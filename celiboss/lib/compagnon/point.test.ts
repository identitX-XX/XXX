import { test } from "node:test";
import assert from "node:assert/strict";
import { aujourdhui, formatSommeil, validerPoint } from "./point";

test("point valide depuis le formulaire (heures + minutes)", () => {
  const r = validerPoint({ jour: "2026-09-30", humeur: "4", energie: "3", ambition: "5", esprit: "Clair", sommeilHeures: "7", sommeilMin: "12", cardioRepos: "58" }, true);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.point.sommeilMinutes, 432);
    assert.equal(r.point.cardioRepos, 58);
    assert.equal(r.point.source, "manuel");
  }
});

test("point valide depuis l'API (minutes, source montre)", () => {
  const r = validerPoint({ jour: "2026-09-30", sommeilMinutes: 440, cardioRepos: 57, source: "montre" }, true);
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.point.source, "montre");
});

test("sommeil et cardio refusés sans consentement santé", () => {
  const r = validerPoint({ humeur: 4, cardioRepos: 60 }, false);
  assert.equal(r.ok, false);
  if (!r.ok) assert.ok(r.erreurs.sante);
});

test("sans consentement, un point sans santé passe", () => {
  assert.equal(validerPoint({ humeur: 4, energie: 3 }, false).ok, true);
});

test("valeurs hors bornes refusées", () => {
  const r = validerPoint({ humeur: 6, energie: 0, cardioRepos: 400, esprit: "Joyeux", jour: "30/09/2026" }, true);
  assert.equal(r.ok, false);
  if (!r.ok) assert.deepEqual(Object.keys(r.erreurs).sort(), ["cardio", "energie", "esprit", "humeur", "jour"]);
});

test("point vide refusé", () => {
  const r = validerPoint({}, true);
  assert.equal(r.ok, false);
  if (!r.ok) assert.ok(r.erreurs.vide);
});

test("date du jour à Paris", () => {
  // 23 h 30 UTC le 29 = 1 h 30 à Paris le 30 (heure d'été).
  assert.equal(aujourdhui(new Date("2026-09-29T23:30:00Z")), "2026-09-30");
});

test("format du sommeil", () => {
  assert.equal(formatSommeil(432), "7 h 12");
  assert.equal(formatSommeil(null), "—");
});
