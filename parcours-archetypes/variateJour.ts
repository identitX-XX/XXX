// Variation quotidienne du GESTE et de la QUESTION de la journée.
//
// Problème résolu : chaque signature ne portait qu'UN geste (`defi`) et UNE
// question (`question`). Résultat : deux jours sous la même signature = mots
// identiques. Ici, on fait TOURNER plusieurs formulations par jour (rotation
// déterministe sur le numéro du jour), tout en restant ancré sur la signature.
// 100 % local, sans IA, testable : deux jours consécutifs ne tombent jamais sur
// la même phrase, et un jour donné rend toujours la même (cohérence en relecture).

import type { Archetype } from "./types";

// Le geste natif de la signature ouvre la rotation ; les suivants sont des
// cadrages génériques qui marchent pour TOUTE signature (on n'interpole que son
// nom, jamais ses longues descriptions → ça reste net et juste).
function gestes(arch: Archetype): string[] {
  const n = arch.name;
  return [
    arch.defi, // le geste natif, spécifique à la signature
    `Aujourd'hui, dans une conversation, laisse « ${n} » parler à ta place une fois — et vois ce que ça change.`,
    `Repère un moment où tu brides « ${n} ». Laisse-la respirer, une fois, juste pour voir.`,
    `Prends une micro-décision aujourd'hui depuis « ${n} », pas depuis tes habitudes.`,
    `Offre à « ${n} » une occasion inhabituelle de se montrer — là où tu ne l'attends pas.`,
    `Ce soir, note un moment où « ${n} » t'a manqué aujourd'hui, et ce que tu aurais fait autrement.`,
    `Choisis une situation ordinaire et traverse-la délibérément en « ${n} ».`,
  ].filter((s) => (s ?? "").trim());
}

function questions(arch: Archetype): string[] {
  const n = arch.name;
  return [
    arch.question, // la question de coaching native
    `Aujourd'hui, où « ${n} » demande-t-elle à s'exprimer — et qu'est-ce qui la retient ?`,
    `Quand « ${n} » s'active en toi, qu'est-ce qu'elle cherche à protéger ou à faire grandir ?`,
    `Qu'est-ce qui, aujourd'hui, nourrit « ${n} » — et qu'est-ce qui l'épuise ?`,
    `Si tu accordais un cran de liberté de plus à « ${n} », que ferais-tu autrement ?`,
    `Où joues-tu contre « ${n} » au lieu de t'appuyer sur elle ?`,
    `À quoi ressemblerait ta journée si « ${n} » la menait entièrement ?`,
  ].filter((s) => (s ?? "").trim());
}

function choisir(liste: string[], jour: number): string {
  if (!liste.length) return "";
  const i = ((jour - 1) % liste.length + liste.length) % liste.length;
  return liste[i];
}

// Le geste du jour — varie d'un jour à l'autre, même sous la même signature.
export function gesteDuJour(arch: Archetype, jour: number): string {
  return choisir(gestes(arch), jour);
}

// La question du jour — même logique de rotation.
export function questionDuJour(arch: Archetype, jour: number): string {
  return choisir(questions(arch), jour);
}
