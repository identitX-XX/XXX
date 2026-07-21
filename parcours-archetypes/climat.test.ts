import { test } from "node:test";
import assert from "node:assert/strict";
import { climatIndex, climatLabel, infererClimat } from "./climat";
import { ClimatJour } from "./types";

const c = (sommeil: number, energie: number, vagues: number, jour = 1): ClimatJour => ({
  jour,
  date: new Date().toISOString(),
  sommeil,
  energie,
  vagues,
});

test("climatIndex : bornes 0 et 100", () => {
  assert.equal(climatIndex(c(100, 100, 0)), 0); // ressources max, aucune vague
  assert.equal(climatIndex(c(0, 0, 100)), 100); // épuisement + vagues max
});

test("climatIndex : pondération (35/35/30)", () => {
  // (100-50)*.35 + (100-50)*.35 + 50*.3 = 17.5 + 17.5 + 15 = 50
  assert.equal(climatIndex(c(50, 50, 50)), 50);
});

test("climatLabel : seuils apaisé / changeant / sous tension", () => {
  assert.equal(climatLabel(0), "apaisé");
  assert.equal(climatLabel(33), "apaisé");
  assert.equal(climatLabel(34), "changeant");
  assert.equal(climatLabel(59), "changeant");
  assert.equal(climatLabel(60), "sous tension");
  assert.equal(climatLabel(100), "sous tension");
});

test("infererClimat : null sans donnée", () => {
  assert.equal(infererClimat({}), null);
});

test("infererClimat : moyenne des N derniers, échantillon & confiance", () => {
  const climat: Record<number, ClimatJour> = {
    1: c(80, 80, 10, 1), // index ~ (20*.35+20*.35+10*.3)=17
    2: c(80, 80, 10, 2),
  };
  const inf = infererClimat(climat, 5);
  assert.ok(inf);
  assert.equal(inf!.echantillon, 2);
  assert.equal(inf!.confiance, 2 / 5);
  assert.equal(inf!.index, 17);
  assert.equal(inf!.label, "apaisé");
});

test("infererClimat : ne garde que les N derniers jours", () => {
  const climat: Record<number, ClimatJour> = {};
  for (let j = 1; j <= 8; j++) climat[j] = c(50, 50, 50, j);
  const inf = infererClimat(climat, 5);
  assert.equal(inf!.echantillon, 5); // 8 relevés, fenêtre 5
});
