import { test } from "node:test";
import assert from "node:assert/strict";
import { premiereLecture } from "./premiereLecture";
import { Diagnostic, Objectifs } from "./types";

const OBJ: Objectifs = { perso: "Prendre soin de mon énergie", pro: "", relationnel: "", love: "" };

test("cite des comptes réels quand le tally est présent", () => {
  const diag: Diagnostic = {
    dominant: "creatrice",
    secondaire: "sage",
    tally: { creatrice: 5, sage: 3, visionnaire: 2, rebelle: 2 },
  };
  const pl = premiereLecture(diag, OBJ);
  assert.match(pl.points[0], /5 fois/);
  assert.match(pl.points[0], /3 fois/);
});

test("profil net quand peu d'archétypes distincts", () => {
  const diag: Diagnostic = {
    dominant: "creatrice",
    secondaire: "sage",
    tally: { creatrice: 6, sage: 4, visionnaire: 2 }, // 3 distincts
  };
  assert.match(premiereLecture(diag, null).corps, /net/);
});

test("profil réparti quand beaucoup d'archétypes distincts", () => {
  const tally: Diagnostic["tally"] = {};
  ["creatrice", "sage", "visionnaire", "rebelle", "amante", "libre", "artiste", "passeuse"].forEach(
    (a) => ((tally as Record<string, number>)[a] = 1)
  );
  const diag: Diagnostic = { dominant: "creatrice", secondaire: "sage", tally };
  assert.match(premiereLecture(diag, null).corps, /facettes/);
});

test("cite le cap de l'utilisatrice (ses mots)", () => {
  const diag: Diagnostic = { dominant: "creatrice", secondaire: "sage", tally: { creatrice: 5, sage: 3 } };
  const pl = premiereLecture(diag, OBJ);
  assert.ok(pl.points.some((p) => p.includes("Prendre soin de mon énergie")));
});

test("robuste sans tally (ancien diagnostic) et sans cap", () => {
  const diag: Diagnostic = { dominant: "creatrice", secondaire: "sage" };
  const pl = premiereLecture(diag, null);
  assert.ok(pl.titre.length > 0);
  assert.ok(pl.points.length >= 1); // au moins le couplage
  assert.ok(!pl.points.some((p) => /fois vers/.test(p))); // pas de comptes inventés
});
