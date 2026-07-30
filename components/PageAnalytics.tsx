"use client";

// Analytics d'engagement (consenti, RGPD) : à chaque changement de page, on
// enregistre une VUE (`page_view`) et le TEMPS passé sur la page quittée
// (`page_time`). Rien sans consentement (track() est verrouillé). Fire-and-forget.
// Alimente le tableau de bord : visites, visiteuses uniques, temps moyen par
// page/module.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/metrics";

export function PageAnalytics() {
  const pathname = usePathname();
  const start = useRef<number>(Date.now());
  const path = useRef<string>(pathname);

  // Changement de route : temps sur la page précédente, puis vue de la nouvelle.
  useEffect(() => {
    const prev = path.current;
    const s = Math.round((Date.now() - start.current) / 1000);
    if (prev && prev !== pathname && s > 0 && s < 3600) {
      track("page_time", { path: prev, seconds: s });
    }
    track("page_view", { path: pathname });
    path.current = pathname;
    start.current = Date.now();
  }, [pathname]);

  // Onglet masqué / fermé : on enregistre le temps de la page courante.
  useEffect(() => {
    const flush = () => {
      const s = Math.round((Date.now() - start.current) / 1000);
      if (s > 0 && s < 3600) track("page_time", { path: path.current, seconds: s });
      start.current = Date.now();
    };
    const onVis = () => document.visibilityState === "hidden" && flush();
    // Fin de session : dernier écran vu avant abandon (drop_point). L'analytics
    // retient le dernier émis par session/visiteuse.
    const onLeave = () => {
      flush();
      track("drop_point", { path: path.current });
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  return null;
}
