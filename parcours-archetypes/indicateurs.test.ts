import { test } from "node:test";
import assert from "node:assert/strict";
import { momentum, progression, archetypeDominant } from "./indicateurs";
import { matriceVide, initialiser } from "./evolution";
import { EtatEvolution, SnapshotJour } from "./types";

// Date ancrée à midi local pour éviter les effets de bord de minuit.
function isoDaysAgo(k: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return new Date(d.getTime() - k * 86400000).toISOString();
}
function etatDates(daysAgo: number[]): EtatEvolution {
  const historique = daysAgo.map(
    (k, i): SnapshotJour => ({
      jour: i + 1,
      date: isoDaysAgo(k),
      radar: {} as SnapshotJour["radar"],
      spheres: {} as SnapshotJour["spheres"],
      coherence: 60,
      respiration: 20,
      emotions: [],
    })
  );
  return { matrice: matriceVide(), historique, jourCourant: historique.length + 1 };
}

test("progression : faits, part, jourCourant", () => {
  const etat = etatDates([2, 1, 0]);
  const p = progression(etat);
  assert.equal(p.faits, 3);
  assert.equal(p.total, 30);
  assert.equal(p.part, 10); // round(3/30*100)
  assert.equal(p.jourCourant, 4);
});

test("momentum : série de jours consécutifs finissant aujourd'hui", () => {
  const mo = momentum(etatDates([2, 1, 0]));
  assert.equal(mo.serie, 3);
  assert.equal(mo.record, 3);
  assert.equal(mo.actifAujourdhui, true);
  assert.equal(mo.prochainJalon, 7);
  assert.equal(mo.resteAvantJalon, 4);
});

test("momentum : jour de grâce — série finissant hier compte encore", () => {
  const mo = momentum(etatDates([2, 1])); // dernier = hier
  assert.equal(mo.serie, 2);
  assert.equal(mo.actifAujourdhui, false);
});

test("momentum : série cassée si dernier relevé plus vieux qu'hier", () => {
  const mo = momentum(etatDates([3])); // avant-hier
  assert.equal(mo.serie, 0);
});

test("momentum : record supérieur à la série courante", () => {
  const mo = momentum(etatDates([4, 3, 2, 0])); // run de 3 (j-4..j-2), puis aujourd'hui isolé
  assert.equal(mo.record, 3);
  assert.equal(mo.serie, 1);
});

test("momentum : jalon atteint pile à 7", () => {
  const mo = momentum(etatDates([6, 5, 4, 3, 2, 1, 0]));
  assert.equal(mo.serie, 7);
  assert.equal(mo.jalonAtteint, 7);
  assert.equal(mo.prochainJalon, 14);
});

test("momentum : pas de jalon entre deux caps", () => {
  const mo = momentum(etatDates([7, 6, 5, 4, 3, 2, 1, 0])); // 8 jours
  assert.equal(mo.jalonAtteint, null);
  assert.equal(mo.prochainJalon, 14);
});

test("archetypeDominant : null quand la matrice est vierge et l'historique vide", () => {
  const etat: EtatEvolution = { matrice: matriceVide(), historique: [], jourCourant: 1 };
  assert.equal(archetypeDominant(etat), null);
});

test("archetypeDominant : renvoie le dominant amorcé", () => {
  const base = initialiser({ dominant: "createur", secondaire: "sage" });
  // historique factice pour sortir du cas « vierge »
  const etat: EtatEvolution = { ...base, historique: [{ jour: 1, date: isoDaysAgo(0), radar: {} as SnapshotJour["radar"], spheres: {} as SnapshotJour["spheres"], coherence: 60, respiration: 20, emotions: [] }] };
  const dom = archetypeDominant(etat);
  assert.ok(dom);
  assert.equal(dom!.key, "createur");
});
