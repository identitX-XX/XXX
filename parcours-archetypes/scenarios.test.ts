import { test } from "node:test";
import assert from "node:assert/strict";
import { genererScenarios, labelPerimetre } from "./scenarios";
import { matriceVide } from "./evolution";
import type { EtatEvolution } from "./types";

const etat = (): EtatEvolution =>
  ({ matrice: matriceVide(), historique: [], jourCourant: 1 } as EtatEvolution);

test("genererScenarios : un scénario par pilier, Love inclus", () => {
  const s = genererScenarios(etat(), "rebelle", "sage");
  assert.equal(s.length, 4);
  assert.deepEqual(
    [...s.map((x) => x.perimetre)].sort(),
    ["love", "perso", "pro", "relationnel"]
  );
  const love = s.find((x) => x.perimetre === "love");
  assert.ok(love && love.titre && love.texte, "un scénario love complet");
});

test("labelPerimetre : le pilier love a un libellé", () => {
  assert.equal(labelPerimetre("love"), "Love");
});
