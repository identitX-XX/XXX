// parcours-archetypes/store.ts
// Store Zustand persisté (localStorage). Rien ne sort du device : local-first.
// Contient le parcours (30 jours), les réponses, et l'état d'évolution.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import parcoursData from "./parcours.json";
import {
  Diagnostic,
  EtatEvolution,
  Parcours,
  ReponseJour,
} from "./types";
import { clotureJour, initialiser, matriceVide } from "./evolution";
import { generateParcours, DIAGNOSTIC_DEFAUT } from "./generateParcours";

const parcoursBase = parcoursData as unknown as Parcours;

function etatDepart(): EtatEvolution {
  return { matrice: matriceVide(), historique: [], jourCourant: 1 };
}

interface StoreParcours {
  parcours: Parcours;
  diagnostic: Diagnostic | null;
  reponses: Record<number, ReponseJour>;
  etat: EtatEvolution;

  // Reçoit le résultat de l'écran-miroir amont, régénère le parcours sur mesure
  // (J1 = dominant, J30 = La Métamorphe) et amorce la matrice.
  initialiserParcours: (diag: Diagnostic) => void;

  // Clôt une journée : enregistre la réponse et fait avancer le moteur.
  repondreJour: (r: ReponseJour) => void;

  // Réinitialise tout (garde le parcours de base généré).
  reinitialiser: () => void;
}

export const useParcoursStore = create<StoreParcours>()(
  persist(
    (set, get) => ({
      parcours: parcoursBase,
      diagnostic: null,
      reponses: {},
      etat: etatDepart(),

      initialiserParcours: (diag) =>
        set({
          diagnostic: diag,
          parcours: generateParcours(diag),
          reponses: {},
          etat: initialiser(diag),
        }),

      repondreJour: (r) => {
        const { etat, reponses } = get();
        // Idempotent : re-répondre à un jour déjà clos ne le rejoue pas.
        if (reponses[r.jour]) return;
        set({
          reponses: { ...reponses, [r.jour]: r },
          etat: clotureJour(etat, r),
        });
      },

      reinitialiser: () =>
        set({
          diagnostic: null,
          parcours: get().diagnostic
            ? generateParcours(DIAGNOSTIC_DEFAUT)
            : parcoursBase,
          reponses: {},
          etat: etatDepart(),
        }),
    }),
    {
      name: "parcours-archetypes",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
