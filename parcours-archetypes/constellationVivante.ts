// parcours-archetypes/constellationVivante.ts
// « Constellation vivante » : une carte d'étoiles qui grandit à CHAQUE capsule
// vécue. Disposition en spirale phyllotaxique (angle d'or ≈ 137,5°) — organique,
// infinie, parfaite pour un parcours sans fin : chaque capsule pose une étoile un
// peu plus loin, et le ciel s'étoffe comme un jardin qu'on fait pousser.
// Logique 100 % pure et déterministe → testable, mêmes entrées, mêmes sorties.

const ANGLE_OR = Math.PI * (3 - Math.sqrt(5)); // ~137,5° en radians
const K = 14; // espacement radial entre étoiles successives
const RAYON_MAX = 112; // garde les étoiles dans le viewBox 240×240

export interface PositionEtoile {
  x: number;
  y: number;
  i: number;
}

// Position déterministe de la i-ème étoile (i = 0 au centre = « toi ») dans un
// viewBox 240×240 centré en (120,120). Le rayon est clampé pour rester dans le
// cadre même quand la constellation devient très dense.
export function positionEtoile(i: number): PositionEtoile {
  const n = Math.max(0, Math.floor(i));
  const angle = n * ANGLE_OR;
  const r = Math.min(RAYON_MAX, K * Math.sqrt(n));
  return {
    x: 120 + r * Math.cos(angle),
    y: 120 + r * Math.sin(angle),
    i: n,
  };
}

export interface Palier {
  seuil: number;
  nom: string;
}

// Paliers nommés : des caps qui donnent un sentiment de progression SANS unité de
// temps (jamais « jour 30 ») — juste ce que ta constellation devient.
export const PALIERS: Palier[] = [
  { seuil: 0, nom: "Ciel encore vierge" },
  { seuil: 1, nom: "Première étoile" },
  { seuil: 3, nom: "Une amorce" },
  { seuil: 7, nom: "Constellation naissante" },
  { seuil: 14, nom: "Une figure se dessine" },
  { seuil: 24, nom: "Constellation vive" },
  { seuil: 40, nom: "Ciel habité" },
  { seuil: 60, nom: "Galaxie intérieure" },
];

export interface InfoConstellation {
  faits: number;
  etoiles: number; // étoiles allumées autour du cœur (= capsules vécues)
  palier: Palier; // palier actuellement atteint
  prochain: Palier | null; // palier suivant (null si au sommet)
  resteAvant: number; // capsules avant le prochain palier (0 si aucun)
  halo: number; // 0..1, intensité du halo (croît avec l'exploration)
  phrase: string; // accompagnement, sans injonction
}

// État dérivé de la constellation à partir du nombre de capsules vécues.
export function infoConstellation(faits: number): InfoConstellation {
  const f = Math.max(0, Math.floor(faits));

  let palier = PALIERS[0];
  let prochain: Palier | null = PALIERS[1] ?? null;
  for (let k = 0; k < PALIERS.length; k++) {
    if (f >= PALIERS[k].seuil) {
      palier = PALIERS[k];
      prochain = PALIERS[k + 1] ?? null;
    }
  }

  const resteAvant = prochain ? Math.max(0, prochain.seuil - f) : 0;
  const halo = Math.min(1, f / 40);
  const phrase =
    f === 0
      ? "Vis ta première capsule pour allumer ta première étoile."
      : prochain
      ? `Encore ${resteAvant} capsule${resteAvant > 1 ? "s" : ""} pour « ${prochain.nom} ».`
      : "Ta constellation est immense — et elle continue de grandir.";

  return { faits: f, etoiles: f, palier, prochain, resteAvant, halo, phrase };
}
