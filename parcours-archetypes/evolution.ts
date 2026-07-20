// parcours-archetypes/evolution.ts
// Le moteur. Une matrice archétype × sphère (0..100) évolue jour après jour :
//   1. EMA  : les cellules touchées par la réponse du jour glissent vers le
//             signal (réactivité = ALPHA).
//   2. RESPIRATION : en fin de journée, TOUTE la matrice se détend vers sa
//             moyenne (fraction = DECAY). Un archétype non réactivé retombe :
//             c'est l'anti-figement — le radar reste vivant, jamais saturé,
//             jamais une identité verrouillée.
//
// La cohérence identitaire mesure CLARTÉ + STABILITÉ, jamais l'uniformité
// entre sphères : une même lentille peut s'exprimer autrement selon le
// contexte, et c'est sain.

import {
  ArchetypeKey,
  Diagnostic,
  EtatEvolution,
  Matrice,
  ReglagesEvolution,
  ReponseJour,
  SnapshotJour,
  SphereKey,
} from "./types";
import { ARCHETYPE_KEYS, SPHERE_KEYS } from "./archetypes";

export const REGLAGES: ReglagesEvolution = {
  ALPHA: 0.35, // réactivité de l'EMA
  DECAY: 0.06, // respiration (relâchement vers la moyenne)
};

const BASE = 18; // niveau neutre de départ d'une cellule

// --- Matrice ----------------------------------------------------------------

export function matriceVide(base = BASE): Matrice {
  const m = {} as Matrice;
  for (const a of ARCHETYPE_KEYS) {
    m[a] = {} as Record<SphereKey, number>;
    for (const s of SPHERE_KEYS) m[a][s] = base;
  }
  return m;
}

function clamp(v: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, v));
}

export function moyenneMatrice(m: Matrice): number {
  let sum = 0;
  let n = 0;
  for (const a of ARCHETYPE_KEYS)
    for (const s of SPHERE_KEYS) {
      sum += m[a][s];
      n++;
    }
  return n ? sum / n : 0;
}

// --- Initialisation depuis le diagnostic amont ------------------------------
// Reçoit le résultat de l'écran-miroir : dominant + secondaire. On amorce
// doucement leurs lignes, sans jamais les verrouiller (la respiration jouera).

export function initialiser(diag: Diagnostic): EtatEvolution {
  const matrice = matriceVide();
  for (const s of SPHERE_KEYS) {
    matrice[diag.dominant][s] = clamp(matrice[diag.dominant][s] + 34);
    matrice[diag.secondaire][s] = clamp(matrice[diag.secondaire][s] + 20);
  }
  return { matrice, historique: [], jourCourant: 1 };
}

// --- Étape 1 : EMA sur la réponse du jour -----------------------------------
// La lentille du jour est renforcée dans chaque sphère selon les curseurs ;
// la sphère de focus pèse davantage. EMA : m = (1-α)·m + α·signal.

export function appliquerReponse(
  matrice: Matrice,
  r: ReponseJour,
  reglages: ReglagesEvolution = REGLAGES
): Matrice {
  const m = cloneMatrice(matrice);
  const a = r.archetype;
  for (const s of SPHERE_KEYS) {
    const focusBoost = s === r.sphereFocus ? 1.15 : 1;
    const signal = clamp(r.curseurs[s] * focusBoost);
    m[a][s] = clamp((1 - reglages.ALPHA) * m[a][s] + reglages.ALPHA * signal);
  }
  return m;
}

// --- Étape 2 : respiration (anti-figement) ----------------------------------
// Toute la matrice se détend vers sa moyenne. Retourne la nouvelle matrice et
// la « quantité respirée » (somme des |ajustements|), utile comme indicateur.

