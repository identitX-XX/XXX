// Le délestage du jour — un exercice DIFFÉRENT chaque jour (30 jours), au lieu
// des 5 mêmes poids répétés. Personnalisé : on tisse les poids propres à la
// signature, des poids identitaires génériques, ET ce que l'utilisatrice a posé
// comme directions. Déterministe (fiable, sans IA), testé.

// Poids identitaires génériques — ils parlent à toutes les signatures et
// élargissent le vivier pour varier chaque jour.
// 11 poids (nombre premier avec 5 → le balayage par blocs de 5 parcourt tout le
// vivier sans jamais faire se chevaucher deux jours consécutifs).
const POIDS_GENERIQUES = [
  "le regard des autres sur tes choix",
  "la peur de mal faire",
  "un vieux rôle qui ne te va plus",
  "l'urgence que tu t'imposes",
  "la comparaison avec les autres",
  "un « oui » que tu as dit de trop",
  "la culpabilité de te reposer",
  "le besoin de tout contrôler",
  "une attente déçue que tu rumines",
  "l'idée qu'il faut mériter ta place",
  "la pression d'avoir déjà tout compris",
];

// Consignes qui tournent chaque jour — l'angle du délestage change.
const CONSIGNES = [
  "Aujourd'hui, allège-toi : touche chaque poids que tu es prête à déposer.",
  "Ce que tu portes n'est pas toujours à toi. Relâche ce qui pèse, un à un.",
  "Un poids à la fois. Touche ceux que tu choisis de ne plus porter aujourd'hui.",
  "Fais de la place : dépose ce qui t'encombre en ce moment.",
  "Rien ne t'oblige à tout tenir. Touche ce que tu laisses derrière toi aujourd'hui.",
  "Ce que tu relâches ne te définit plus. Choisis, et dépose.",
  "Aujourd'hui, tu tries : garde l'essentiel, relâche le reste.",
  "Un geste de délestage : nomme puis lâche ce qui te tire vers le bas.",
];

// Sélectionne `k` poids : un BLOC de k consécutifs (mod n) qui glisse de k
// chaque jour. Garanties (pour n ≥ 2k) : k items distincts dans la journée, et
// deux jours consécutifs sans aucun poids en commun (blocs adjacents disjoints).
function selection(pool: string[], jour: number, k = 5): string[] {
  const n = pool.length;
  if (!n) return [];
  const taille = Math.min(k, n);
  const start = ((jour - 1) * taille % n + n) % n;
  const out: string[] = [];
  for (let i = 0; i < taille; i++) out.push(pool[(start + i) % n]);
  return out;
}

export interface DelestageJour {
  items: string[]; // les poids à relâcher aujourd'hui (distincts jour après jour)
  consigne: string; // l'angle du jour
}

export function delestageDuJour(
  poids: string[],
  directions: string[],
  jour: number
): DelestageJour {
  const dirPoids = (directions || [])
    .filter((d) => d && d.trim())
    .map((d) => `ce qui te retient sur « ${d.trim()} »`);
  // Vivier : poids de la signature (prioritaires) + tirés des directions + génériques.
  const pool = [...poids.filter((p) => p && p.trim()), ...dirPoids, ...POIDS_GENERIQUES];
  const items = selection(pool, jour, 5);
  const consigne = CONSIGNES[((jour - 1) % CONSIGNES.length + CONSIGNES.length) % CONSIGNES.length];
  return { items, consigne };
}
