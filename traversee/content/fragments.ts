// traversee/content/fragments.ts
// Corpus de fragments — la matière première de la voix et de la dérivation.
// Ce ne sont PAS des étiquettes (« tu es la Créatrice »). Ce sont des éclats,
// décontextualisés, distillés de l'ancienne écriture des archétypes. La voix du
// MOI DU FUTUR et la couche de dérivation y puisent ; jamais pour te définir.

import { Fragment } from "../types";

export const FRAGMENTS: Fragment[] = [
  { id: "f-perfection", texte: "Ce que tu attends de rendre irréprochable avant de lui accorder le droit d'exister.", themes: ["controle", "regard-des-autres"], territoireHint: "oeuvre", source: "createur" },
  { id: "f-refuge", texte: "L'imaginaire devenu une demeure plus confortable que le présent.", themes: ["evitement"], territoireHint: "terres", source: "reveur" },
  { id: "f-comprendre", texte: "Le savoir gardé comme une protection contre l'inconnu, plutôt qu'une manière de l'habiter.", themes: ["controle", "evitement"], territoireHint: "terres", source: "sage" },
  { id: "f-opposition", texte: "Ce à quoi tu restes lié précisément parce que tu continues à t'y opposer.", themes: ["liberte"], territoireHint: "liens", source: "rebelle" },
  { id: "f-porter", texte: "Ce que tu portes sans le dire, et qui n'appartient plus à ta responsabilité.", themes: ["care", "regard-des-autres"], territoireHint: "liens", source: "protecteur" },
  { id: "f-reparer", texte: "Réparer les autres pour différer la rencontre avec tes propres blessures.", themes: ["care", "evitement"], territoireHint: "sante", source: "guerisseur" },
  { id: "f-fusion", texte: "L'autre à qui tu confies la mission impossible de te rendre à toi-même.", themes: ["regard-des-autres", "attachement"], territoireHint: "amour", source: "amoureux" },
  { id: "f-forteresse", texte: "Les habitudes devenues des forteresses, et chaque changement vécu comme une menace.", themes: ["controle"], territoireHint: "argent", source: "batisseur" },
  { id: "f-valeur", texte: "Ta valeur mesurée à ce que tu produis ou à ce que tu maintiens debout.", themes: ["controle", "regard-des-autres"], territoireHint: "oeuvre", source: "batisseur" },
  { id: "f-fuite", texte: "Le mouvement qui protège de l'immobilité — et de certaines confrontations.", themes: ["evitement", "liberte"], territoireHint: "terres", source: "explorateur" },
  { id: "f-legerete", texte: "La légèreté comme refuge contre le risque d'être réellement touchée.", themes: ["evitement", "attachement"], territoireHint: "amour", source: "joueur" },
  { id: "f-indispensable", texte: "Te croire indispensable, et mesurer ce que tu donnes à la reconnaissance reçue.", themes: ["regard-des-autres", "care"], territoireHint: "liens", source: "passeur" },
  { id: "f-image", texte: "Une image de toi que le réel pourrait contredire, et que tu protèges encore.", themes: ["regard-des-autres", "controle"], territoireHint: "oeuvre", source: "createur" },
  { id: "f-quitter", texte: "Quitter avant d'avoir habité, recommencer avant d'avoir approfondi.", themes: ["evitement", "liberte"], territoireHint: "terres", source: "metamorphe" },
  { id: "f-ancienne", texte: "Une ancienne définition de toi, honorée, puis doucement laissée derrière.", themes: ["renoncement"], territoireHint: "terres", source: "metamorphe" },
];

export const fragmentById: Record<string, Fragment> = Object.fromEntries(
  FRAGMENTS.map((f) => [f.id, f])
);

// Fragments partageant un thème donné.
export function fragmentsParTheme(theme: string): Fragment[] {
  return FRAGMENTS.filter((f) => f.themes.includes(theme));
}
