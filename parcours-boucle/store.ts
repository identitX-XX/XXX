"use client";

// État de la boucle quotidienne — la carte identitaire qui s'enrichit dans le
// temps. Persistée localement (et synchronisable via le compte, comme le reste).
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DIM_KEYS, DimKey } from "./dimensions";

export interface Connexion {
  a: DimKey;
  b: DimKey;
  jour: number;
}

interface BoucleState {
  dimensions: Record<string, number>; // score accumulé par dimension
  connexions: Connexion[]; // connexions révélées
  jours: number; // nombre d'explorations faites
  dernier: string | null; // date ISO de la dernière exploration
  facettesFaites: string[];
  intentions: string[];
  explorer: (facetteId: string, choix: DimKey[]) => void;
  ajouterIntention: (t: string) => void;
  reset: () => void;
}

const vide = (): Record<string, number> =>
  Object.fromEntries(DIM_KEYS.map((k) => [k, 0]));

export const useBoucle = create<BoucleState>()(
  persist(
    (set, get) => ({
      dimensions: vide(),
      connexions: [],
      jours: 0,
      dernier: null,
      facettesFaites: [],
      intentions: [],

      explorer: (facetteId, choix) => {
        const dimensions = { ...vide(), ...get().dimensions };
        choix.forEach((c) => {
          dimensions[c] = (dimensions[c] ?? 0) + 1;
        });
        const connexions = [...get().connexions];
        if (choix.length >= 2) {
          const [a, b] = choix;
          const existe = connexions.some(
            (x) => (x.a === a && x.b === b) || (x.a === b && x.b === a)
          );
          if (!existe) connexions.push({ a, b, jour: get().jours + 1 });
        }
        set({
          dimensions,
          connexions,
          jours: get().jours + 1,
          dernier: new Date().toISOString(),
          facettesFaites: Array.from(new Set([...get().facettesFaites, facetteId])),
        });
      },

      ajouterIntention: (t) =>
        set({ intentions: [...get().intentions, t.trim()].filter(Boolean) }),

      reset: () =>
        set({
          dimensions: vide(),
          connexions: [],
          jours: 0,
          dernier: null,
          facettesFaites: [],
          intentions: [],
        }),
    }),
    { name: "parcours-boucle", version: 1 }
  )
);
