/// <reference types="node" />
import assert from "node:assert/strict";
import { test } from "node:test";
import { cardioPlausible, minutesCouvertes, sommeilPlausible } from "./fusion";

const h = (heures: number) => heures * 3600 * 1000;

test("additionne des intervalles disjoints", () => {
  assert.equal(minutesCouvertes([{ debut: 0, fin: h(3) }, { debut: h(4), fin: h(7) }]), 360);
});

test("fusionne les chevauchements (montre + téléphone)", () => {
  assert.equal(minutesCouvertes([{ debut: 0, fin: h(7) }, { debut: h(1), fin: h(7.5) }, { debut: h(2), fin: h(3) }]), 450);
});

test("coupe à la fenêtre de la nuit", () => {
  assert.equal(minutesCouvertes([{ debut: -h(2), fin: h(6) }], { debut: 0, fin: h(5) }), 300);
});

test("ignore les intervalles vides ou inversés", () => {
  assert.equal(minutesCouvertes([{ debut: h(2), fin: h(1) }, { debut: h(1), fin: h(1) }]), 0);
});

test("sommeil plausible entre 1 h et 16 h", () => {
  assert.equal(sommeilPlausible(30), null);
  assert.equal(sommeilPlausible(420), 420);
  assert.equal(sommeilPlausible(17 * 60), null);
});

test("cardio plausible et arrondi", () => {
  assert.equal(cardioPlausible(58.6), 59);
  assert.equal(cardioPlausible(12), null);
  assert.equal(cardioPlausible(undefined), null);
  assert.equal(cardioPlausible(Number.NaN), null);
});
