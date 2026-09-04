import { test } from "node:test";
import assert from "node:assert/strict";
import { exercicesDuJour } from "./exercices";
import { archetypeByKey } from "./archetypes";

const arch = archetypeByKey["multiple"];
const objectifs = { perso: "mon énergie", pro: "mon élan", relationnel: "mes liens", love: "plus de tendresse" };

test("exercicesDuJour : un exercice par pilier (4 piliers)", () => {
  const ex = exercicesDuJour(arch, objectifs, 1);
  assert.equal(ex.length, 4);
  assert.deepEqual(
    ex.map((e) => e.perimetre),
    ["relationnel", "love", "pro", "perso"]
  );
});

test("exercicesDuJour : la graine renouvelle vraiment (deux graines proches diffèrent)", () => {
  // C'est le cœur du bouton « Un autre angle » : seed = jour + variante.
  for (let jour = 1; jour <= 12; jour++) {
    const a = exercicesDuJour(arch, objectifs, jour);
    const b = exercicesDuJour(arch, objectifs, jour + 1);
    for (let i = 0; i < 3; i++) {
      assert.notEqual(
        a[i].consigne,
        b[i].consigne,
        `graine ${jour} vs ${jour + 1}, périmètre ${a[i].perimetre} : identiques`
      );
    }
  }
});

test("exercicesDuJour : au moins 12 angles distincts par périmètre", () => {
  const persos = new Set<string>();
  for (let s = 1; s <= 12; s++) persos.add(exercicesDuJour(arch, objectifs, s)[0].consigne);
  assert.ok(persos.size >= 12, `seulement ${persos.size} angles perso distincts`);
});
