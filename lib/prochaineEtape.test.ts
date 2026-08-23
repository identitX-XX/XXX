import { test } from "node:test";
import assert from "node:assert/strict";
import { prochaineEtape } from "./prochaineEtape";
import type { EtatEvolution } from "@/parcours-archetypes/types";

// `progression` ne lit que historique.length (faits) et jourCourant.
function etat(jourCourant: number, faits = 0): EtatEvolution {
  return {
    matrice: {} as EtatEvolution["matrice"],
    historique: Array.from({ length: faits }, (_, i) => ({ jour: i + 1 })) as unknown as EtatEvolution["historique"],
    jourCourant,
  };
}

test("prochaineEtape : sans diagnostic → révéler la signature", () => {
  const e = prochaineEtape(null, null, etat(1), {});
  assert.equal(e.href, "/parcours-signatures");
  assert.match(e.cta, /Commencer/);
});

test("prochaineEtape : diagnostic mais pas d'objectifs → poser le cap", () => {
  const e = prochaineEtape({ dominant: "multiple" }, null, etat(1), {});
  assert.match(e.ctaCourt, /cap/i);
});

test("prochaineEtape : jour courant non terminé → terminer la journée", () => {
  const e = prochaineEtape({ dominant: "multiple" }, { perso: "x" }, etat(3), {});
  assert.equal(e.href, "/parcours-signatures");
  assert.equal(e.ctaCourt, "Terminer");
  assert.match(e.titre, /jour 3/i);
});

test("prochaineEtape : jour courant déjà répondu → aller à la progression", () => {
  const e = prochaineEtape({ dominant: "multiple" }, { perso: "x" }, etat(3, 3), { 3: {} });
  assert.equal(e.href, "/progression");
});

test("prochaineEtape : parcours terminé (>30) → le bilan", () => {
  const e = prochaineEtape({ dominant: "multiple" }, { perso: "x" }, etat(31, 30), {});
  assert.equal(e.href, "/parcours-signatures/rapport");
});

test("prochaineEtape : fournit toujours cta ET ctaCourt non vides", () => {
  const cas = [
    prochaineEtape(null, null, etat(1), {}),
    prochaineEtape({ dominant: "multiple" }, { perso: "x" }, etat(3), {}),
    prochaineEtape({ dominant: "multiple" }, { perso: "x" }, etat(31, 30), {}),
  ];
  for (const e of cas) {
    assert.ok(e.cta.trim());
    assert.ok(e.ctaCourt.trim());
  }
});
