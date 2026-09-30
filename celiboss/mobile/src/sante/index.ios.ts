// iOS : Apple Santé (HealthKit). Reçoit aussi les données de l'Apple Watch,
// et des montres Garmin, Withings, Oura… dont l'appli écrit dans Santé.
import {
  getMostRecentQuantitySample,
  isHealthDataAvailable,
  queryCategorySamples,
  requestAuthorization,
} from "@kingstinct/react-native-healthkit";
import { cardioPlausible, minutesCouvertes, sommeilPlausible } from "./fusion";
import type { LecteurSante } from "./types";

const SOMMEIL = "HKCategoryTypeIdentifierSleepAnalysis" as const;
const REPOS = "HKQuantityTypeIdentifierRestingHeartRate" as const;

// HKCategoryValueSleepAnalysis : 0 au lit, 1 endormi (non précisé), 2 éveillé,
// 3 sommeil léger, 4 profond, 5 paradoxal. On ne compte que le sommeil réel.
const ENDORMI = new Set<number>([1, 3, 4, 5]);

export const sante: LecteurSante = {
  source: "Apple Santé",
  disponible: async () => isHealthDataAvailable(),
  // iOS ne dit jamais si la lecture a été refusée (confidentialité) :
  // un refus se traduit simplement par des données vides.
  autoriser: () => requestAuthorization({ toRead: [SOMMEIL, REPOS] }),
  async lireNuit(debut, fin) {
    const [echantillons, repos] = await Promise.all([
      queryCategorySamples(SOMMEIL, { limit: 0, ascending: true, filter: { date: { startDate: debut, endDate: fin } } }),
      getMostRecentQuantitySample(REPOS, "count/min"),
    ]);
    const endormi = echantillons
      .filter((e) => ENDORMI.has(Number(e.value)))
      .map((e) => ({ debut: e.startDate.getTime(), fin: e.endDate.getTime() }));
    // Mesure de repos récente seulement (48 h), sinon elle ne dit rien d'aujourd'hui.
    const recente = repos && fin.getTime() - repos.endDate.getTime() < 48 * 3600 * 1000;
    return {
      sommeilMinutes: sommeilPlausible(minutesCouvertes(endormi, { debut: debut.getTime(), fin: fin.getTime() })),
      cardioRepos: recente ? cardioPlausible(repos.quantity) : null,
    };
  },
};
