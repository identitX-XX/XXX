// Auto-réparation des « chunks » JS périmés après un déploiement.
//
// iOS Safari garde en cache d'anciens morceaux de code. Après un nouveau
// déploiement, une navigation côté client peut demander un chunk dont le nom a
// changé → l'app jette une erreur de chargement de module (« ChunkLoadError »,
// « Failed to fetch dynamically imported module »…). On recharge alors pour
// récupérer le manifeste à jour.
//
// Le piège à éviter : la boucle infinie (recharger → même erreur → recharger…).
// On borne donc les tentatives RAPPROCHÉES (MAX dans une fenêtre courte), tout
// en laissant une nouvelle péremption — bien plus tard — se réparer à son tour.

const KEY = "idx-chunk-reload";
const FENETRE_MS = 20000; // au-delà, on considère une nouvelle péremption (compteur remis à zéro)
const MAX = 3; // tentatives max à l'intérieur de la fenêtre

type ErrLike = { name?: string; message?: string; digest?: string };

export function estErreurChunk(error?: ErrLike): boolean {
  const msg = `${error?.name || ""} ${error?.message || ""} ${error?.digest || ""}`;
  return /chunk|dynamically imported|importing a module|Failed to fetch|Load failed|Loading CSS chunk/i.test(
    msg
  );
}

// Tente une reprise automatique sur erreur de chunk. Renvoie true si un
// rechargement est lancé (l'écran d'erreur n'a alors pas besoin de s'afficher).
export function tenterReprise(error?: ErrLike): boolean {
  if (!estErreurChunk(error)) return false;
  let n = 0;
  let t = 0;
  try {
    const r = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    n = Number(r.n) || 0;
    t = Number(r.t) || 0;
  } catch {}
  const now = Date.now();
  if (now - t > FENETRE_MS) n = 0; // hors fenêtre → nouvelle péremption, on repart à zéro
  if (n >= MAX) return false; // trop de tentatives rapprochées → on montre l'écran de reprise
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ n: n + 1, t: now }));
  } catch {}
  window.location.reload();
  return true;
}

export function oublierReprises(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
