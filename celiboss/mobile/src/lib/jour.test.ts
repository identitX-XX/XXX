/// <reference types="node" />
import assert from "node:assert/strict";
import { test } from "node:test";
import { aujourdhui, fenetreNuit, formatSommeil } from "./jour";

test("le jour suit l'heure de Paris", () => {
  // 23 h 30 UTC le 30 juin = 1 h 30 le 1er juillet à Paris.
  assert.equal(aujourdhui(new Date("2026-06-30T23:30:00Z")), "2026-07-01");
});

test("la fenêtre va de la veille 18 h à 14 h, ou à maintenant si plus tôt", () => {
  const matin = new Date(2026, 8, 30, 7, 15);
  const { debut, fin } = fenetreNuit(matin);
  assert.deepEqual([debut.getDate(), debut.getHours()], [29, 18]);
  assert.equal(fin.getTime(), matin.getTime());
  const soir = fenetreNuit(new Date(2026, 8, 30, 21, 0));
  assert.deepEqual([soir.fin.getDate(), soir.fin.getHours()], [30, 14]);
});

test("format du sommeil", () => {
  assert.equal(formatSommeil(432), "7 h 12");
  assert.equal(formatSommeil(null), "—");
});
