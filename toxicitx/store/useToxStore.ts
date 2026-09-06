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
  setContext: (patch: Partial<OnboardingContext>) => void;
  setAnswer: (questionId: string, value: ScaleValue) => void;
  /** Réinitialise tout et repart d'une nouvelle session anonyme. */
  reset: () => void;
  answeredCount: () => number;
}

export const useToxStore = create<ToxState>()(
  persist(
    (set, get) => ({
      sessionId: newSessionId(),
      context: emptyContext,
      answers: {},
      setContext: (patch) =>
        set((s) => ({ context: { ...s.context, ...patch } })),
      setAnswer: (questionId, value) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: value } })),
      reset: () =>
        set({
          sessionId: newSessionId(),
          context: emptyContext,
          answers: {},
        }),
      answeredCount: () => Object.keys(get().answers).length,
    }),
    { name: "toxicitx-v1" }
  )
);
