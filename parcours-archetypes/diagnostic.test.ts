import { test } from "node:test";
import assert from "node:assert/strict";
import { calculerDiagnostic } from "./sens";
import { ARCHETYPE_KEYS } from "./archetypes";

const KEYS = new Set(ARCHETYPE_KEYS as unknown as string[]);
const answers = (vals: string[]) =>
  Object.fromEntries(vals.map((v, i) => [`q${i}`, v])) as Record<string, never>;

// Invariant clé : le diagnostic ne produit QUE des signatures valides. Sinon
// l'assainissement au chargement (store) l'invaliderait → « refaire le parcours ».
test("diagnostic : dominant et secondaire sont toujours des signatures valides", () => {
  const cas = [
    answers(Array(12).fill(ARCHETYPE_KEYS[0] as string)),
    answers(ARCHETYPE_KEYS.slice(0, 6) as unknown as string[]),
    answers([]),
  ];
  for (const rep of cas) {
    const d = calculerDiagnostic(rep);
    assert.ok(KEYS.has(d.dominant as string), `dominant invalide : ${d.dominant}`);
    assert.ok(KEYS.has(d.secondaire as string), `secondaire invalide : ${d.secondaire}`);
  }
});

test("diagnostic : dominant et secondaire sont distincts", () => {
  const d = calculerDiagnostic(answers(Array(12).fill(ARCHETYPE_KEYS[0] as string)));
  assert.notEqual(d.dominant, d.secondaire);
});

test("diagnostic : déterministe (mêmes réponses → même signature)", () => {
  const rep = answers(ARCHETYPE_KEYS.slice(0, 5) as unknown as string[]);
  const a = calculerDiagnostic(rep);
  const b = calculerDiagnostic(rep);
  assert.deepEqual({ d: a.dominant, s: a.secondaire }, { d: b.dominant, s: b.secondaire });
});

// Profil très dispersé (≥ 8 signatures distinctes) → La Multiple orchestre.
test("diagnostic : très dispersé → dominante « multiple »", () => {
  const d = calculerDiagnostic(answers(ARCHETYPE_KEYS.slice(0, 10) as unknown as string[]));
  assert.equal(d.dominant, "multiple");
  assert.ok(KEYS.has(d.secondaire as string));
  assert.notEqual(d.secondaire, "multiple");
});
