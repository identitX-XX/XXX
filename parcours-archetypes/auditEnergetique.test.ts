import { test } from "node:test";
import assert from "node:assert/strict";
import { auditEnergetique, auditDepuisEtat, SpheresValeurs } from "./auditEnergetique";
import { matriceVide } from "./evolution";
import type { ClimatJour, EtatEvolution, Objectifs } from "./types";

const vide: SpheresValeurs = { travail: 0, relations: 0, creation: 0, corps: 0, sens: 0 };
const obj = (o: Partial<Objectifs>): Objectifs =>
  ({ relationnel: "", love: "", pro: "", perso: "", ...o } as Objectifs);

test("audit : toujours 4 directions dans l'ordre fixe", () => {
  const a = auditEnergetique(vide, null, null);
  assert.deepEqual(a.directions.map((d) => d.key), ["relationnel", "love", "pro", "perso"]);
});

test("audit : jamais vide même sans données (base neutre, crédits > 0)", () => {
  const a = auditEnergetique(vide, null, null);
  for (const d of a.directions) assert.ok(d.credit >= 8 && d.credit <= 96);
  assert.ok(a.ressource && a.aRecharger);
});

test("audit : une direction posée augmente le crédit du pilier", () => {
  const sansDir = auditEnergetique(vide, obj({}), null).directions.find((d) => d.key === "love")!;
  const avecDir = auditEnergetique(vide, obj({ love: "Oser dire" }), null).directions.find((d) => d.key === "love")!;
  assert.ok(avecDir.credit > sansDir.credit);
});

test("audit : une sphère forte tire son pilier vers le haut", () => {
  const fortPro: SpheresValeurs = { ...vide, travail: 95 };
  const a = auditEnergetique(fortPro, null, 60);
  const pro = a.directions.find((d) => d.key === "pro")!;
  const perso = a.directions.find((d) => d.key === "perso")!;
  assert.ok(pro.credit > perso.credit);
});

test("audit : l'énergie globale basse fait baisser l'ensemble", () => {
  const haut = auditEnergetique(vide, null, 90);
  const bas = auditEnergetique(vide, null, 20);
  const moy = (a: ReturnType<typeof auditEnergetique>) =>
    a.directions.reduce((s, d) => s + d.credit, 0) / 4;
  assert.ok(moy(haut) > moy(bas));
});

test("audit : la phrase induit une direction (mentionne le pilier bas)", () => {
  const a = auditEnergetique({ ...vide, travail: 95 }, obj({ love: "Oser" }), 40);
  assert.match(a.phrase, new RegExp(a.aRecharger.label));
});

test("auditDepuisEtat : l'énergie du moment suit le relevé LE PLUS RÉCENT", () => {
  const etat: EtatEvolution = { matrice: matriceVide(), historique: [], jourCourant: 3 };
  const cj = (jour: number, energie: number): ClimatJour => ({ jour, date: "", sommeil: 50, energie, vagues: 20 });
  // Jour 1 = haute énergie, jour 2 = basse → c'est la plus RÉCENTE qui compte.
  const bas = auditDepuisEtat(etat, null, { 1: cj(1, 90), 2: cj(2, 20) }, null);
  assert.ok(bas.global <= 25, `attendu bas (~20), obtenu ${bas.global}`);
  // Inverse : dernier relevé haut → global haut, même avec un ancien bas.
  const haut = auditDepuisEtat(etat, null, { 1: cj(1, 20), 2: cj(2, 88) }, null);
  assert.ok(haut.global >= 80, `attendu haut (~88), obtenu ${haut.global}`);
});
