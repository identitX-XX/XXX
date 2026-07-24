"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TurbineDirection } from "./types";

// Le modèle manquant : les DIRECTIONS de l'utilisatrice (ses multiples comme
// projets concrets) et ses TENSIONS. C'est la matière que la bascule
// d'archétype vient orchestrer. Local-first, persisté.

interface CarteTurbine {
  directions: TurbineDirection[];
  tensions: string[];
  ajouterDirection: (d: TurbineDirection) => void;
  retirerDirection: (index: number) => void;
  setTensions: (t: string[]) => void;
}

export const useCarteTurbine = create<CarteTurbine>()(
  persist(
    (set, get) => ({
      directions: [],
      tensions: [],
      ajouterDirection: (d) => set({ directions: [...get().directions, d] }),
      retirerDirection: (index) =>
        set({ directions: get().directions.filter((_, i) => i !== index) }),
      setTensions: (tensions) => set({ tensions }),
    }),
    {
      name: "turbine-carte",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
