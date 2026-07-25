"use client";

// Backend A — client de métriques. Identité anonyme stable (localStorage), et
// AUCUN événement sans consentement (RGPD). Fire-and-forget : ne bloque jamais
// l'UI, ne casse jamais si le backend n'est pas provisionné.

const ANON_KEY = "idx-anon";
const CONSENT_KEY = "idx-consent";

export function anonId(): string {
  if (typeof window === "undefined") return "srv";
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `a-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function track(name: string, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return; // pas de mesure sans consentement
  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ anon_id: anonId(), name, props: props ?? {} }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* silencieux : la mesure ne doit jamais gêner l'usage */
  }
}
