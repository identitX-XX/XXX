import { describe, expect, it } from "vitest";
import { normaliserUG, ugValide } from "@/lib/ug";
import {
  codeCorrespond,
  genererCodeActivation,
  hacherCode,
  hacherPin,
  normaliserCode,
  pinCorrespond,
  pinValide,
  signer,
  verifierSignature,
} from "@/lib/securite";
import { defiDebloque, estGold, formaterPoints, niveauCarte, progressionNiveau } from "@/lib/carte";
import { DEFIS } from "@/lib/defis";

describe("n° d'UG", () => {
  it("normalise la saisie", () => {
    expect(normaliserUG(" til a 101 ")).toBe("TIL-A-101");
    expect(normaliserUG("til_a/101")).toBe("TIL-A-101");
    expect(normaliserUG("--Tîl--a--101--")).toBe("TIL-A-101");
  });
  it("valide le format", () => {
    expect(ugValide("TIL-A-101")).toBe(true);
    expect(ugValide("12")).toBe(false);
    expect(ugValide("")).toBe(false);
  });
});

describe("codes d'activation", () => {
  it("génère XXXX-XXXX sans caractère ambigu", () => {
    for (let i = 0; i < 200; i++) {
      const code = genererCodeActivation();
      expect(code).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
      expect(code).not.toMatch(/[01OIL]/);
    }
  });
  it("tolère la casse et les espaces à la saisie", () => {
    const h = hacherCode("ABCD-EF23");
    expect(normaliserCode("abcd ef23")).toBe("ABCD-EF23");
    expect(codeCorrespond("abcdef23", h)).toBe(true);
    expect(codeCorrespond("ABCD-EF24", h)).toBe(false);
  });
});

describe("PIN", () => {
  it("refuse les PIN trop simples", () => {
    expect(pinValide("246810")).toBe(true);
    expect(pinValide("111111")).toBe(false);
    expect(pinValide("123456")).toBe(false);
    expect(pinValide("12345")).toBe(false);
    expect(pinValide("12a456")).toBe(false);
  });
  it("hache avec sel et vérifie", () => {
    const a = hacherPin("246810");
    expect(a).not.toBe(hacherPin("246810"));
    expect(pinCorrespond("246810", a)).toBe(true);
    expect(pinCorrespond("246811", a)).toBe(false);
    expect(pinCorrespond("246810", "n'importe quoi")).toBe(false);
  });
});

describe("jetons signés", () => {
  it("vérifie la signature et l'expiration", () => {
    const j = signer({ logementId: "x" }, 60);
    expect(verifierSignature<{ logementId: string }>(j)?.logementId).toBe("x");
    expect(verifierSignature(j.slice(0, -2) + "zz")).toBeNull();
    expect(verifierSignature(signer({ a: 1 }, -1))).toBeNull();
    expect(verifierSignature(undefined)).toBeNull();
  });
});

describe("règles de la carte", () => {
  it("calcule le niveau", () => {
    expect(niveauCarte(0).nom).toBe("Graine");
    expect(niveauCarte(300).nom).toBe("Pousse");
    expect(niveauCarte(2500).nom).toBe("Forêt");
  });
  it("calcule la progression vers le niveau suivant", () => {
    const p = progressionNiveau(650);
    expect(p.suivant?.nom).toBe("Arbre");
    expect(p.reste).toBe(350);
    expect(p.ratio).toBeCloseTo(0.5);
    expect(progressionNiveau(9999)).toEqual({ suivant: null, ratio: 1, reste: 0 });
  });
  it("débloque les défis progressivement", () => {
    expect(defiDebloque(3, 0)).toBe(true);
    expect(defiDebloque(4, 0)).toBe(false);
    expect(defiDebloque(10, 7)).toBe(true);
  });
  it("passe Gold avec les 10 cases", () => {
    expect(estGold(Array(10).fill(1))).toBe(true);
    expect(estGold([...Array(9).fill(3), 0])).toBe(false);
  });
  it("formate les points à la française", () => {
    expect(formaterPoints(1240)).toBe("1 240");
  });
  it("a 10 défis ordonnés de 1 à 10", () => {
    expect(DEFIS.map((d) => d.ordre)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(new Set(DEFIS.map((d) => d.id)).size).toBe(10);
  });
});
