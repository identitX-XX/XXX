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
  { href: "/archetypes", label: "12 Archétypes" },
  { href: "/explorer", label: "Explorer" },
  { href: "/timeline", label: "Ligne de vie" },
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

// --- Module : Parcours des 12 Archétypes ---------------------------------
// Local-first, aucun backend. Un archétype n'est jamais une étiquette
// (« tu es… ») : c'est une lentille d'exploration, qui se lit différemment
// selon les contextes de vie. Source unique de contenu (même principe que
// JOURNEY), consommée par le module <Archetypes>.

export type ArchetypeContext = { key: string; label: string };

// Les contextes de vie à travers lesquels une même lentille se lit autrement.
// [DÉFAUT — à ajuster] 4 contextes proposés.
export const ARCHETYPE_CONTEXTS: ArchetypeContext[] = [
  { key: "travail", label: "Travail" },
  { key: "relations", label: "Relations" },
  { key: "creation", label: "Création" },
  { key: "epreuves", label: "Épreuves" },
];

export type Archetype = {
  key: string;
  name: string;
  // La « lentille » : une invitation à regarder, jamais un verdict « tu es… ».
  lens: string;
  // Lecture de la lentille par contexte (clé = ArchetypeContext.key).
  // Optionnel au stade squelette : l'UI affiche « À rédiger » si absent.
  readings?: Record<string, string>;
};

// [DÉFAUT — à remplacer par ta liste/tes textes] 12 archétypes jungiens.
// 2 sont remplis en exemple (lens + lectures par contexte) ; les 10 autres
// n'ont que la lentille (placeholder) — à compléter ensuite.
export const ARCHETYPES: Archetype[] = [
  {
    key: "explorateur",
    name: "L'Explorateur",
    lens: "Repère ce qui te pousse à partir, à élargir l'horizon plutôt qu'à t'installer.",
    readings: {
      travail:
        "Tu cherches des terrains neufs plutôt que des routines ; l'ennui te signale qu'il est temps de bouger.",
      relations:
        "Tu tiens à ta liberté de mouvement ; l'engagement se vit mieux quand il reste une ouverture, pas une cage.",
      creation:
        "Tu crées en explorant, par essais et détours, sans te fixer trop tôt sur une seule voie.",
      epreuves:
        "Face à l'épreuve, tu pars en reconnaissance : comprendre le territoire rend l'obstacle traversable.",
    },
  },
  {
    key: "sage",
    name: "Le Sage",
    lens: "Observe comment tu cherches à comprendre avant d'agir, et où le savoir te rassure.",
    readings: {
      travail:
        "Tu veux comprendre avant de trancher ; décider te coûte tant que le tableau n'est pas clair.",
      relations:
        "Tu offres de la lucidité plus que de la chaleur immédiate ; on vient te chercher pour y voir clair.",
      creation:
        "Tu crées à partir du sens : l'idée juste compte plus que l'effet.",
      epreuves:
        "Dans l'épreuve, tu cherches la leçon ; nommer ce qui arrive t'aide à ne pas t'y perdre.",
    },
  },
  {
    key: "innocent",
    name: "L'Innocent",
    lens: "Regarde où tu cherches encore la confiance simple et le droit de recommencer.",
  },
  {
    key: "rebelle",
    name: "Le Rebelle",
    lens: "Vois ce que tu refuses de suivre, et ce que ta rupture cherche à protéger.",
  },
  {
    key: "magicien",
    name: "Le Magicien",
    lens: "Remarque où tu transformes les situations plutôt que de les subir.",
  },
  {
    key: "heros",
    name: "Le Héros",
    lens: "Note ce que tu te sens appelé à défendre, et le prix que tu es prêt à payer.",
  },
  {
    key: "amant",
    name: "L'Amant·e",
    lens: "Regarde ce qui t'attache, ce que tu chéris et ce que la proximité révèle.",
  },
  {
    key: "bouffon",
    name: "Le Bouffon",
    lens: "Observe où le jeu et l'humour te libèrent de ce qui pèse trop.",
  },
  {
    key: "ordinaire",
    name: "L'Ordinaire",
    lens: "Vois où tu cherches à appartenir, à rester simple et proche des autres.",
  },
  {
    key: "protecteur",
    name: "Le Protecteur",
    lens: "Repère qui et quoi tu veux mettre à l'abri, et ce que tu portes pour eux.",
  },
  {
    key: "createur",
    name: "Le Créateur",
    lens: "Remarque ce que tu as besoin de faire exister qui n'était pas là avant.",
  },
  {
    key: "souverain",
    name: "Le Souverain",
    lens: "Observe où tu prends la responsabilité de l'ordre et du cap.",
  },
];


