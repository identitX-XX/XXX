// Web et plateformes sans données de santé : rien à lire.
// Metro choisit index.ios.ts ou index.android.ts sur téléphone.
import type { LecteurSante } from "./types";

export const sante: LecteurSante = {
  source: null,
  disponible: async () => false,
  autoriser: async () => false,
  lireNuit: async () => ({ sommeilMinutes: null, cardioRepos: null }),
};
