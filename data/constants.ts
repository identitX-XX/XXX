export const CATEGORIES: { key: string; label: string }[] = [
  { key: "valeurs", label: "Valeurs" },
  { key: "personnalite", label: "Personnalité" },
  { key: "forces", label: "Forces" },
  { key: "talents", label: "Talents" },
  { key: "competences", label: "Compétences" },
  { key: "blessures", label: "Blessures" },
  { key: "peur", label: "Peur" },
  { key: "habitudes", label: "Habitudes" },
  { key: "relations", label: "Relations" },
  { key: "travail", label: "Travail" },
  { key: "mission", label: "Mission de vie" },
  { key: "emotions", label: "Émotions" },
  { key: "energie", label: "Énergie" },
  { key: "motivations", label: "Motivations" },
];

export const RADAR_AXES = [
  "Leadership",
  "Créativité",
  "Discipline",
  "Empathie",
  "Communication",
  "Résilience",
  "Confiance",
  "Optimisme",
  "Vision",
  "Intuition",
];
// Navigation groupée — une limpidité par intention. Les libellés sont
// désambiguïsés : « Le parcours » (les 30 jours) ≠ « La Quête » (le jeu).
// Navigation focalisée sur la colonne : de 18 entrées à la seule séquence qui
// compte — Comprendre (Acte I) → Orchestrer (Acte II), plus le quotidien et
// l'aide. Les surfaces contemplatives et annexes (Traversée, ADN, Cartographie,
// Le parcours, Journal, Tableau de bord, Synthèse, Rapport) existent toujours
// comme pages mais sortent du cœur : elles ne dispersent plus.
export const NAV_GROUPS: {
  section: string | null;
  items: { href: string; label: string }[];
}[] = [
  {
    section: "Au quotidien",
    items: [
      { href: "/aujourdhui", label: "Aujourd'hui" },
      { href: "/exercices", label: "Mes exercices" },
      { href: "/scenarios", label: "Scénarios" },
    ],
  },
  {
    section: "Comprendre",
    items: [
      { href: "/parcours-signatures", label: "Ta signature" },
      { href: "/synthese", label: "Ton portrait — valeurs, forces, compétences" },
      { href: "/explorer", label: "Explorer" },
      { href: "/cartographie", label: "Cartographie" },
    ],
  },
  {
    section: "Orchestrer",
    items: [
      { href: "/quete", label: "La Quête" },
      { href: "/progression", label: "Progression" },
      { href: "/rapport-analytique", label: "Rapport analytique" },
    ],
  },
  {
    section: "Aide",
    items: [
      { href: "/coach", label: "Coach identitX" },
      { href: "/ressources", label: "Ressources" },
      { href: "/presentation", label: "Revoir la présentation" },
    ],
  },
  {
    section: null,
    items: [{ href: "/settings", label: "Paramètres" }],
  },
];

// Liste plate, pour tout code qui aurait besoin de l'ensemble des entrées.
export const NAV = NAV_GROUPS.flatMap((g) => g.items);

// Source unique du parcours : les 8 blocs, dans l'ordre.
// Sert à la fois au fléchage <NextStep> et à la vue d'ensemble
// <ParcoursOverview>. Un seul contenu, deux usages.
export type JourneyStep = {
  href: string;
  title: string;
  phrase: string;
};

// La colonne, dans l'ordre des deux actes : Comprendre → Orchestrer. Les
// surfaces contemplatives (ADN, Cartographie, Journal, Synthèse, Rapport) n'y
// figurent plus — la vue d'ensemble ne parade que la séquence qui compte.
export const JOURNEY: JourneyStep[] = [
  {
    href: "/parcours-signatures",
    title: "Ta signature",
    phrase:
      "Douze questions, et la signature qui te met en mouvement se révèle. Tout commence là.",
  },
  {
    href: "/explorer",
    title: "Explorer",
    phrase:
      "Des questions justes pour faire remonter tes valeurs, tes forces, tes directions.",
  },
  {
    href: "/scenarios",
    title: "Scénarios",
    phrase:
      "Ta carte devient mouvement : des possibles d'orchestration qui émergent de tes bascules.",
  },
  {
    href: "/quete",
    title: "La Quête",
    phrase:
      "Ce dont tu te délestes pour avancer — le geste, joué et rejoué.",
  },
  {
    href: "/progression",
    title: "Progression",
    phrase: "La trace de ton mouvement : chaque journée vécue, d'un seul coup d'œil.",
  },
];


