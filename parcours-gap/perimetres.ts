// Les 4 PILIERS de vie — Relationnel & famille, Love, Pro, Santé. Source unique,
// utilisée par les exercices, l'éclairage, l'accueil et le rapport.
// NB technique : les clés internes historiques (perso/pro/relationnel) sont
// conservées pour ne pas casser tout le moteur ; « perso » porte désormais le
// pilier Santé, et « love » est le nouveau pilier. Seuls les LIBELLÉS changent
// pour l'utilisateur·rice.

import type { Objectifs } from "@/parcours-archetypes/types";

export type Perimetre = "relationnel" | "love" | "pro" | "perso";

export const PERIMETRES: { key: Perimetre; label: string; angle: string }[] = [
  { key: "relationnel", label: "Relationnel & famille", angle: "tes proches, ta famille, tes amis, ta manière d'être en lien" },
  { key: "love", label: "Love", angle: "ton couple, l'amour, l'intimité, ta vie sentimentale" },
  { key: "pro", label: "Pro", angle: "ton travail, tes projets, ta façon d'agir et de décider" },
  { key: "perso", label: "Santé", angle: "ton corps, ton énergie, ton sommeil, ton équilibre intérieur" },
];

export const PERIMETRE_KEYS = PERIMETRES.map((p) => p.key);

export function labelPerimetre(p: Perimetre): string {
  return PERIMETRES.find((x) => x.key === p)?.label ?? p;
}

export function anglePerimetre(p: Perimetre): string {
  return PERIMETRES.find((x) => x.key === p)?.angle ?? "";
}

// La direction posée sur un pilier (store `objectifs`).
export function directionDe(objectifs: Objectifs | null | undefined, p: Perimetre): string {
  if (!objectifs) return "";
  return (objectifs[p] ?? "").trim();
}
