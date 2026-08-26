// Le fil des PACTES — la continuité de la Quête d'un jour à l'autre. Un pacte
// pris aujourd'hui revient te chercher le lendemain (« tenu ? »), et tes
// réponses nourrissent une jauge de constance (une série qui se renforce).
// Logique pure et testée : aucune dépendance UI ni IA.

export type TenuPacte = "oui" | "partiel" | "non";

export interface PacteJour {
  jour: number; // le jour de quête où l'engagement a été pris
  texte: string; // le geste sur lequel on s'est engagé
  archKey: string; // la signature du moment
  dateEngagement: string; // ISO
  tenu?: TenuPacte; // réponse au check-in du lendemain (absente = pas encore répondu)
}

// Le pacte à vérifier MAINTENANT : le plus récent pris un jour PASSÉ et pas
// encore évalué. On ne demande jamais le jour même (jour < jourCourant).
export function pacteAVerifier(
  pactes: Record<number, PacteJour>,
  jourCourant: number
): PacteJour | null {
  let best: PacteJour | null = null;
  for (const p of Object.values(pactes || {})) {
    if (!p || typeof p.jour !== "number" || !p.texte) continue;
    if (p.jour < jourCourant && p.tenu === undefined) {
      if (!best || p.jour > best.jour) best = p;
    }
  }
  return best;
}

// Jauge de constance : série d'engagements tenus (oui/partiel) d'affilée, en
// partant du plus récent — un « non » casse la série. `tenus` = total des « oui ».
export function constancePactes(
  pactes: Record<number, PacteJour>
): { serie: number; tenus: number } {
  const repondus = Object.values(pactes || {})
    .filter((p): p is PacteJour => Boolean(p) && p.tenu !== undefined)
    .sort((a, b) => b.jour - a.jour);
  let serie = 0;
  for (const p of repondus) {
    if (p.tenu === "oui" || p.tenu === "partiel") serie++;
    else break;
  }
  const tenus = repondus.filter((p) => p.tenu === "oui").length;
  return { serie, tenus };
}
