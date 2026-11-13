import { describe, expect, it } from "vitest";
import { CATALOGUE, choisirGagnant, genererCodeRetrait, verifierCommande, verifierParticipation } from "@/lib/cadeaux";

const mug = { type: "boutique" as const, actif: true, prix: 300, stock: 10, solde: 500, dejaCommande: false, tailles: null, taille: null };

describe("catalogue", () => {
  it("contient le mug, le jeu de cartes, le tee-shirt et le séjour", () => {
    expect(CATALOGUE.map((c) => c.id)).toEqual(["mug", "jeu-de-cartes", "tee-shirt", "sejour"]);
    expect(CATALOGUE.find((c) => c.id === "sejour")?.type).toBe("grand-prix");
    expect(CATALOGUE.find((c) => c.id === "tee-shirt")?.tailles).toContain("M");
  });
  it("génère des codes de retrait lisibles", () => {
    for (let i = 0; i < 100; i++) expect(genererCodeRetrait()).toMatch(/^GC-[A-HJ-NP-Z2-9]{6}$/);
  });
});

describe("commander", () => {
  it("accepte une commande possible", () => {
    expect(verifierCommande(mug)).toBeNull();
    expect(verifierCommande({ ...mug, solde: 300 })).toBeNull();
  });
  it("refuse si points insuffisants, déjà commandé, épuisé ou grand prix", () => {
    expect(verifierCommande({ ...mug, solde: 250 })).toMatch(/manque 50 GreenPoints/);
    expect(verifierCommande({ ...mug, dejaCommande: true })).toMatch(/un exemplaire par foyer/);
    expect(verifierCommande({ ...mug, stock: 0 })).toMatch(/épuisé/);
    expect(verifierCommande({ ...mug, type: "grand-prix", prix: null })).toMatch(/ne s'échange pas/);
    expect(verifierCommande({ ...mug, actif: false })).toMatch(/ne s'échange pas/);
  });
  it("exige une taille valide pour le tee-shirt", () => {
    const tee = { ...mug, prix: 700, solde: 800, tailles: ["S", "M", "L"] };
    expect(verifierCommande({ ...tee, taille: null })).toMatch(/taille/);
    expect(verifierCommande({ ...tee, taille: "XXXL" })).toMatch(/taille/);
    expect(verifierCommande({ ...tee, taille: "M" })).toBeNull();
  });
});

describe("grand tirage", () => {
  const cloture = new Date("2027-04-30T18:00:00+02:00");
  it("réserve l'inscription aux cartes Gold, avant la clôture", () => {
    expect(verifierParticipation({ gold: true, cloture, maintenant: new Date("2026-12-01"), effectue: false })).toBeNull();
    expect(verifierParticipation({ gold: false, cloture, maintenant: new Date("2026-12-01"), effectue: false })).toMatch(/Gold/);
    expect(verifierParticipation({ gold: true, cloture, maintenant: new Date("2027-05-01"), effectue: false })).toMatch(/closes/);
    expect(verifierParticipation({ gold: true, cloture, maintenant: new Date("2026-12-01"), effectue: true })).toMatch(/closes/);
  });
  it("tire au sort avec la même chance pour chacun", () => {
    expect(choisirGagnant([], Math.random)).toBeNull();
    expect(choisirGagnant(["a", "b", "c", "d"], () => 0)).toBe("a");
    expect(choisirGagnant(["a", "b", "c", "d"], () => 0.999999)).toBe("d");
    const comptes: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
    for (let i = 0; i < 4000; i++) comptes[choisirGagnant(["a", "b", "c", "d"], Math.random)!]++;
    for (const n of Object.values(comptes)) expect(n).toBeGreaterThan(850);
  });
});
