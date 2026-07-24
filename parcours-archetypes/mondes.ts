// parcours-archetypes/mondes.ts
// Les cinq mondes de La Quête — une même quête, cinq peaux visuelles. Le monde
// choisi teinte l'écran (fond, accent, encre) et donne son nom à la récompense.
// Purement déclaratif : l'UI lit ces valeurs, rien de plus.

export type MondeKey = "nature" | "urbain" | "futuriste" | "retro" | "manga";

export interface Monde {
  key: MondeKey;
  nom: string;
  tagline: string;
  motif: string; // emoji d'ambiance (sélecteur uniquement)
  bg: string; // fond de l'écran
  panel: string; // fond des cartes
  line: string; // bordures
  ink: string; // texte principal
  muted: string; // texte secondaire
  accent: string; // couleur d'action
  accent2: string; // second accent / dégradé
  recompense: string; // trophée (singulier)
  recompensePl: string; // trophée (pluriel)
}

export const MONDES: Monde[] = [
  {
    key: "nature",
    nom: "Nature",
    tagline: "Forêts, mousse, lumière filtrée.",
    motif: "🌿",
    bg: "radial-gradient(1000px 560px at 50% -6%, #16281c 0%, rgba(22,40,28,0) 60%), #0a120c",
    panel: "linear-gradient(180deg, #12201699, #0c150e)",
    line: "#22331f",
    ink: "#eaf3e6",
    muted: "#93a891",
    accent: "#5fbf7a",
    accent2: "#b7d84a",
    recompense: "graine", recompensePl: "graines",
  },
  {
    key: "urbain",
    nom: "Urbain",
    tagline: "Béton, néons, ville la nuit.",
    motif: "🏙️",
    bg: "radial-gradient(1000px 560px at 50% -6%, #1b1424 0%, rgba(27,20,36,0) 60%), #0b0b0f",
    panel: "linear-gradient(180deg, #16161d99, #0e0e12)",
    line: "#262633",
    ink: "#eef0f4",
    muted: "#98a0ae",
    accent: "#ff477e",
    accent2: "#22d3ee",
    recompense: "néon", recompensePl: "néons",
  },
  {
    key: "futuriste",
    nom: "Futuriste",
    tagline: "Verre, hologrammes, lumière froide.",
    motif: "🛰️",
    bg: "radial-gradient(1000px 560px at 50% -6%, #0e2330 0%, rgba(14,35,48,0) 60%), #070d12",
    panel: "linear-gradient(180deg, #0c1a2299, #081016)",
    line: "#123043",
    ink: "#e6f6ff",
    muted: "#83a3b5",
    accent: "#35e0d6",
    accent2: "#7c5cff",
    recompense: "cristal", recompensePl: "cristaux",
  },
  {
    key: "retro",
    nom: "Rétro",
    tagline: "Pixels, CRT, arcade des années 80.",
    motif: "🕹️",
    bg: "radial-gradient(1000px 560px at 50% -6%, #2a1030 0%, rgba(42,16,48,0) 60%), #120616",
    panel: "linear-gradient(180deg, #1d0e2299, #140816)",
    line: "#3a1c40",
    ink: "#ffe9c7",
    muted: "#c99bb0",
    accent: "#ff5cae",
    accent2: "#ffcf3a",
    recompense: "vie", recompensePl: "vies",
  },
  {
    key: "manga",
    nom: "Manga",
    tagline: "Encre, trames, cases noir & blanc.",
    motif: "🗾",
    bg: "radial-gradient(1000px 560px at 50% -6%, #201014 0%, rgba(32,16,20,0) 60%), #0c0a0b",
    panel: "linear-gradient(180deg, #17141599, #100e0f)",
    line: "#2c2224",
    ink: "#f6f2f2",
    muted: "#a79ea0",
    accent: "#e63946",
    accent2: "#f1faee",
    recompense: "sceau", recompensePl: "sceaux",
  },
];

export const mondeByKey: Record<MondeKey, Monde> = Object.fromEntries(
  MONDES.map((m) => [m.key, m])
) as Record<MondeKey, Monde>;
