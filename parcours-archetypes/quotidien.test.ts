import { test } from "node:test";
import assert from "node:assert/strict";
import { nouveauteDuJour, ressourceDuJour, RESSOURCES } from "./quotidien";
import { ARCHETYPES, archetypeByKey } from "./archetypes";

const arch = archetypeByKey["explorateur"] ?? ARCHETYPES[0];

test("nouveauté : la facette alterne question ↔ défi (jamais la lens de la capsule)", () => {
  assert.equal(nouveauteDuJour(1, arch).kind, "question");
  assert.equal(nouveauteDuJour(2, arch).kind, "defi");
  assert.equal(nouveauteDuJour(3, arch).kind, "question");
  assert.equal(nouveauteDuJour(4, arch).kind, "defi");
});

test("nouveauté : le texte vient bien de l'archétype du jour", () => {
  assert.equal(nouveauteDuJour(1, arch).texte, arch.question);
  assert.equal(nouveauteDuJour(2, arch).texte, arch.defi);
  assert.notEqual(nouveauteDuJour(1, arch).texte, arch.lens);
});

test("nouveauté : la phase oriente la facette dominante", () => {
  // Phase d'action → le défi domine le premier jour de parité paire.
  assert.equal(nouveauteDuJour(1, arch, "exploration").kind, "defi");
  assert.equal(nouveauteDuJour(1, arch, "revelation").kind, "question");
  assert.equal(nouveauteDuJour(1, arch, "tension").kind, "defi");
});

test("ressource : déterministe et toujours dans la bibliothèque", () => {
  const a = ressourceDuJour(5, "sage");
  const b = ressourceDuJour(5, "sage");
  assert.equal(a.id, b.id);
  assert.ok(RESSOURCES.some((r) => r.id === a.id));
});

test("ressource : un climat agité fait remonter une pratique d'ancrage", () => {
  for (let n = 1; n <= 8; n++) {
    assert.equal(ressourceDuJour(n, "sage", 70).type, "pratique", `jour ${n} agité → pratique`);
  }
  // Un climat apaisé écarte les pratiques (lecture / réflexion).
  for (let n = 1; n <= 8; n++) {
    assert.notEqual(ressourceDuJour(n, "sage", 20).type, "pratique", `jour ${n} apaisé → pas pratique`);
  }
});

test("ressource : varie selon le jour et l'archétype", () => {
  const ids = new Set<string>();
  for (let n = 1; n <= 12; n++) ids.add(ressourceDuJour(n, "createur").id);
  assert.ok(ids.size >= 4, "assez de diversité sur douze jours");
});
