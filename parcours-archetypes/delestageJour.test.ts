import { test } from "node:test";
import assert from "node:assert/strict";
import { delestageDuJour } from "./delestageJour";

const poids = ["poids A", "poids B", "poids C", "poids D", "poids E"];
const directions = ["me lancer", "ralentir", "oser dire non"];

test("délestage : 5 items par jour, tous distincts dans la journée", () => {
  for (let j = 1; j <= 30; j++) {
    const { items } = delestageDuJour(poids, directions, j);
    assert.equal(items.length, 5, `jour ${j}`);
    assert.equal(new Set(items).size, 5, `jour ${j} : items distincts`);
  }
});

test("délestage : deux jours consécutifs ne partagent aucun poids", () => {
  for (let j = 1; j < 30; j++) {
    const a = new Set(delestageDuJour(poids, directions, j).items);
    const b = delestageDuJour(poids, directions, j + 1).items;
    const partage = b.filter((x) => a.has(x));
    assert.equal(partage.length, 0, `jours ${j}/${j + 1} partagent : ${partage.join(", ")}`);
  }
});

test("délestage : personnalisé — les directions apparaissent dans le vivier", () => {
  // Sur 30 jours, chaque direction posée doit ressortir au moins une fois.
  const vus = new Set<string>();
  for (let j = 1; j <= 30; j++) {
    for (const it of delestageDuJour(poids, directions, j).items) vus.add(it);
  }
  for (const d of directions) {
    assert.ok([...vus].some((v) => v.includes(d)), `direction « ${d} » jamais proposée`);
  }
});

test("délestage : déterministe (même jour → même exercice)", () => {
  assert.deepEqual(
    delestageDuJour(poids, directions, 12),
    delestageDuJour(poids, directions, 12)
  );
});

test("délestage : la consigne tourne d'un jour à l'autre", () => {
  assert.notEqual(
    delestageDuJour(poids, directions, 1).consigne,
    delestageDuJour(poids, directions, 2).consigne
  );
});

test("délestage : robuste sans directions", () => {
  const { items } = delestageDuJour(poids, [], 3);
  assert.equal(items.length, 5);
});
