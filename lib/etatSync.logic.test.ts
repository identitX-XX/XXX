import { test } from "node:test";
import assert from "node:assert/strict";
import { advancement, serveurPlusAvance, normaliserEmail } from "./etatSync.logic";

test("normaliserEmail : casse et espaces ne créent pas deux comptes", () => {
  assert.equal(normaliserEmail("  Marina@Gmail.COM "), "marina@gmail.com");
  assert.equal(normaliserEmail("marina@gmail.com"), "marina@gmail.com");
  assert.equal(
    normaliserEmail("Test@Icloud.com"),
    normaliserEmail("  test@icloud.com  ")
  );
  assert.equal(normaliserEmail(""), "");
});

// Fabrique un blob d'état persisté (forme zustand : { state, version }).
const blob = (opts: { diag?: boolean; jour?: number; vecus?: number }) => ({
  state: {
    diagnostic: opts.diag ? { dominant: "exploratrice", secondaire: "sage" } : null,
    etat: {
      jourCourant: opts.jour ?? 1,
      historique: Array.from({ length: opts.vecus ?? 0 }, (_, i) => ({ jour: i + 1 })),
    },
  },
  version: 2,
});

test("advancement : robuste au bruit (null / garbage → 0)", () => {
  assert.equal(advancement(null), 0);
  assert.equal(advancement(undefined), 0);
  assert.equal(advancement("pas un objet"), 0);
  assert.equal(advancement({}), 0);
});

test("advancement : le diagnostic pèse plus que n'importe quel nombre de jours", () => {
  const avecDiagJour1 = advancement(blob({ diag: true, jour: 1, vecus: 0 }));
  const sansDiagJour30 = advancement(blob({ diag: false, jour: 30, vecus: 30 }));
  assert.ok(avecDiagJour1 > sansDiagJour30, "un état avec signature doit dominer un état sans");
});

// LE BUG DE MARINA : local a le diagnostic, une sauvegarde serveur antérieure
// (sans diagnostic) ne doit JAMAIS l'écraser → sinon « refaire tout le parcours ».
test("serveurPlusAvance : un serveur SANS diagnostic ne remplace pas un local AVEC", () => {
  const local = blob({ diag: true, jour: 1, vecus: 0 });
  const server = blob({ diag: false, jour: 5, vecus: 5 }); // + de jours mais pas de signature
  assert.equal(serveurPlusAvance(server, local), false);
});

// L'autre moitié du bug : à égalité stricte, on garde le local (pas de churn).
test("serveurPlusAvance : à égalité, on garde le local", () => {
  const local = blob({ diag: true, jour: 1, vecus: 0 });
  const server = blob({ diag: true, jour: 1, vecus: 0 });
  assert.equal(serveurPlusAvance(server, local), false);
});

test("serveurPlusAvance : reprise légitime — serveur réellement plus avancé restaure", () => {
  const local = blob({ diag: true, jour: 3, vecus: 2 });
  const server = blob({ diag: true, jour: 8, vecus: 7 });
  assert.equal(serveurPlusAvance(server, local), true);
});

test("serveurPlusAvance : nouvel appareil vide — le serveur (avec progression) restaure", () => {
  const local = null; // rien en local
  const server = blob({ diag: true, jour: 6, vecus: 5 });
  assert.equal(serveurPlusAvance(server, local), true);
});

test("serveurPlusAvance : ni l'un ni l'autre n'a de diagnostic — pas de restauration à égalité", () => {
  assert.equal(serveurPlusAvance(blob({ diag: false }), blob({ diag: false })), false);
});
