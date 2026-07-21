// parcours-archetypes/bascules.ts
// Mémoire identitaire (Phase 6) : segmente le parcours en CHAPITRES à partir des
// bascules d'archétype dominant. Anti-bruit : un dominant nouveau ne fait
// basculer que s'il TIENT (≥ minHold jours) — un flicker d'un jour est absorbé.
// Pur, déterministe : mêmes entrées → mêmes sorties.

import { ArchetypeKey, SnapshotJour } from "./types";
import { dominant } from "./evolution";

export interface Chapitre {
  debut: number; // jour de début (inclus)
  fin: number; // jour de fin (inclus)
  archetype: ArchetypeKey;
  jours: number;
  coherenceMoy: number;
}

function moyenne(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}

function chap(
  H: SnapshotJour[],
  a: number,
  b: number,
  arch: ArchetypeKey
): Chapitre {
  const slice = H.slice(a, b + 1);
  return {
    debut: H[a].jour,
    fin: H[b].jour,
    archetype: arch,
    jours: H[b].jour - H[a].jour + 1,
    coherenceMoy: Math.round(moyenne(slice.map((h) => h.coherence))),
  };
}

export function detecterChapitres(
  historique: SnapshotJour[],
  minHold = 2
): Chapitre[] {
  if (historique.length === 0) return [];
  const doms = historique.map((h) => dominant(h.radar));
  const chapitres: Chapitre[] = [];

  let start = 0;
  let courant = doms[0];
  for (let i = 1; i < historique.length; i++) {
    if (doms[i] === courant) continue;
    // Le nouveau dominant tient-il minHold jours consécutifs à partir d'ici ?
    let tient = historique.length - i >= minHold;
    for (let k = i; tient && k < i + minHold; k++) {
      if (doms[k] !== doms[i]) tient = false;
    }
    if (tient) {
      chapitres.push(chap(historique, start, i - 1, courant));
      start = i;
      courant = doms[i];
    }
    // sinon : flicker, on reste dans le chapitre courant
  }
  chapitres.push(chap(historique, start, historique.length - 1, courant));
  return chapitres;
}

// La dernière bascule (frontière entre les deux derniers chapitres), ou null.
export interface Bascule {
  jour: number; // premier jour du nouveau chapitre
  depuis: ArchetypeKey;
  vers: ArchetypeKey;
}
export function derniereBascule(chapitres: Chapitre[]): Bascule | null {
  if (chapitres.length < 2) return null;
  const prev = chapitres[chapitres.length - 2];
  const cur = chapitres[chapitres.length - 1];
  return { jour: cur.debut, depuis: prev.archetype, vers: cur.archetype };
}
