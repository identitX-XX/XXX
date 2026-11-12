/**
 * Numéro d'UG (unité de gestion) : la codification CDC Habitat d'un logement.
 * Le format exact est à confirmer avec CDC Habitat : on accepte ici lettres, chiffres
 * et tirets, et on normalise la saisie (majuscules, espaces et séparateurs unifiés).
 */
export function normaliserUG(saisie: string): string {
  return saisie
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[\s_./]+/g, "-")
    .replace(/[^A-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ugValide(ug: string): boolean {
  return /^[A-Z0-9][A-Z0-9-]{2,23}$/.test(ug);
}
