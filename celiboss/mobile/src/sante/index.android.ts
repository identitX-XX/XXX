// Android : Health Connect. Reçoit les données de Wear OS (Pixel Watch, Galaxy
// Watch via Samsung Health) et des montres Garmin, Withings, Fitbit… synchronisées.
import { SdkAvailabilityStatus, SleepStageType, getGrantedPermissions, getSdkStatus, initialize, readRecords, requestPermission } from "react-native-health-connect";
import { cardioPlausible, minutesCouvertes, sommeilPlausible, type Intervalle } from "./fusion";
import type { LecteurSante } from "./types";

const PERMISSIONS = [
  { accessType: "read", recordType: "SleepSession" },
  { accessType: "read", recordType: "RestingHeartRate" },
] as const;

const ENDORMI = new Set<number>([SleepStageType.SLEEPING, SleepStageType.LIGHT, SleepStageType.DEEP, SleepStageType.REM]);

let pret: Promise<boolean> | null = null;
async function demarrer() {
  if ((await getSdkStatus()) !== SdkAvailabilityStatus.SDK_AVAILABLE) return false;
  pret ??= initialize();
  return pret;
}

export const sante: LecteurSante = {
  source: "Health Connect",
  disponible: () => demarrer().catch(() => false),
  async autoriser() {
    if (!(await demarrer())) return false;
    await requestPermission([...PERMISSIONS]);
    const accordees = await getGrantedPermissions();
    return accordees.some((p) => p.accessType === "read" && (p.recordType === "SleepSession" || p.recordType === "RestingHeartRate"));
  },
  async lireNuit(debut, fin) {
    if (!(await demarrer())) return { sommeilMinutes: null, cardioRepos: null };
    const accordees = new Set((await getGrantedPermissions()).filter((p) => p.accessType === "read").map((p) => p.recordType as string));
    const fenetre = { operator: "between", startTime: debut.toISOString(), endTime: fin.toISOString() } as const;

    let sommeilMinutes: number | null = null;
    if (accordees.has("SleepSession")) {
      const { records } = await readRecords("SleepSession", { timeRangeFilter: fenetre });
      const intervalles: Intervalle[] = [];
      for (const s of records) {
        // Sans phases détaillées, la session entière compte comme sommeil.
        const phases = s.stages?.length ? s.stages.filter((p) => ENDORMI.has(p.stage)) : [{ startTime: s.startTime, endTime: s.endTime }];
        for (const p of phases) intervalles.push({ debut: Date.parse(p.startTime), fin: Date.parse(p.endTime) });
      }
      sommeilMinutes = sommeilPlausible(minutesCouvertes(intervalles, { debut: debut.getTime(), fin: fin.getTime() }));
    }

    let cardioRepos: number | null = null;
    if (accordees.has("RestingHeartRate")) {
      const depuis = new Date(fin.getTime() - 48 * 3600 * 1000);
      const { records } = await readRecords("RestingHeartRate", {
        timeRangeFilter: { operator: "between", startTime: depuis.toISOString(), endTime: fin.toISOString() },
        ascendingOrder: false,
        pageSize: 1,
      });
      cardioRepos = cardioPlausible(records[0]?.beatsPerMinute);
    }
    return { sommeilMinutes, cardioRepos };
  },
};
