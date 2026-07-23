// traversee/lib/vestiaire.ts
// Le Vestiaire ne supprime jamais. Un dépôt reste, à jamais, comme trace de ce
// qu'elle a posé. Seule la RÉVERSIBILITÉ est limitée : 24 h pour se raviser.
// Petites fonctions pures, déterministes (now injectable), pour l'affichage.

import { Depot } from "../types";

export function estReversible(d: Depot, now: number = Date.now()): boolean {
  return now <= new Date(d.reversibleJusqua).getTime();
}

// Heures entières restantes avant la fin de la fenêtre (0 si dépassée).
export function heuresRestantes(d: Depot, now: number = Date.now()): number {
  const ms = new Date(d.reversibleJusqua).getTime() - now;
  return Math.max(0, Math.ceil(ms / 3_600_000));
}

// Du plus récent au plus ancien — l'ordre du Vestiaire.
export function parPlusRecent(depots: Depot[]): Depot[] {
  return [...depots].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
