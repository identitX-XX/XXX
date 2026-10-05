import { test } from "node:test";
import assert from "node:assert/strict";
import { signalCapsule, gesteCapsule, questionCapsule } from "./capsuleAdaptive";
import { gesteDuJour } from "./variateJour";
import { ARCHETYPE_KEYS, SPHERE_KEYS, archetypeByKey } from "./archetypes";
import type { EtatEvolution, SnapshotJour, ArchetypeKey, SphereKey, EmotionKey } from "./types";

const arch = archetypeByKey[ARCHETYPE_KEYS[0]];

function radar(dom: ArchetypeKey, val = 80): Record<ArchetypeKey, number> {
  const r = {} as Record<ArchetypeKey, number>;
  for (const a of ARCHETYPE_KEYS) r[a] = 20;
  r[dom] = val;
  return r;
}
function spheres(over: Partial<Record<SphereKey, number>> = {}): Record<SphereKey, number> {
  const s = {} as Record<SphereKey, number>;
  for (const k of SPHERE_KEYS) s[k] = 50;
  return { ...s, ...over };
}
function snap(over: Partial<SnapshotJour>): SnapshotJour {
  return {
    jour: 1,
    date: new Date().toISOString(),
    radar: radar(ARCHETYPE_KEYS[0]),
    spheres: spheres(),
    coherence: 50,
    respiration: 10,
    emotions: [],
    ...over,
  };
}
function etat(hist: SnapshotJour[]): EtatEvolution {
  return { matrice: {} as EtatEvolution["matrice"], historique: hist, jourCourant: hist.length + 1 };
}

test("signal : neutre quand aucun historique → geste = rotation existante", () => {
  const sig = signalCapsule(etat([]));
  assert.equal(sig.type, "neutre");
  assert.equal(gesteCapsule(arch, 1, sig), gesteDuJour(arch, 1));
});

test("signal : une bascule de dominant est détectée en priorité", () => {
  const a = ARCHETYPE_KEYS[0];
  const b = ARCHETYPE_KEYS[1];
  const sig = signalCapsule(etat([snap({ radar: radar(a) }), snap({ radar: radar(b) })]));
  assert.equal(sig.type, "bascule");
  assert.equal(sig.vers, b);
  assert.ok(sig.label.length > 0);
  assert.ok(questionCapsule(arch, 1, sig).includes(archetypeByKey[b].name));
});

test("signal : une émotion difficile récente est repérée", () => {
  const emo: EmotionKey[] = ["tristesse"];
  // Même dominant → pas de bascule ; émotion négative → type emotion.
  const sig = signalCapsule(etat([snap({}), snap({ emotions: emo })]));
  assert.equal(sig.type, "emotion");
  assert.equal(sig.emotion, "tristesse");
});

test("signal : une sphère en retrait est ciblée (sans autre signal)", () => {
  // Deux snapshots identiques (pas de bascule), sans émotion, cohérence stable →
  // on tombe sur la sphère la plus basse.
  const base = snap({ spheres: spheres({ corps: 10 }), emotions: [] });
  const sig = signalCapsule(etat([base, snap({ spheres: spheres({ corps: 10 }), emotions: [] })]));
  assert.equal(sig.type, "sphere");
  assert.equal(sig.sphere, "corps");
});

test("textes : chaque signal produit un geste ET une question non vides", () => {
  for (const sig of [
    { type: "bascule", vers: ARCHETYPE_KEYS[1], label: "x" } as const,
    { type: "emotion", emotion: "doute", label: "x" } as const,
    { type: "elan", label: "x" } as const,
    { type: "sphere", sphere: "travail", label: "x" } as const,
  ]) {
    assert.ok(gesteCapsule(arch, 1, sig).length > 10);
    assert.ok(questionCapsule(arch, 2, sig).length > 10);
  }
});
