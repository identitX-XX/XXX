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
export const NAV_GROUPS: {
  section: string | null;
  items: { href: string; label: string }[];
}[] = [
  {
    section: "Au quotidien",
    items: [
      { href: "/aujourdhui", label: "Aujourd'hui" },
      { href: "/traversee", label: "La Traversée" },
    ],
  },
  {
    section: "Ton identité",
    items: [
      { href: "/parcours-archetypes", label: "Ton archétype" },
      { href: "/quete", label: "La Quête" },
      { href: "/explorer", label: "Explorer" },
      { href: "/dna", label: "ADN personnel" },
    ],
  },
  {
    section: "Le parcours",
    items: [
      { href: "/parcours", label: "Le parcours" },
      { href: "/progression", label: "Progression" },
      { href: "/cartographie", label: "Cartographie" },
    ],
  },
  {
    section: "Ressources & aide",
    items: [
      { href: "/ressources", label: "Ressources" },
      { href: "/coach", label: "Coach IA" },
      { href: "/journal", label: "Journal" },
    ],
  },
  {
    section: "Tes bilans",
    items: [
      { href: "/dashboard", label: "Tableau de bord" },
      { href: "/synthese", label: "Synthèse" },
      { href: "/reports", label: "Rapport journalier" },
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

export const JOURNEY: JourneyStep[] = [
  {
    href: "/parcours-archetypes",
    title: "Ton archétype",
    phrase:
      "Douze questions, et l'archétype qui te met en mouvement se révèle. Tout commence là.",
  },
  {
    href: "/explorer",
    title: "Explorer",
    phrase:
      "Des questions justes pour faire remonter tes caractéristiques, tes valeurs, tes motifs.",
  },
  {
    href: "/progression",
    title: "Progression",
    phrase: "Ta carte des 30 jours : chaque journée vécue, d'un seul coup d'œil.",
  },
  {
    href: "/dna",
    title: "ADN personnel",
    phrase: "Tout ce qui ressort, réuni en un seul portrait — ton ADN, net.",
  },
  {
    href: "/cartographie",
    title: "Cartographie",
    phrase: "Tes thèmes reliés entre eux : la carte de ce qui te compose.",
  },
  {
    href: "/journal",
    title: "Journal",
    phrase:
      "Écris ce que tu traverses. Relis-toi plus tard : le chemin saute aux yeux.",
  },
  {
    href: "/coach",
    title: "Coach IdentitX",
    phrase: "Un dialogue qui pose des mots là où tu n'en avais pas encore.",
  },
  {
    href: "/synthese",
    title: "Synthèse",
    phrase: "L'essentiel de toi, distillé — ton profil en un regard.",
  },
  {
    href: "/reports",
    title: "Rapports",
    phrase: "Un document complet de ton exploration, à garder ou à transmettre.",
  },
];


