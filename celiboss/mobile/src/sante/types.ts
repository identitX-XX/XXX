import type { Nuit } from "./fusion";

export type Plateforme = "Apple Santé" | "Health Connect";

/** Même contrat sur iOS (HealthKit) et Android (Health Connect). */
export interface LecteurSante {
  /** Nom affiché de la source, ou null si le téléphone n'en a pas. */
  source: Plateforme | null;
  disponible(): Promise<boolean>;
  /** Ouvre la fenêtre système d'autorisation (lecture seule). */
  autoriser(): Promise<boolean>;
  /** Sommeil de la dernière nuit et fréquence cardiaque au repos la plus récente. */
  lireNuit(debut: Date, fin: Date): Promise<Nuit>;
}
