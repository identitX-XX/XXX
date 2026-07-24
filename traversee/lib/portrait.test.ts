import { test } from "node:test";
import assert from "node:assert/strict";
import { portraitParams } from "./portrait";

test("portrait : flou épais et voile plein à netteté 0", () => {
  const p = portraitParams(0);
  assert.equal(p.reveal, 0);
  assert.ok(p.blur >= 27, "flou proche de 28px");
  assert.ok(p.veil > 0.8, "voile presque plein");
});

test("portrait : révélé, sans flou ni voile à netteté 100", () => {
  const p = portraitParams(100);
  assert.equal(p.reveal, 1);
  assert.equal(p.blur, 0);
  assert.equal(p.veil, 0);
});

test("portrait : le flou décroît de façon monotone", () => {
  let prev = Infinity;
  for (let c = 0; c <= 100; c += 10) {
    const b = portraitParams(c).blur;
    assert.ok(b <= prev, `flou monotone à ${c}`);
    prev = b;
  }
});

test("portrait : la fuchsia se concentre (halo resserré, intensité montante)", () => {
  const bas = portraitParams(10);
  const haut = portraitParams(90);
  assert.ok(haut.glowRadius < bas.glowRadius, "le halo se resserre");
  assert.ok(haut.glowIntensity > bas.glowIntensity, "l'intensité monte");
});

test("portrait : valeurs hors bornes ramenées dans l'intervalle", () => {
  assert.equal(portraitParams(-50).reveal, 0);
  assert.equal(portraitParams(999).reveal, 1);
});
