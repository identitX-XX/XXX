import { test } from "node:test";
import assert from "node:assert/strict";
import { estReversible, heuresRestantes, parPlusRecent } from "./vestiaire";
import { Depot } from "../types";

function depot(id: string, dateISO: string, reversibleJusquaISO: string): Depot {
  return { id, label: id, territoire: "corps", date: dateISO, reversibleJusqua: reversibleJusquaISO };
}

const T0 = Date.parse("2026-01-01T12:00:00.000Z");
const H = 3_600_000;

test("estReversible : vrai avant la fenêtre, faux après", () => {
  const d = depot("a", "2026-01-01T00:00:00.000Z", new Date(T0 + 2 * H).toISOString());
  assert.equal(estReversible(d, T0), true);
  assert.equal(estReversible(d, T0 + 3 * H), false);
});

test("heuresRestantes : arrondi au supérieur, 0 une fois dépassé", () => {
  const d = depot("a", "2026-01-01T00:00:00.000Z", new Date(T0 + 90 * 60 * 1000).toISOString());
  assert.equal(heuresRestantes(d, T0), 2); // 1h30 → 2
  assert.equal(heuresRestantes(d, T0 + 5 * H), 0);
});

test("parPlusRecent : du plus récent au plus ancien, sans muter", () => {
  const a = depot("a", "2026-01-01T09:00:00.000Z", "2026-01-02T09:00:00.000Z");
  const b = depot("b", "2026-01-01T11:00:00.000Z", "2026-01-02T11:00:00.000Z");
  const src = [a, b];
  const out = parPlusRecent(src);
  assert.deepEqual(out.map((d) => d.id), ["b", "a"]);
  assert.deepEqual(src.map((d) => d.id), ["a", "b"]); // non muté
});
