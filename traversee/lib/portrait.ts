// traversee/lib/portrait.ts
// Le portrait qui se révèle. La netteté (clarity 0..100, visible en permanence)
// pilote TROIS choses, de façon monotone et déterministe :
//   · le flou           : épais au départ, nul à la fin ;
//   · le voile          : le vide violet posé par-dessus, qui se lève ;
//   · la fuchsia        : DIFFUSE au J1 (halo large, faible) → CONCENTRÉE au J30
//                         (un seul point intense). C'est la thèse en image :
//                         on ne se révèle pas en s'ajoutant, mais en se resserrant.
// Aucune animation ici : juste les paramètres. Le composant décide du rendu et
// respecte prefers-reduced-motion.

export interface PortraitParams {
  reveal: number; // 0..1 — part révélée
  blur: number; // px de flou gaussien (28 → 0)
  veil: number; // 0..1 — opacité du voile de vide par-dessus
  glowRadius: number; // rayon relatif du halo fuchsia (large → resserré)
  glowIntensity: number; // 0..1 — intensité du point fuchsia (faible → fort)
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Courbe douce : la révélation s'accélère sur la fin (la nomination du J30
// « ouvre » le visage). easeInOut léger, déterministe.
function eased(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x); // smoothstep
}

export function portraitParams(clarity: number): PortraitParams {
  const reveal = eased(clamp01(clarity / 100));
  return {
    reveal,
    blur: Math.round(lerp(28, 0, reveal) * 100) / 100,
    veil: Math.round(lerp(0.82, 0, reveal) * 1000) / 1000,
    // la fuchsia se concentre : le halo rétrécit, son intensité monte.
    glowRadius: Math.round(lerp(0.85, 0.14, reveal) * 1000) / 1000,
    glowIntensity: Math.round(lerp(0.22, 1, reveal) * 1000) / 1000,
  };
}
