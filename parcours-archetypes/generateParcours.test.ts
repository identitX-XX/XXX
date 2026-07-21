import { test } from "node:test";
import assert from "node:assert/strict";
import { generateParcours } from "./generateParcours";
import { archetypeByKey } from "./archetypes";
import { Diagnostic } from "./types";

const diag: Diagnostic = { dominant: "createur", secondaire: "sage" };

test("30 journées générées, J1 = dominant, J30 = métamorphe", () => {
  const p = generateParcours(diag);
  assert.equal(p.jours.length, 30);
  assert.equal(p.jours[0].archetype, "createur");
  assert.equal(p.jours[29].archetype, "metamorphe");
});

test("un jour dont l'archétype a un contenu enrichi utilise SES question/défi", () => {
  const p = generateParcours(diag);
  const jour = p.jours.find((j) => j.archetype === "createur")!;
  const question = jour.sections.find((s) => s.kind === "question")!;
  const defi = jour.sections.find((s) => s.kind === "defi")!;
  assert.equal(question.texte, archetypeByKey.createur.question);
  assert.equal(defi.texte, archetypeByKey.createur.defi);
});

test("un archétype sans contenu enrichi retombe sur le gabarit générique", () => {
  const p = generateParcours(diag);
  const jour = p.jours.find((j) => j.archetype === "explorateur"); // pas encore enrichi
  if (jour) {
    const question = jour.sections.find((s) => s.kind === "question")!;
    assert.match(question.texte, /qu'est-ce qu'elle cherche à protéger/);
  }
});

test("la capsule du jour porte le lens de l'archétype", () => {
  const p = generateParcours(diag);
  const jour = p.jours.find((j) => j.archetype === "createur")!;
  const capsule = jour.sections.find((s) => s.kind === "capsule")!;
  assert.ok(capsule.texte.includes(archetypeByKey.createur.lens));
});
