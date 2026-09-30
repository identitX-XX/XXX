import { test } from "node:test";
import assert from "node:assert/strict";
import {
  QUESTIONS,
  champsRemplis,
  pretAGenerer,
  mockBilan,
  resumeMarkdown,
  Reponses,
} from "./xsens";

test("QUESTIONS : deux étapes, ids uniques", () => {
  const ids = QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length, "ids uniques");
  assert.ok(QUESTIONS.some((q) => q.etape === 1) && QUESTIONS.some((q) => q.etape === 2));
});

test("champsRemplis compte les champs non vides", () => {
  assert.equal(champsRemplis({}), 0);
  assert.equal(champsRemplis({ pro: "x", envie: "  " }), 1);
});

test("pretAGenerer : besoin d'un état des lieux ET d'une direction", () => {
  assert.equal(pretAGenerer({}), false);
  assert.equal(pretAGenerer({ pro: "salariée" }), false);
  assert.equal(pretAGenerer({ pro: "salariée", envie: "créer" }), true);
  assert.equal(pretAGenerer({ perso: "en couple", valeurs: "liberté" }), true);
});

test("mockBilan : 3 scénarios + plan complet, dérivés des réponses", () => {
  const r: Reponses = { pro: "marketing", envie: "ouvrir un atelier", valeurs: "liberté" };
  const b = mockBilan(r);
  assert.equal(b.scenarios.length, 3);
  for (const s of b.scenarios) {
    assert.ok(s.titre && s.description && s.horizon);
    assert.ok(s.avantages.length && s.vigilance.length && s.ressources.length);
  }
  assert.ok(b.plan.premiers.length >= 3 && b.plan.ensuite.length >= 3 && b.plan.indicateurs.length >= 3);
  assert.match(b.scenarios[0].description, /atelier/);
});

test("resumeMarkdown : contient les sections clés et les réponses", () => {
  const r: Reponses = { pro: "marketing", envie: "ouvrir un atelier", contrainte: "un crédit" };
  const md = resumeMarkdown(r, mockBilan(r));
  assert.match(md, /## Situation actuelle/);
  assert.match(md, /## Boussole intérieure/);
  assert.match(md, /## Scénarios/);
  assert.match(md, /## Mon plan/);
  assert.doesNotMatch(md, /30 jours|7 jours/); // aucune unité de temps imposée
  assert.match(md, /marketing/);
  assert.match(md, /- \[ \] /); // cases à cocher du plan
});
