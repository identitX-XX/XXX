import { test } from "node:test";
import assert from "node:assert/strict";
import { calculerElan, lectureElan, referenceCardio, scoreCardio, scoreEchelle, scoreSommeil } from "./elan";

test("échelle 1–5 → 0–100", () => {
  assert.equal(scoreEchelle(1), 0);
  assert.equal(scoreEchelle(3), 50);
  assert.equal(scoreEchelle(5), 100);
});

test("sommeil : plein score de 7 h à 9 h, 0 à 4 h et à 12 h", () => {
  assert.equal(scoreSommeil(7 * 60), 100);
  assert.equal(scoreSommeil(9 * 60), 100);
  assert.equal(scoreSommeil(4 * 60), 0);
  assert.equal(scoreSommeil(12 * 60), 0);
  assert.equal(Math.round(scoreSommeil(5.5 * 60)), 50);
});

test("cardio sans référence : zone 50–70 bpm", () => {
  assert.equal(scoreCardio(58), 100);
  assert.equal(scoreCardio(40), 0);
  assert.equal(scoreCardio(100), 0);
  assert.equal(scoreCardio(85), 50);
});

test("cardio avec référence personnelle : l'écart à SA normale", () => {
  assert.equal(scoreCardio(55, 58), 100);
  assert.equal(scoreCardio(63, 58), 50);
  assert.equal(scoreCardio(70, 58), 0);
});

test("élan : aucun signal → null", () => {
  const e = calculerElan({});
  assert.equal(e.valeur, null);
  assert.equal(e.completude, 0);
});

test("élan : les poids sont renormalisés sur les signaux présents", () => {
  // Seulement humeur 5 et énergie 1 : (0.25×100 + 0.2×0) / 0.45 = 55.6 → 56
  const e = calculerElan({ humeur: 5, energie: 1 });
  assert.equal(e.valeur, 56);
  assert.equal(e.completude, 0.45);
});

test("élan : tous les signaux au maximum → 100", () => {
  const e = calculerElan({ humeur: 5, energie: 5, ambition: 5, sommeilMinutes: 480, cardioRepos: 58 });
  assert.equal(e.valeur, 100);
  assert.equal(e.completude, 1);
});

test("élan : sommeil ou cardio à 0 sont ignorés (mesure absente)", () => {
  const e = calculerElan({ humeur: 3, sommeilMinutes: 0, cardioRepos: 0 });
  assert.deepEqual(Object.keys(e.detail), ["humeur"]);
});

test("référence cardio : au moins 5 mesures", () => {
  assert.equal(referenceCardio([58, 60, null, 62]), null);
  assert.equal(referenceCardio([58, 60, 62, 59, 61]), 60);
});

test("lecture : une phrase pour chaque niveau", () => {
  assert.match(lectureElan(calculerElan({})), /point du matin/);
  assert.match(lectureElan(calculerElan({ humeur: 5, energie: 5, ambition: 5 })), /prêt pour une rencontre/);
  assert.match(lectureElan(calculerElan({ humeur: 5, energie: 4, ambition: 1 })), /ambition/);
  assert.match(lectureElan(calculerElan({ humeur: 1, energie: 1 })), /recharge/);
});
