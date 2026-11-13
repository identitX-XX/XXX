import { describe, expect, it } from "vitest";
import { NB_GASPI, OBJETS, PIECES, melangerScene, niveauGaspi } from "@/lib/jeux/gaspi";
import { formaterChrono, litresEconomises, niveauDouche, verdictDouche } from "@/lib/jeux/douche";
import { ENGAGEMENTS, journeeTenue, niveau19, verifierEngagements } from "@/lib/jeux/chauffage";
import { INGREDIENTS, QUIZ, RECETTES, niveauFrigo, recettesPour, scorerQuiz } from "@/lib/jeux/frigo";
import { classer, niveauImmeuble, objectifAtteint } from "@/lib/jeux/immeuble";
import { bornesMois, moisParis, moisPrecedent, serieMax } from "@/lib/temps";

describe("calendrier (suite)", () => {
  it("trouve la plus longue série", () => {
    expect(serieMax([])).toBe(0);
    expect(serieMax(["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-05", "2026-11-06"])).toBe(3);
    expect(serieMax(["2026-02-27", "2026-02-28", "2026-03-01"])).toBe(3);
  });
  it("gère les mois", () => {
    expect(moisParis(new Date("2026-11-30T23:30:00Z"))).toBe("2026-12");
    expect(moisPrecedent("2027-01")).toBe("2026-12");
    expect(moisPrecedent("2026-11")).toBe("2026-10");
    const b = bornesMois("2026-11");
    expect(b.debut < new Date("2026-11-01T00:00:00+01:00")).toBe(true);
    expect(b.fin > new Date("2026-11-30T23:59:00+01:00")).toBe(true);
  });
});

describe("Chasse au Gaspi", () => {
  it("a 10 gaspillages et des pièges dans chaque pièce", () => {
    expect(NB_GASPI).toBe(10);
    for (const p of PIECES) {
      expect(OBJETS.some((o) => o.piece === p.id && o.gaspi)).toBe(true);
      expect(OBJETS.some((o) => o.piece === p.id && !o.gaspi)).toBe(true);
    }
    expect(new Set(OBJETS.map((o) => o.id)).size).toBe(OBJETS.length);
  });
  it("mélange les objets sans en perdre, pièce par pièce", () => {
    const ordre = melangerScene();
    expect([...ordre].sort()).toEqual(OBJETS.map((o) => o.id).sort());
    const pieces = ordre.map((id) => OBJETS.find((o) => o.id === id)!.piece);
    expect(pieces).toEqual([...pieces].sort((a, b) => PIECES.findIndex((p) => p.id === a) - PIECES.findIndex((p) => p.id === b)));
  });
  it("attribue les médailles", () => {
    expect(niveauGaspi(5, 0, 30_000)).toBe(0);
    expect(niveauGaspi(6, 9, 150_000)).toBe(1);
    expect(niveauGaspi(10, 5, 50_000)).toBe(2);
    expect(niveauGaspi(10, 2, 59_000)).toBe(3);
    expect(niveauGaspi(10, 2, 70_000)).toBe(2);
    expect(niveauGaspi(10, 0, 200_000)).toBe(0);
  });
});

describe("Douche Chrono", () => {
  it("juge la durée", () => {
    expect(verdictDouche(30)).toBe("trop-court");
    expect(verdictDouche(4 * 60)).toBe("reussie");
    expect(verdictDouche(5 * 60)).toBe("reussie");
    expect(verdictDouche(5 * 60 + 1)).toBe("depassee");
    expect(verdictDouche(2 * 3600)).toBe("trop-long");
  });
  it("calcule l'eau économisée par rapport à 10 minutes", () => {
    expect(litresEconomises(5 * 60)).toBe(60);
    expect(litresEconomises(15 * 60)).toBe(0);
  });
  it("attribue les médailles", () => {
    expect(niveauDouche([])).toBe(0);
    expect(niveauDouche(["2026-11-01", "2026-11-01"])).toBe(1);
    expect(niveauDouche(["2026-11-01", "2026-11-04", "2026-11-09"])).toBe(2);
    const semaine = ["01", "02", "03", "04", "05", "06", "07"].map((d) => `2026-11-${d}`);
    expect(niveauDouche(semaine)).toBe(3);
    expect(niveauDouche(semaine.filter((d) => d !== "2026-11-04"))).toBe(2);
  });
  it("formate le chrono", () => {
    expect(formaterChrono(299)).toBe("4:59");
    expect(formaterChrono(5)).toBe("0:05");
  });
});

