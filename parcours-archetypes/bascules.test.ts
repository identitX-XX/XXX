import { test } from "node:test";
import assert from "node:assert/strict";
import { detecterChapitres, derniereBascule } from "./bascules";
import { ARCHETYPE_KEYS, SPHERE_KEYS } from "./archetypes";
import { ArchetypeKey, SnapshotJour } from "./types";

// Snapshot dont le dominant est forcé (radar : dom à 80, le reste à 20).
function snap(jour: number, dom: ArchetypeKey, coherence = 60): SnapshotJour {
  const radar = Object.fromEntries(
    ARCHETYPE_KEYS.map((a) => [a, a === dom ? 80 : 20])
  ) as SnapshotJour["radar"];
  const spheres = Object.fromEntries(SPHERE_KEYS.map((s) => [s, 50])) as SnapshotJour["spheres"];
  return { jour, date: new Date().toISOString(), radar, spheres, coherence, respiration: 20, emotions: [] };
}
const seq = (doms: ArchetypeKey[]) => doms.map((d, i) => snap(i + 1, d));

test("aucun historique → aucun chapitre", () => {
  assert.deepEqual(detecterChapitres([]), []);
});

test("un seul dominant → un seul chapitre couvrant tout", () => {
  const ch = detecterChapitres(seq(["creatrice", "creatrice", "creatrice", "creatrice"]));
  assert.equal(ch.length, 1);
  assert.equal(ch[0].debut, 1);
  assert.equal(ch[0].fin, 4);
  assert.equal(ch[0].archetype, "creatrice");
  assert.equal(ch[0].jours, 4);
});

test("bascule nette qui tient → deux chapitres", () => {
  const ch = detecterChapitres(
    seq(["creatrice", "creatrice", "creatrice", "creatrice", "rebelle", "rebelle", "rebelle", "rebelle"])
  );
  assert.equal(ch.length, 2);
  assert.deepEqual([ch[0].archetype, ch[0].debut, ch[0].fin], ["creatrice", 1, 4]);
  assert.deepEqual([ch[1].archetype, ch[1].debut, ch[1].fin], ["rebelle", 5, 8]);
});

test("flicker d'un jour absorbé (ne casse pas le chapitre)", () => {
  const ch = detecterChapitres(
    seq(["creatrice", "creatrice", "creatrice", "rebelle", "creatrice", "creatrice"])
  );
  assert.equal(ch.length, 1);
  assert.equal(ch[0].archetype, "creatrice");
});

test("bascule dans les tout derniers jours : ignorée si elle ne tient pas minHold", () => {
  const ch = detecterChapitres(seq(["creatrice", "creatrice", "creatrice", "rebelle"]));
  assert.equal(ch.length, 1); // rebelle seul en fin → pas de nouveau chapitre
});

test("coherenceMoy calculée par chapitre", () => {
  const h = [snap(1, "creatrice", 40), snap(2, "creatrice", 60), snap(3, "creatrice", 80)];
  const ch = detecterChapitres(h);
  assert.equal(ch[0].coherenceMoy, 60); // (40+60+80)/3
});

test("derniereBascule : null sur un seul chapitre, sinon la frontière", () => {
  assert.equal(derniereBascule(detecterChapitres(seq(["creatrice", "creatrice"]))), null);
  const b = derniereBascule(
    detecterChapitres(seq(["creatrice", "creatrice", "rebelle", "rebelle"]))
  );
  assert.deepEqual(b, { jour: 3, depuis: "creatrice", vers: "rebelle" });
});
