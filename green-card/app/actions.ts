"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { normaliserUG, ugValide } from "@/lib/ug";
import {
  BLOCAGE_PIN_MINUTES,
  TENTATIVES_CODE_MAX,
  TENTATIVES_PIN_MAX,
  codeCorrespond,
  hacherPin,
  pinCorrespond,
  pinValide,
  signer,
  verifierSignature,
} from "@/lib/securite";
import {
  carteConnectee,
  effacerCookieActivation,
  fermerSession,
  lireCookieActivation,
  ouvrirSession,
  poserCookieActivation,
} from "@/lib/session";

export type EtatFormulaire = { erreur?: string; champ?: string } | undefined;

const ERREUR_IDENTITE =
  "Ces informations ne correspondent pas. Vérifiez la résidence, le n° d'UG et le code de votre courrier.";

// ---------------------------------------------------------------------------
// Activation, étape 1 : résidence + n° d'UG + code d'activation
// ---------------------------------------------------------------------------
export async function verifierActivation(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const residenceId = String(form.get("residenceId") ?? "");
  const ug = normaliserUG(String(form.get("ug") ?? ""));
  const code = String(form.get("code") ?? "");

  if (!residenceId) return { erreur: "Choisissez votre résidence.", champ: "residence" };
  if (!ugValide(ug)) return { erreur: "Le n° d'UG semble incomplet. Il figure sur votre bail ou votre avis d'échéance.", champ: "ug" };
  if (code.replace(/[^A-Za-z0-9]/g, "").length !== 8) return { erreur: "Le code d'activation contient 8 caractères.", champ: "code" };

  const logement = await db.logement.findUnique({
    where: { ug },
    include: { activation: true, carte: { select: { id: true } } },
  });
  if (!logement || logement.residenceId !== residenceId || !logement.activation) return { erreur: ERREUR_IDENTITE };

  const act = logement.activation;
  if (act.tentatives >= TENTATIVES_CODE_MAX)
    return { erreur: "Trop d'essais : ce code est bloqué. Contactez votre agence CDC Habitat pour en recevoir un nouveau." };

  if (!codeCorrespond(code, act.codeHash)) {
    await db.codeActivation.update({ where: { id: act.id }, data: { tentatives: { increment: 1 } } });
    const reste = TENTATIVES_CODE_MAX - act.tentatives - 1;
    return { erreur: `${ERREUR_IDENTITE}${reste > 0 ? ` (${reste} essai${reste > 1 ? "s" : ""} restant${reste > 1 ? "s" : ""})` : ""}` };
  }
  if (logement.carte || act.utiliseLe)
    return { erreur: "Cette Green Card est déjà activée. Utilisez « Me connecter » avec votre code PIN." };
  if (act.expireLe < new Date())
    return { erreur: "Ce code a expiré. Contactez votre agence CDC Habitat pour en recevoir un nouveau." };

  poserCookieActivation(signer({ logementId: logement.id }, 15 * 60));
  redirect("/activer/carte");
}

