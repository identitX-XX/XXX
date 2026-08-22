import { test } from "node:test";
import assert from "node:assert/strict";
import { initialiser, clotureJour, moyenneMatrice, radarDepuisMatrice } from "./evolution";
import { generateParcours } from "./generateParcours";
import { progression } from "./indicateurs";
import { ARCHETYPE_KEYS, SPHERE_KEYS, EMOTION_KEYS } from "./archetypes";
import type { Diagnostic, EtatEvolution, ReponseJour } from "./types";

const diag: Diagnostic = {
  dominant: ARCHETYPE_KEYS[0],
  secondaire: ARCHETYPE_KEYS[1],
} as Diagnostic;

const curseursBase = Object.fromEntries(SPHERE_KEYS.map((k) => [k, 55])) as ReponseJour["curseurs"];

function vivreJour(etat: EtatEvolution, n: number, parcours: ReturnType<typeof generateParcours>): EtatEvolution {
  const jour = parcours.jours.find((j) => j.n === n)!;
  const r: ReponseJour = {
    jour: n,
    archetype: jour.archetype,
    sphereFocus: jour.sphereFocus,
    curseurs: { ...curseursBase, [jour.sphereFocus]: 85 },
    emotions: [EMOTION_KEYS[n % EMOTION_KEYS.length]],
    intensiteDefi: 70,
    note: "",
    date: new Date(2026, 0, n).toISOString(),
  };
  return clotureJour(etat, r);
}

// LE CŒUR DU PRODUIT : d'un jour à l'autre, le jour avance, la progression monte,
// et l'état (matrice / radar) évolue réellement.
test("progression : le jour courant avance à chaque journée vécue", () => {
  const parcours = generateParcours(diag);
  let etat = initialiser(diag);
  assert.equal(etat.jourCourant, 1);
  for (let n = 1; n <= 10; n++) {
    etat = vivreJour(etat, n, parcours);
    assert.equal(etat.jourCourant, n + 1, `après le jour ${n}, on vise le jour ${n + 1}`);
    assert.equal(progression(etat).faits, n, `${n} journées vécues`);
  }
});

test("progression : le pourcentage d'avancement croît strictement", () => {
  const parcours = generateParcours(diag);
  let etat = initialiser(diag);
  let partPrec = -1;
  for (let n = 1; n <= 10; n++) {
    etat = vivreJour(etat, n, parcours);
    const part = progression(etat).part;
    assert.ok(part > partPrec, `jour ${n} : ${part}% > ${partPrec}%`);
    partPrec = part;
  }
});

test("évolution : la matrice / le radar changent au fil des jours (rien n'est figé)", () => {
  const parcours = generateParcours(diag);
  let etat = initialiser(diag);
  const moyennes: number[] = [moyenneMatrice(etat.matrice)];
  const radars: string[] = [JSON.stringify(radarDepuisMatrice(etat.matrice))];
  for (let n = 1; n <= 10; n++) {
    etat = vivreJour(etat, n, parcours);
    moyennes.push(moyenneMatrice(etat.matrice));
    radars.push(JSON.stringify(radarDepuisMatrice(etat.matrice)));
  }
  assert.ok(new Set(moyennes).size > 1, "la moyenne de la matrice doit bouger");
  assert.ok(new Set(radars).size > 1, "le radar doit évoluer d'un jour à l'autre");
  assert.equal(etat.historique.length, 10, "chaque jour laisse une trace dans l'historique");
});

test("contenu : les capsules diffèrent d'un jour à l'autre (le parcours n'est pas identique chaque jour)", () => {
  const parcours = generateParcours(diag);
  const dixPremiers = parcours.jours.slice(0, 10);
  assert.equal(parcours.jours.length, 30);
  assert.ok(
    new Set(dixPremiers.map((j) => j.archetype)).size > 1,
    "les archétypes de capsule varient sur les 10 premiers jours"
  );
  assert.ok(
    new Set(dixPremiers.map((j) => j.titre)).size > 1,
    "les titres de capsule varient"
  );
  // J1 part du dominant, la fin tend vers la métamorphose.
  assert.equal(parcours.jours[0].archetype, diag.dominant);
});
