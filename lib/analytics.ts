// A-05 — Analytics produit. Une seule fonction : track(nom, props).
// Priorité aux custom events Vercel Analytics (window.va) si présents ; sinon
// POST vers /api/track qui écrit dans la table Supabase `events`.
//
// Règle : AUCUNE donnée personnelle dans les propriétés (pas d'e-mail, de
// prénom, de texte libre). Uniquement des dimensions anonymes (jour, verbe…).

import { anonId } from "./metrics";

export type TrackProps = Record<string, string | number | boolean>;

export function track(name: string, props?: TrackProps): void {
  if (typeof window === "undefined") return;

  // 1) Vercel Analytics custom events, si le script est chargé (window.va).
  try {
    const va = (window as unknown as { va?: (...a: unknown[]) => void }).va;
    if (typeof va === "function") {
      va("event", { name, ...(props ?? {}) });
      return;
    }
  } catch {
    /* on retombe sur le POST */
  }

  // 2) Repli : POST vers /api/track → table Supabase `events`.
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ anon_id: anonId(), name, props: props ?? {} }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* la mesure ne doit jamais casser l'app */
  }
}
