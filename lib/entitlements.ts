// Débloquages premium (« entitlements »). Pour l'instant : stockés localement
// (scaffold, le temps de brancher Stripe). Une fois le paiement en place, la
// source de vérité sera le serveur (webhook Stripe → achat enregistré par
// e-mail), et `lireEntitlements` ira lire cet état. La logique pure (estDebloque)
// reste identique et testable.

export type OffreId = string;
export type Entitlements = Record<OffreId, boolean>;

// Identifiants d'offres (stables).
export const OFFRES = {
  perimetrePerso: "perimetre:perso",
  perimetrePro: "perimetre:pro",
  perimetreRelationnel: "perimetre:relationnel",
  signature: "signature",
  questionsPerso: "questions:perso",
  questionsPro: "questions:pro",
  questionsIdentitaire: "questions:identitaire",
  questionsRelationnel: "questions:relationnel",
} as const;

export function estDebloque(map: Entitlements | null | undefined, id: OffreId): boolean {
  return Boolean(map && map[id]);
}

const CLE = "idx-entitlements";

export function lireEntitlements(): Entitlements {
  try {
    const raw = localStorage.getItem(CLE);
    return raw ? (JSON.parse(raw) as Entitlements) : {};
  } catch {
    return {};
  }
}

export function debloquer(id: OffreId): Entitlements {
  const map = lireEntitlements();
  map[id] = true;
  try {
    localStorage.setItem(CLE, JSON.stringify(map));
  } catch {}
  return map;
}
