// parcours-archetypes/constellationSignature.ts
// « Constellation identitaire » — composition GÉNÉRATIVE, unique par personne,
// dérivée de sa signature (dominante + secondaire + tally des réponses). Pas un
// radar : une empreinte. Déterministe (même diagnostic → même composition), donc
// testable et reproductible (export). Le calcul est pur ; le rendu/motion est
// dans components/SignatureConstellation.tsx.

import type { Diagnostic } from "./types";

export type KindNode = "primary" | "secondary" | "dimension" | "ambient";

export interface NodeC {
  id: number;
  x: number; // 0..400 (viewBox)
  y: number;
  r: number;
  kind: KindNode;
  key?: string; // clé d'archétype pour les dimensions
}

export interface LinkC {
  a: number; // id
  b: number;
}

export interface Composition {
  seed: number;
  nodes: NodeC[];
  links: LinkC[];
}

// Hash déterministe d'une chaîne → entier 32 bits.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// PRNG déterministe (mulberry32).
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CENTER = 200;
const dist = (ax: number, ay: number, bx: number, by: number) =>
  Math.hypot(ax - bx, ay - by);

// Construit la composition à partir du diagnostic. Bornée au viewBox 400×400.
export function compositionSignature(diag: Diagnostic): Composition {
  const tally = (diag.tally ?? {}) as Record<string, number>;
  const graine = hash(
    `${diag.dominant}|${diag.secondaire}|` +
      Object.entries(tally)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join(",")
  );
  const rnd = mulberry32(graine);
  const nodes: NodeC[] = [];

  // 1) Noyau primaire — focal, légèrement décentré (jamais pile au centre, plus
  //    vivant). C'est le SIGNAL (rendu en rouge côté composant).
  const pa = rnd() * Math.PI * 2;
  const pr = 26 + rnd() * 22;
  const primary: NodeC = {
    id: 0,
    x: CENTER + Math.cos(pa) * pr,
    y: CENTER + Math.sin(pa) * pr,
    r: 9,
    kind: "primary",
    key: diag.dominant,
  };
  nodes.push(primary);

  // 2) Noyau secondaire — à bonne distance du primaire.
  const sa = pa + Math.PI * (0.6 + rnd() * 0.8);
  const sr = 78 + rnd() * 34;
  const secondary: NodeC = {
    id: 1,
    x: CENTER + Math.cos(sa) * sr,
    y: CENTER + Math.sin(sa) * sr,
    r: 6.5,
    kind: "secondary",
    key: diag.secondaire,
  };
  nodes.push(secondary);

  // 3) Dimensions — une par archétype marqué dans le tally. Position sur une
  //    orbite semée ; le poids (compte) rapproche du centre et grossit le point.
  const dims = Object.entries(tally)
    .filter(([k]) => k !== diag.dominant && k !== diag.secondaire && (tally[k] ?? 0) > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxW = Math.max(1, ...dims.map(([, w]) => w));
  dims.forEach(([key, w], i) => {
    const ang = (i / Math.max(1, dims.length)) * Math.PI * 2 + rnd() * 0.9;
    const pull = w / maxW; // 0..1
    const radius = 150 - pull * 55 + (rnd() - 0.5) * 36;
    nodes.push({
      id: nodes.length,
      x: CENTER + Math.cos(ang) * radius,
      y: CENTER + Math.sin(ang) * radius,
      r: 2.6 + pull * 2.6,
      kind: "dimension",
      key,
    });
  });

  // 4) Poussière ambiante — quelques points fins pour la densité/composition.
  const ambCount = 6 + Math.floor(rnd() * 5);
  for (let i = 0; i < ambCount; i++) {
    const ang = rnd() * Math.PI * 2;
    const radius = 60 + rnd() * 120;
    nodes.push({
      id: nodes.length,
      x: CENTER + Math.cos(ang) * radius,
      y: CENTER + Math.sin(ang) * radius,
      r: 1 + rnd() * 1.3,
      kind: "ambient",
    });
  }

  // Clamp dans le cadre (marge 18).
  for (const n of nodes) {
    n.x = Math.max(18, Math.min(382, n.x));
    n.y = Math.max(18, Math.min(382, n.y));
  }

  // Liens : primaire↔secondaire, primaire→chaque dimension, puis chaque dimension
  // à son plus proche voisin (dimension ou noyau) → une vraie trame, pas une étoile.
  const links: LinkC[] = [{ a: 0, b: 1 }];
  const dimNodes = nodes.filter((n) => n.kind === "dimension");
  for (const d of dimNodes) {
    links.push({ a: 0, b: d.id });
    // plus proche voisin parmi {secondaire + autres dimensions}
    let best = -1;
    let bestD = Infinity;
    for (const o of nodes) {
      if (o.id === d.id || o.id === 0 || o.kind === "ambient") continue;
      const dd = dist(d.x, d.y, o.x, o.y);
      if (dd < bestD) {
        bestD = dd;
        best = o.id;
      }
    }
    if (best >= 0 && best !== 0) links.push({ a: d.id, b: best });
  }

  // Dédoublonnage des liens (a<b).
  const seen = new Set<string>();
  const uniq = links.filter((l) => {
    const k = l.a < l.b ? `${l.a}-${l.b}` : `${l.b}-${l.a}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return { seed: graine, nodes, links: uniq };
}
