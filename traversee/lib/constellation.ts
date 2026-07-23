// traversee/lib/constellation.ts
// La constellation — la seule « progression » visible avec la netteté. Elle ne
// se remplit pas : elle se SIMPLIFIE. LAISSER éteint une étoile, EMPORTER en
// intensifie une. Au fil des jours, il reste moins de points, mais plus francs.
//
// Cette couche est purement géométrique et déterministe (mêmes étoiles → même
// disposition). Le composant SVG ne fait que dessiner ce qu'elle renvoie.

import { Etoile, EtoileEtat, TerritoireKey } from "../types";
import { TERRITOIRE_KEYS } from "../content/territoires";

export interface EtoilePosee {
  id: string;
  territoire: TerritoireKey;
  etat: EtoileEtat;
  x: number; // 0..100 (viewBox)
  y: number; // 0..100
  r: number; // rayon
  opacity: number; // 0..1
}

// Hash déterministe (chaîne → 0..1), pour un léger désordre stable.
function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

// Rendu d'une étoile selon son état :
//   diffuse  → présente mais discrète ;
//   intense  → un point franc, plus large ;
//   eteinte  → presque disparue (jamais tout à fait : rien n'est effacé).
function rendu(etat: EtoileEtat): { r: number; opacity: number } {
  if (etat === "intense") return { r: 2.4, opacity: 1 };
  if (etat === "eteinte") return { r: 0.7, opacity: 0.07 };
  return { r: 1.3, opacity: 0.4 }; // diffuse
}

// Dispose les 8 territoires en couronne, 3 étoiles chacun, autour du centre où
// se resserre le portrait. Déterministe.
export function constellationLayout(etoiles: Etoile[]): EtoilePosee[] {
  const cx = 50;
  const cy = 50;
  const n = TERRITOIRE_KEYS.length; // 8
  const indexTerr = new Map(TERRITOIRE_KEYS.map((t, i) => [t, i]));

  return etoiles.map((e) => {
    const ti = indexTerr.get(e.territoire) ?? 0;
    // angle du territoire (couronne) + micro-décalage par étoile
    const base = (ti / n) * Math.PI * 2 - Math.PI / 2;
    const jitterA = (hash01(e.id) - 0.5) * 0.5; // ± ~0.25 rad
    const angle = base + jitterA;
    // rayon : 3 anneaux légers pour ne pas superposer les 3 étoiles d'un
    // territoire ; assez large pour cercler le portrait sans couvrir le visage.
    const ring = Number(e.id.split("-").pop()) || 0; // 0,1,2
    const rad = 33 + ring * 6 + (hash01(e.id + "r") - 0.5) * 4;
    const { r, opacity } = rendu(e.etat);
    return {
      id: e.id,
      territoire: e.territoire,
      etat: e.etat,
      x: Math.round((cx + Math.cos(angle) * rad) * 100) / 100,
      y: Math.round((cy + Math.sin(angle) * rad) * 100) / 100,
      r,
      opacity,
    };
  });
}

// Combien de points restent « vifs » (diffuse ou intense) — sert au texte sobre
// éventuel et aux tests : la constellation se simplifie quand ce nombre baisse.
export function etoilesVives(etoiles: Etoile[]): number {
  return etoiles.filter((e) => e.etat !== "eteinte").length;
}
