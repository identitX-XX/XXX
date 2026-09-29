import { test } from "node:test";
import assert from "node:assert/strict";
import {
  positionEtoile,
  infoConstellation,
  PALIERS,
} from "./constellationVivante";

test("positionEtoile : la première étoile (i=0) est au centre", () => {
  const p = positionEtoile(0);
  assert.equal(p.x, 120);
  assert.equal(p.y, 120);
});

test("positionEtoile : le rayon croît puis se clampe dans le cadre", () => {
  const d = (i: number) => {
    const p = positionEtoile(i);
    return Math.hypot(p.x - 120, p.y - 120);
  };
  assert.ok(d(4) > d(1), "plus loin quand i augmente");
  // Jamais hors du viewBox (rayon max 112).
  for (const i of [50, 200, 1000]) {
    assert.ok(d(i) <= 112.001, `étoile ${i} reste dans le cadre`);
  }
});

test("positionEtoile : déterministe (mêmes entrées, mêmes sorties)", () => {
  assert.deepEqual(positionEtoile(17), positionEtoile(17));
});

test("infoConstellation : ciel vierge à 0 capsule", () => {
  const c = infoConstellation(0);
  assert.equal(c.etoiles, 0);
  assert.equal(c.palier.nom, "Ciel encore vierge");
  assert.equal(c.prochain?.nom, "Première étoile");
  assert.match(c.phrase, /première capsule/i);
});

test("infoConstellation : palier + reste avant le prochain", () => {
  const c = infoConstellation(7);
  assert.equal(c.palier.nom, "Constellation naissante");
  assert.equal(c.prochain?.seuil, 14);
  assert.equal(c.resteAvant, 7);
});

test("infoConstellation : au sommet, plus de prochain palier", () => {
  const c = infoConstellation(120);
  assert.equal(c.palier, PALIERS[PALIERS.length - 1]);
  assert.equal(c.prochain, null);
  assert.equal(c.resteAvant, 0);
  assert.match(c.phrase, /immense/i);
});

test("infoConstellation : le halo croît avec l'exploration, plafonné à 1", () => {
  assert.ok(infoConstellation(10).halo > infoConstellation(2).halo);
  assert.equal(infoConstellation(200).halo, 1);
});
