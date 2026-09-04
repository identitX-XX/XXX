import { test } from "node:test";
import assert from "node:assert/strict";
import { contientCorvee } from "@/app/api/exercices/route";

test("contientCorvee : détecte la dérive vers la corvée domestique", () => {
  assert.equal(contientCorvee("Prépare le dîner en famille ce soir."), true);
  assert.equal(contientCorvee("Fais les courses au supermarché."), true);
  assert.equal(contientCorvee("Range le placard de la cuisine."), true);
  assert.equal(contientCorvee("Passe l'aspirateur dans le salon."), true);
  assert.equal(contientCorvee("Fais la vaisselle et la lessive."), true);
});

test("contientCorvee : insensible aux accents et à la casse", () => {
  assert.equal(contientCorvee("CUISINER un bon plat"), true);
  assert.equal(contientCorvee("Nettoyer la voiture au garage"), true);
});

test("contientCorvee : laisse passer les vrais exercices d'identité", () => {
  assert.equal(contientCorvee("Ose dire une chose vraie que tu tais d'habitude."), false);
  assert.equal(contientCorvee("Pose une petite limite avec douceur aujourd'hui."), false);
  assert.equal(contientCorvee("Remarque un automatisme et ajuste ta posture."), false);
});
