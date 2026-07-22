import { test } from "node:test";
import assert from "node:assert/strict";
import { signes, deriverDestinations } from "./derivation";
import { ReponseJour } from "../types";

const rep = (jour: number, verbe: "emporter" | "laisser"): ReponseJour => ({
  jour,
  choixId: verbe,
  verbe,
  cible: "x",
  date: new Date().toISOString(),
});
const asMap = (rs: ReponseJour[]) => Object.fromEntries(rs.map((r) => [r.jour, r]));

test("signes : silence sous 3 réponses", () => {
  assert.deepEqual(signes(asMap([rep(1, "laisser"), rep(2, "laisser")])), []);
});

test("signes : bilan chiffré vérifiable", () => {
  const s = signes(asMap([rep(1, "laisser"), rep(2, "laisser"), rep(3, "emporter")]));
  const bilan = s.find((x) => x.id === "bilan");
  assert.ok(bilan);
  assert.match(bilan!.texte, /posé 2/);
  assert.match(bilan!.texte, /emporté 1/);
});

test("signes : détecte le territoire le plus laissé (déterministe)", () => {
  // jours 1,9,17 → même rotation d'index (0) → territoire "corps"
  const rs = asMap([rep(1, "laisser"), rep(9, "laisser"), rep(17, "laisser"), rep(2, "emporter")]);
  const s = signes(rs);
  assert.ok(s.some((x) => x.id.startsWith("laisse:") && /Corps/.test(x.texte)));
  assert.deepEqual(signes(rs), signes(rs)); // déterministe
});

test("deriverDestinations : 3 candidates distinctes, dérivées des données", () => {
  // Emporter beaucoup en "oeuvre" (jour 3 → index 2 → "oeuvre")
  const d = deriverDestinations(asMap([rep(3, "emporter"), rep(11, "emporter"), rep(1, "laisser")]));
  assert.equal(d.length, 3);
  assert.equal(new Set(d.map((x) => x.id)).size, 3);
  // le territoire le plus emporté doit apparaître dans au moins une candidate
  assert.ok(d.some((x) => x.territoires.includes("oeuvre")));
  assert.match(d[0].fondement, /emporté/);
});

test("deriverDestinations : déterministe", () => {
  const rs = asMap([rep(3, "emporter"), rep(5, "laisser")]);
  assert.deepEqual(deriverDestinations(rs), deriverDestinations(rs));
});
