// Les périmètres de vie — désormais QUATRE : perso, pro, familial, amoureux
// (le « relationnel » se scinde en familial + amoureux). Source unique, utilisée
// par les exercices, l'éclairage, l'accueil et le rapport.

import type { Objectifs } from "@/parcours-archetypes/types";

export type Perimetre = "perso" | "pro" | "familial" | "amoureux";

export const PERIMETRES: { key: Perimetre; label: string; angle: string }[] = [
  { key: "perso", label: "Perso", angle: "ton équilibre, ton corps, ton énergie" },
  { key: "pro", label: "Pro", angle: "ton travail, tes projets" },
  { key: "familial", label: "Familial", angle: "ta famille, tes proches" },
  { key: "amoureux", label: "Amoureux", angle: "ta vie amoureuse, ton couple" },
];

export const PERIMETRE_KEYS = PERIMETRES.map((p) => p.key);

export function labelPerimetre(p: Perimetre): string {
  return PERIMETRES.find((x) => x.key === p)?.label ?? p;
}

export function anglePerimetre(p: Perimetre): string {
  return PERIMETRES.find((x) => x.key === p)?.angle ?? "";
}

// La direction posée sur un périmètre. Le store `objectifs` historique n'a que
// perso / pro / relationnel : familial et amoureux héritent (pour l'instant) de
// la direction « relationnel », le temps qu'on l'affine.
export function directionDe(objectifs: Objectifs | null | undefined, p: Perimetre): string {
  if (!objectifs) return "";
  if (p === "perso") return (objectifs.perso ?? "").trim();
  if (p === "pro") return (objectifs.pro ?? "").trim();
  return (objectifs.relationnel ?? "").trim(); // familial + amoureux
}
