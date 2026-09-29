// parcours-archetypes/auditEnergetique.ts
// « Audit de crédits énergétiques » — une lecture AUTOMATIQUE de l'énergie
// disponible sur chacun des 4 piliers (Relationnel & famille · Love · Pro ·
// Santé), dérivée de ce qu'on sait déjà de la personne : l'équilibre de ses
// sphères (matrice), ses directions posées, et son énergie du moment (climat).
// But : rendre visible où l'énergie est HAUTE (ta ressource) et BASSE (à
// recharger), et INDUIRE une direction. 100 % pur & déterministe → testable.

import type { EtatEvolution, Objectifs, PerimetreKey } from "./types";
import { equilibreSpheres } from "./indicateurs";

export interface SpheresValeurs {
  travail: number;
  relations: number;
  creation: number;
  corps: number;
  sens: number;
}

export interface CreditDirection {
  key: PerimetreKey;
  label: string;
  credit: number; // 0..100
  etat: "haute" | "stable" | "basse";
  direction: string; // la direction posée sur ce pilier (peut être vide)
}

export interface Audit {
  directions: CreditDirection[]; // ordre fixe : relationnel, love, pro, perso
  global: number; // énergie globale 0..100
  ressource: CreditDirection; // pilier le plus chargé
  aRecharger: CreditDirection; // pilier le plus bas
  phrase: string; // induit une direction
}

const LABEL: Record<PerimetreKey, string> = {
  relationnel: "Relationnel & famille",
  love: "Love",
  pro: "Pro",
  perso: "Santé",
};

const ORDRE: PerimetreKey[] = ["relationnel", "love", "pro", "perso"];

// Rattachement de chaque signature à un pilier (au plus proche) — pour que la
// signature dominante colore l'audit et donne de la nuance dès le départ.
const ARCHE_PILIER: Record<string, PerimetreKey> = {
  amante: "love",
  passeuse: "relationnel",
  mere: "relationnel",
  protectrice: "relationnel",
  mediatrice: "relationnel",
  altruiste: "relationnel",
  gardienne: "relationnel",
  creatrice: "pro",
  batisseuse: "pro",
  stratege: "pro",
  rebelle: "pro",
  visionnaire: "pro",
  souveraine: "pro",
  activiste: "pro",
  artiste: "pro",
  sage: "perso",
  libre: "perso",
  presence: "perso",
  sorciere: "perso",
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export function auditEnergetique(
  spheres: SpheresValeurs,
  objectifs: Objectifs | null,
  energieGlobale: number | null,
  diagnostic?: { dominant?: string; secondaire?: string } | null
): Audit {
  const global = clamp(Math.round(energieGlobale ?? 60), 0, 100);

  // Aucune matière encore (matrice vide) → base neutre, les directions posées
  // et la signature font la nuance. Sinon, on mappe les sphères sur les piliers.
  const total =
    spheres.travail + spheres.relations + spheres.creation + spheres.corps + spheres.sens;
  const neutre = total < 1;
  const source: Record<PerimetreKey, number> = neutre
    ? { relationnel: 52, love: 50, pro: 52, perso: 51 }
    : {
        pro: spheres.travail,
        relationnel: spheres.relations,
        love: (spheres.relations + spheres.creation) / 2,
        perso: (spheres.corps + spheres.sens) / 2,
      };

  const pilierDom = diagnostic?.dominant ? ARCHE_PILIER[diagnostic.dominant] : undefined;
  const pilierSec = diagnostic?.secondaire ? ARCHE_PILIER[diagnostic.secondaire] : undefined;

  const directions: CreditDirection[] = ORDRE.map((k) => {
    const direction = (objectifs?.[k] ?? "").trim();
    let c = 52; // base neutre plus haute : on part d'un plein « raisonnable »
    c += (source[k] - 50) * 0.7; // signal de la sphère (bien marqué → nuance)
    c += direction ? 12 : 0; // une direction posée = de l'énergie engagée
    c += (global - 60) * 0.4; // modulé par l'énergie du moment
    if (k === pilierDom) c += 8; // la signature dominante recharge son pilier
    else if (k === pilierSec) c += 4;
    const credit = clamp(Math.round(c), 12, 96);
    const etat = credit >= 66 ? "haute" : credit >= 42 ? "stable" : "basse";
    return { key: k, label: LABEL[k], credit, etat, direction };
  });

  const tri = [...directions].sort((a, b) => b.credit - a.credit);
  const ressource = tri[0];
  const aRecharger = tri[tri.length - 1];

  const phrase = aRecharger.direction
    ? `Ta réserve la plus basse : ${aRecharger.label}. Ta direction posée — « ${aRecharger.direction} » — est le bon point d'appui pour la recharger.`
    : `Ta réserve la plus basse : ${aRecharger.label}. Et si tu lui posais une direction ?`;

  return { directions, global, ressource, aRecharger, phrase };
}

// Wrapper ROBUSTE prêt à l'emploi côté composant : dérive les sphères et l'énergie
// de l'état + du climat, sans jamais planter (un vieil état d'une autre version
// pouvait faire échouer equilibreSpheres → on retombe alors sur une base neutre,
// jamais sur un écran cassé). C'est le point d'entrée à utiliser dans l'UI.
export function auditDepuisEtat(
  etat: EtatEvolution,
  objectifs: Objectifs | null,
  climat: Record<number, { energie?: number } | undefined> | null | undefined,
  diagnostic?: { dominant?: string; secondaire?: string } | null
): Audit {
  const map: SpheresValeurs = { travail: 0, relations: 0, creation: 0, corps: 0, sens: 0 };
  try {
    const mut = map as unknown as Record<string, number>;
    for (const s of equilibreSpheres(etat)) {
      if (s.key in map) mut[s.key] = s.valeur;
    }
  } catch {
    /* état hérité illisible → base neutre */
  }
  let energie: number | null = null;
  try {
    const vals = Object.values(climat || {})
      .map((c) => (c && typeof c.energie === "number" ? c.energie : null))
      .filter((n): n is number => n !== null);
    energie = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  } catch {
    /* ignore */
  }
  return auditEnergetique(map, objectifs, energie, diagnostic);
}
