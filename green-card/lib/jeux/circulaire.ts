/**
 * Jeu 8 — Seconde Vie : règles pures.
 * Achats d'occasion, réparations, dons, reventes, et un mur de dons / trocs / prêts entre voisins.
 */

import { nettoyerLigne, nettoyerTexte, problemeContenu } from "./moderation";

export type TypeAction = "occasion" | "reparation" | "don" | "revente" | "echange";

export const TYPES_ACTION: { id: Exclude<TypeAction, "echange">; nom: string; emoji: string; aide: string }[] = [
  { id: "occasion", nom: "Achat d'occasion", emoji: "🛍️", aide: "Ressourcerie, vide-grenier, site d'annonces, friperie…" },
  { id: "reparation", nom: "Réparation", emoji: "🔧", aide: "Repair café, cordonnier, couture, réparateur…" },
  { id: "don", nom: "Don", emoji: "🎁", aide: "À une association, une recyclerie, un proche…" },
  { id: "revente", nom: "Revente", emoji: "🔁", aide: "Vous avez vendu un objet au lieu de le jeter." },
];

export type Categorie = "vetements" | "meubles" | "electromenager" | "electronique" | "enfants" | "culture" | "maison" | "autre";

/** kg CO₂e évités en moyenne quand on évite d'acheter neuf (valeurs indicatives, à faire valider). */
export const CATEGORIES: { id: Categorie; nom: string; emoji: string; co2: number }[] = [
  { id: "vetements", nom: "Vêtements", emoji: "👕", co2: 10 },
  { id: "meubles", nom: "Meubles", emoji: "🪑", co2: 50 },
  { id: "electromenager", nom: "Électroménager", emoji: "🧺", co2: 100 },
  { id: "electronique", nom: "Électronique", emoji: "📱", co2: 40 },
  { id: "enfants", nom: "Jouets et puériculture", emoji: "🧸", co2: 8 },
  { id: "culture", nom: "Livres, jeux, culture", emoji: "📚", co2: 2 },
  { id: "maison", nom: "Vaisselle, déco, bricolage", emoji: "🏠", co2: 5 },
  { id: "autre", nom: "Autre", emoji: "📦", co2: 5 },
];

export type TypeAnnonce = "don" | "troc" | "pret";

export const TYPES_ANNONCE: { id: TypeAnnonce; nom: string; libelle: string; emoji: string; verbe: string }[] = [
  { id: "don", nom: "Je donne", libelle: "Don", emoji: "🎁", verbe: "Donné" },
  { id: "troc", nom: "J'échange", libelle: "Échange", emoji: "🔄", verbe: "Échangé" },
  { id: "pret", nom: "Je prête", libelle: "Prêt", emoji: "🤝", verbe: "Prêté" },
];

export const ACTIONS_MAX_PAR_JOUR = 3;
export const ANNONCES_MAX_OUVERTES = 5;
export const ACTIONS_ARGENT = 5;

export const estTypeAction = (v: unknown): v is Exclude<TypeAction, "echange"> => TYPES_ACTION.some((t) => t.id === v);
export const estCategorie = (v: unknown): v is Categorie => CATEGORIES.some((c) => c.id === v);
export const estTypeAnnonce = (v: unknown): v is TypeAnnonce => TYPES_ANNONCE.some((t) => t.id === v);
export const categorie = (id: string) => CATEGORIES.find((c) => c.id === id);

/**
 * CO₂ évité par une action. Acheter d'occasion, réparer ou échanger évite un achat neuf (100 %) ;
 * donner ou revendre permet à quelqu'un d'autre de l'éviter, on compte la moitié pour ne pas compter deux fois.
 */
export function co2Action(type: TypeAction, cat: Categorie): number {
  const base = CATEGORIES.find((c) => c.id === cat)!.co2;
  return type === "don" || type === "revente" ? base / 2 : base;
}

/** Lit un prix saisi en euros (« 12,50 », « 12 € »). Vide = null ; invalide = NaN. */
export function lirePrix(saisie: string): number | null {
  const s = saisie.replace(/[\s€]/g, "").replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 && n <= 10_000 ? Math.round(n * 100) / 100 : NaN;
}

/** Économie réalisée sur un achat d'occasion par rapport au neuf. */
export function economie(prixPaye: number | null, prixNeuf: number | null): number {
  if (prixPaye === null || prixNeuf === null) return 0;
  return Math.max(0, prixNeuf - prixPaye);
}

export function verifierAnnonce(titreBrut: string, descriptionBrute: string): { titre: string; description: string; erreur?: string } {
  const titre = nettoyerLigne(titreBrut);
  const description = nettoyerTexte(descriptionBrute);
  if (titre.length < 3 || titre.length > 60) return { titre, description, erreur: "Le titre doit faire entre 3 et 60 caractères." };
  if (description.length > 300) return { titre, description, erreur: "La description fait 300 caractères maximum." };
  const erreur = problemeContenu(`${titre} ${description}`);
  return erreur ? { titre, description, erreur } : { titre, description };
}

/**
 * Médailles de Seconde Vie :
 * Bronze : une première action ; Argent : 5 actions ;
 * Or : un objet donné, échangé ou prêté entre voisins via le mur, confirmé par les deux (donneur et receveur).
 */
export function niveauSecondeVie(p: { actions: number; echangesVoisins: number }): number {
  if (p.echangesVoisins >= 1) return 3;
  if (p.actions >= ACTIONS_ARGENT) return 2;
  if (p.actions >= 1) return 1;
  return 0;
}
