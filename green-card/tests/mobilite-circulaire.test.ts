import { describe, expect, it } from "vitest";
import { co2Evite, euroEconomise, niveauTrajets, verifierTrajet, MODES } from "@/lib/jeux/trajets";
import { co2Action, economie, lirePrix, niveauSecondeVie, verifierAnnonce } from "@/lib/jeux/circulaire";
import { problemeContenu } from "@/lib/jeux/moderation";
import { jourParis, serieEnCours, veille } from "@/lib/temps";

describe("calendrier", () => {
  it("donne le jour à l'heure de Paris", () => {
    // 23 h 30 UTC le 31 décembre = déjà le 1er janvier à Paris
    expect(jourParis(new Date("2026-12-31T23:30:00Z"))).toBe("2027-01-01");
    expect(jourParis(new Date("2026-07-14T10:00:00Z"))).toBe("2026-07-14");
  });
  it("calcule la veille, y compris en changeant de mois et d'année", () => {
    expect(veille("2026-03-01")).toBe("2026-02-28");
    expect(veille("2027-01-01")).toBe("2026-12-31");
  });
  it("compte la série de jours consécutifs", () => {
    expect(serieEnCours(["2026-11-13", "2026-11-12", "2026-11-11", "2026-11-09"], "2026-11-13")).toBe(3);
    // la série tient encore si le dernier trajet date d'hier
    expect(serieEnCours(["2026-11-12", "2026-11-11"], "2026-11-13")).toBe(2);
    expect(serieEnCours(["2026-11-10"], "2026-11-13")).toBe(0);
  });
});

describe("Mes Trajets Verts", () => {
  it("vérifie la distance et le nombre de trajets", () => {
    expect(verifierTrajet("velo", 4.5, 0)).toBeNull();
    expect(verifierTrajet("velo", 0, 0)).toMatch(/distance/);
    expect(verifierTrajet("velo", Number.NaN, 0)).toMatch(/distance/);
    expect(verifierTrajet("marche", 0.1, 0)).toMatch(/200 mètres/);
    expect(verifierTrajet("marche", 80, 0)).toMatch(/30 km maximum/);
    expect(verifierTrajet("train", 450, 0)).toBeNull();
    expect(verifierTrajet("velo", 3, 8)).toMatch(/8 trajets maximum/);
  });

  it("calcule le CO₂ évité par rapport à la voiture seule", () => {
    expect(co2Evite("velo", 10)).toBeCloseTo(2.2);
    expect(co2Evite("transports", 10)).toBeCloseTo(1.6);
    expect(co2Evite("covoiturage", 10)).toBeCloseTo(1.1);
    for (const m of MODES) expect(co2Evite(m.id, 5)).toBeGreaterThanOrEqual(0);
  });

  it("calcule le carburant économisé (moitié en covoiturage)", () => {
    expect(euroEconomise("velo", 10)).toBeCloseTo(1.5);
    expect(euroEconomise("covoiturage", 10)).toBeCloseTo(0.75);
  });

  it("récompense la régularité", () => {
    expect(niveauTrajets(0)).toBe(0);
    expect(niveauTrajets(1)).toBe(1);
    expect(niveauTrajets(4)).toBe(1);
    expect(niveauTrajets(5)).toBe(2);
    expect(niveauTrajets(15)).toBe(3);
  });
});

describe("Seconde Vie", () => {
  it("compte le CO₂ évité, à moitié pour un don ou une revente", () => {
    expect(co2Action("occasion", "meubles")).toBe(50);
    expect(co2Action("reparation", "electromenager")).toBe(100);
    expect(co2Action("echange", "vetements")).toBe(10);
    expect(co2Action("don", "meubles")).toBe(25);
    expect(co2Action("revente", "electronique")).toBe(20);
  });

  it("lit les prix en euros", () => {
    expect(lirePrix("12,50 €")).toBe(12.5);
    expect(lirePrix(" 8 ")).toBe(8);
    expect(lirePrix("")).toBeNull();
    expect(lirePrix("douze")).toBeNaN();
    expect(lirePrix("-3")).toBeNaN();
    expect(economie(8, 35)).toBe(27);
    expect(economie(40, 35)).toBe(0);
    expect(economie(null, 35)).toBe(0);
  });

  it("vérifie les annonces", () => {
    expect(verifierAnnonce("Poussette", "").erreur).toBeUndefined();
    expect(verifierAnnonce("Po", "").erreur).toMatch(/titre/);
    expect(verifierAnnonce("Poussette", "Appelez le 0612345678").erreur).toMatch(/téléphone/);
    expect(verifierAnnonce("Poussette", "x".repeat(301)).erreur).toMatch(/300/);
  });

  it("donne l'or seulement pour un échange confirmé entre voisins", () => {
    expect(niveauSecondeVie({ actions: 0, echangesVoisins: 0 })).toBe(0);
    expect(niveauSecondeVie({ actions: 1, echangesVoisins: 0 })).toBe(1);
    expect(niveauSecondeVie({ actions: 5, echangesVoisins: 0 })).toBe(2);
    expect(niveauSecondeVie({ actions: 50, echangesVoisins: 0 })).toBe(2);
    expect(niveauSecondeVie({ actions: 1, echangesVoisins: 1 })).toBe(3);
  });
});

describe("modération partagée", () => {
  it("laisse passer un texte normal", () => {
    expect(problemeContenu("Je donne une poussette, Bât. A, 2e étage")).toBeUndefined();
  });
});
