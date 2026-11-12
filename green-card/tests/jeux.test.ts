import { describe, expect, it } from "vitest";
import { bilanCompteur, economieMensuelle, niveauCompteur, verifierReleve } from "@/lib/jeux/compteur";
import { BACS, DECHETS, NB_DECHETS_PARTIE, niveauTri, scorer, tirerDechets } from "@/lib/jeux/tri";
import { niveauAstuces, verifierAstuce } from "@/lib/jeux/astuces";
import { DEFIS, pointsPourNiveau } from "@/lib/defis";

const J = 86_400_000;
const t0 = new Date("2026-01-01T10:00:00Z");
const jour = (n: number) => new Date(t0.getTime() + n * J);

describe("Compteur Malin", () => {
  it("refuse un index qui baisse, un doublon du jour et une conso invraisemblable", () => {
    const prec = { index: 1000, date: jour(0) };
    expect(verifierReleve("elec", 900, prec, jour(7))).toMatch(/ne peut pas baisser/);
    expect(verifierReleve("elec", 1001, prec, new Date(t0.getTime() + 3_600_000))).toMatch(/déjà relevé/);
    expect(verifierReleve("eau", 1100, prec, jour(1))).toMatch(/très élevée/);
    expect(verifierReleve("elec", -5, null, jour(0))).toMatch(/pas valide/);
    expect(verifierReleve("elec", 1056, prec, jour(7))).toBeNull();
    expect(verifierReleve("elec", 50, null, jour(0))).toBeNull();
  });

  it("compare la dernière période à la période de référence", () => {
    const b = bilanCompteur([
      { index: 1000, date: jour(0) },
      { index: 1003, date: jour(2) }, // ignoré : moins de 6 jours après le relevé précédent retenu
      { index: 1070, date: jour(7) }, // référence : 10 / jour
      { index: 1133, date: jour(14) }, // actuelle : 9 / jour
    ]);
    expect(b.reference).toBeCloseTo(10);
    expect(b.actuelle).toBeCloseTo(9);
    expect(b.variation).toBeCloseTo(-0.1);
    const eco = economieMensuelle("elec", b)!;
    expect(eco.unites).toBeCloseTo(30);
    expect(eco.euros).toBeCloseTo(7.5);
  });

  it("donne bronze, argent puis or", () => {
    expect(niveauCompteur({})).toBe(0);
    expect(niveauCompteur({ elec: [{ index: 1000, date: jour(0) }] })).toBe(1);
    const deux = [{ index: 1000, date: jour(0) }, { index: 1070, date: jour(7) }];
    expect(niveauCompteur({ elec: deux })).toBe(2);
    // −5 % pile : or
    expect(niveauCompteur({ elec: [...deux, { index: 1070 + 66.5, date: jour(14) }] })).toBe(3);
    // −2 % : reste argent
    expect(niveauCompteur({ elec: [...deux, { index: 1070 + 68.6, date: jour(14) }] })).toBe(2);
    // la meilleure médaille des trois compteurs compte
    expect(niveauCompteur({ elec: [{ index: 1, date: jour(0) }], eau: deux })).toBe(2);
  });
});

describe("Tri Master", () => {
  it("a des déchets pour chaque bac et des identifiants uniques", () => {
    expect(new Set(DECHETS.map((d) => d.id)).size).toBe(DECHETS.length);
    for (const b of BACS) expect(DECHETS.some((d) => d.bac === b.id)).toBe(true);
  });

  it("tire 12 déchets distincts", () => {
    const ids = tirerDechets();
    expect(ids).toHaveLength(NB_DECHETS_PARTIE);
    expect(new Set(ids).size).toBe(NB_DECHETS_PARTIE);
  });

  it("compte uniquement les bonnes réponses", () => {
    expect(scorer(["bocal", "pile", "masque"], { bocal: "verre", pile: "jaune" })).toBe(1);
  });

  it("attribue les médailles", () => {
    expect(niveauTri(7, 12, 50_000)).toBe(0);
    expect(niveauTri(8, 12, 50_000)).toBe(1);
    expect(niveauTri(11, 12, 30_000)).toBe(2);
    expect(niveauTri(12, 12, 59_000)).toBe(3);
    expect(niveauTri(12, 12, 61_000)).toBe(2);
    expect(niveauTri(12, 12, 125_000)).toBe(0); // hors délai
  });
});

describe("Boîte à Astuces", () => {
  it("filtre liens, coordonnées et insultes", () => {
    expect(verifierAstuce("Titre ok", "Un texte assez long pour passer le filtre.").erreur).toBeUndefined();
    expect(verifierAstuce("Abc", "Un texte assez long pour passer le filtre.").erreur).toMatch(/titre/);
    expect(verifierAstuce("Titre ok", "Trop court").erreur).toMatch(/entre 20 et 500/);
    expect(verifierAstuce("Titre ok", "Allez voir sur www.exemple.fr c'est top").erreur).toMatch(/liens/);
    expect(verifierAstuce("Titre ok", "Appelez-moi au 06 12 34 56 78 pour en parler").erreur).toMatch(/téléphone/);
    expect(verifierAstuce("Titre ok", "Écrivez à jean.dupont@mail.com pour en parler").erreur).toMatch(/e-mail/);
    expect(verifierAstuce("Titre ok", "Mon voisin est un connard qui gaspille").erreur).toMatch(/courtois/);
  });

  it("nettoie les espaces", () => {
    const r = verifierAstuce("  Mon   titre  ", "Un texte   assez long pour passer.\n\n\n\nFin.");
    expect(r.titre).toBe("Mon titre");
    expect(r.texte).toBe("Un texte assez long pour passer.\n\nFin.");
  });

  it("attribue les médailles", () => {
    expect(niveauAstuces({ publiees: 0, votesDonnes: 10, meilleurScore: 0 })).toBe(0);
    expect(niveauAstuces({ publiees: 1, votesDonnes: 4, meilleurScore: 4 })).toBe(1);
    expect(niveauAstuces({ publiees: 1, votesDonnes: 5, meilleurScore: 0 })).toBe(2);
    expect(niveauAstuces({ publiees: 1, votesDonnes: 0, meilleurScore: 5 })).toBe(3);
  });
});

describe("points", () => {
  it("les médailles rapportent des points croissants", () => {
    for (const d of DEFIS) {
      expect(pointsPourNiveau(d, 1)).toBeLessThan(pointsPourNiveau(d, 2));
      expect(pointsPourNiveau(d, 2)).toBeLessThan(pointsPourNiveau(d, 3));
      expect(pointsPourNiveau(d, 0)).toBe(0);
    }
  });
});
