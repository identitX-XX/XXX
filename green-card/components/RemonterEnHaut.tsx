"use client";

import { useEffect } from "react";

/** Après une redirection depuis un formulaire, la page garde le défilement : on revient en haut. */
export function RemonterEnHaut() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
