"use client";

// Filet anti-cache périmé : compare la version chargée (bakée au build) à la
// version déployée (/api/version). Si elles diffèrent, recharge UNE fois (via
// doitRecharger, testé). Vérifie au montage et au retour sur l'onglet — le cas
// exact d'une app en écran d'accueil qu'on rouvre après un déploiement.

import { useEffect } from "react";
import { VERSION_CHARGEE, doitRecharger } from "@/lib/version";

const CLE_SESSION = "idx-reload-version";

export function VersionGuard() {
  useEffect(() => {
    let annule = false;

    const verifier = async () => {
      if (document.visibilityState === "hidden") return;
      let actuelle: string | null = null;
      try {
        const r = await fetch("/api/version", { cache: "no-store" });
        actuelle = (await r.json())?.v ?? null;
      } catch {
        return; // hors-ligne / réseau : on ne force rien
      }
      if (annule) return;

      let dejaFait: string | null = null;
      try {
        dejaFait = sessionStorage.getItem(CLE_SESSION);
      } catch {}

      if (doitRecharger(VERSION_CHARGEE, actuelle, dejaFait)) {
        try {
          sessionStorage.setItem(CLE_SESSION, actuelle as string);
        } catch {}
        window.location.reload();
      }
    };

    verifier();
    const onFocus = () => void verifier();
    window.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      annule = true;
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}
