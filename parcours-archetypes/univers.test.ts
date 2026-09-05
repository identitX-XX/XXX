import { test } from "node:test";
import assert from "node:assert/strict";
import { UNIVERS, lectureUnivers } from "./univers";

test("univers : 4 entrées (nature, urbain, futuriste, retro), pas de manga", () => {
  assert.deepEqual(
    UNIVERS.map((u) => u.key),
    ["nature", "urbain", "futuriste", "retro"]
  );
});

test("lectureUnivers : interpole le nom de la signature partout", () => {
  for (const u of UNIVERS) {
    const l = lectureUnivers("Rebelle", u.key);
    assert.ok(l.titre.includes("Rebelle"), `titre ${u.key}`);
    assert.ok(l.texte.includes("Rebelle"), `texte ${u.key}`);
    assert.ok(l.question.length > 0, `question ${u.key}`);
  }
});

test("lectureUnivers : robuste sur nom vide", () => {
  const l = lectureUnivers("", "nature");
  assert.ok(l.titre.includes("ta signature"));
});
