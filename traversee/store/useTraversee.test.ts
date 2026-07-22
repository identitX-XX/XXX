import { test } from "node:test";
import assert from "node:assert/strict";
import { useTraversee } from "./useTraversee";

const S = () => useTraversee.getState();
function reset() {
  S().reinitialiser();
}

test("état de départ : 24 étoiles diffuses, jour 1, netteté 0", () => {
  reset();
  assert.equal(S().etoiles.length, 24);
  assert.ok(S().etoiles.every((e) => e.etat === "diffuse"));
  assert.equal(S().journey.currentDay, 1);
  assert.equal(S().portrait.clarity, 0);
});

test("LAISSER : dépose au Vestiaire, éteint une étoile, avance le jour", () => {
  reset();
  S().vivreJour(1, "laisser", "laisser", "le regard des autres");
  const s = S();
  assert.equal(s.reponses[1].verbe, "laisser");
  assert.equal(s.vestiaire.length, 1);
  assert.equal(s.vestiaire[0].label, "le regard des autres");
  assert.equal(s.etoiles.filter((e) => e.territoire === "corps" && e.etat === "eteinte").length, 1);
  assert.equal(s.journey.currentDay, 2);
  assert.ok(s.portrait.clarity > 0);
});

test("une seule action par jour : idempotent, ordre immuable", () => {
  reset();
  S().vivreJour(1, "laisser", "laisser", "a");
  S().vivreJour(1, "emporter", "emporter", "b"); // ignoré
  assert.equal(S().reponses[1].cible, "a");
  assert.equal(S().vestiaire.length, 1);
});

test("EMPORTER : intensifie une étoile du territoire", () => {
  reset();
  S().vivreJour(3, "emporter", "emporter", "mon travail"); // jour 3 → territoire « oeuvre »
  assert.equal(S().etoiles.filter((e) => e.territoire === "oeuvre" && e.etat === "intense").length, 1);
});

test("REPRENDRE dans les 24 h : rallume l'étoile, retire le dépôt", () => {
  reset();
  S().vivreJour(1, "laisser", "laisser", "une injonction");
  const id = S().vestiaire[0].id;
  S().reprendre(id);
  assert.equal(S().vestiaire.length, 0);
  assert.ok(S().etoiles.some((e) => e.territoire === "corps" && e.etat === "diffuse"));
});

test("aucune punition : l'absence est notée, le jour ne recule jamais", () => {
  reset();
  S().vivreJour(1, "laisser", "laisser", "x"); // currentDay -> 2
  // simule un dernier passage il y a 7 jours
  const ilya7 = new Date(Date.now() - 7 * 86400000).toISOString();
  useTraversee.setState((s) => ({ journey: { ...s.journey, lastVisit: ilya7 } }));
  S().noterVisite();
  assert.ok(S().journey.absences.length >= 1); // absence notée
  assert.equal(S().journey.currentDay, 2); // aucun reset, aucun recul
});

test("destinations : dérivées (3), jamais pré-écrites ; choix + élimination", () => {
  reset();
  S().vivreJour(3, "emporter", "emporter", "a");
  S().vivreJour(11, "emporter", "emporter", "b");
  S().genererDestinations();
  assert.equal(S().destinations.candidates.length, 3);
  const idElim = S().destinations.candidates[2].id;
  S().eliminerDestination(idElim);
  assert.ok(S().destinations.eliminees.includes(idElim));
});

test("nommer : révèle le portrait entièrement (netteté 100)", () => {
  reset();
  S().nommer("Celle qui reste");
  assert.equal(S().nomFutur, "Celle qui reste");
  assert.equal(S().portrait.clarity, 100);
});

test("devSetDay : parcourt les jours et cale l'acte", () => {
  reset();
  S().devSetDay(15);
  assert.equal(S().journey.currentDay, 15);
  assert.equal(S().journey.acte, "signes");
});
