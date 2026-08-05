// L'exercice du jour — un par périmètre de vie (perso · pro · relationnel),
// par la direction posée sur chaque périmètre. Comme la signature active change,
// les consignes changent avec elle : la quête « évolue ».

import type { Archetype, Objectifs } from "./types";
import { PERIMETRES, anglePerimetre, directionDe, Perimetre } from "@/parcours-gap/perimetres";

export type { Perimetre } from "@/parcours-gap/perimetres";

export interface ExercicePerimetre {
  perimetre: Perimetre;
  label: string;
  direction: string; // la direction posée (peut être vide)
  consigne: string; // l'exercice, teinté de la signature du moment
}

function consigne(perimetre: Perimetre, arch: Archetype, direction: string): string {
  const cible = direction ? `« ${direction} »` : anglePerimetre(perimetre);
  switch (perimetre) {
    case "perso":
      return `Où, dans ${anglePerimetre("perso")}, l'énergie de « ${arch.name} » demande-t-elle à s'exprimer aujourd'hui ? Pose un geste minuscule, au service de ${cible}.`;
    case "pro":
      return `Dans ${anglePerimetre("pro")}, comment « ${arch.name} » changerait ta prochaine action concrète ? Fais ce pas, pour faire avancer ${cible}.`;
    case "relationnel":
      return `Avec ${anglePerimetre("relationnel")}, ose aujourd'hui une interaction teintée de « ${arch.name} » — au service de ${cible}.`;
  }
}

// Les exercices du jour, un par périmètre.
export function exercicesDuJour(
  arch: Archetype,
  objectifs: Objectifs | null
): ExercicePerimetre[] {
  return PERIMETRES.map(({ key, label }) => {
    const direction = directionDe(objectifs, key);
    return { perimetre: key, label, direction, consigne: consigne(key, arch, direction) };
  });
}
