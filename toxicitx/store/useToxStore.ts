"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Answers,
  OnboardingContext,
  ScaleValue,
} from "@/types";

/** ID de session anonyme, non lié à une personne (aucune donnée identifiante). */
function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const emptyContext: OnboardingContext = {
  genre: null,
  secteur: null,
  tailleEntreprise: null,
  niveauPoste: null,
  anciennete: null,
  encadrement: null,
};

interface ToxState {
  sessionId: string;
  context: OnboardingContext;
  answers: Answers;
  /** Codes opaques (version entreprise), non identifiants — pour l'agrégation. */
  orgCode: string | null;
  teamCode: string | null;
  /** sessionId dont les réponses ont déjà été envoyées (anti-doublon). */
  lastSubmittedId: string | null;
  setContext: (patch: Partial<OnboardingContext>) => void;
  setAnswer: (questionId: string, value: ScaleValue) => void;
  setOrg: (orgCode: string | null, teamCode?: string | null) => void;
  markSubmitted: (sessionId: string) => void;
  /** Réinitialise le parcours et repart d'une nouvelle session anonyme. */
  reset: () => void;
  answeredCount: () => number;
}

export const useToxStore = create<ToxState>()(
  persist(
    (set, get) => ({
      sessionId: newSessionId(),
      context: emptyContext,
      answers: {},
      orgCode: null,
      teamCode: null,
      lastSubmittedId: null,
      setContext: (patch) =>
        set((s) => ({ context: { ...s.context, ...patch } })),
      setAnswer: (questionId, value) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: value } })),
      setOrg: (orgCode, teamCode = null) => set({ orgCode, teamCode }),
      markSubmitted: (sessionId) => set({ lastSubmittedId: sessionId }),
      reset: () =>
        // On garde orgCode/teamCode (contexte entreprise) entre deux tests.
        set({
          sessionId: newSessionId(),
          context: emptyContext,
          answers: {},
          lastSubmittedId: null,
        }),
      answeredCount: () => Object.keys(get().answers).length,
    }),
    { name: "toxicitx-v1" }
  )
);