export function respiration(
  matrice: Matrice,
  reglages: ReglagesEvolution = REGLAGES
): { matrice: Matrice; respire: number } {
  const m = cloneMatrice(matrice);
  const moy = moyenneMatrice(m);
  let respire = 0;
  for (const a of ARCHETYPE_KEYS)
    for (const s of SPHERE_KEYS) {
      const delta = reglages.DECAY * (moy - m[a][s]);
      m[a][s] = clamp(m[a][s] + delta);
      respire += Math.abs(delta);
    }
  const maxRespire = ARCHETYPE_KEYS.length * SPHERE_KEYS.length * 100 * reglages.DECAY;
  return { matrice: m, respire: maxRespire ? (respire / maxRespire) * 100 : 0 };
}

// --- Agrégations ------------------------------------------------------------

export function radarDepuisMatrice(m: Matrice): Record<ArchetypeKey, number> {
  const out = {} as Record<ArchetypeKey, number>;
  for (const a of ARCHETYPE_KEYS) {
    let sum = 0;
    for (const s of SPHERE_KEYS) sum += m[a][s];
    out[a] = sum / SPHERE_KEYS.length;
  }
  return out;
}

export function spheresDepuisMatrice(m: Matrice): Record<SphereKey, number> {
  const out = {} as Record<SphereKey, number>;
  for (const s of SPHERE_KEYS) {
    let sum = 0;
    for (const a of ARCHETYPE_KEYS) sum += m[a][s];
    out[s] = sum / ARCHETYPE_KEYS.length;
  }
  return out;
}

// --- Cohérence = clarté + stabilité (jamais uniformité) ---------------------
// clarté   : à quel point une (ou deux) lentille(s) se détache(nt) du fond.
// stabilité: à quel point le dominant reste le même d'un jour à l'autre.

export function clarte(radar: Record<ArchetypeKey, number>): number {
  const vals = ARCHETYPE_KEYS.map((a) => radar[a]).sort((x, y) => y - x);
  const top = vals[0] ?? 0;
  const reste = vals.slice(1);
  const moyReste = reste.length
    ? reste.reduce((s, v) => s + v, 0) / reste.length
    : 0;
  // écart normalisé du sommet au fond, 0..100
  return clamp(((top - moyReste) / 100) * 100 * 1.6);
}

export function dominant(radar: Record<ArchetypeKey, number>): ArchetypeKey {
  let best = ARCHETYPE_KEYS[0];
  for (const a of ARCHETYPE_KEYS) if (radar[a] > radar[best]) best = a;
  return best;
}

export function stabilite(historique: SnapshotJour[], fenetre = 5): number {
  const recents = historique.slice(-fenetre);
  if (recents.length < 2) return 50; // neutre au début
  const doms = recents.map((h) => dominant(h.radar));
  const dernier = doms[doms.length - 1];
  const constants = doms.filter((d) => d === dernier).length;
  return clamp((constants / doms.length) * 100);
}

export function coherence(
  radar: Record<ArchetypeKey, number>,
  historique: SnapshotJour[]
): number {
  return clamp(0.55 * clarte(radar) + 0.45 * stabilite(historique));
}

// --- Clôture d'une journée : orchestration ----------------------------------

export function clotureJour(
  etat: EtatEvolution,
  r: ReponseJour,
  reglages: ReglagesEvolution = REGLAGES
): EtatEvolution {
  const apresEma = appliquerReponse(etat.matrice, r, reglages);
  const { matrice, respire } = respiration(apresEma, reglages);

  const radar = radarDepuisMatrice(matrice);
  const spheres = spheresDepuisMatrice(matrice);
  const snapshot: SnapshotJour = {
    jour: r.jour,
    date: r.date,
    radar,
    spheres,
    coherence: coherence(radar, etat.historique),
    respiration: respire,
    emotions: r.emotions,
  };

  return {
    matrice,
    historique: [...etat.historique, snapshot],
    jourCourant: Math.min(31, Math.max(etat.jourCourant, r.jour + 1)),
  };
}

// --- Utilitaires ------------------------------------------------------------

export function cloneMatrice(m: Matrice): Matrice {
  const out = {} as Matrice;
  for (const a of ARCHETYPE_KEYS) {
    out[a] = {} as Record<SphereKey, number>;
    for (const s of SPHERE_KEYS) out[a][s] = m[a][s];
  }
  return out;
}
