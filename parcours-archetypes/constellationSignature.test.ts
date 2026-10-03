import { test } from "node:test";
import assert from "node:assert/strict";
import { compositionSignature } from "./constellationSignature";
import type { Diagnostic } from "./types";

const diag = (over: Partial<Diagnostic> = {}): Diagnostic =>
  ({
    dominant: "rebelle",
    secondaire: "sage",
    tally: { rebelle: 3, sage: 2, creatrice: 1, libre: 1 },
    ...over,
  } as Diagnostic);

test("composition : déterministe (même diagnostic → même seed/nodes)", () => {
  const a = compositionSignature(diag());
  const b = compositionSignature(diag());
  assert.equal(a.seed, b.seed);
  assert.deepEqual(a.nodes, b.nodes);
});

test("composition : des diagnostics différents donnent des empreintes différentes", () => {
  const a = compositionSignature(diag());
  const b = compositionSignature(diag({ dominant: "amante", secondaire: "mere" }));
  assert.notEqual(a.seed, b.seed);
});

test("composition : toujours un primaire et un secondaire", () => {
  const c = compositionSignature(diag());
  assert.equal(c.nodes.filter((n) => n.kind === "primary").length, 1);
  assert.equal(c.nodes.filter((n) => n.kind === "secondary").length, 1);
  assert.equal(c.nodes[0].key, "rebelle");
  assert.equal(c.nodes[1].key, "sage");
});

test("composition : tous les nœuds tiennent dans le viewBox 400×400", () => {
  const c = compositionSignature(diag());
  for (const n of c.nodes) {
    assert.ok(n.x >= 18 && n.x <= 382, `x=${n.x}`);
    assert.ok(n.y >= 18 && n.y <= 382, `y=${n.y}`);
  }
});

test("composition : liens valides et dédoublonnés", () => {
  const c = compositionSignature(diag());
  const seen = new Set<string>();
  for (const l of c.links) {
    assert.ok(c.nodes.some((n) => n.id === l.a) && c.nodes.some((n) => n.id === l.b));
    const k = l.a < l.b ? `${l.a}-${l.b}` : `${l.b}-${l.a}`;
    assert.ok(!seen.has(k), "pas de doublon");
    seen.add(k);
  }
  assert.ok(c.links.length >= 1);
});

test("composition : robuste même sans tally", () => {
  const c = compositionSignature(diag({ tally: undefined }));
  assert.ok(c.nodes.length >= 2);
});
