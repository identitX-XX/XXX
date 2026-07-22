import { test } from "node:test";
import assert from "node:assert/strict";
import { constellationLayout, etoilesVives } from "./constellation";
import { Etoile } from "../types";

function etoilesDepart(): Etoile[] {
  const out: Etoile[] = [];
  for (const t of ["corps", "energie", "sante", "amour", "liens", "argent", "oeuvre", "terres"] as const)
    for (let i = 0; i < 3; i++) out.push({ id: `${t}-${i}`, territoire: t, etat: "diffuse" });
  return out;
}

test("constellation : 24 étoiles disposées dans le viewBox", () => {
  const pts = constellationLayout(etoilesDepart());
  assert.equal(pts.length, 24);
  for (const p of pts) {
    assert.ok(p.x >= 0 && p.x <= 100, "x dans le cadre");
    assert.ok(p.y >= 0 && p.y <= 100, "y dans le cadre");
  }
});

test("constellation : déterministe — mêmes étoiles, mêmes positions", () => {
  const a = constellationLayout(etoilesDepart());
  const b = constellationLayout(etoilesDepart());
  assert.deepEqual(a, b);
});

test("constellation : l'éteinte s'efface, l'intense s'affirme", () => {
  const e = etoilesDepart();
  e[0].etat = "eteinte";
  e[1].etat = "intense";
  const pts = constellationLayout(e);
  const eteinte = pts.find((p) => p.id === e[0].id)!;
  const intense = pts.find((p) => p.id === e[1].id)!;
  const diffuse = pts.find((p) => p.etat === "diffuse")!;
  assert.ok(eteinte.opacity < diffuse.opacity, "l'éteinte est la plus faible");
  assert.ok(intense.opacity >= diffuse.opacity, "l'intense est la plus forte");
  assert.ok(intense.r > eteinte.r, "l'intense est plus large que l'éteinte");
});

test("constellation : se simplifie — moins d'étoiles vives quand on éteint", () => {
  const e = etoilesDepart();
  assert.equal(etoilesVives(e), 24);
  e[0].etat = "eteinte";
  e[3].etat = "eteinte";
  assert.equal(etoilesVives(e), 22);
});
