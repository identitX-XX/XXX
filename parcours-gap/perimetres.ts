// Les périmètres de vie — perso, pro, relationnel. Source unique, utilisée par
// les exercices, l'éclairage, l'accueil et le rapport.

import type { Objectifs } from "@/parcours-archetypes/types";

export type Perimetre = "perso" | "pro" | "relationnel";

export const PERIMETRES: { key: Perimetre; label: string; angle: string }[] = [
  { key: "perso", label: "Perso", angle: "ton équilibre, ton corps, ton énergie" },
  { key: "pro", label: "Pro", angle: "ton travail, tes projets" },
  { key: "relationnel", label: "Relationnel", angle: "tes proches, ton couple, ta famille, tes amis" },
];

export const PERIMETRE_KEYS = PERIMETRES.map((p) => p.key);

export function labelPerimetre(p: Perimetre): string {
  return PERIMETRES.find((x) => x.key === p)?.label ?? p;
}

export function anglePerimetre(p: Perimetre): string {
  return PERIMETRES.find((x) => x.key === p)?.angle ?? "";
}

// La direction posée sur un périmètre (store `objectifs` : perso / pro / relationnel).
export function directionDe(objectifs: Objectifs | null | undefined, p: Perimetre): string {
  if (!objectifs) return "";
  return (objectifs[p] ?? "").trim();
}
