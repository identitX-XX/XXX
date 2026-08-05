// La « boucle quotidienne » d'IdentitX — micro-exploration façon Duolingo, sans
// l'infantilisation. Chaque jour = une facette légère (cartes à choisir) qui
// produit une micro-révélation ET éclaire une connexion sur la carte identitaire.
// Ce fichier tient les dimensions, les facettes du jour, et la logique de
// révélation (déterministe, sourcée sur les choix — jamais un texte creux).

export type DimKey =
  | "creation"
  | "transmission"
  | "organisation"
  | "lien"
  | "soin"
  | "exploration";

export const DIMENSIONS: Record<DimKey, { nom: string; fil: string }> = {
  creation: { nom: "Création", fil: "créer" },
  transmission: { nom: "Transmission", fil: "transmettre" },
  organisation: { nom: "Structure", fil: "structurer" },
  lien: { nom: "Lien", fil: "relier" },
  soin: { nom: "Soin", fil: "prendre soin" },
  exploration: { nom: "Exploration", fil: "explorer" },
};

export const DIM_KEYS = Object.keys(DIMENSIONS) as DimKey[];

export interface Carte {
  label: string;
  dim: DimKey;
}

export interface Facette {
  id: string;
  eyebrow: string;
  invitation: string;
  question: string;
  cartes: Carte[];
  demain: string; // l'ouverture vers la facette suivante
}

// Les facettes du parcours — une par jour. On démarre par « ton énergie ».
// (Les suivantes reprennent ta liste : ce que tu fais naturellement, ce que les
// autres viennent chercher, ce que tu ne veux plus, ce que tu veux transmettre…)
export const FACETTES: Facette[] = [
  {
    id: "energie",
    eyebrow: "Aujourd'hui · 3 min",
    invitation: "Explorons ce qui te donne de l'énergie.",
    question: "Quand tu te sens pleinement à ta place, que fais-tu le plus souvent ?",
    cartes: [
      { label: "Je crée", dim: "creation" },
      { label: "Je transmets", dim: "transmission" },
      { label: "J'organise", dim: "organisation" },
      { label: "Je relie des idées", dim: "lien" },
      { label: "J'accompagne", dim: "soin" },
      { label: "J'explore", dim: "exploration" },
    ],
    demain: "Demain, nous explorerons ce que tu veux construire à partir de cette énergie.",
  },
];

export function facetteDuJour(jours: number): Facette {
  return FACETTES[Math.min(jours, FACETTES.length - 1)];
}

// Le « fil » commun à deux dimensions — ce qui les relie plutôt que de les
// opposer. C'est le cœur du recadrage « tu n'es pas dispersée ».
export function filCommun(a: DimKey, b: DimKey): string {
  if (a === "lien" || b === "lien") return "relier des univers différents";
  if (a === "transmission" || b === "transmission") return "transmettre ce que tu vis";
  if (a === "soin" || b === "soin") return "prendre soin, à ta manière";
  return `${DIMENSIONS[a].fil} et ${DIMENSIONS[b].fil} dans un même mouvement`;
}

export interface Revelation {
  titre: string;
  resonance: string;
  reframe: string;
  connexion: [DimKey, DimKey];
}

// La micro-révélation, calculée sur les deux choix. Valeur immédiate + l'effet
// « Ah, je me reconnais ».
export function reveler(choix: DimKey[]): Revelation | null {
  if (choix.length < 2) return null;
  const [a, b] = choix;
  const fil = filCommun(a, b);
  return {
    titre: `Tu sembles puiser ton énergie dans ${DIMENSIONS[a].nom} et ${DIMENSIONS[b].nom}.`,
    resonance: `Ces deux élans ne s'opposent pas chez toi : ils se nourrissent. Une même fonction les relie — ${fil}.`,
    reframe: `Tu n'es peut-être pas dispersée. Tes élans s'organisent autour d'un fil : ${fil}.`,
    connexion: [a, b],
  };
}
