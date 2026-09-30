"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { validerPoint, versLigne } from "@/lib/compagnon/point";
import { supabaseConfigure } from "@/lib/supabase/config";
import { supabaseServeur } from "@/lib/supabase/serveur";

export type EtatFormulaire = { erreurs?: Record<string, string>; message?: string; ok?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NON_CONFIGURE: EtatFormulaire = { message: "Le Compagnon ouvre à la prochaine lune : les comptes ne sont pas encore actifs." };

function origine() {
  const h = headers();
  const hote = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (hote.startsWith("localhost") ? "http" : "https");
  return `${proto}://${hote}`;
}

/** N'autorise que des chemins internes après connexion (pas de redirection ouverte). */
function suiteSure(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/espace") && !s.startsWith("//") ? s : "/espace";
}

// Messages d'erreur Supabase → phrases claires, sans révéler si un e-mail existe.
function traduire(message: string): string {
  if (/invalid login credentials/i.test(message)) return "E-mail ou mot de passe incorrect.";
  if (/email not confirmed/i.test(message)) return "Confirmez d'abord votre adresse : le lien vous attend dans votre boîte e-mail.";
  if (/rate limit|too many/i.test(message)) return "Trop de tentatives. Réessayez dans quelques minutes.";
  if (/password/i.test(message)) return "Ce mot de passe n'est pas accepté : 12 caractères minimum, dont un chiffre.";
  return "Une erreur est survenue. Réessayez dans un instant.";
}

// ── Compte ─────────────────────────────────────────────────────────────────

export async function inscrire(_: EtatFormulaire, d: FormData): Promise<EtatFormulaire> {
  const prenom = String(d.get("prenom") ?? "").trim().slice(0, 60);
  const email = String(d.get("email") ?? "").trim().toLowerCase();
  const motdepasse = String(d.get("motdepasse") ?? "");
  const erreurs: Record<string, string> = {};
  if (!prenom) erreurs.prenom = "Indiquez votre prénom.";
  if (!EMAIL.test(email)) erreurs.email = "Indiquez une adresse e-mail valide.";
  if (motdepasse.length < 12 || !/\d/.test(motdepasse)) erreurs.motdepasse = "12 caractères minimum, dont un chiffre.";
  if (d.get("cgu") !== "on") erreurs.cgu = "Votre accord est nécessaire pour créer un compte.";
  if (Object.keys(erreurs).length) return { erreurs };
  if (!supabaseConfigure) return NON_CONFIGURE;

  const maintenant = new Date().toISOString();
  const { error } = await supabaseServeur().auth.signUp({
    email,
    password: motdepasse,
    options: {
      emailRedirectTo: `${origine()}/auth/confirmer`,
      data: {
        prenom,
        cgu_acceptees_le: maintenant,
        // Consentement santé : case séparée et facultative (RGPD art. 9).
        sante_consentie_le: d.get("sante") === "on" ? maintenant : null,
      },
    },
  });
  if (error) return { message: traduire(error.message) };
  // Même réponse que l'adresse soit nouvelle ou déjà inscrite : on ne révèle rien.
  return { ok: true, message: "Presque fini : confirmez votre adresse grâce au lien que nous venons de vous envoyer." };
}

export async function connecter(_: EtatFormulaire, d: FormData): Promise<EtatFormulaire> {
  const email = String(d.get("email") ?? "").trim().toLowerCase();
  const motdepasse = String(d.get("motdepasse") ?? "");
  const erreurs: Record<string, string> = {};
  if (!EMAIL.test(email)) erreurs.email = "Indiquez une adresse e-mail valide.";
  if (!motdepasse) erreurs.motdepasse = "Indiquez votre mot de passe.";
  if (Object.keys(erreurs).length) return { erreurs };
  if (!supabaseConfigure) return NON_CONFIGURE;

  const { error } = await supabaseServeur().auth.signInWithPassword({ email, password: motdepasse });
  if (error) return { message: traduire(error.message) };
  redirect(suiteSure(d.get("suite")));
}

export async function deconnecter() {
  if (supabaseConfigure) await supabaseServeur().auth.signOut();
  redirect("/connexion");
}

export async function demanderReinitialisation(_: EtatFormulaire, d: FormData): Promise<EtatFormulaire> {
  if (!supabaseConfigure) return NON_CONFIGURE;
  const email = String(d.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) return { erreurs: { email: "Indiquez une adresse e-mail valide." } };
  await supabaseServeur().auth.resetPasswordForEmail(email, { redirectTo: `${origine()}/auth/confirmer?suite=/nouveau-mot-de-passe` });
  // Toujours la même réponse : on ne dit pas si l'adresse a un compte.
  return { ok: true, message: "Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé." };
}

export async function changerMotDePasse(_: EtatFormulaire, d: FormData): Promise<EtatFormulaire> {
  if (!supabaseConfigure) return NON_CONFIGURE;
  const motdepasse = String(d.get("motdepasse") ?? "");
  if (motdepasse.length < 12 || !/\d/.test(motdepasse)) return { erreurs: { motdepasse: "12 caractères minimum, dont un chiffre." } };
  const { error } = await supabaseServeur().auth.updateUser({ password: motdepasse });
  if (error) return { message: "Le lien a expiré. Demandez-en un nouveau." };
  redirect("/espace");
}

// ── Point du jour ──────────────────────────────────────────────────────────

export async function enregistrerPoint(_: EtatFormulaire, d: FormData): Promise<EtatFormulaire> {
  const supabase = supabaseServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?suite=/espace/point");

  const { data: profil } = await supabase.from("profils").select("sante_consentie_le").eq("id", user.id).single();
  const r = validerPoint(Object.fromEntries(d), Boolean(profil?.sante_consentie_le));
  if (!r.ok) return { erreurs: r.erreurs };

  const { error } = await supabase.from("points").upsert(versLigne(user.id, r.point), { onConflict: "user_id,jour" });
  if (error) return { message: "Enregistrement impossible pour le moment. Réessayez." };
  revalidatePath("/espace");
  redirect("/espace");
}

// ── Profil et consentements ────────────────────────────────────────────────

export async function mettreAJourProfil(_: EtatFormulaire, d: FormData): Promise<EtatFormulaire> {
  const supabase = supabaseServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?suite=/espace/profil");

  const prenom = String(d.get("prenom") ?? "").trim().slice(0, 60);
  const cap = String(d.get("cap") ?? "").trim().slice(0, 140);
  if (!prenom) return { erreurs: { prenom: "Indiquez votre prénom." } };

  const { error } = await supabase.from("profils").update({ prenom, cap_du_mois: cap || null }).eq("id", user.id);
  if (error) return { message: "Enregistrement impossible pour le moment." };
  revalidatePath("/espace", "layout");
  return { ok: true, message: "Profil enregistré." };
}

/** Donner ou retirer le consentement santé. Le retrait efface les données de santé (trigger SQL). */
export async function basculerConsentementSante(donner: boolean) {
  const supabase = supabaseServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await supabase
    .from("profils")
    .update({ sante_consentie_le: donner ? new Date().toISOString() : null })
    .eq("id", user.id);
  revalidatePath("/espace", "layout");
}

export async function supprimerCompte(_: EtatFormulaire, d: FormData): Promise<EtatFormulaire> {
  if (String(d.get("confirmation") ?? "").trim().toUpperCase() !== "SUPPRIMER") {
    return { erreurs: { confirmation: "Écrivez SUPPRIMER pour confirmer." } };
  }
  const supabase = supabaseServeur();
  const { error } = await supabase.rpc("supprimer_mon_compte");
  if (error) return { message: "Suppression impossible pour le moment. Écrivez-nous, nous la ferons à la main." };
  await supabase.auth.signOut();
  redirect("/?compte=supprime");
}
