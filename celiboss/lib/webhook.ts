// Point de sortie UNIQUE des données personnelles : tout formulaire du site
// passe par ici. Le site ne stocke rien ; il relaie vers l'outil configuré
// dans FORMULAIRES_WEBHOOK_URL (CRM, Brevo, Make, Airtable EU…), qui doit être
// déclaré comme sous-traitant dans /confidentialite (art. 28 RGPD).
import { VERSION_NOTICE } from "@/lib/candidature";

export type TypeEnvoi = "candidature" | "liste";
export type Relais = { ok: true } | { ok: false; statut: number; erreur: string };

export async function transmettre(type: TypeEnvoi, data: Record<string, unknown>): Promise<Relais> {
  const cible = process.env.FORMULAIRES_WEBHOOK_URL;
  if (!cible) {
    if (process.env.NODE_ENV === "development") return { ok: true };
    return { ok: false, statut: 503, erreur: "Les inscriptions ouvrent très bientôt." };
  }
  const res = await fetch(cible, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      ...data,
      // Preuve du consentement (art. 7.1) : quand, et sur quelle notice.
      consentement: { donne: true, le: new Date().toISOString(), notice: VERSION_NOTICE },
    }),
  }).catch(() => null);
  return res?.ok
    ? { ok: true }
    : { ok: false, statut: 502, erreur: "Envoi impossible pour le moment. Réessayez dans un instant." };
}
