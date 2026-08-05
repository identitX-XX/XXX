"use client";

// Exercices « GAP » — l'écart entre ce que tu CROIS, ce que tu PENSES et ce que
// tu FAIS, sur chaque périmètre (perso · pro · relationnel). C'est de la
// matière que l'IA analyse chaque jour pour un éclairage relié à la signature.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Perimetre } from "./perimetres";
import { PERIMETRE_KEYS } from "./perimetres";

export type { Perimetre } from "./perimetres";

export interface GapTriplet {
  crois: string;
  pense: string;
  fais: string;
}

export type GapJour = Record<Perimetre, GapTriplet>;

export interface Eclairage {
  eclairage: string;
  tensions: { perimetre: Perimetre; note: string }[];
  projection: string;
  _mock?: boolean;
}

const tripletVide = (): GapTriplet => ({ crois: "", pense: "", fais: "" });
export const gapJourVide = (): GapJour => ({
  perso: tripletVide(),
  pro: tripletVide(),
  relationnel: tripletVide(),
});

interface GapState {
  gaps: Record<number, GapJour>;
  // Autres exercices (délestage, expérimentation…) : par jour, par id d'exercice.
  pratiques: Record<number, Record<string, string>>;
  eclairages: Record<number, Eclairage>;
  setChamp: (jour: number, p: Perimetre, champ: keyof GapTriplet, val: string) => void;
  setPratique: (jour: number, id: string, val: string) => void;
  setEclairage: (jour: number, e: Eclairage) => void;
  reset: () => void;
}

export const useGap = create<GapState>()(
  persist(
    (set, get) => ({
      gaps: {},
      pratiques: {},
      eclairages: {},
      setChamp: (jour, p, champ, val) => {
        const jourGap = get().gaps[jour] ?? gapJourVide();
        set({
          gaps: {
            ...get().gaps,
            [jour]: { ...jourGap, [p]: { ...jourGap[p], [champ]: val } },
          },
        });
      },
      setPratique: (jour, id, val) => {
        const jourPr = get().pratiques[jour] ?? {};
        set({ pratiques: { ...get().pratiques, [jour]: { ...jourPr, [id]: val } } });
      },
      setEclairage: (jour, e) =>
        set({ eclairages: { ...get().eclairages, [jour]: e } }),
      reset: () => set({ gaps: {}, pratiques: {}, eclairages: {} }),
    }),
    { name: "parcours-gap", version: 1 }
  )
);

// Y a-t-il assez de matière pour demander un éclairage ? (au moins un champ)
export function aDeLaMatiere(g: GapJour | undefined): boolean {
  if (!g) return false;
  return PERIMETRE_KEYS.some((p) =>
    [g[p].crois, g[p].pense, g[p].fais].some((v) => v.trim().length > 0)
  );
}
