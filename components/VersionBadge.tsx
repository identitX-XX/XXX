"use client";

// Badge de version VISIBLE (bas du menu) : l'utilisatrice peut lire la version
// réellement chargée sur son appareil. Si ce numéro diffère de la dernière
// version déployée, c'est que son app est en cache périmé → le bouton
// « Mettre à jour » vide les caches et recharge la version en ligne.

import { useEffect, useState } from "react";
import { VERSION_CHARGEE } from "@/lib/version";

export function VersionBadge() {
  const chargee = (VERSION_CHARGEE || "dev").slice(0, 7);
  const [enLigne, setEnLigne] = useState<string | null>(null);
  const [maj, setMaj] = useState(false);

  useEffect(() => {
    let annule = false;
    fetch("/api/version", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!annule) setEnLigne((d?.v || "dev").slice(0, 7));
      })
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, []);

  const aJour = enLigne == null || enLigne === chargee;

  const forcer = async () => {
    setMaj(true);
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {}
    // Recharge la dernière version (le HTML est en no-store, donc frais).
    location.reload();
  };

  return (
    <div className="mt-6 border-t border-line pt-4 text-xs text-muted">
      <div>
        Version <span className="font-mono text-ink">{chargee}</span>
        {!aJour && (
          <span className="ml-2 rounded-full bg-fuchsia/15 px-2 py-0.5 text-[11px] text-fuchsia">
            maj dispo · {enLigne}
          </span>
        )}
        {aJour && enLigne != null && (
          <span className="ml-2 text-[11px] text-muted">à jour</span>
        )}
      </div>
      <button
        onClick={forcer}
        disabled={maj}
        className="mt-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-fuchsia hover:text-fuchsia disabled:opacity-50"
      >
        {maj ? "Mise à jour…" : "Mettre à jour l'app →"}
      </button>
    </div>
  );
}
