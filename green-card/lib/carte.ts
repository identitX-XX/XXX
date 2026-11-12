/** Règles pures de la Green Card (testables sans base de données). */

export const NIVEAUX_CARTE = [
  { cle: "graine", nom: "Graine", emoji: "🌰", seuil: 0 },
  { cle: "pousse", nom: "Pousse", emoji: "🌱", seuil: 300 },
  { cle: "arbre", nom: "Arbre", emoji: "🌳", seuil: 1000 },
  { cle: "foret", nom: "Forêt", emoji: "🌲", seuil: 2500 },
] as const;

export type NiveauCarte = (typeof NIVEAUX_CARTE)[number];

export function niveauCarte(points: number): NiveauCarte {
  let courant: NiveauCarte = NIVEAUX_CARTE[0];
  for (const n of NIVEAUX_CARTE) if (points >= n.seuil) courant = n;
  return courant;
}

/** Progression vers le niveau suivant, entre 0 et 1 (1 au niveau max). */
export function progressionNiveau(points: number): { suivant: NiveauCarte | null; ratio: number; reste: number } {
  const actuel = niveauCarte(points);
  const idx = NIVEAUX_CARTE.findIndex((n) => n.cle === actuel.cle);
  const suivant = NIVEAUX_CARTE[idx + 1] ?? null;
  if (!suivant) return { suivant: null, ratio: 1, reste: 0 };
  const ratio = (points - actuel.seuil) / (suivant.seuil - actuel.seuil);
  return { suivant, ratio: Math.max(0, Math.min(1, ratio)), reste: suivant.seuil - points };
}

export const MEDAILLES = ["", "Bronze", "Argent", "Or"] as const;

/**
 * Déblocage progressif : les défis d'ouverture sont jouables tout de suite ;
 * les autres se débloquent un par un, dans l'ordre, à chaque case tamponnée.
 */
export function defiDebloque(id: string, casesValidees: number, ordreDefis: string[], ouverture: string[]): boolean {
  if (ouverture.includes(id)) return true;
  const rang = ordreDefis.filter((d) => !ouverture.includes(d)).indexOf(id);
  return rang >= 0 && rang < casesValidees;
}

/** Carte complète (10 cases au moins en bronze) = statut Green Card Gold. */
export function estGold(niveauxParDefi: number[]): boolean {
  return niveauxParDefi.length >= 10 && niveauxParDefi.every((n) => n >= 1);
}

export function formaterPoints(points: number): string {
  return new Intl.NumberFormat("fr-FR").format(points).replace(/[  ]/g, " ");
}
