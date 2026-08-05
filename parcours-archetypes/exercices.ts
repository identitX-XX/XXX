// Les 3 exercices du jour — un par périmètre de vie (perso · pro · relationnel),
// PILOTÉS par la signature du moment (qui varie au fil de la quête) et par la
// direction que tu as posée sur chaque périmètre. Chaque jour, comme la signature
// active change, les trois consignes changent avec elle : la quête « évolue ».

import type { Archetype, Objectifs } from "./types";

export type Perimetre = "perso" | "pro" | "relationnel";

export interface ExercicePerimetre {
  perimetre: Perimetre;
  label: string;
  direction: string; // la direction posée sur ce périmètre (peut être vide)
  consigne: string; // l'exercice, teinté de la signature du moment
}

const AMORCE: Record<Perimetre, { label: string; angle: string }> = {
  perso: { label: "Perso", angle: "ton équilibre, ton corps, ton énergie" },
  pro: { label: "Pro", angle: "ton travail, tes projets" },
  relationnel: { label: "Relationnel", angle: "un lien qui compte" },
};

function consigne(perimetre: Perimetre, arch: Archetype, direction: string): string {
  const d = direction.trim();
  const cible = d ? `« ${d} »` : AMORCE[perimetre].angle;
  switch (perimetre) {
    case "perso":
      return `Où, dans ${AMORCE.perso.angle}, l'énergie de « ${arch.name} » demande-t-elle à s'exprimer aujourd'hui ? Pose un geste minuscule, au service de ${cible}.`;
    case "pro":
      return `Dans ${AMORCE.pro.angle}, comment « ${arch.name} » changerait ta prochaine action concrète ? Fais ce pas, pour faire avancer ${cible}.`;
    case "relationnel":
      return `Avec une personne aujourd'hui, ose une interaction teintée de « ${arch.name} » — au service de ${cible}.`;
  }
}

// Les 3 exercices du jour, dans l'ordre perso → pro → relationnel.
export function exercicesDuJour(
  arch: Archetype,
  objectifs: Objectifs | null
): ExercicePerimetre[] {
  const faire = (p: Perimetre): ExercicePerimetre => {
    const direction = (objectifs?.[p] ?? "").trim();
    return {
      perimetre: p,
      label: AMORCE[p].label,
      direction,
      consigne: consigne(p, arch, direction),
    };
  };
  return [faire("perso"), faire("pro"), faire("relationnel")];
}
