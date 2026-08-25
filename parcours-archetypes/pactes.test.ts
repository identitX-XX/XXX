import { test } from "node:test";
import assert from "node:assert/strict";
import { pacteAVerifier, constancePactes, PacteJour } from "./pactes";

const mk = (jour: number, tenu?: PacteJour["tenu"]): PacteJour => ({
  jour,
  texte: `geste ${jour}`,
  archKey: "multiple",
  dateEngagement: "2026-01-01T00:00:00Z",
  tenu,
});

test("pacteAVerifier : le plus récent pacte passé non évalué", () => {
  const pactes = { 3: mk(3), 5: mk(5), 6: mk(6, "oui") };
  const p = pacteAVerifier(pactes, 7);
  assert.equal(p?.jour, 5); // 6 est déjà évalué, 5 est le plus récent restant
});

test("pacteAVerifier : jamais le jour même ni un jour futur", () => {
  const pactes = { 6: mk(6) };
  assert.equal(pacteAVerifier(pactes, 6), null); // jour courant = 6 → pas de check-in
  assert.equal(pacteAVerifier(pactes, 5), null); // pacte dans le futur
});

test("pacteAVerifier : rien à vérifier si tout est répondu", () => {
  const pactes = { 3: mk(3, "non"), 4: mk(4, "oui") };
  assert.equal(pacteAVerifier(pactes, 6), null);
});

test("constancePactes : série d'engagements tenus, cassée par un non", () => {
  const pactes = {
    2: mk(2, "oui"),
    3: mk(3, "non"),
    4: mk(4, "oui"),
    5: mk(5, "partiel"),
    6: mk(6, "oui"),
  };
  const { serie, tenus } = constancePactes(pactes);
  assert.equal(serie, 3); // 6:oui, 5:partiel, 4:oui — puis 3:non casse
  assert.equal(tenus, 3); // total des « oui » : jours 2, 4, 6
});

test("constancePactes : vide → 0", () => {
  assert.deepEqual(constancePactes({}), { serie: 0, tenus: 0 });
});
