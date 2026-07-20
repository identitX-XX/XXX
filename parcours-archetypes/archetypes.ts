// parcours-archetypes/archetypes.ts
// LE SEUL FICHIER DE CONTENU. Remplace librement les textes ci-dessous sans
// toucher au moteur : tout le reste (évolution, indicateurs, charts) est
// agnostique du contenu.
//
// [DÉFAUTS — à relire / réécrire] Les 12 lentilles, 5 sphères, 6 émotions,
// 4 phases. Rédigés en « lentille » (regarde / observe / repère…), jamais
// « tu es X ». La 12e — La Métamorphe — est la lentille de clôture (J30).

import { Archetype, Emotion, Phase, Sphere } from "./types";

export const ARCHETYPES: Archetype[] = [
  {
    key: "explorateur",
    name: "L'Explorateur·rice",
    lens: "Repère ce qui te pousse à partir, à élargir l'horizon plutôt qu'à t'installer.",
    hue: 28,
  },
  {
    key: "sage",
    name: "Le·la Sage",
    lens: "Observe comment tu cherches à comprendre avant d'agir, et où le savoir te rassure.",
    hue: 265,
  },
  {
    key: "createur",
    name: "Le·la Créateur·rice",
    lens: "Remarque ce que tu as besoin de faire exister qui n'était pas là avant.",
    hue: 330,
  },
  {
    key: "rebelle",
    name: "Le·la Rebelle",
    lens: "Vois ce que tu refuses de suivre, et ce que ta rupture cherche à protéger.",
    hue: 5,
  },
  {
    key: "protecteur",
    name: "Le·la Protecteur·rice",
    lens: "Repère qui et quoi tu veux mettre à l'abri, et ce que tu portes pour eux.",
    hue: 150,
  },
  {
    key: "amoureux",
    name: "L'Amoureux·se",
    lens: "Regarde ce qui t'attache, ce que tu chéris et ce que la proximité révèle.",
    hue: 345,
  },
  {
    key: "batisseur",
    name: "Le·la Bâtisseur·se",
    lens: "Observe où tu prends la responsabilité de l'ordre, de la durée et du cap.",
    hue: 210,
  },
  {
    key: "guerisseur",
    name: "Le·la Guérisseur·se",
    lens: "Remarque où tu transformes la douleur — la tienne, celle des autres — en apaisement.",
    hue: 175,
  },
  {
    key: "joueur",
    name: "Le·la Joueur·se",
    lens: "Observe où le jeu et l'humour te libèrent de ce qui pèse trop.",
    hue: 48,
  },
  {
    key: "passeur",
    name: "Le·la Passeur·se",
    lens: "Vois ce que tu te sens appelé·e à transmettre, et à qui tu ouvres un chemin.",
    hue: 95,
  },
  {
    key: "reveur",
    name: "Le·la Rêveur·se",
    lens: "Regarde où tu cherches encore l'émerveillement et le droit de tout recommencer.",
    hue: 300,
  },
  {
    key: "metamorphe",
    name: "La Métamorphe",
    lens: "Observe ce qui, en toi, ne cesse de se transformer — et refuse de se figer.",
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
    intention: "Laisser apparaître les lentilles qui te sont les plus familières.",
  },
  {
    key: "exploration",
    label: "Exploration",
    jours: [9, 16],
    intention: "Essayer des lentilles moins spontanées, dans d'autres sphères.",
  },
  {
    key: "tension",
    label: "Tension",
    jours: [17, 24],
    intention: "Rencontrer les frictions entre lentilles et contextes.",
  },
  {
    key: "metamorphose",
    label: "Métamorphose",
    jours: [25, 30],
    intention: "Intégrer ce qui bouge — sans se refermer sur une identité fixe.",
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
