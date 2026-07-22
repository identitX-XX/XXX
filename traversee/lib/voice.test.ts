import { test } from "node:test";
import assert from "node:assert/strict";
import { voiceClarity, registre, composerSignal } from "./voice";
import { jourN } from "../content/jours";

test("voiceClarity : croît de 0 (J1) à 1 (J30)", () => {
  assert.equal(voiceClarity(1), 0);
  assert.equal(voiceClarity(30), 1);
  assert.ok(voiceClarity(15) > voiceClarity(10));
});

test("registre : brume / assuré / intime selon les bandes", () => {
  assert.equal(registre(voiceClarity(1)), "brume");
  assert.equal(registre(voiceClarity(8)), "brume");
  assert.equal(registre(voiceClarity(9)), "assure");
  assert.equal(registre(voiceClarity(20)), "assure");
  assert.equal(registre(voiceClarity(21)), "intime");
  assert.equal(registre(voiceClarity(30)), "intime");
});

test("composerSignal : la brume ne connaît pas ton prénom", () => {
  const s = composerSignal(jourN(1)!, { prenom: "Marina" });
  assert.ok(!s.includes("Marina"));
});

test("composerSignal : l'intime cite ton prénom et ton dernier renoncement", () => {
  const s = composerSignal(jourN(30)!, { prenom: "Marina", renoncements: ["le regard des autres"] });
  assert.ok(s.includes("Marina"));
  assert.ok(s.includes("le regard des autres"));
});

test("composerSignal : déterministe", () => {
  const a = composerSignal(jourN(15)!, { prenom: "Marina" });
  const b = composerSignal(jourN(15)!, { prenom: "Marina" });
  assert.equal(a, b);
});
