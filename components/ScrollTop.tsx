"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Filet de sécurité anti-friction : à chaque changement de page, on repart du
// haut. Le routeur App Router le fait normalement, mais certaines transitions
// (contenu qui s'hydrate après coup, focus d'un champ, ancre) peuvent laisser
// l'utilisatrice au milieu ou en bas de l'écran. On garantit le haut.
export function ScrollTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}
