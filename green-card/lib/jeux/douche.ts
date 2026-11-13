/**
 * Jeu 3 — Douche Chrono : règles pures.
 * Un minuteur de 5 minutes ; le serveur mesure la durée entre « Je commence » et « J'ai fini ».
 */

import { serieMax } from "../temps";

export const OBJECTIF_S = 5 * 60;
export const DUREE_MIN_S = 60; // en dessous : pas une vraie douche (ou un clic par erreur)
export const DUREE_MAX_S = 60 * 60; // au-delà : minuteur oublié, la douche n'est pas comptée
/** Débit moyen d'une douche classique (L/min) et durée de référence (min). Valeurs indicatives. */
export const LITRES_PAR_MIN = 12;
export const DUREE_REFERENCE_MIN = 10;
/** Chauffer 1 litre d'eau de 15 à 40 °C ≈ 0,029 kWh ; prix moyen de l'eau ≈ 4,5 €/m³ ; électricité ≈ 0,25 €/kWh. */
export const KWH_PAR_LITRE = 0.029;
export const EURO_PAR_LITRE = 0.0045 + 0.029 * 0.25;

export const JOURS_ARGENT_DOUCHE = 3;
export const SERIE_OR_DOUCHE = 7;

export type VerdictDouche = "trop-court" | "trop-long" | "reussie" | "depassee";

export function verdictDouche(dureeS: number): VerdictDouche {
  if (dureeS < DUREE_MIN_S) return "trop-court";
  if (dureeS > DUREE_MAX_S) return "trop-long";
  return dureeS <= OBJECTIF_S ? "reussie" : "depassee";
}

/** Litres économisés par rapport à une douche de référence de 10 minutes. */
export function litresEconomises(dureeS: number): number {
  return Math.max(0, (DUREE_REFERENCE_MIN - dureeS / 60) * LITRES_PAR_MIN);
}

/**
 * Médailles de Douche Chrono (une douche réussie = 5 minutes ou moins) :
 * Bronze : une douche réussie ; Argent : sur 3 jours différents ; Or : 7 jours d'affilée.
 */
export function niveauDouche(joursReussis: string[]): number {
  const jours = new Set(joursReussis);
  if (serieMax(jours) >= SERIE_OR_DOUCHE) return 3;
  if (jours.size >= JOURS_ARGENT_DOUCHE) return 2;
  if (jours.size >= 1) return 1;
  return 0;
}

export function formaterChrono(secondes: number): string {
  const s = Math.max(0, Math.round(secondes));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
