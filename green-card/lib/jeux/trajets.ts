/**
 * Jeu 5 — Mes Trajets Verts : règles pures.
 * Le locataire déclare ses trajets à pied, à vélo, en transports en commun ou partagés ;
 * on calcule le CO₂ évité par rapport au même trajet seul en voiture.
 */

export type Mode = "marche" | "velo" | "trottinette" | "transports" | "train" | "covoiturage";

export interface InfoMode {
  id: Mode;
  nom: string;
  emoji: string;
  /** kg CO₂e par km et par personne (valeurs moyennes indicatives, à faire valider). */
  co2ParKm: number;
  /** Distance maximale vraisemblable pour un trajet (anti-triche). */
  kmMax: number;
}

export const MODES: InfoMode[] = [
  { id: "marche", nom: "À pied", emoji: "🚶", co2ParKm: 0, kmMax: 30 },
  { id: "velo", nom: "Vélo", emoji: "🚲", co2ParKm: 0, kmMax: 120 },
  { id: "trottinette", nom: "Trottinette", emoji: "🛴", co2ParKm: 0.02, kmMax: 40 },
  { id: "transports", nom: "Bus, tram, métro", emoji: "🚌", co2ParKm: 0.06, kmMax: 150 },
  { id: "train", nom: "Train", emoji: "🚆", co2ParKm: 0.02, kmMax: 1000 },
  { id: "covoiturage", nom: "Covoiturage", emoji: "🚗", co2ParKm: 0.11, kmMax: 1000 },
];

export const MOTIFS = [
  { id: "travail", nom: "Travail", emoji: "💼" },
  { id: "ecole", nom: "École", emoji: "🎒" },
  { id: "courses", nom: "Courses", emoji: "🛒" },
  { id: "loisirs", nom: "Loisirs", emoji: "🎉" },
  { id: "sante", nom: "Santé", emoji: "🩺" },
  { id: "autre", nom: "Autre", emoji: "📍" },
] as const;

/** Voiture thermique seule : kg CO₂e/km et coût de carburant €/km (indicatifs). */
export const VOITURE_CO2_PAR_KM = 0.22;
export const VOITURE_EURO_PAR_KM = 0.15;

export const TRAJETS_MAX_PAR_JOUR = 8;
export const JOURS_ARGENT = 5;
export const JOURS_OR = 15;

const PAR_ID = new Map(MODES.map((m) => [m.id, m]));
export const infoMode = (id: string) => PAR_ID.get(id as Mode);
export const estMode = (v: unknown): v is Mode => typeof v === "string" && PAR_ID.has(v as Mode);
export const estMotif = (v: unknown) => MOTIFS.some((m) => m.id === v);

/** Vérifie un trajet. Renvoie un message d'erreur ou null. */
export function verifierTrajet(mode: Mode, km: number, trajetsCeJour: number): string | null {
  if (!Number.isFinite(km) || km <= 0) return "Indiquez la distance en kilomètres (par exemple 2,5).";
  if (km < 0.2) return "Un trajet compte à partir de 200 mètres.";
  const info = PAR_ID.get(mode)!;
  if (km > info.kmMax) return `${info.nom} : ${info.kmMax} km maximum par trajet. Vérifiez la distance.`;
  if (trajetsCeJour >= TRAJETS_MAX_PAR_JOUR) return `${TRAJETS_MAX_PAR_JOUR} trajets maximum par jour. Bravo pour cette journée bien remplie !`;
  return null;
}

/** CO₂ évité (kg) par rapport au même trajet seul en voiture. */
export function co2Evite(mode: Mode, km: number): number {
  return Math.max(0, (VOITURE_CO2_PAR_KM - PAR_ID.get(mode)!.co2ParKm) * km);
}

/** Carburant économisé (€) par rapport à la voiture (le covoiturage divise les frais par deux). */
export function euroEconomise(mode: Mode, km: number): number {
  return (mode === "covoiturage" ? VOITURE_EURO_PAR_KM / 2 : VOITURE_EURO_PAR_KM) * km;
}

/**
 * Médailles de Mes Trajets Verts : la régularité compte plus que la distance.
 * Bronze : un premier trajet ; Argent : des trajets sur 5 jours différents ; Or : sur 15 jours différents.
 */
export function niveauTrajets(joursActifs: number): number {
  if (joursActifs >= JOURS_OR) return 3;
  if (joursActifs >= JOURS_ARGENT) return 2;
  if (joursActifs >= 1) return 1;
  return 0;
}
