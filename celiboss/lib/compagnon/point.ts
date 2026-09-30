// Validation d'un point du jour, commune au formulaire web et à l'API des
// autres appareils (appli native, montre). Une seule vérité.

import type { Echelle } from "@/lib/compagnon/elan";

export const ESPRITS = ["Clair", "Serein", "Concentré", "Inspiré", "Dispersé", "Tendu", "Fatigué"] as const;
export type Esprit = (typeof ESPRITS)[number];

export type PointSaisi = {
  jour: string; // AAAA-MM-JJ
  humeur: Echelle | null;
  energie: Echelle | null;
  ambition: Echelle | null;
  esprit: Esprit | null;
  sommeilMinutes: number | null;
  cardioRepos: number | null;
  source: "manuel" | "montre" | "mixte";
};

export type ResultatPoint = { ok: true; point: PointSaisi } | { ok: false; erreurs: Record<string, string> };

const JOUR = /^\d{4}-\d{2}-\d{2}$/;

function echelle(v: unknown): Echelle | null | "invalide" {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? (n as Echelle) : "invalide";
}

function entier(v: unknown, min: number, max: number): number | null | "invalide" {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : "invalide";
}

/** Date du jour à Paris, au format AAAA-MM-JJ. */
export function aujourdhui(maintenant = new Date()): string {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(maintenant);
}

/**
 * @param santeAutorisee sommeil et cardio ne sont acceptés qu'avec le consentement santé.
 */
export function validerPoint(brut: Record<string, unknown>, santeAutorisee: boolean): ResultatPoint {
  const erreurs: Record<string, string> = {};

  const jour = typeof brut.jour === "string" && brut.jour ? brut.jour : aujourdhui();
  if (!JOUR.test(jour) || Number.isNaN(Date.parse(jour))) erreurs.jour = "Date invalide.";

  const humeur = echelle(brut.humeur);
  const energie = echelle(brut.energie);
  const ambition = echelle(brut.ambition);
  if (humeur === "invalide") erreurs.humeur = "Choisissez une valeur de 1 à 5.";
  if (energie === "invalide") erreurs.energie = "Choisissez une valeur de 1 à 5.";
  if (ambition === "invalide") erreurs.ambition = "Choisissez une valeur de 1 à 5.";

  const esprit = brut.esprit ? (ESPRITS as readonly string[]).includes(String(brut.esprit)) ? (String(brut.esprit) as Esprit) : "invalide" : null;
  if (esprit === "invalide") erreurs.esprit = "État d'esprit inconnu.";

  // Sommeil : accepté en minutes (API) ou en heures + minutes (formulaire).
  let sommeil: number | null | "invalide" = entier(brut.sommeilMinutes, 0, 1440);
  if (sommeil === null && (brut.sommeilHeures !== undefined && brut.sommeilHeures !== "")) {
    const h = entier(brut.sommeilHeures, 0, 23);
    const m = entier(brut.sommeilMin ?? 0, 0, 59);
    sommeil = h === "invalide" || m === "invalide" ? "invalide" : (h ?? 0) * 60 + (m ?? 0);
  }
  if (sommeil === "invalide") erreurs.sommeil = "Durée de sommeil invalide.";

  const cardio = entier(brut.cardioRepos, 25, 220);
  if (cardio === "invalide") erreurs.cardio = "Rythme cardiaque entre 25 et 220 bpm.";

  const sante = (typeof sommeil === "number" && sommeil > 0) || typeof cardio === "number";
  if (sante && !santeAutorisee) {
    erreurs.sante = "Activez le consentement santé dans votre profil pour enregistrer sommeil et cardio.";
  }

  if ([humeur, energie, ambition].every((v) => v === null) && !sante && !esprit) {
    erreurs.vide = "Renseignez au moins un signal.";
  }

  const source = brut.source === "montre" || brut.source === "mixte" ? brut.source : "manuel";

  if (Object.keys(erreurs).length) return { ok: false, erreurs };
  return {
    ok: true,
    point: {
      jour,
      humeur: humeur as Echelle | null,
      energie: energie as Echelle | null,
      ambition: ambition as Echelle | null,
      esprit: esprit as Esprit | null,
      sommeilMinutes: typeof sommeil === "number" && sommeil > 0 ? sommeil : null,
      cardioRepos: cardio as number | null,
      source,
    },
  };
}

/** Ligne de la table `points` → forme applicative. */
export type LignePoint = {
  jour: string;
  humeur: number | null;
  energie: number | null;
  ambition: number | null;
  esprit: string | null;
  sommeil_minutes: number | null;
  cardio_repos: number | null;
  source: string;
};

export function versLigne(userId: string, p: PointSaisi) {
  return {
    user_id: userId,
    jour: p.jour,
    humeur: p.humeur,
    energie: p.energie,
    ambition: p.ambition,
    esprit: p.esprit,
    sommeil_minutes: p.sommeilMinutes,
    cardio_repos: p.cardioRepos,
    source: p.source,
    modifie_le: new Date().toISOString(),
  };
}

export function formatSommeil(minutes: number | null | undefined): string {
  if (!minutes) return "—";
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`;
}
