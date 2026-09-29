// Chaque rubrique du Journal mène à une « porte » : c'est le pont entre le
// média (lecture gratuite) et l'offre. Une porte « bientôt » renvoie vers
// l'appel en attendant son ouverture.

export type PorteId = "rencontrer" | "journal" | "cercle" | "atelier";

export type Porte = {
  id: PorteId;
  nom: string;
  promesse: string;
  href: string;
  active: boolean;
};

export const PORTES: Record<PorteId, Porte> = {
  rencontrer: {
    id: "rencontrer",
    nom: "Rencontrer",
    promesse: "Un matchmaking sélectif, mené personnellement par Maï Diaw.",
    href: "/rencontrer",
    active: true,
  },
  journal: {
    id: "journal",
    nom: "Le Journal",
    promesse: "Lire, penser, se positionner. Chaque semaine.",
    href: "/journal",
    active: true,
  },
  cercle: {
    id: "cercle",
    nom: "Le Cercle",
    promesse: "La communauté privée, dans l'application.",
    href: "/cercle",
    active: false,
  },
  atelier: {
    id: "atelier",
    nom: "L'Atelier",
    promesse: "Posture, image, présence : le travail sur soi, en petit comité.",
    href: "/atelier",
    active: false,
  },
};

export const ORDRE_PORTES: PorteId[] = ["rencontrer", "journal", "cercle", "atelier"];

export const RUBRIQUES = {
  relationnel: { nom: "Relationnel", porte: "rencontrer" },
  mindset: { nom: "Mindset", porte: "cercle" },
  "posture-image": { nom: "Posture & Image", porte: "atelier" },
  "art-de-vivre": { nom: "Art de vivre", porte: "journal" },
} as const satisfies Record<string, { nom: string; porte: PorteId }>;

export type RubriqueId = keyof typeof RUBRIQUES;

export const RUBRIQUE_IDS = Object.keys(RUBRIQUES) as RubriqueId[];

export function isRubrique(v: unknown): v is RubriqueId {
  return typeof v === "string" && v in RUBRIQUES;
}

export function porteDe(rubrique: RubriqueId): Porte {
  return PORTES[RUBRIQUES[rubrique].porte];
}
