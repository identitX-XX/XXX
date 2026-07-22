// traversee/content/jours.ts
// Les 30 journées, typées et versionnées, SÉPARÉES du code UI.
// État actuel : échafaudage. Tout est `aEcrire: true` — J1–6 et J28–30 seront
// écrits à la main, J7–27 restent des placeholders. Chaque jour est néanmoins
// JOUABLE (prélèvement placeholder cohérent) pour tester la colonne vertébrale.
//
// Règle absolue Corps/Santé : jamais de chiffre corporel dans une question.

import { ActeKey, JourContenu, TerritoireKey } from "../types";
import { territoireByKey } from "./territoires";

export function acteDuJour(n: number): ActeKey {
  if (n <= 6) return "inventaire";
  if (n <= 13) return "tri";
  if (n <= 20) return "signes";
  if (n <= 27) return "atterrissage";
  return "passage";
}

// Rotation déterministe des 8 territoires sur 30 jours (~3-4 passages chacun).
const ROTATION: TerritoireKey[] = [
  "corps", "liens", "oeuvre", "energie", "amour", "argent", "sante", "terres",
];
const territoireDuJour = (n: number): TerritoireKey => ROTATION[(n - 1) % ROTATION.length];

// Prélèvement placeholder — un couteau générique, adapté à l'acte. Remplacé par
// le vrai contenu écrit à la main. Jamais « comment te sens-tu ? ».
function prelevementPlaceholder(n: number, t: TerritoireKey) {
  const nom = territoireByKey[t].nom.toLowerCase();
  const acte = acteDuJour(n);
  if (acte === "inventaire") {
    return {
      question: `Ce qui occupe « ${nom} » en ce moment — tu l'as choisi, ou il s'est imposé à toi ?`,
      choix: [
        { id: "choisi", label: "Je l'ai choisi", verbe: "emporter" as const },
        { id: "impose", label: "Il s'est imposé", verbe: "laisser" as const },
      ],
    };
  }
  // tri / signes / atterrissage / passage : le couteau du seuil
  return {
    question: `Cette chose que tu portes dans « ${nom} » — tu l'emportes de l'autre côté, ou tu la poses ici ?`,
    choix: [
      { id: "emporter", label: "Je l'emporte", verbe: "emporter" as const },
      { id: "laisser", label: "Je la pose ici", verbe: "laisser" as const },
    ],
  };
}

function jourPlaceholder(n: number): JourContenu {
  const territoire = territoireDuJour(n);
  return {
    jour: n,
    acte: acteDuJour(n),
    territoire,
    prelevement: prelevementPlaceholder(n, territoire),
    acteInvitation: {
      emporter: "Nomme, en un mot ou une phrase, ce que tu gardes ici.",
      laisser: "Nomme ce que tu déposes ici. Rien n'est effacé — c'est rangé.",
    },
    aEcrire: true,
  };
}

export const JOURS: JourContenu[] = Array.from({ length: 30 }, (_, i) => jourPlaceholder(i + 1));

export const jourN = (n: number): JourContenu | undefined => JOURS.find((j) => j.jour === n);

// Bornes des cinq actes (pour l'UI et les tests).
export const ACTES: { key: ActeKey; nom: string; jours: [number, number] }[] = [
  { key: "inventaire", nom: "L'inventaire", jours: [1, 6] },
  { key: "tri", nom: "Le tri", jours: [7, 13] },
  { key: "signes", nom: "Les signes", jours: [14, 20] },
  { key: "atterrissage", nom: "L'atterrissage", jours: [21, 27] },
  { key: "passage", nom: "Le passage", jours: [28, 30] },
];
