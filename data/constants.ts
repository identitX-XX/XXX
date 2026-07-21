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
export const NAV = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/parcours", label: "Quête IdentitX" },
  { href: "/parcours-archetypes", label: "12 Archétypes" },
  { href: "/explorer", label: "Explorer" },
  { href: "/progression", label: "Progression" },
  { href: "/dna", label: "ADN personnel" },
  { href: "/coach", label: "Coach IA" },
  { href: "/journal", label: "Journal" },
  { href: "/cartographie", label: "Cartographie" },
    { href: "/synthese", label: "Synthèse" },

  { href: "/reports", label: "Rapports" },
  { href: "/settings", label: "Paramètres" },
];

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
    href: "/explorer",
    title: "Explorer",
    phrase:
      "Réponds à des questions ciblées pour révéler tes traits, valeurs et motifs.",
  },
  {
    href: "/timeline",
    title: "Ligne de vie",
    phrase:
      "Place les moments clés de ton parcours et vois ce qui t'a façonnée.",
  },
  {
    href: "/dna",
    title: "ADN personnel",
    phrase: "Tes traits et motifs récurrents réunis en un profil.",
  },
  {
    href: "/cartographie",
    title: "Cartographie",
    phrase: "Tes thèmes reliés entre eux, en une carte visuelle.",
  },
  {
    href: "/journal",
    title: "Journal",
    phrase:
      "Note ce que tu vis et relis-toi pour repérer tes évolutions.",
  },
  {
    href: "/coach",
    title: "Coach IdentitX",
    phrase:
      "Un dialogue qui t'aide à mettre des mots sur ce qui te définit.",
  },
  {
    href: "/synthese",
    title: "Synthèse",
    phrase: "Ton profil en un coup d'œil : l'essentiel qui ressort.",
  },
  {
    href: "/reports",
    title: "Rapports",
    phrase:
      "Génère un document complet de ton exploration, à garder ou partager.",
  },
];


