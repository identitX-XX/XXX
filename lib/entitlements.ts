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

// Catalogue : nom + montant (en centimes) par offre. Source unique côté serveur
// (checkout) ET côté client (affichage). `montant` alimente Stripe directement
// (price_data) → pas besoin de créer des « produits » dans le dashboard.
export const CATALOGUE: Record<OffreId, { nom: string; montant: number }> = {
  [OFFRES.signature]: { nom: "Lecture approfondie de ta signature", montant: 250 },
  [OFFRES.perimetrePerso]: { nom: "Approfondir ton périmètre perso", montant: 450 },
  [OFFRES.perimetrePro]: { nom: "Approfondir ton périmètre pro", montant: 450 },
  [OFFRES.perimetreRelationnel]: { nom: "Approfondir ton périmètre relationnel", montant: 450 },
  [OFFRES.questionsPerso]: { nom: "Panel de 10 questions · Perso", montant: 250 },
  [OFFRES.questionsPro]: { nom: "Panel de 10 questions · Pro", montant: 250 },
  [OFFRES.questionsIdentitaire]: { nom: "Panel de 10 questions · Identitaire", montant: 250 },
  [OFFRES.questionsRelationnel]: { nom: "Panel de 10 questions · Relationnel", montant: 250 },
};

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
