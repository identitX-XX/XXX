import { test } from "node:test";
import assert from "node:assert/strict";
import { doitRecharger } from "./version";

test("version : recharge quand la version déployée diffère de la version chargée", () => {
  assert.equal(doitRecharger("abc", "def", null), true);
});

test("version : ne recharge pas si déjà à jour", () => {
  assert.equal(doitRecharger("abc", "abc", null), false);
});

// Anti-boucle : on ne recharge pas deux fois pour la même version déployée.
test("version : anti-boucle — pas de second rechargement pour la même version", () => {
  assert.equal(doitRecharger("abc", "def", "def"), false);
});

test("version : versions inconnues → on ne touche à rien (prudence)", () => {
  assert.equal(doitRecharger(undefined, "def", null), false);
  assert.equal(doitRecharger("abc", null, null), false);
  assert.equal(doitRecharger("dev", "dev", null), false); // local
});
