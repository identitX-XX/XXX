// Chaque rubrique du Journal mène à une « porte » : c'est le pont entre le
// média (lecture gratuite) et l'offre. Une porte « bientôt » renvoie vers
// l'appel en attendant son ouverture.

export type PorteId = "rencontrer" | "journal" | "programmes" | "evenements";

export type Porte = {
  id: PorteId;
  nom: string;
  promesse: string;
  detail?: string;
  href: string;
  active: boolean;
};

export const PORTES: Record<PorteId, Porte> = {
  rencontrer: {
    id: "rencontrer",
    nom: "Rencontrer",
    promesse: "Un matchmaking d'exception, mené personnellement par Maï Diaw.",
    detail: "Pro · Relationnel · Sentimental",
    href: "/rencontrer",
    active: true,
  },
  journal: {
    id: "journal",
    nom: "Le Journal",
    promesse: "Identité, confiance, standards, intelligence émotionnelle.",
    detail: "Chaque semaine",
    href: "/journal",
    active: true,
  },
  programmes: {
    id: "programmes",
    nom: "Programmes",
    promesse: "Mindset, posture, image : le travail sur soi, accompagné.",
    detail: "Glow Up · M.C MEN · Coaching",
    href: "/programmes",
    active: false,
  },
  evenements: {
    id: "evenements",
    nom: "Événements",
    promesse: "Des rencontres choisies, en petit comité. Certaines changent une trajectoire.",
    detail: "Sur invitation",
    href: "/evenements",
    active: false,
  },
};

export const ORDRE_PORTES: PorteId[] = ["rencontrer", "journal", "programmes", "evenements"];

export const RUBRIQUES = {
  relationnel: { nom: "Relationnel", porte: "rencontrer" },
  "intelligence-emotionnelle": { nom: "Intelligence émotionnelle", porte: "programmes" },
  mindset: { nom: "Mindset", porte: "programmes" },
  "posture-image": { nom: "Posture & Image", porte: "programmes" },
} as const satisfies Record<string, { nom: string; porte: PorteId }>;

export type RubriqueId = keyof typeof RUBRIQUES;

export const RUBRIQUE_IDS = Object.keys(RUBRIQUES) as RubriqueId[];

export function isRubrique(v: unknown): v is RubriqueId {
  return typeof v === "string" && v in RUBRIQUES;
}

export function porteDe(rubrique: RubriqueId): Porte {
  return PORTES[RUBRIQUES[rubrique].porte];
}
