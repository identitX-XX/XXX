// parcours-archetypes/scenarios.ts
// Génère 3 scénarios de sortie ACTIVABLES à partir des éclairages de la
// progression (dominant, secondaire, équilibre des sphères). Un par périmètre
// de vie : perso, pro, relationnel. L'utilisateur en active un → il devient
// son plan.

import { EtatEvolution, SphereKey } from "./types";
import { archetypeByKey, sphereByKey } from "./archetypes";
import { equilibreSpheres, lentilleDominante, topLentilles } from "./indicateurs";

export type Perimetre = "perso" | "pro" | "relationnel";

export interface Scenario {
  perimetre: Perimetre;
  mouvement: string; // Consolider / Réorienter / Oser
  titre: string;
  texte: string;
  appui: string; // l'archétype sur lequel il s'appuie
}

const LABEL_PERIMETRE: Record<Perimetre, string> = {
  perso: "Perso",
  pro: "Pro",
  relationnel: "Relationnel",
};

// Sphères → périmètres (le relationnel = Relations ; le pro = Travail ;
// le perso = le reste).
function sphereDuPerimetre(
  spheres: ReturnType<typeof equilibreSpheres>,
  perso: SphereKey[]
): SphereKey {
  let best = perso[0];
  let bestVal = -1;
  for (const s of spheres) {
    if (perso.includes(s.key) && s.valeur > bestVal) {
      bestVal = s.valeur;
      best = s.key;
    }
  }
  return best;
}

export function genererScenarios(
  etat: EtatEvolution,
  dominantKey: string,
  secondaireKey: string
): Scenario[] {
  const dom = archetypeByKey[dominantKey as keyof typeof archetypeByKey];
  const sec = archetypeByKey[secondaireKey as keyof typeof archetypeByKey];
  const spheres = equilibreSpheres(etat);
  const dominantActuel = lentilleDominante(etat)?.name ?? dom.name;
  const top = topLentilles(etat, 3);

  // Sphère perso la plus vive (corps / création / sens).
  const spherePerso = sphereByKey[sphereDuPerimetre(spheres, ["corps", "creation", "sens"])];

  return [
    {
      perimetre: "perso",
      mouvement: "Consolider",
      titre: `Renforce ${dom.name}`,
      texte: `Sur ces 30 jours, ${dominantActuel} t'a le plus porté. Côté perso, appuie-toi dessus dans ta sphère « ${spherePerso.label} » : un engagement concret qui prolonge ce qui marche déjà.`,
      appui: dom.name,
    },
    {
      perimetre: "pro",
      mouvement: "Réorienter",
      titre: `Ouvre à ${sec.name}`,
      texte: `Ton secondaire ${sec.name} est resté en réserve. Côté pro, déplace un peu d'énergie vers lui — là où ton dominant seul plafonne, il ouvre un angle neuf.`,
      appui: sec.name,
    },
    {
      perimetre: "relationnel",
      mouvement: "Oser",
      titre: "Fais un pas plus engageant",
      texte: `Côté relationnel, ose une conversation ou un geste que tu remets depuis un moment. Tes archétypes actifs (${top
        .map((t) => t.name)
        .join(", ")}) te donnent de quoi t'appuyer.`,
      appui: top[0]?.name ?? dom.name,
    },
  ];
}

export function labelPerimetre(p: Perimetre): string {
  return LABEL_PERIMETRE[p];
}
