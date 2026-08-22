import { test } from "node:test";
import assert from "node:assert/strict";
import {
  estObjet,
  snapshotValide,
  diagnosticValide,
  jourCourantReconcilie,
} from "./hydration";

// LE BUG « BLOQUÉE SUR JOUR 1 » : une journée déjà répondue mais un compteur
// resté à 1 → repondreJour (idempotent) refuse d'avancer → coincée à vie.
test("jourCourantReconcilie : débloque un jour courant en retard sur les réponses", () => {
  assert.equal(jourCourantReconcilie(1, [1], 1), 2); // le cas exact du blocage
  assert.equal(jourCourantReconcilie(2, [1, 2, 3], 3), 4); // en retard sur 3 réponses
});

test("jourCourantReconcilie : ne fait pas avancer à tort (aucune journée faite)", () => {
  assert.equal(jourCourantReconcilie(1, [], 0), 1); // rien fait → reste jour 1
});

test("jourCourantReconcilie : un état sain est laissé intact", () => {
  assert.equal(jourCourantReconcilie(5, [1, 2, 3, 4], 4), 5);
});

test("jourCourantReconcilie : borné à 31 (30 jours + 1)", () => {
  assert.equal(jourCourantReconcilie(1, [30], 30), 31);
  assert.equal(jourCourantReconcilie(99, [30], 30), 31);
});

test("estObjet : objets oui, primitives/null non", () => {
  assert.equal(estObjet({}), true);
  assert.equal(estObjet({ a: 1 }), true);
  assert.equal(estObjet(null), false);
  assert.equal(estObjet(undefined), false);
  assert.equal(estObjet("x"), false);
  assert.equal(estObjet(3), false);
});

test("snapshotValide : garde un snapshot exploitable, écarte les vieilles formes", () => {
  assert.equal(snapshotValide({ radar: { a: 1 }, jour: 3 }), true);
  assert.equal(snapshotValide({ radar: {}, jour: 0 }), true);
  assert.equal(snapshotValide({ jour: 3 }), false); // pas de radar
  assert.equal(snapshotValide({ radar: {} }), false); // pas de jour
  assert.equal(snapshotValide({ radar: 5, jour: 3 }), false); // radar pas un objet
  assert.equal(snapshotValide(null), false);
  assert.equal(snapshotValide("vieux format"), false);
});

const KEYS = new Set(["sage", "multiple", "presence"]);

test("diagnosticValide : accepte des signatures connues", () => {
  assert.equal(diagnosticValide({ dominant: "multiple", secondaire: "sage" }, KEYS), true);
});

// LE VERROU ANTI « REFAIRE LE PARCOURS » : un diagnostic aux clés inconnues
// (vieux localStorage) est rejeté proprement, jamais gardé pour crasher le rendu.
test("diagnosticValide : rejette les signatures inconnues / incomplètes / bruit", () => {
  assert.equal(diagnosticValide({ dominant: "banane", secondaire: "sage" }, KEYS), false);
  assert.equal(diagnosticValide({ dominant: "sage" }, KEYS), false); // pas de secondaire
  assert.equal(diagnosticValide({}, KEYS), false);
  assert.equal(diagnosticValide(null, KEYS), false);
  assert.equal(diagnosticValide("x", KEYS), false);
  assert.equal(diagnosticValide({ dominant: 1, secondaire: 2 }, KEYS), false);
});
