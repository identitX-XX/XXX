/**
 * Jeu 10 — Le Défi Immeuble : règles pures.
 * Chaque mois, les résidences s'affrontent : on compte les éco-gestes de tous les foyers
 * (trajets, relevés, actions seconde vie et anti-gaspi, journées 19 °C, douches réussies, astuces),
 * rapportés au nombre de logements pour que petites et grandes résidences jouent à armes égales.
 */

/** Objectif collectif du mois : nombre moyen de gestes par logement. */
export const OBJECTIF_GESTES_PAR_LOGEMENT = 5;
/** Contribution personnelle minimale pour l'argent et l'or. */
export const CONTRIBUTION_MIN = 5;

export interface ScoreResidence {
  residenceId: string;
  nom: string;
  logements: number;
  gestes: number;
}

export function scoreParLogement(r: ScoreResidence): number {
  return r.logements > 0 ? r.gestes / r.logements : 0;
}

/** Classement par gestes par logement (puis par nombre total de gestes). */
export function classer(residences: ScoreResidence[]): (ScoreResidence & { rang: number; parLogement: number })[] {
  const tries = residences
    .map((r) => ({ ...r, parLogement: scoreParLogement(r) }))
    .sort((a, b) => b.parLogement - a.parLogement || b.gestes - a.gestes);
  return tries.map((r, i) => ({ ...r, rang: i + 1 }));
}

export function objectifAtteint(r: ScoreResidence): boolean {
  return scoreParLogement(r) >= OBJECTIF_GESTES_PAR_LOGEMENT;
}

/**
 * Médailles du Défi Immeuble :
 * Bronze : rejoindre le défi du mois et faire un geste ;
 * Argent : la résidence atteint l'objectif collectif du mois, avec au moins 5 gestes de votre part ;
 * Or : la résidence termine 1ʳᵉ d'un mois complet, avec au moins 5 gestes de votre part ce mois-là.
 */
export function niveauImmeuble(p: {
  inscrit: boolean;
  mesGestes: number;
  objectifAtteint: boolean;
  premiereMoisPrecedent: boolean;
  mesGestesMoisPrecedent: number;
}): number {
  if (p.premiereMoisPrecedent && p.mesGestesMoisPrecedent >= CONTRIBUTION_MIN) return 3;
  if (!p.inscrit || p.mesGestes < 1) return 0;
  if (p.objectifAtteint && p.mesGestes >= CONTRIBUTION_MIN) return 2;
  return 1;
}
