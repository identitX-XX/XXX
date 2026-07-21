// parcours-archetypes/premiereLecture.ts
// Time-to-aha au jour 1 : une première lecture CRÉDIBLE dès la fin du
// diagnostic, sans attendre 5 journées vécues. Sourcée (anti-Barnum) : elle
// s'appuie sur la distribution RÉELLE des 12 réponses (concentration, comptes)
// et cite le cap de l'utilisatrice — jamais un texte d'archétype générique.
// Toujours cadrée « à vérifier sur 30 jours ». Pur, déterministe.

import { Diagnostic, Objectifs } from "./types";
import { archetypeByKey } from "./archetypes";

export interface PremiereLecture {
  titre: string;
  corps: string;
  points: string[];
}

// Distance circulaire entre deux teintes (0..180).
function hueDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function premiereLecture(
  diagnostic: Diagnostic,
  objectifs: Objectifs | null
): PremiereLecture {
  const dom = archetypeByKey[diagnostic.dominant];
  const sec = archetypeByKey[diagnostic.secondaire];
  const tally = diagnostic.tally;
  const points: string[] = [];

  // 1) Concentration / dispersion — sourcé sur ses vraies réponses.
  let corps: string;
  if (tally) {
    const distinct = Object.values(tally).filter((n) => (n ?? 0) > 0).length;
    const domN = tally[diagnostic.dominant] ?? 0;
    const secN = tally[diagnostic.secondaire] ?? 0;
    points.push(
      `Sur tes 12 réponses, tu as penché ${domN} fois vers ${dom.name}, ${secN} fois vers ${sec.name}.`
    );
    corps =
      distinct <= 4
        ? "Tes réponses convergent : un profil déjà net, une direction claire."
        : distinct >= 8
        ? "Tes réponses se répartissent sur beaucoup de facettes — cohérent avec une période où plusieurs versions de toi coexistent."
        : "Tes réponses dessinent un cœur net, entouré de nuances.";
  } else {
    corps = "Voici ce qui ressort de ton diagnostic — un point de départ, pas un verdict.";
  }

  // 2) Couplage dominant × secondaire — dérivé des teintes du modèle.
  const contraste = hueDist(dom.hue, sec.hue) > 90;
  points.push(
    contraste
      ? `${dom.name} et ${sec.name} sont deux forces contrastées : une tension féconde à habiter, pas à résoudre.`
      : `${dom.name} et ${sec.name} sont deux forces proches qui se renforcent — un même élan, deux nuances.`
  );

  // 3) Ancrage sur le cap — ses propres mots.
  const cap = objectifs
    ? (["perso", "pro", "relationnel"] as const)
        .map((k) => objectifs[k]?.trim())
        .find((v) => v)
    : undefined;
  if (cap) {
    points.push(
      `Sur ton cap « ${cap} », c'est ${dom.name} qui sera à l'œuvre — les 30 jours diront si c'est ton moteur ou ton piège.`
    );
  }

  return { titre: "Ce que je vois déjà de toi", corps, points };
}
