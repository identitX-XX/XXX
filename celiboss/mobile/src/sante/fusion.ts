// Calculs purs sur les données de la montre, communs à iOS et Android.

export type Intervalle = { debut: number; fin: number }; // millisecondes epoch

/**
 * Durée totale (minutes) couverte par des intervalles qui peuvent se chevaucher.
 * Une Apple Watch et un iPhone, ou deux applis, enregistrent souvent la même nuit :
 * on fusionne au lieu d'additionner.
 */
export function minutesCouvertes(intervalles: Intervalle[], borne?: Intervalle): number {
  const coupes = intervalles
    .map((i) => (borne ? { debut: Math.max(i.debut, borne.debut), fin: Math.min(i.fin, borne.fin) } : i))
    .filter((i) => i.fin > i.debut)
    .sort((a, b) => a.debut - b.debut);
  let total = 0;
  let courant: Intervalle | null = null;
  for (const i of coupes) {
    if (courant && i.debut <= courant.fin) courant.fin = Math.max(courant.fin, i.fin);
    else {
      if (courant) total += courant.fin - courant.debut;
      courant = { ...i };
    }
  }
  if (courant) total += courant.fin - courant.debut;
  return Math.round(total / 60000);
}

/** Durée de sommeil plausible, sinon null (capteur mal porté, sieste isolée…). */
export function sommeilPlausible(minutes: number): number | null {
  return minutes >= 60 && minutes <= 16 * 60 ? minutes : null;
}

/** Fréquence au repos plausible (mêmes bornes que l'API), arrondie. */
export function cardioPlausible(bpm: number | null | undefined): number | null {
  if (bpm == null || !Number.isFinite(bpm)) return null;
  const r = Math.round(bpm);
  return r >= 25 && r <= 220 ? r : null;
}

export type Nuit = { sommeilMinutes: number | null; cardioRepos: number | null };
