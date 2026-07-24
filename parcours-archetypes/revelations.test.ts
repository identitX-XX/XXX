import { test } from "node:test";
import assert from "node:assert/strict";
import { genererRevelations } from "./revelations";
import { matriceVide } from "./evolution";
import { ARCHETYPE_KEYS, SPHERE_KEYS, EMOTION_KEYS } from "./archetypes";
import {
  ClimatJour,
  EmotionKey,
  EtatEvolution,
  ReponseJour,
  SnapshotJour,
} from "./types";

const iso = (j: number) => new Date(Date.now() - (40 - j) * 86400000).toISOString();

function snap(
  jour: number,
  o: { coherence?: number; dom?: string; domVal?: number; emotions?: EmotionKey[] } = {}
): SnapshotJour {
  const { coherence = 60, dom = "createur", domVal = 20, emotions = ["joie"] } = o;
  const radar = Object.fromEntries(
    ARCHETYPE_KEYS.map((a) => [a, a === dom ? domVal : 20])
  ) as SnapshotJour["radar"];
  const spheres = Object.fromEntries(SPHERE_KEYS.map((s) => [s, 50])) as SnapshotJour["spheres"];
  return { jour, date: iso(jour), radar, spheres, coherence, respiration: 20, emotions };
}
function rep(
  jour: number,
  o: { creation?: number; corps?: number; emotions?: EmotionKey[]; defi?: number } = {}
): ReponseJour {
  const { creation = 50, corps = 50, emotions = ["joie"], defi = 40 } = o;
  return {
    jour,
    date: iso(jour),
    archetype: "createur",
    sphereFocus: "creation",
    curseurs: { travail: 50, relations: 50, creation, corps, sens: 50 },
    emotions,
    intensiteDefi: defi,
    note: "",
  };
}
const etatFrom = (snaps: SnapshotJour[]): EtatEvolution => ({
  matrice: matriceVide(),
  historique: snaps,
  jourCourant: snaps.length + 1,
});
const repMap = (reps: ReponseJour[]) => Object.fromEntries(reps.map((r) => [r.jour, r]));

test("silence avant 5 journées", () => {
  const snaps = [1, 2, 3, 4].map((j) => snap(j));
  assert.deepEqual(genererRevelations(etatFrom(snaps), {}), []);
});

test("silence quand aucun signal ne dépasse le seuil (anti-Barnum)", () => {
  // 6 jours plats : émotions toutes différentes, cohérence stable, radar plat,
  // curseurs égaux, défi constant → rien ne doit ressortir.
  const snaps = Array.from({ length: 6 }, (_, i) =>
    snap(i + 1, { coherence: 60, emotions: [EMOTION_KEYS[i % 6]] })
  );
  const reps = repMap(
    Array.from({ length: 6 }, (_, i) =>
      rep(i + 1, { creation: 50, corps: 50, emotions: [EMOTION_KEYS[i % 6]], defi: 40 })
    )
  );
  assert.deepEqual(genererRevelations(etatFrom(snaps), reps), []);
});

test("révélation de sphère : sourcée avec des chiffres réels", () => {
  const snaps = Array.from({ length: 6 }, (_, i) => snap(i + 1));
  const reps = repMap(
    Array.from({ length: 6 }, (_, i) => rep(i + 1, { creation: 74, corps: 24 }))
  );
  const revs = genererRevelations(etatFrom(snaps), reps);
  const sphere = revs.find((r) => r.kind === "sphere");
  assert.ok(sphere, "une révélation de sphère doit apparaître");
  assert.match(sphere!.preuve, /\/100/); // la preuve cite des chiffres
  assert.match(sphere!.titre, /création/);
});

test("ré-attribution : creux de clarté + climat agité → insight climat", () => {
  // 10 jours : 2e moitié plus floue.
  const snaps = Array.from({ length: 10 }, (_, i) =>
    snap(i + 1, { coherence: i >= 5 ? 50 : 70, emotions: ["apaisement"] })
  );
  const climat: Record<number, ClimatJour> = {};
  for (let j = 6; j <= 10; j++)
    climat[j] = { jour: j, date: iso(j), sommeil: 35, energie: 35, vagues: 70 };
  const revs = genererRevelations(etatFrom(snaps), {}, climat);
  assert.ok(revs.some((r) => r.id === "reattribution"), "la ré-attribution doit ressortir");
});

test("ré-attribution absente sans données de climat", () => {
  const snaps = Array.from({ length: 10 }, (_, i) =>
    snap(i + 1, { coherence: i >= 5 ? 50 : 70, emotions: ["apaisement"] })
  );
  const revs = genererRevelations(etatFrom(snaps), {});
  assert.ok(!revs.some((r) => r.id === "reattribution"));
});

test("archétype qui monte : détecté quand le radar grimpe", () => {
  const snaps = Array.from({ length: 9 }, (_, i) =>
    snap(i + 1, { dom: "rebelle", domVal: 20 + i * 6 }) // rebelle grimpe
  );
  const revs = genererRevelations(etatFrom(snaps), {});
  assert.ok(revs.some((r) => r.kind === "archetype" && /Rebelle/.test(r.titre)));
});

test("sphère en tendance : une sphère qui monte est repérée, sourcée", () => {
  // 9 jours, l'énergie « création » grimpe de 30 à 78.
  const snaps = Array.from({ length: 9 }, (_, i) => {
    const s = snap(i + 1);
    s.spheres = { ...s.spheres, creation: 30 + i * 6 };
    return s;
  });
  const revs = genererRevelations(etatFrom(snaps), {});
  const t = revs.find((r) => r.id === "sphere-trend:creation");
  assert.ok(t, "la tendance de sphère doit ressortir");
  assert.match(t!.titre, /monte/);
  assert.match(t!.preuve, /points/);
});

test("rythme hebdomadaire : un jour de la semaine plus flou est détecté", () => {
  // 14 jours consécutifs ; on abaisse la cohérence sur un jour de semaine précis.
  const snaps = Array.from({ length: 14 }, (_, i) => {
    const jour = i + 1;
    const s = snap(jour);
    const wd = new Date(s.date).getDay();
    s.coherence = wd === 1 ? 46 : 70; // les lundis plus flous
    return s;
  });
  const revs = genererRevelations(etatFrom(snaps), {});
  assert.ok(revs.some((r) => r.kind === "rythme"), "un insight de rythme doit ressortir");
});
