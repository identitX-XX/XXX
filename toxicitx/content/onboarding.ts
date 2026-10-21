import type { Genre } from "@/types";

// Options du contexte d'onboarding — non identifiantes, éditables librement.

export const GENRES: { value: Genre; label: string }[] = [
  { value: "F", label: "Femme" },
  { value: "H", label: "Homme" },
  { value: "NSP", label: "Ne souhaite pas le dire" },
];

export const SECTEURS: string[] = [
  "Industrie / Production",
  "Tech / Numérique",
  "Santé / Social",
  "Commerce / Distribution",
  "Banque / Assurance / Finance",
  "Conseil / Services aux entreprises",
  "Éducation / Recherche",
  "Secteur public / Administration",
  "Bâtiment / Construction",
  "Média / Culture / Communication",
  "Autre",
];

export const TAILLES: string[] = [
  "Moins de 10",
  "10 à 49",
  "50 à 249",
  "250 à 999",
  "1000 et plus",
];

export const NIVEAUX_POSTE: string[] = [
  "Opérationnel / Exécution",
  "Intermédiaire / Expert",
  "Manager de proximité",
  "Direction / Cadre dirigeant",
  "Support (RH, finance, IT…)",
];

export const ANCIENNETES: string[] = [
  "Moins d'un an",
  "1 à 3 ans",
  "3 à 7 ans",
  "7 à 15 ans",
  "Plus de 15 ans",
];
