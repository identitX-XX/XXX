// Détection de version (anti-cache périmé). La page connaît la version avec
// laquelle elle a été CHARGÉE (bakée au build) ; /api/version renvoie la version
// ACTUELLEMENT déployée (lue au runtime). Si elles diffèrent, on recharge — mais
// UNE seule fois par version, pour ne jamais boucler.

export const VERSION_CHARGEE =
  process.env.NEXT_PUBLIC_APP_VERSION || "dev";

// Décision PURE, testée. `dejaFait` = la version pour laquelle on a déjà
// rechargé cette session (sessionStorage). On ne recharge que si :
//  - les deux versions sont connues,
//  - elles diffèrent,
//  - on n'a pas déjà rechargé pour cette version (anti-boucle).
export function doitRecharger(
  chargee: string | undefined | null,
  actuelle: string | undefined | null,
  dejaFait: string | null
): boolean {
  if (!chargee || !actuelle) return false;
  if (chargee === actuelle) return false;
  if (dejaFait === actuelle) return false;
  return true;
}
