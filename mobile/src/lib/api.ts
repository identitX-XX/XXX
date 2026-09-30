import { SITE_URL } from "./config";
import { supabase } from "./supabase";

// Client de l'API du Compagnon (même base et mêmes règles que le site).

export type Signal = "humeur" | "energie" | "ambition" | "sommeil" | "cardio";

export type PointJour = {
  jour: string;
  humeur: number | null;
  energie: number | null;
  ambition: number | null;
  esprit: string | null;
  sommeil_minutes: number | null;
  cardio_repos: number | null;
  source: "manuel" | "montre" | "mixte";
  elan: { valeur: number | null; detail: Partial<Record<Signal, number>>; completude: number; lecture: string };
};

export type Lecture = { jour: string; points: PointJour[]; profil: { prenom: string | null; santeConsentie: boolean } };

export type EnvoiPoint = {
  jour: string;
  source: "manuel" | "montre";
  humeur?: number;
  energie?: number;
  ambition?: number;
  sommeilMinutes?: number;
  cardioRepos?: number;
};

export class ErreurApi extends Error {
  constructor(
    message: string,
    readonly statut: number,
    readonly erreurs?: Record<string, string>,
  ) {
    super(message);
  }
}

async function appel<T>(chemin: string, init?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const jeton = data.session?.access_token;
  if (!jeton) throw new ErreurApi("Session expirée. Reconnectez-vous.", 401);
  let rep: Response;
  try {
    rep = await fetch(`${SITE_URL}/api/v1/compagnon${chemin}`, {
      ...init,
      headers: { "content-type": "application/json", authorization: `Bearer ${jeton}`, ...init?.headers },
    });
  } catch {
    throw new ErreurApi("Pas de connexion. Réessayez quand le réseau revient.", 0);
  }
  const corps = (await rep.json().catch(() => ({}))) as { erreur?: string; erreurs?: Record<string, string> };
  if (!rep.ok) {
    const premier = corps.erreurs ? Object.values(corps.erreurs)[0] : undefined;
    throw new ErreurApi(corps.erreur ?? premier ?? "Une erreur est survenue.", rep.status, corps.erreurs);
  }
  return corps as T;
}

export function lirePoints(depuis?: string) {
  return appel<Lecture>(`/points${depuis ? `?depuis=${depuis}` : ""}`);
}

export function envoyerPoint(point: EnvoiPoint) {
  return appel<{ ok: true; jour: string }>("/points", { method: "POST", body: JSON.stringify(point) });
}
