// Chaque rubrique du Journal mène à une « porte » : c'est le pont entre le
// média (lecture gratuite) et l'offre. Une porte « bientôt » mène à sa page de
// présentation, avec liste d'attente : jamais d'impasse.

export type PorteId = "rencontrer" | "compagnon" | "programmes" | "journal";

export type Porte = {
  id: PorteId;
  nom: string;
  accroche: string;
  promesse: string;
  href: string;
  active: boolean;
};

export const PORTES: Record<PorteId, Porte> = {
  rencontrer: {
    id: "rencontrer",
    nom: "Rencontrer",
    accroche: "par choix.",
    promesse: "Un matchmaking d'exception, mené personnellement par Maï Diaw.",
    href: "/rencontrer",
    active: true,
  },
  compagnon: {
    id: "compagnon",
    nom: "Le Compagnon",
    accroche: "votre élan du jour.",
    promesse: "Sommeil, cardio, humeur, énergie, ambition : l'application qui écoute votre corps.",
    href: "/compagnon",
    active: false,
  },
  programmes: {
    id: "programmes",
    nom: "Programmes",
    accroche: "avant de choisir.",
    promesse: "Glow Up, M.C MEN, coaching : devenir aligné·e avant de choisir.",
    href: "/programmes",
    active: false,
  },
  journal: {
    id: "journal",
    nom: "Le Journal",
    accroche: "chaque semaine.",
    promesse: "Lire. Ressentir. Choisir.",
    href: "/journal",
    active: true,
  },
};

export const RUBRIQUES = {
  relationnel: { nom: "Relationnel", porte: "rencontrer" },
  "intelligence-emotionnelle": { nom: "Intelligence émotionnelle", porte: "programmes" },
  mindset: { nom: "Mindset", porte: "programmes" },
  "posture-image": { nom: "Posture & image", porte: "programmes" },
  corps: { nom: "Corps", porte: "compagnon" },
  intuition: { nom: "Intuition", porte: "compagnon" },
} as const satisfies Record<string, { nom: string; porte: PorteId }>;

export type RubriqueId = keyof typeof RUBRIQUES;

export const RUBRIQUE_IDS = Object.keys(RUBRIQUES) as RubriqueId[];

export function isRubrique(v: unknown): v is RubriqueId {
  return typeof v === "string" && v in RUBRIQUES;
}

export function porteDe(rubrique: RubriqueId): Porte {
  return PORTES[RUBRIQUES[rubrique].porte];
}
