// Dates du Compagnon. Le « jour » d'un point suit l'heure de Paris, comme sur le web.

/** AAAA-MM-JJ à Paris. */
export function aujourdhui(maintenant = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(maintenant);
}

/**
 * Fenêtre de la nuit qui précède ce matin, en heure locale du téléphone :
 * de la veille 18 h jusqu'à aujourd'hui 14 h (ou maintenant, si plus tôt).
 */
export function fenetreNuit(maintenant = new Date()): { debut: Date; fin: Date } {
  const debut = new Date(maintenant);
  debut.setDate(debut.getDate() - 1);
  debut.setHours(18, 0, 0, 0);
  const midi = new Date(maintenant);
  midi.setHours(14, 0, 0, 0);
  return { debut, fin: maintenant < midi ? maintenant : midi };
}

export function formatSommeil(minutes: number | null | undefined): string {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h} h ${String(m).padStart(2, "0")}`;
}
