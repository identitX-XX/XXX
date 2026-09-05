import { test } from "node:test";
import assert from "node:assert/strict";
import { QUIZ, bilanQuiz } from "./quizAuto";

test("quizAuto : 4 piliers, 4 énoncés chacun", () => {
  assert.equal(QUIZ.length, 4);
  assert.deepEqual(QUIZ.map((q) => q.key), ["relationnel", "love", "pro", "perso"]);
  for (const q of QUIZ) assert.equal(q.enonces.length, 4);
});

test("bilanQuiz : trois niveaux selon le score /12", () => {
  assert.equal(bilanQuiz(12, 12).niveau, "solide");
  assert.equal(bilanQuiz(9, 12).niveau, "solide");
  assert.equal(bilanQuiz(6, 12).niveau, "mixte");
  assert.equal(bilanQuiz(2, 12).niveau, "fragile");
  assert.equal(bilanQuiz(0, 12).niveau, "fragile");
});

test("bilanQuiz : toujours un titre, un texte et une action", () => {
  for (const s of [0, 3, 6, 9, 12]) {
    const b = bilanQuiz(s, 12);
    assert.ok(b.titre && b.texte && b.action);
  }
});