describe("Opération 19 °C", () => {
  it("demande au moins 3 engagements connus", () => {
    expect(verifierEngagements(["thermostat-19", "volets"])).toMatch(/au moins 3/);
    expect(verifierEngagements(["thermostat-19", "volets", "volets"])).toMatch(/au moins 3/);
    expect(verifierEngagements(["thermostat-19", "volets", "inconnu"])).toMatch(/inconnu/);
    expect(verifierEngagements(["thermostat-19", "volets", "pull"])).toBeNull();
    expect(new Set(ENGAGEMENTS.map((e) => e.emoji)).size).toBe(ENGAGEMENTS.length);
  });
  it("une journée est tenue avec au moins la moitié des engagements", () => {
    const choisis = ["thermostat-19", "volets", "pull", "aerer"];
    expect(journeeTenue(["thermostat-19", "volets"], choisis)).toBe(true);
    expect(journeeTenue(["thermostat-19"], choisis)).toBe(false);
    expect(journeeTenue(["thermostat-19", "nuit-17"], choisis)).toBe(false); // nuit-17 n'est pas choisi
    expect(journeeTenue(["thermostat-19"], [])).toBe(false);
  });
  it("attribue les médailles", () => {
    expect([0, 1, 6, 7, 20, 21].map(niveau19)).toEqual([0, 1, 1, 2, 2, 3]);
  });
});

describe("Zéro Gaspi Frigo", () => {
  it("les recettes n'utilisent que des ingrédients connus", () => {
    const ids = new Set<string>(INGREDIENTS.map((i) => i.id));
    for (const r of RECETTES) for (const i of r.ingredients) expect(ids.has(i)).toBe(true);
    // chaque ingrédient a au moins une recette
    for (const i of INGREDIENTS) expect(recettesPour([i.id]).length).toBeGreaterThan(0);
  });
  it("propose d'abord les recettes qui utilisent le plus d'ingrédients", () => {
    expect(recettesPour(["pain", "oeufs", "lait"])[0].id).toBe("pain-perdu");
    expect(recettesPour([])).toEqual([]);
  });
  it("corrige le quiz", () => {
    const parfait = Object.fromEntries(QUIZ.map((q) => [q.id, q.bonne]));
    expect(scorerQuiz(parfait)).toBe(QUIZ.length);
    expect(scorerQuiz({ ...parfait, dlc: 1 })).toBe(QUIZ.length - 1);
    expect(scorerQuiz({})).toBe(0);
  });
  it("attribue les médailles", () => {
    expect(niveauFrigo({ joursActions: 0, quizParfait: true })).toBe(0);
    expect(niveauFrigo({ joursActions: 1, quizParfait: false })).toBe(1);
    expect(niveauFrigo({ joursActions: 10, quizParfait: false })).toBe(1);
    expect(niveauFrigo({ joursActions: 1, quizParfait: true })).toBe(2);
    expect(niveauFrigo({ joursActions: 7, quizParfait: true })).toBe(3);
  });
});

describe("Le Défi Immeuble", () => {
  const res = (id: string, logements: number, gestes: number) => ({ residenceId: id, nom: id, logements, gestes });
  it("classe par gestes par logement", () => {
    const c = classer([res("grande", 100, 300), res("petite", 10, 50), res("moyenne", 30, 60)]);
    expect(c.map((r) => r.residenceId)).toEqual(["petite", "grande", "moyenne"]);
    expect(c[0].rang).toBe(1);
    expect(c[0].parLogement).toBe(5);
  });
  it("vérifie l'objectif collectif", () => {
    expect(objectifAtteint(res("a", 10, 50))).toBe(true);
    expect(objectifAtteint(res("a", 10, 49))).toBe(false);
    expect(objectifAtteint(res("a", 0, 0))).toBe(false);
  });
  it("attribue les médailles", () => {
    const base = { inscrit: true, mesGestes: 1, objectifAtteint: false, premiereMoisPrecedent: false, mesGestesMoisPrecedent: 0 };
    expect(niveauImmeuble({ ...base, inscrit: false })).toBe(0);
    expect(niveauImmeuble({ ...base, mesGestes: 0 })).toBe(0);
    expect(niveauImmeuble(base)).toBe(1);
    expect(niveauImmeuble({ ...base, objectifAtteint: true, mesGestes: 4 })).toBe(1);
    expect(niveauImmeuble({ ...base, objectifAtteint: true, mesGestes: 5 })).toBe(2);
    expect(niveauImmeuble({ ...base, premiereMoisPrecedent: true, mesGestesMoisPrecedent: 5 })).toBe(3);
    expect(niveauImmeuble({ ...base, premiereMoisPrecedent: true, mesGestesMoisPrecedent: 2 })).toBe(1);
  });
});
