import { test } from "node:test";
import assert from "node:assert/strict";
import {
  matriceVide,
  initialiser,
  clotureJour,
  respiration,
  dominant,
  coherence,
  radarDepuisMatrice,
} from "./evolution";
import { ARCHETYPE_KEYS, SPHERE_KEYS } from "./archetypes";
import { ReponseJour } from "./types";

const rep = (jour: number, over: Partial<ReponseJour> = {}): ReponseJour => ({
  jour,
  date: new Date().toISOString(),
  archetype: "createur",
  sphereFocus: "creation",
  curseurs: { travail: 50, relations: 50, creation: 70, corps: 40, sens: 50 },
  emotions: ["joie"],
  intensiteDefi: 40,
  note: "",
  ...over,
});

test("matriceVide : 12×5 cellules au niveau de base", () => {
  const m = matriceVide();
  let n = 0;
  for (const a of ARCHETYPE_KEYS) for (const s of SPHERE_KEYS) { assert.equal(m[a][s], 18); n++; }
  assert.equal(n, 60);
});

test("initialiser : amorce dominant (+34) et secondaire (+20), jour 1", () => {
  const etat = initialiser({ dominant: "createur", secondaire: "sage" });
  for (const s of SPHERE_KEYS) {
    assert.equal(etat.matrice.createur[s], 52);
    assert.equal(etat.matrice.sage[s], 38);
  }
  assert.equal(etat.jourCourant, 1);
  assert.deepEqual(etat.historique, []);
});

test("clotureJour : historique grandit, jourCourant avance, cohérence bornée", () => {
  const etat0 = initialiser({ dominant: "createur", secondaire: "sage" });
  const etat1 = clotureJour(etat0, rep(1));
  assert.equal(etat1.historique.length, 1);
  assert.equal(etat1.jourCourant, 2);
  const snap = etat1.historique[0];
  assert.ok(snap.coherence >= 0 && snap.coherence <= 100);
  assert.deepEqual(snap.emotions, ["joie"]);
});

test("clotureJour : jourCourant plafonné à 31", () => {
  const etat0 = initialiser({ dominant: "createur", secondaire: "sage" });
  const etat = clotureJour(etat0, rep(30));
  assert.equal(etat.jourCourant, 31);
});

test("clotureJour : idempotence de la cohérence sur mêmes entrées (pur)", () => {
  const etat0 = initialiser({ dominant: "createur", secondaire: "sage" });
  const a = clotureJour(etat0, rep(1));
  const b = clotureJour(etat0, rep(1));
  assert.equal(a.historique[0].coherence, b.historique[0].coherence);
});

test("respiration : une cellule saturée est ramenée vers la moyenne", () => {
  const m = matriceVide();
  m.createur.creation = 100;
  const { matrice } = respiration(m);
  assert.ok(matrice.createur.creation < 100);
  assert.ok(matrice.createur.creation > 18); // pas d'effondrement instantané
});

test("dominant : renvoie l'archétype au radar le plus haut", () => {
  const radar = Object.fromEntries(ARCHETYPE_KEYS.map((a) => [a, 20])) as Record<string, number>;
  radar.rebelle = 80;
  assert.equal(dominant(radar as never), "rebelle");
});

test("coherence : toujours dans [0,100]", () => {
  const etat = clotureJour(initialiser({ dominant: "createur", secondaire: "sage" }), rep(1));
  const c = coherence(radarDepuisMatrice(etat.matrice), etat.historique);
  assert.ok(c >= 0 && c <= 100);
});
