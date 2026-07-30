// parcours-archetypes/archetypes.ts
// Le moteur (évolution, indicateurs, charts) est agnostique : il consomme
// ARCHETYPES / ARCHETYPE_KEYS. Depuis la migration, ces « archétypes » SONT les
// 20 Signatures (source de contenu unique : signatures.ts). Les noms d'export
// historiques (ARCHETYPES, archetypeByKey, ARCHETYPE_KEYS) sont conservés pour
// ne rien casser dans le reste du moteur.

import { Archetype, Emotion, Phase, Sphere } from "./types";
import { SIGNATURES } from "./signatures";

// Projection des Signatures dans la forme `Archetype` attendue par le moteur.
// lens/question/defi alimentent la journée ; essence/force/ombre la fiche & le
// rapport (mappés depuis valeur / forces / ombres).
export const ARCHETYPES: Archetype[] = SIGNATURES.map((s) => ({
  key: s.key,
  name: s.name,
  lens: s.lens,
  hue: s.hue,
  essence: s.valeur,
  force: s.forces,
  ombre: s.ombres,
  question: s.question,
  defi: s.defi,
}));

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
  { key: "doute", label: "Doute", valence: -0.3 },
  { key: "peur", label: "Peur", valence: -0.6 },
  { key: "colere", label: "Colère", valence: -0.5 },
  { key: "tristesse", label: "Tristesse", valence: -0.8 },
];

export const PHASES: Phase[] = [
  {
    key: "revelation",
    label: "Révélation",
    jours: [1, 8],
    intention: "Laisser paraître les signatures qui te viennent le plus naturellement.",
  },
  {
    key: "exploration",
    label: "Exploration",
    jours: [9, 16],
    intention: "Essayer des signatures moins familières, dans d'autres sphères que d'habitude.",
  },
  {
    key: "tension",
    label: "Tension",
    jours: [17, 24],
    intention: "Rencontrer les frictions : quand deux signatures, ou une signature et un contexte, se contredisent.",
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
