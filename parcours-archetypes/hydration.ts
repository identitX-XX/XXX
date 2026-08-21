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
