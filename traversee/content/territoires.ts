// traversee/content/territoires.ts
// Les huit territoires. Un seul est actif par jour ; l'écran ne montre que
// celui-là. Corps & Santé : aucune métrique, jamais.

import { Territoire } from "../types";

export const TERRITOIRES: Territoire[] = [
  { key: "corps", nom: "Corps", propos: "Ce qu'il demande, ce que tu lui dois, ce que tu arrêtes de lui imposer.", sansMetrique: true },
  { key: "energie", nom: "Énergie", propos: "Ce qui te remplit, ce qui te vide, sans que tu l'aies décidé.", sansMetrique: true },
  { key: "sante", nom: "Santé", propos: "La relation, pas les chiffres. Ce que tu écoutes, ce que tu ajournes.", sansMetrique: true },
  { key: "amour", nom: "Amour", propos: "Ce qui t'attache encore, ce qui te retient, ce que tu n'oses pas nommer." },
  { key: "liens", nom: "Liens", propos: "Les personnes que tu portes, celles qui te portent, celles qui pèsent." },
  { key: "argent", nom: "Argent", propos: "Ce qu'il protège, ce qu'il empêche, la liberté qu'il permet ou refuse." },
  { key: "oeuvre", nom: "Œuvre", propos: "Ce que tu fabriques, ce que tu transmets, ce qui te survivra ou non." },
  { key: "terres", nom: "Terres inconnues", propos: "Ce que tu n'as pas encore osé regarder, et qui t'appelle quand même." },
];

export const TERRITOIRE_KEYS = TERRITOIRES.map((t) => t.key);
export const territoireByKey: Record<string, Territoire> = Object.fromEntries(
  TERRITOIRES.map((t) => [t.key, t])
);
