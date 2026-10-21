"use client";

import { useEffect, useState } from "react";

/**
 * true une fois le composant monté côté client.
 * Évite les décalages d'hydratation quand on lit le store persistant
 * (localStorage) qui n'existe pas au rendu serveur.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
