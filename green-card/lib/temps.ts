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

/** La plus longue suite de jours consécutifs dans la liste. */
export function serieMax(jours: Iterable<string>): number {
  const ensemble = new Set(jours);
  let max = 0;
  for (const j of ensemble) {
    if (ensemble.has(veille(j))) continue; // pas un début de série
    let n = 1;
    let suivant = lendemain(j);
    while (ensemble.has(suivant)) {
      n++;
      suivant = lendemain(suivant);
    }
    max = Math.max(max, n);
  }
  return max;
}

export function lendemain(jour: string): string {
  const d = new Date(`${jour}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Le mois AAAA-MM d'un jour ou d'une date (heure de Paris). */
export function moisParis(date: Date = new Date()): string {
  return jourParis(date).slice(0, 7);
}

/** Le mois précédent un mois AAAA-MM. */
export function moisPrecedent(mois: string): string {
  const [a, m] = mois.split("-").map(Number);
  return m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, "0")}`;
}

/** Bornes UTC approximatives d'un mois de Paris (marge d'une journée de chaque côté, à filtrer ensuite par jour). */
export function bornesMois(mois: string): { debut: Date; fin: Date } {
  const [a, m] = mois.split("-").map(Number);
  return { debut: new Date(Date.UTC(a, m - 1, 1) - 86_400_000), fin: new Date(Date.UTC(a, m, 1) + 86_400_000) };
}
