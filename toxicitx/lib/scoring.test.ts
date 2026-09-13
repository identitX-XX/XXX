import { test } from "node:test";
import assert from "node:assert/strict";
import { QUESTIONS, PROFILES } from "@/content";
import {
  computeAxisScore,
  computeGlobalScore,
  findDominantProfiles,
  graveTriggered,
  score,
  scoreToLevel,
} from "./scoring";
import type { Answers, Axis, ScaleValue } from "@/types";

// Répond `value` à toutes les questions d'un axe (ou de tous les axes).
function answerAll(value: ScaleValue, axis?: Axis): Answers {
  const a: Answers = {};
  for (const q of QUESTIONS) {
    if (!axis || q.axis === axis) a[q.id] = value;
  }
  return a;
}

test("30 questions, 10 par axe", () => {
  assert.equal(QUESTIONS.length, 30);
  for (const axis of ["ascendante", "descendante", "laterale"] as Axis[]) {
    assert.equal(QUESTIONS.filter((q) => q.axis === axis).length, 10);
  }
});

test("ids de questions uniques", () => {
  const ids = new Set(QUESTIONS.map((q) => q.id));
  assert.equal(ids.size, QUESTIONS.length);
});

test("scoreToLevel : bornes des 6 niveaux", () => {
  assert.equal(scoreToLevel(0), 1);
  assert.equal(scoreToLevel(16), 1);
  assert.equal(scoreToLevel(17), 2);
  assert.equal(scoreToLevel(33), 2);
  assert.equal(scoreToLevel(34), 3);
  assert.equal(scoreToLevel(50), 3);
  assert.equal(scoreToLevel(51), 4);
  assert.equal(scoreToLevel(66), 4);
  assert.equal(scoreToLevel(67), 5);
  assert.equal(scoreToLevel(83), 5);
  assert.equal(scoreToLevel(84), 6);
  assert.equal(scoreToLevel(100), 6);
});

test("computeAxisScore : 'Toujours' partout = axe quasi maximal", () => {
  // a9 est reverse : "Toujours" y est sain, donc le score n'atteint pas tout à fait 100.
  const s = computeAxisScore("ascendante", answerAll(4, "ascendante"), QUESTIONS);
  assert.ok(s >= 85 && s < 100, `attendu 85–100, reçu ${s}`);
});

test("computeAxisScore : 'Jamais' partout = axe quasi minimal", () => {
  // a9 reverse : "Jamais" y est toxique, donc le score n'est pas tout à fait 0.
  const s = computeAxisScore("ascendante", answerAll(0, "ascendante"), QUESTIONS);
  assert.ok(s > 0 && s <= 15, `attendu 0–15, reçu ${s}`);
});

test("question reverse : une réponse 'Jamais' compte comme toxique", () => {
  const only: Answers = { a9: 0 }; // a9 = "les bonnes idées remontent" (reverse)
  const s = computeAxisScore("ascendante", only, QUESTIONS);
  assert.equal(s, 100); // 0 inversé -> 4/4 -> 100
});

test("computeGlobalScore : moyenne pondérée des axes", () => {
  const axes = [
    { axis: "ascendante" as Axis, score: 30, level: 2 },
    { axis: "descendante" as Axis, score: 60, level: 4 },
    { axis: "laterale" as Axis, score: 90, level: 6 },
  ];
  assert.equal(computeGlobalScore(axes), 60);
});

test("profils : organisation saine -> L'Oasis (baseline)", () => {
  const res = score(answerAll(0), QUESTIONS, PROFILES);
  assert.equal(res.level, 1);
  assert.equal(res.profiles[0].id, "oasis");
});

test("profils : tout au rouge -> Le Volcan en tête, max 3 profils", () => {
  const res = score(answerAll(4), QUESTIONS, PROFILES);
  assert.equal(res.profiles[0].id, "volcan");
  assert.ok(res.profiles.length <= 3);
});

test("profils : seule l'ascendante élevée -> La Forteresse", () => {
  const answers: Answers = { ...answerAll(0), ...answerAll(4, "ascendante") };
  const res = score(answers, QUESTIONS, PROFILES);
  const ids = res.profiles.map((p) => p.id);
  assert.ok(ids.includes("forteresse"), `profils reçus : ${ids.join(", ")}`);
  assert.ok(!ids.includes("oasis"));
});

test("findDominantProfiles : baseline exclue si un profil spécifique matche", () => {
  const axes = [
    { axis: "descendante" as Axis, score: 90, level: 6 },
    { axis: "ascendante" as Axis, score: 10, level: 1 },
    { axis: "laterale" as Axis, score: 10, level: 1 },
  ];
  const res = findDominantProfiles(axes, PROFILES);
  assert.equal(res[0].id, "petit-chef");
  assert.ok(!res.some((p) => p.id === "oasis"));
});

test("filet de sécurité : un item grave à Souvent/Toujours déclenche les ressources", () => {
  const graveQ = QUESTIONS.find((q) => q.grave);
  assert.ok(graveQ, "au moins un item grave doit exister");
  assert.equal(graveTriggered({}, QUESTIONS), false);
  assert.equal(graveTriggered({ [graveQ!.id]: 2 }, QUESTIONS), false);
  assert.equal(graveTriggered({ [graveQ!.id]: 3 }, QUESTIONS), true);
});

test("chaque profil (hors baseline) a des remèdes individuels et collectifs", async () => {
  const { remediesForProfile } = await import("@/content");
  for (const p of PROFILES) {
    const rs = remediesForProfile(p.id);
    assert.ok(rs.length >= 4, `${p.id} devrait avoir >= 4 remèdes`);
    assert.ok(rs.some((r) => r.type === "individuel"), `${p.id} sans remède individuel`);
    assert.ok(rs.some((r) => r.type === "collectif"), `${p.id} sans remède collectif`);
  }
});
