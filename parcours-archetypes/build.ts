// parcours-archetypes/build.ts
// (Optionnel) Régénère parcours.json à partir des modules réels — DRY, une
// seule source de vérité pour le contenu.
//
//   Depuis parcours-archetypes/ :  npx tsx build.ts
//
// La génération utilise le diagnostic par défaut (explorateur/sage) : le J1
// s'ouvre sur le dominant, le J30 sur La Métamorphe. À l'exécution réelle,
// l'app régénère le parcours via generateParcours(diagnosticRéel).

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { DIAGNOSTIC_DEFAUT, generateParcours } from "./generateParcours";

const parcours = generateParcours(DIAGNOSTIC_DEFAUT);
const out = join(__dirname, "parcours.json");
writeFileSync(out, JSON.stringify(parcours, null, 2) + "\n", "utf8");

console.log(
  `parcours.json généré — ${parcours.jours.length} jours, ` +
    `${parcours.jours[0].sections.length} sections/jour.`
);
console.log(
  "Rotation :",
  parcours.jours.map((j) => `${j.n}:${j.archetype}`).join("  ")
);
