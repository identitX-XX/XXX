/**
 * Jeu 1 — Le Compteur Malin : règles pures.
 * Le locataire relève ses compteurs ; on compare la consommation journalière d'une période à l'autre.
 */

export type TypeCompteur = "eau" | "gaz" | "elec";

export interface InfoCompteur {
  type: TypeCompteur;
  nom: string;
  emoji: string;
  unite: string;
  /** Consommation journalière au-delà de laquelle un relevé est jugé invraisemblable (anti-triche). */
  maxParJour: number;
  /** Valeurs indicatives (à faire valider) : €/unité et kg CO₂e/unité. */
  euroParUnite: number;
  co2ParUnite: number;
}

export const COMPTEURS: Record<TypeCompteur, InfoCompteur> = {
  elec: { type: "elec", nom: "Électricité", emoji: "⚡", unite: "kWh", maxParJour: 150, euroParUnite: 0.25, co2ParUnite: 0.06 },
  gaz: { type: "gaz", nom: "Gaz", emoji: "🔥", unite: "m³", maxParJour: 30, euroParUnite: 1.3, co2ParUnite: 2.5 },
  eau: { type: "eau", nom: "Eau", emoji: "💧", unite: "m³", maxParJour: 3, euroParUnite: 4.5, co2ParUnite: 0.3 },
};

export const TYPES_COMPTEUR = Object.keys(COMPTEURS) as TypeCompteur[];

/** Durée minimale d'une période de comparaison. */
export const JOURS_MIN_PERIODE = 6;
/** Baisse minimale de la consommation journalière pour la médaille d'or. */
export const BAISSE_OR = 0.05;

export interface ReleveSimple {
  index: number;
  date: Date;
}

const JOUR = 86_400_000;

export function joursEntre(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / JOUR;
}

/** Vérifie un nouveau relevé par rapport au précédent. Renvoie un message d'erreur ou null. */
export function verifierReleve(type: TypeCompteur, index: number, precedent: ReleveSimple | null, maintenant: Date): string | null {
  if (!Number.isFinite(index) || index < 0 || index > 9_999_999) return "Cet index ne semble pas valide. Recopiez les chiffres du compteur.";
  if (!precedent) return null;
  const jours = joursEntre(precedent.date, maintenant);
  if (jours < 0.5) return "Vous avez déjà relevé ce compteur aujourd'hui. Revenez demain !";
  if (index < precedent.index)
    return `L'index ne peut pas baisser : votre dernier relevé était ${formaterIndex(precedent.index)} ${COMPTEURS[type].unite}.`;
  const parJour = (index - precedent.index) / jours;
  if (parJour > COMPTEURS[type].maxParJour)
    return "Cette consommation paraît très élevée. Vérifiez l'index : il ne faut pas compter les chiffres rouges après la virgule.";
  return null;
}

/** Consommation journalière moyenne entre deux relevés. */
export function consoJournaliere(a: ReleveSimple, b: ReleveSimple): number {
  const jours = joursEntre(a.date, b.date);
  return jours > 0 ? (b.index - a.index) / jours : 0;
}

export interface BilanCompteur {
  nbReleves: number;
  /** Consommation journalière de la période de référence (1ʳᵉ période d'au moins 6 jours). */
  reference: number | null;
  /** Consommation journalière de la dernière période d'au moins 6 jours. */
  actuelle: number | null;
  /** Variation de la consommation actuelle par rapport à la référence (−0,1 = −10 %). */
  variation: number | null;
}

/**
 * Découpe les relevés (triés par date) en périodes d'au moins JOURS_MIN_PERIODE jours,
 * et compare la dernière à la première.
 */
export function bilanCompteur(releves: ReleveSimple[]): BilanCompteur {
  const tries = [...releves].sort((a, b) => a.date.getTime() - b.date.getTime());
  const bornes: ReleveSimple[] = [];
  for (const r of tries) {
    const dernier = bornes[bornes.length - 1];
    if (!dernier || joursEntre(dernier.date, r.date) >= JOURS_MIN_PERIODE) bornes.push(r);
  }
  const periodes = bornes.slice(1).map((b, i) => consoJournaliere(bornes[i], b));
  const reference = periodes[0] ?? null;
  const actuelle = periodes.length >= 2 ? periodes[periodes.length - 1] : null;
  const variation = reference && actuelle !== null ? (actuelle - reference) / reference : null;
  return { nbReleves: tries.length, reference, actuelle, variation };
}

/**
 * Médailles du Compteur Malin (la meilleure sur les trois compteurs) :
 * - Bronze : un premier relevé (la référence de départ) ;
 * - Argent : un deuxième relevé au moins 6 jours plus tard (la régularité) ;
 * - Or : une baisse d'au moins 5 % de la consommation journalière par rapport à la période de référence.
 */
export function niveauCompteur(relevesParType: Partial<Record<TypeCompteur, ReleveSimple[]>>): number {
  let niveau = 0;
  for (const releves of Object.values(relevesParType)) {
    if (!releves?.length) continue;
    const bilan = bilanCompteur(releves);
    let n = 1;
    if (bilan.reference !== null) n = 2;
    if (bilan.variation !== null && bilan.variation <= -BAISSE_OR) n = 3;
    niveau = Math.max(niveau, n);
  }
  return niveau;
}

/** Économie estimée sur un mois si la baisse se maintient (valeurs négatives = surconsommation). */
export function economieMensuelle(type: TypeCompteur, bilan: BilanCompteur): { unites: number; euros: number; co2: number } | null {
  if (bilan.reference === null || bilan.actuelle === null) return null;
  const unites = (bilan.reference - bilan.actuelle) * 30;
  const info = COMPTEURS[type];
  return { unites, euros: unites * info.euroParUnite, co2: unites * info.co2ParUnite };
}

export function formaterIndex(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(n).replace(/[  ]/g, " ");
}
