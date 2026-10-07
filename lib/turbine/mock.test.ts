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

test("mock : deux directions produisent un scénario de dialogue (en tête)", () => {
  const out = mockOutput(input(["Entreprendre", "Écrire"]));
  assert.ok(out.scenarios.length >= 2 && out.scenarios.length <= 3);
  assert.deepEqual(out.scenarios[0].multiples_en_dialogue, ["Entreprendre", "Écrire"]);
});

test("mock : la graine fait varier la sélection (plus « toujours la même chose »)", () => {
  const base = input(["Entreprendre", "Écrire"], ["doute"]);
  const a = mockOutput({ ...base, seed: 0 });
  const b = mockOutput({ ...base, seed: 3 });
  const titres = (o: typeof a) => o.scenarios.map((s) => s.titre).join(" | ");
  assert.notEqual(titres(a), titres(b), "deux graines → sélections différentes");
});

test("mock : le MOMENT (énergie basse) fait apparaître un angle dédié → les possibles bougent avec l'état", () => {
  const base = input(["Entreprendre", "Écrire"]);
  const sans = mockOutput({ ...base, seed: 0 });
  const avec = mockOutput({ ...base, seed: 0, moment: { aRecharger: "Love" } });
  const titres = (o: typeof sans) => o.scenarios.map((s) => s.titre).join(" | ");
  assert.notEqual(titres(sans), titres(avec), "le moment change la sélection");
  assert.ok(
    avec.scenarios.some((s) => s.titre.includes("Love")),
    "un scénario cible l'énergie la plus basse du moment"
  );
});

test("mock : les titres déjà vus sont écartés", () => {
  const base = input(["Entreprendre", "Écrire"], ["doute"]);
  const premier = mockOutput({ ...base, seed: 0 });
  const vus = premier.scenarios.map((s) => s.titre);
  const suite = mockOutput({ ...base, seed: 0, scenariosPrecedents: vus });
  for (const s of suite.scenarios) {
    assert.ok(!vus.includes(s.titre), `« ${s.titre} » ne devrait pas réapparaître`);
  }
});

// Le message envoyé au modèle porte bien les directions de l'utilisatrice.
test("buildUserMessage : transporte les directions réelles vers le générateur", () => {
  const msg = buildUserMessage(input(["Entreprendre", "Écrire"], ["peur"]));
  const parsed = JSON.parse(msg);
  assert.equal(parsed.carte.directions.length, 2);
  assert.ok(msg.includes("Entreprendre") && msg.includes("Écrire"));
  assert.ok(msg.includes("peur"));
});
