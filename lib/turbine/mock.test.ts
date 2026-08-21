import { test } from "node:test";
import assert from "node:assert/strict";
import { mockOutput } from "./mock";
import { buildUserMessage } from "./prompt";
import type { TurbineInput } from "./types";

const input = (noms: string[], tensions: string[] = []): TurbineInput => ({
  archetype: { actuel: "La Multiple", precedent: "", bascule: "" },
  valeurs: [],
  forces: [],
  directions: noms.map((nom) => ({ nom, energie: "moyenne", etat: "actif" })),
  tensions,
  signalRecent: [],
  scenariosPrecedents: [],
});

const complet = (s: { titre: string; mouvement: string; premier_pas: string }) =>
  Boolean(s.titre?.trim() && s.mouvement?.trim() && s.premier_pas?.trim());

// Une seule direction suffit à générer — c'est le correctif du « signal
// insuffisant » : plus jamais d'écran vide dès qu'une direction est posée.
test("mock : une seule direction produit au moins un scénario complet", () => {
  const out = mockOutput(input(["Entreprendre"], ["doute"]));
  assert.ok(out.scenarios.length >= 1);
  assert.ok(out.scenarios.every(complet), "chaque scénario doit être complet");
  assert.ok(
    out.scenarios.some((s) => s.mouvement.includes("Entreprendre")),
    "les scénarios partent de la direction réelle"
  );
});

test("mock : deux directions les font dialoguer (2 scénarios)", () => {
  const out = mockOutput(input(["Entreprendre", "Écrire"]));
  assert.equal(out.scenarios.length, 2);
  assert.deepEqual(out.scenarios[0].multiples_en_dialogue, ["Entreprendre", "Écrire"]);
});

// Le message envoyé au modèle porte bien les directions de l'utilisatrice.
test("buildUserMessage : transporte les directions réelles vers le générateur", () => {
  const msg = buildUserMessage(input(["Entreprendre", "Écrire"], ["peur"]));
  const parsed = JSON.parse(msg);
  assert.equal(parsed.carte.directions.length, 2);
  assert.ok(msg.includes("Entreprendre") && msg.includes("Écrire"));
  assert.ok(msg.includes("peur"));
});
