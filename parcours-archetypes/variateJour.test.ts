import { test } from "node:test";
import assert from "node:assert/strict";
import { gesteDuJour, questionDuJour } from "./variateJour";
import type { Archetype } from "./types";

const arch = {
  key: "multiple",
  name: "La Multiple",
  lens: "…",
  hue: 300,
  essence: "…",
  force: "…",
  ombre: "…",
  question: "Question native ?",
  defi: "Geste natif.",
} as unknown as Archetype;

test("variateJour : jours consécutifs → phrases différentes (geste + question)", () => {
  const g = [1, 2, 3, 4, 5].map((j) => gesteDuJour(arch, j));
  const q = [1, 2, 3, 4, 5].map((j) => questionDuJour(arch, j));
  assert.equal(new Set(g).size, 5, "5 gestes distincts sur 5 jours");
  assert.equal(new Set(q).size, 5, "5 questions distinctes sur 5 jours");
});

test("variateJour : déterministe (un jour donné rend toujours la même phrase)", () => {
  assert.equal(gesteDuJour(arch, 3), gesteDuJour(arch, 3));
  assert.equal(questionDuJour(arch, 7), questionDuJour(arch, 7));
});

test("variateJour : le jour 1 ouvre sur le contenu natif de la signature", () => {
  assert.equal(gesteDuJour(arch, 1), "Geste natif.");
  assert.equal(questionDuJour(arch, 1), "Question native ?");
});

test("variateJour : chaque phrase mentionne la signature ou son contenu natif", () => {
  for (let j = 1; j <= 5; j++) {
    const g = gesteDuJour(arch, j);
    const q = questionDuJour(arch, j);
    assert.ok(g.includes("La Multiple") || g === "Geste natif.", `geste jour ${j}`);
    assert.ok(q.includes("La Multiple") || q === "Question native ?", `question jour ${j}`);
  }
});