// ---------------------------------------------------------------------------
// Activation, étape 2 : pseudo + PIN + consentements → création de la carte
// ---------------------------------------------------------------------------
export async function creerCarte(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const ticket = verifierSignature<{ logementId: string }>(lireCookieActivation());
  if (!ticket) return { erreur: "Votre session d'activation a expiré. Recommencez depuis le début." };

  const pseudo = String(form.get("pseudo") ?? "").trim().replace(/\s+/g, " ");
  const pin = String(form.get("pin") ?? "");
  const pin2 = String(form.get("pin2") ?? "");
  const cgu = form.get("cgu") === "on";
  const conso = form.get("conso") === "on";

  if (!/^[\p{L}\p{N} '\-]{2,20}$/u.test(pseudo))
    return { erreur: "Choisissez un pseudo de 2 à 20 caractères (lettres, chiffres, espaces).", champ: "pseudo" };
  if (!pinValide(pin))
    return { erreur: "Le code PIN doit faire 6 chiffres, et pas une suite trop simple (comme 123456 ou 111111).", champ: "pin" };
  if (pin !== pin2) return { erreur: "Les deux codes PIN ne sont pas identiques.", champ: "pin2" };
  if (!cgu) return { erreur: "Vous devez accepter les conditions d'utilisation pour activer votre carte.", champ: "cgu" };

  const maintenant = new Date();
  let carteId: string;
  try {
    carteId = await db.$transaction(async (tx) => {
      const act = await tx.codeActivation.findUnique({ where: { logementId: ticket.logementId } });
      if (!act || act.utiliseLe) throw new Error("deja");
      await tx.codeActivation.update({ where: { id: act.id }, data: { utiliseLe: maintenant } });
      const carte = await tx.carte.create({
        data: {
          logementId: ticket.logementId,
          pseudo,
          pinHash: hacherPin(pin),
          consentCGU: maintenant,
          consentConsommation: conso ? maintenant : null,
        },
      });
      await tx.mouvementPoints.create({ data: { carteId: carte.id, points: 20, motif: "Bienvenue dans Green Card" } });
      return carte.id;
    });
  } catch {
    return { erreur: "Cette Green Card est déjà activée. Utilisez « Me connecter »." };
  }

  effacerCookieActivation();
  await ouvrirSession(carteId);
  redirect("/carte?bienvenue=1");
}

// ---------------------------------------------------------------------------
// Connexion : résidence + n° d'UG + PIN
// ---------------------------------------------------------------------------
export async function connexion(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const residenceId = String(form.get("residenceId") ?? "");
  const ug = normaliserUG(String(form.get("ug") ?? ""));
  const pin = String(form.get("pin") ?? "");
  const erreur = "Résidence, n° d'UG ou code PIN incorrect.";

  if (!residenceId) return { erreur: "Choisissez votre résidence.", champ: "residence" };
  if (!ugValide(ug) || !/^\d{6}$/.test(pin)) return { erreur };

  const logement = await db.logement.findUnique({ where: { ug }, include: { carte: true } });
  const carte = logement?.residenceId === residenceId ? logement.carte : null;
  if (!carte) return { erreur };

  if (carte.bloqueeJusquA && carte.bloqueeJusquA > new Date()) {
    const minutes = Math.ceil((carte.bloqueeJusquA.getTime() - Date.now()) / 60_000);
    return { erreur: `Trop d'essais. Réessayez dans ${minutes} minute${minutes > 1 ? "s" : ""}.` };
  }

  if (!pinCorrespond(pin, carte.pinHash)) {
    const tentatives = carte.tentativesPin + 1;
    const bloque = tentatives >= TENTATIVES_PIN_MAX;
    await db.carte.update({
      where: { id: carte.id },
      data: bloque
        ? { tentativesPin: 0, bloqueeJusquA: new Date(Date.now() + BLOCAGE_PIN_MINUTES * 60_000) }
        : { tentativesPin: tentatives },
    });
    return {
      erreur: bloque
        ? `Trop d'essais. Votre carte est verrouillée pendant ${BLOCAGE_PIN_MINUTES} minutes.`
        : erreur,
    };
  }

  await db.carte.update({ where: { id: carte.id }, data: { tentativesPin: 0, bloqueeJusquA: null } });
  await ouvrirSession(carte.id);
  redirect("/carte");
}

export async function deconnexion() {
  await fermerSession();
  redirect("/");
}

// ---------------------------------------------------------------------------
// RGPD : consentement et suppression
// ---------------------------------------------------------------------------
export async function majConsentementConso(form: FormData) {
  const carte = await carteConnectee();
  if (!carte) redirect("/connexion");
  const actif = form.get("conso") === "on";
  await db.carte.update({ where: { id: carte.id }, data: { consentConsommation: actif ? new Date() : null } });
  redirect("/profil?maj=1");
}

export async function supprimerCarte(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const carte = await carteConnectee();
  if (!carte) redirect("/connexion");
  const pin = String(form.get("pin") ?? "");
  if (!pinCorrespond(pin, carte.pinHash)) return { erreur: "Code PIN incorrect." };
  await db.carte.delete({ where: { id: carte.id } });
  await fermerSession();
  redirect("/?supprime=1");
}
