import { test } from "node:test";
import assert from "node:assert/strict";
import { initialiser, clotureJour } from "./evolution";
import { archetypeDominant } from "./indicateurs";
import { detecterChapitres, derniereBascule } from "./bascules";
import { ARCHETYPE_KEYS, SPHERE_KEYS, EMOTION_KEYS } from "./archetypes";
import type { ArchetypeKey, Diagnostic, EtatEvolution, ReponseJour, SphereKey } from "./types";

const DOM = ARCHETYPE_KEYS[0] as ArchetypeKey;
const VERS = ARCHETYPE_KEYS[7] as ArchetypeKey; // une autre signature, bien distincte
const diag = { dominant: DOM, secondaire: ARCHETYPE_KEYS[1] } as Diagnostic;

function vivre(etat: EtatEvolution, n: number, arch: ArchetypeKey, sphere: SphereKey): EtatEvolution {
  const r: ReponseJour = {
    jour: n,
    archetype: arch,
    sphereFocus: sphere,
    curseurs: Object.fromEntries(
      SPHERE_KEYS.map((k) => [k, k === sphere ? 100 : 55])
    ) as ReponseJour["curseurs"],
    emotions: [EMOTION_KEYS[0]],
    intensiteDefi: 90,
    note: "",
    date: new Date(2026, 0, n).toISOString(),
  };
  return clotureJour(etat, r);
}

// Le portrait / la signature du moment doivent SUIVRE ce que la personne vit :
// si elle bascule durablement vers une autre signature, ça doit se voir.
test("signature du moment : évolue vers ce que la personne vit réellement", () => {
  let etat = initialiser(diag);

  // Départ : quelques jours ancrés sur la signature dominante.
  for (let n = 1; n <= 3; n++) etat = vivre(etat, n, DOM, SPHERE_KEYS[0]);
  const debut = archetypeDominant(etat);
  assert.ok(debut, "une signature du moment existe");

  // Puis une bascule durable vers une autre signature.
  for (let n = 4; n <= 16; n++) etat = vivre(etat, n, VERS, SPHERE_KEYS[1]);
  const apres = archetypeDominant(etat);
  assert.ok(apres, "la signature du moment existe toujours");

  assert.notEqual(
    apres!.key,
    debut!.key,
    "la signature du moment a suivi la bascule vécue"
  );
  assert.equal(apres!.key, VERS, "elle pointe vers la signature réellement vécue");
});

// Le rapport « Ce qui évolue : De X à Y » repose sur la détection de mue.
test("mue : le chemin fait apparaître des chapitres et une bascule De X à Y", () => {
  let etat = initialiser(diag);
  for (let n = 1; n <= 4; n++) etat = vivre(etat, n, DOM, SPHERE_KEYS[0]);
  for (let n = 5; n <= 18; n++) etat = vivre(etat, n, VERS, SPHERE_KEYS[1]);

  const chapitres = detecterChapitres(etat.historique);
  assert.ok(chapitres.length >= 2, "au moins deux chapitres (un avant, un après la mue)");

  const bascule = derniereBascule(chapitres);
  assert.ok(bascule, "une mue est détectée");
  assert.notEqual(bascule!.depuis, bascule!.vers, "la mue va d'une signature à une autre");
});
