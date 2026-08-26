import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PANELS_QUESTIONS,
  approfondissementPerimetre,
  PerimetreQ,
} from "./premiumContenu";

test("panels : 10 questions par périmètre, non vides et distinctes", () => {
  for (const p of Object.keys(PANELS_QUESTIONS) as PerimetreQ[]) {
    const qs = PANELS_QUESTIONS[p];
    assert.equal(qs.length, 10, `${p} : 10 questions`);
    assert.equal(new Set(qs).size, 10, `${p} : distinctes`);
    assert.ok(qs.every((q) => q.trim().length > 0), `${p} : non vides`);
  }
});

test("approfondissement : compose direction + force + ombre, 3 pistes", () => {
  const a = approfondissementPerimetre(
    "pro",
    "oser me lancer",
    "La Stratège",
    "Vision d'ensemble, anticipation.",
    "Le contrôle, une froideur perçue."
  );
  assert.match(a.titre, /pro/i);
  assert.ok(a.lecture.includes("oser me lancer"));
  assert.ok(a.lecture.includes("La Stratège"));
  assert.equal(a.pistes.length, 3);
});

test("approfondissement : robuste sans direction", () => {
  const a = approfondissementPerimetre("perso", "", "La Multiple", "Forces.", "Ombres.");
  assert.ok(a.lecture.includes("ce qui compte pour toi"));
  assert.equal(a.pistes.length, 3);
});
