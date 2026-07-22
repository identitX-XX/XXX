// traversee/lib/derivation.ts
// La couche de dérivation — isolée, déterministe, testable. Deux sorties :
//   1. signes()             : les patterns de l'Acte III, VÉRIFIABLES dans ses
//                             données, jamais de flatterie générique.
//   2. deriverDestinations(): les 3 candidates de l'Acte IV, COMPOSÉES à partir
//                             de ses choix — jamais pré-écrites. La destination
//                             doit pouvoir la surprendre.
// Aucune API : tout est déterministe (fallback par défaut si données minces).

import { DestinationCandidate, ReponseJour, Signe, TerritoireKey } from "../types";
import { TERRITOIRE_KEYS, territoireByKey } from "../content/territoires";
import { jourN } from "../content/jours";

function comptesParTerritoire(reponses: ReponseJour[]): Record<string, number> {
  const m: Record<string, number> = {};
  for (const r of reponses) {
    const t = jourN(r.jour)?.territoire;
    if (t) m[t] = (m[t] ?? 0) + 1;
  }
  return m;
}

// --- 1. Les signes (Acte III) -----------------------------------------------
export function signes(reponses: Record<number, ReponseJour>): Signe[] {
  const R = Object.values(reponses);
  const laisses = R.filter((r) => r.verbe === "laisser");
  const emportes = R.filter((r) => r.verbe === "emporter");
  if (laisses.length + emportes.length < 3) return []; // pas assez de matière

  const out: Signe[] = [];
  out.push({
    id: "bilan",
    texte: `Jusqu'ici, tu as posé ${laisses.length} chose${laisses.length > 1 ? "s" : ""} et emporté ${emportes.length}.`,
    preuve: `${laisses.length} laisser · ${emportes.length} emporter`,
    force: 0.5,
  });

  const lT = comptesParTerritoire(laisses);
  const topL = Object.entries(lT).sort((a, b) => b[1] - a[1])[0];
  if (topL && topL[1] >= 2) {
    out.push({
      id: `laisse:${topL[0]}`,
      texte: `C'est dans « ${territoireByKey[topL[0]].nom} » que tu as le plus posé.`,
      preuve: `${topL[1]} dépôts sur ${laisses.length}`,
      force: Math.min(1, 0.55 + topL[1] / 10),
    });
  }

  const eT = comptesParTerritoire(emportes);
  const topE = Object.entries(eT).sort((a, b) => b[1] - a[1])[0];
  if (topE && topE[1] >= 2) {
    out.push({
      id: `emporte:${topE[0]}`,
      texte: `Et c'est « ${territoireByKey[topE[0]].nom} » que tu emportes le plus.`,
      preuve: `${topE[1]} sur ${emportes.length}`,
      force: Math.min(1, 0.55 + topE[1] / 10),
    });
  }

  return out.sort((a, b) => b.force - a.force);
}

// --- 2. Les destinations (Acte IV) ------------------------------------------
// Une « figure » sobre par territoire : matière de composition, pas une
// destination. La destination naît du CROISEMENT de ses territoires gardés.
const FIGURES: Record<TerritoireKey, string> = {
  corps: "la présence à ton corps",
  energie: "ton élan juste",
  sante: "l'écoute de ce qui t'use",
  amour: "le lien que tu choisis",
  liens: "un cercle resserré",
  argent: "une liberté sobre",
  oeuvre: "ce que tu fabriques",
  terres: "l'inconnu qui t'appelle",
};

export function deriverDestinations(
  reponses: Record<number, ReponseJour>
): DestinationCandidate[] {
  const score: Record<string, number> = {};
  for (const t of TERRITOIRE_KEYS) score[t] = 0;
  for (const r of Object.values(reponses)) {
    const t = jourN(r.jour)?.territoire;
    if (!t) continue;
    if (r.verbe === "emporter") score[t] += 1;
    else if (r.verbe === "laisser") score[t] -= 1;
  }

  const ranked = [...TERRITOIRE_KEYS].sort((a, b) => score[b] - score[a]);
  const bas = ranked[ranked.length - 1];
  const paires: [TerritoireKey, TerritoireKey][] = [
    [ranked[0], ranked[1]],
    [ranked[0], ranked[2]],
    [ranked[1], ranked[2]],
  ];

  return paires.map(([a, b], i) => ({
    id: `dest-${i + 1}`,
    nom: `Celle qui garde ${FIGURES[a]} et ${FIGURES[b]}.`,
    fondement: `Tu as le plus emporté vers « ${territoireByKey[a].nom} » et « ${territoireByKey[b].nom} », et le plus posé dans « ${territoireByKey[bas].nom} ».`,
    territoires: [a, b],
  }));
}
