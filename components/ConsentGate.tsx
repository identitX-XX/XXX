"use client";

import { useEffect, useState } from "react";

// Backend A — consentement RGPD. S'affiche tant que le choix n'est pas fait.
// Sans « Accepter », aucune mesure n'est envoyée (voir lib/metrics). Local-first :
// la décision est stockée sur l'appareil.
const CONSENT_KEY = "idx-consent";

export function ConsentGate() {
  const [decided, setDecided] = useState(true);

  useEffect(() => {
    try {
      setDecided(Boolean(localStorage.getItem(CONSENT_KEY)));
    } catch {
      setDecided(true);
    }
  }, []);

  if (decided) return null;

  const decide = (v: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {
      /* ignore */
    }
    setDecided(true);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-muted">
          <span className="text-ink">Aide-nous à améliorer IdentitX.</span> Avec
          ton accord, on mesure l'usage de façon anonyme (jamais tes contenus
          intimes) pour comprendre ce qui aide. Tu peux revenir sur ce choix, et
          tout supprimer, à tout moment.
        </p>
        <div className="flex flex-none gap-2">
          <button
            onClick={() => decide("denied")}
            className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:text-ink"
          >
            Refuser
          </button>
          <button
            onClick={() => decide("granted")}
            className="rounded-full brand-gradient px-4 py-2 text-sm font-medium text-white"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
