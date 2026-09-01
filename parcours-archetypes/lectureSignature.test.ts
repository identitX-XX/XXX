import { test } from "node:test";
import assert from "node:assert/strict";
import { lectureApprofondie } from "./lectureSignature";
import { estDebloque } from "@/lib/entitlements";

test("lectureApprofondie : compose principale + secondaire + émergente", () => {
  const l = lectureApprofondie("multiple", "sage", "rebelle");
  assert.ok(l);
  assert.equal(l!.principale.name, "La Multiple");
  assert.equal(l!.secondaire?.name, "La Sage");
  assert.equal(l!.emergente?.name, "La Rebelle");
  assert.ok(l!.synthese.includes("La Multiple"));
});

test("lectureApprofondie : émergente ignorée si = principale ou secondaire", () => {
  const l = lectureApprofondie("multiple", "sage", "multiple");
  assert.equal(l!.emergente, null);
  const l2 = lectureApprofondie("multiple", "sage", "sage");
  assert.equal(l2!.emergente, null);
});

test("lectureApprofondie : clé principale inconnue → null (jamais de crash)", () => {
  assert.equal(lectureApprofondie("inconnue" as never, "sage", null), null);
});

test("lectureApprofondie : robuste sans secondaire ni émergente", () => {
  const l = lectureApprofondie("stratege", null, null);
  assert.equal(l!.secondaire, null);
  assert.equal(l!.emergente, null);
});

test("entitlements : estDebloque", () => {
  assert.equal(estDebloque({ signature: true }, "signature"), true);
  assert.equal(estDebloque({ signature: true }, "perimetre:perso"), false);
  assert.equal(estDebloque(null, "signature"), false);
  assert.equal(estDebloque({}, "signature"), false);
});
