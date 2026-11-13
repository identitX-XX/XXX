/** Dates « au calendrier » des locataires (heure de Paris), au format AAAA-MM-JJ. */
const FORMAT = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });

export function jourParis(date: Date = new Date()): string {
  return FORMAT.format(date);
}

/** Le jour précédent un jour AAAA-MM-JJ. */
export function veille(jour: string): string {
  const d = new Date(`${jour}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Nombre de jours consécutifs (jusqu'à aujourd'hui ou hier) présents dans la liste. */
export function serieEnCours(jours: Iterable<string>, aujourdhui: string): number {
  const ensemble = new Set(jours);
  let jour = ensemble.has(aujourdhui) ? aujourdhui : veille(aujourdhui);
  let n = 0;
  while (ensemble.has(jour)) {
    n++;
    jour = veille(jour);
  }
  return n;
}
