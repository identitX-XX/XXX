import { test } from "node:test";
import assert from "node:assert/strict";
import { composerArtefact } from "./artefact";
import { ReponseJour } from "../types";

function rep(jour: number, verbe: "emporter" | "laisser", cible: string): ReponseJour {
  return { jour, choixId: verbe, verbe, cible, date: "2026-01-01T00:00:00.000Z" };
}

const reponses: Record<number, ReponseJour> = {
  9: rep(9, "laisser", "une exigence"),
  10: rep(10, "laisser", "le regard des autres"),
  3: rep(3, "emporter", "mon travail"),
  11: rep(11, "emporter", "ma vitalité"),
};

test("artefact : porte le nom donné et une destination dérivée", () => {
  const a = composerArtefact({ prenom: "Marina", nomFutur: "Celle qui reste", reponses });
  assert.equal(a.nom, "Celle qui reste");
  assert.ok(a.destination, "une destination est dérivée");
  assert.equal(a.pacte.length, 3);
});

test("artefact : la lettre cite ses vrais renoncements et emportés", () => {
  const a = composerArtefact({ prenom: "Marina", nomFutur: "Celle qui reste", reponses });
  const texte = a.lettre.join(" ");
  assert.ok(texte.includes("Marina"), "adresse par le prénom");
  assert.ok(texte.includes("le regard des autres"), "cite le dernier renoncement");
  assert.ok(texte.includes("ma vitalité"), "cite le dernier emporté");
  assert.ok(a.lettre[a.lettre.length - 1].includes("Celle qui reste"), "signée du nom");
});

test("artefact : le pacte tient en trois lignes — garder, laisser, aller", () => {
  const a = composerArtefact({ prenom: "Marina", nomFutur: "Celle qui reste", reponses });
  assert.match(a.pacte[0], /Je garde/);
  assert.match(a.pacte[1], /Je laisse/);
  assert.match(a.pacte[2], /Je vais vers/);
});

test("artefact : déterministe, et robuste si les données sont minces", () => {
  const a = composerArtefact({ prenom: null, nomFutur: null, reponses: {} });
  const b = composerArtefact({ prenom: null, nomFutur: null, reponses: {} });
  assert.deepEqual(a, b);
  assert.equal(a.nom, "Celle que tu deviens"); // repli sobre
  assert.equal(a.pacte.length, 3);
});
