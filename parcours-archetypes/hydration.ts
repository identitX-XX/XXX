// Prédicats PURS d'assainissement de l'état persisté au chargement, isolés ici
// pour être testés. Ce sont eux qui garantissent qu'un vieux localStorage
// (signatures disparues, snapshots d'une autre forme) ne fasse JAMAIS planter le
// rendu : on répare ou on écarte, jamais on ne casse.

export const estObjet = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === "object";

// Un snapshot d'historique exploitable : la segmentation et les indicateurs
// lisent `radar` (objet) et `jour` (nombre). Sinon on écarte l'entrée.
export const snapshotValide = (h: unknown): boolean =>
  estObjet(h) &&
  estObjet((h as Record<string, unknown>).radar) &&
  typeof (h as Record<string, unknown>).jour === "number";

// Auto-réparation du jour courant : il ne peut JAMAIS être en retard sur les
// journées déjà répondues ou vécues. Sinon une journée « déjà répondue » bloque
// l'avancée (repondreJour est idempotent) → parcours coincé au jour 1. On prend
// donc le max entre le compteur, (dernière journée répondue + 1) et
// (nombre de journées vécues + 1). Borné à 31 (parcours de 30 jours + 1).
export function jourCourantReconcilie(
  jc: number,
  joursReponses: number[],
  historiqueLen: number
): number {
  const base = jc >= 1 ? jc : 1;
  const parReponses = joursReponses.length ? Math.max(...joursReponses) + 1 : 1;
  const parHistorique = historiqueLen + 1;
  return Math.min(31, Math.max(base, parReponses, parHistorique));
}

// Un diagnostic exploitable : dominant ET secondaire sont des signatures
// connues. Sinon on repart proprement au diagnostic (mieux qu'un écran mort).
export const diagnosticValide = (d: unknown, keys: Set<string>): boolean => {
  if (!estObjet(d)) return false;
  const dom = d.dominant;
  const sec = d.secondaire;
  return (
    typeof dom === "string" &&
    typeof sec === "string" &&
    keys.has(dom) &&
    keys.has(sec)
  );
};
