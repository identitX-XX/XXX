import { test } from "node:test";
import assert from "node:assert/strict";
import { exercicesVolet } from "./voletsExercices";

test("exercicesVolet : 3 exercices par volet", () => {
  for (const v of ["capsule", "explore", "construis"] as const) {
    assert.equal(exercicesVolet(v, "Rebelle", 1).length, 3);
  }
});

test("exercicesVolet : change chaque jour (jours consécutifs distincts)", () => {
  for (const v of ["capsule", "explore", "construis"] as const) {
    for (let j = 1; j <= 9; j++) {
      const a = exercicesVolet(v, "Rebelle", j);
      const b = exercicesVolet(v, "Rebelle", j + 1);
      assert.notDeepEqual(a, b, `${v} jour ${j} vs ${j + 1}`);
    }
  }
});

test("exercicesVolet : interpole la signature (capsule/explore) et la direction", () => {
  assert.ok(exercicesVolet("capsule", "Sage", 1).every((x) => x.includes("Sage")));
  assert.ok(exercicesVolet("explore", "Sage", 1).every((x) => x.includes("Sage")));
  assert.ok(exercicesVolet("construis", "oser aimer", 1).some((x) => x.includes("oser aimer")));
});

test("exercicesVolet : robuste sur sujet vide", () => {
  assert.equal(exercicesVolet("capsule", "", 1).length, 3);
  assert.ok(exercicesVolet("construis", "", 1)[0].length > 0);
});
