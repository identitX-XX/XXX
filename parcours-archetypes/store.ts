// parcours-archetypes/store.ts
// Store Zustand persisté (localStorage). Rien ne sort du device : local-first.
// Contient le parcours (30 jours), les réponses, et l'état d'évolution.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import parcoursData from "./parcours.json";
import {
  ClimatJour,
  Diagnostic,
  EtatEvolution,
  Objectifs,
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
  objectifs: Objectifs | null;
  reponses: Record<number, ReponseJour>;
  etat: EtatEvolution;
  // Retour de l'utilisatrice sur les révélations (anti-Barnum) : « oui, ça me
  // parle » ou « non » → une révélation infirmée est écartée et pénalisée.
  revelationsFeedback: Record<string, "oui" | "non">;
  // Couche climat & corps (optionnelle), un relevé par jour de parcours.
  climat: Record<number, ClimatJour>;

  // Reçoit le résultat de l'écran-miroir amont, régénère le parcours sur mesure
  // (J1 = dominant, J30 = La Métamorphe) et amorce la matrice.
  initialiserParcours: (diag: Diagnostic) => void;

  // Pose les objectifs de départ (un par périmètre : perso / pro / relationnel).
  definirObjectifs: (o: Objectifs) => void;

  // Clôt une journée : enregistre la réponse et fait avancer le moteur.
  repondreJour: (r: ReponseJour) => void;

  // Note une révélation (« oui » / « non ») — boucle de recalibration.
  noterRevelation: (id: string, v: "oui" | "non") => void;

  // Enregistre le climat & corps du jour.
  noterClimat: (c: ClimatJour) => void;

  // Réinitialise tout (garde le parcours de base généré).
  reinitialiser: () => void;
}

export const useParcoursStore = create<StoreParcours>()(
  persist(
    (set, get) => ({
      parcours: parcoursBase,
      diagnostic: null,
      objectifs: null,
      reponses: {},
      etat: etatDepart(),
      revelationsFeedback: {},
      climat: {},

      initialiserParcours: (diag) =>
        set({
          diagnostic: diag,
          parcours: generateParcours(diag),
          reponses: {},
          etat: initialiser(diag),
          revelationsFeedback: {},
          climat: {},
        }),

      definirObjectifs: (o) => set({ objectifs: o }),

      repondreJour: (r) => {
        const { etat, reponses } = get();
        // Idempotent : re-répondre à un jour déjà clos ne le rejoue pas.
        if (reponses[r.jour]) return;
        set({
          reponses: { ...reponses, [r.jour]: r },
          etat: clotureJour(etat, r),
        });
      },

      noterRevelation: (id, v) =>
        set({ revelationsFeedback: { ...get().revelationsFeedback, [id]: v } }),

      noterClimat: (c) => set({ climat: { ...get().climat, [c.jour]: c } }),

      reinitialiser: () =>
        set({
          diagnostic: null,
          objectifs: null,
          parcours: get().diagnostic
            ? generateParcours(DIAGNOSTIC_DEFAUT)
            : parcoursBase,
          reponses: {},
          etat: etatDepart(),
          revelationsFeedback: {},
          climat: {},
        }),
    }),
    {
      name: "parcours-archetypes",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // v1 -> v2 : la version précédente amorçait un diagnostic PAR DÉFAUT
      // automatiquement (explorateur/sage), ce qui faisait sauter l'écran des
      // 8 questions. On repart à zéro pour que le vrai diagnostic s'affiche.
      migrate: (persisted, version) => {
        if (version < 2) {
          return {
            parcours: parcoursBase,
            diagnostic: null,
            reponses: {},
            etat: etatDepart(),
          } as Partial<StoreParcours>;
        }
        return persisted as StoreParcours;
      },
    }
  )
);
