// parcours-archetypes/archetypes.ts
// LE SEUL FICHIER DE CONTENU. Le moteur (évolution, indicateurs, charts) est
// agnostique : réécrire ici ne casse rien tant que les `key` restent stables.
//
// Voix « lentille » : une invitation à regarder (« observe… », « repère… »),
// jamais un verdict « tu es X ». La 12e — La Métamorphe — clôt le parcours
// (J30) : la lentille qui refuse toute étiquette.

import { Archetype, Emotion, Phase, Sphere } from "./types";

export const ARCHETYPES: Archetype[] = [
  {
    key: "explorateur",
    name: "L'Explorateur·rice",
    lens: "Observe ce qui s'ouvre quand tu oses l'inconnu — et ce que rester en place te coûte.",
    hue: 28,
  },
  {
    key: "sage",
    name: "Le·la Sage",
    lens: "Regarde comment tu cherches à comprendre avant d'agir, et où le savoir te met à l'abri.",
    hue: 265,
  },
  {
    key: "createur",
    name: "Le·la Créateur·rice",
    lens: "Remarque ce que tu as besoin de faire exister, qui n'était pas là avant toi.",
    hue: 330,
  },
  {
    key: "rebelle",
    name: "Le·la Rebelle",
    lens: "Vois ce que tu refuses de suivre, et ce que ton « non » cherche à protéger.",
    hue: 5,
  },
  {
    key: "protecteur",
    name: "Le·la Protecteur·rice",
    lens: "Repère qui et quoi tu veux mettre à l'abri, et ce que tu portes sans le dire.",
    hue: 150,
  },
  {
    key: "amoureux",
    name: "L'Amoureux·se",
    lens: "Regarde ce qui t'attache, ce que tu chéris, et ce que la proximité fait remonter.",
    hue: 345,
  },
  {
    key: "batisseur",
    name: "Le·la Bâtisseur·se",
    lens: "Observe où tu prends en charge la durée, l'ordre et le cap — pour toi et pour les autres.",
    hue: 210,
  },
  {
    key: "guerisseur",
    name: "Le·la Guérisseur·se",
    lens: "Remarque où tu transformes la douleur — la tienne, celle d'autrui — en apaisement.",
    hue: 175,
  },
  {
    key: "joueur",
    name: "Le·la Joueur·se",
    lens: "Observe où le jeu, la légèreté et l'humour te rendent à toi-même.",
    hue: 48,
  },
  {
    key: "passeur",
    name: "Le·la Passeur·se",
    lens: "Vois ce que tu te sens appelé·e à transmettre, et à qui tu ouvres un passage.",
    hue: 95,
  },
  {
    key: "reveur",
    name: "Le·la Rêveur·se",
    lens: "Regarde où vit ton émerveillement, et ce que ton imaginaire refuse d'abandonner.",
    hue: 300,
  },
  {
    key: "metamorphe",
    name: "La Métamorphe",
    lens: "Observe ce qui, en toi, ne cesse de se transformer — et se refuse à toute étiquette.",
    hue: 190,
  },
];

export const SPHERES: Sphere[] = [
  { key: "travail", label: "Travail" },
  { key: "relations", label: "Relations" },
  { key: "creation", label: "Création" },
  { key: "corps", label: "Corps & énergie" },
  { key: "sens", label: "Sens & intériorité" },
];

export const EMOTIONS: Emotion[] = [
  { key: "joie", label: "Joie", valence: 1 },
  { key: "elan", label: "Élan", valence: 0.6 },
  { key: "apaisement", label: "Apaisement", valence: 0.4 },
  { key: "peur", label: "Peur", valence: -0.6 },
  { key: "colere", label: "Colère", valence: -0.5 },
  { key: "tristesse", label: "Tristesse", valence: -0.8 },
];

export const PHASES: Phase[] = [
  {
    key: "revelation",
    label: "Révélation",
    jours: [1, 8],
    intention: "Laisser paraître les lentilles qui te viennent le plus naturellement.",
  },
  {
    key: "exploration",
    label: "Exploration",
    jours: [9, 16],
    intention: "Essayer des lentilles moins familières, dans d'autres sphères que d'habitude.",
  },
  {
    key: "tension",
    label: "Tension",
    jours: [17, 24],
    intention: "Rencontrer les frictions : quand deux lentilles, ou une lentille et un contexte, se contredisent.",
  },
  {
    key: "metamorphose",
    label: "Métamorphose",
    jours: [25, 30],
    intention: "Intégrer ce qui a bougé — sans se refermer sur une identité fixe.",
  },
];

// Index pratiques ------------------------------------------------------------

export const ARCHETYPE_KEYS = ARCHETYPES.map((a) => a.key);
export const SPHERE_KEYS = SPHERES.map((s) => s.key);
export const EMOTION_KEYS = EMOTIONS.map((e) => e.key);

export const archetypeByKey = Object.fromEntries(
  ARCHETYPES.map((a) => [a.key, a])
) as Record<(typeof ARCHETYPES)[number]["key"], Archetype>;

export const sphereByKey = Object.fromEntries(
  SPHERES.map((s) => [s.key, s])
) as Record<(typeof SPHERES)[number]["key"], Sphere>;

export const emotionByKey = Object.fromEntries(
  EMOTIONS.map((e) => [e.key, e])
) as Record<(typeof EMOTIONS)[number]["key"], Emotion>;

export function phaseDuJour(n: number): Phase {
  return PHASES.find((p) => n >= p.jours[0] && n <= p.jours[1]) ?? PHASES[0];
}
