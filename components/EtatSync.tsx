"use client";

// Monté haut dans l'app. Si un e-mail a été collecté à l'entrée (idx-email), il
// (1) restaure la progression serveur au chargement — utile après un vidage de
// cache ou sur un nouvel appareil, et (2) pousse l'état local à chaque
// changement (débouncé). Sans backend Supabase configuré : no-op silencieux.

import { useEffect } from "react";
import { anonId } from "@/lib/metrics";
import { getEmail, pullEtat, pushEtat } from "@/lib/etatSync";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { useStore } from "@/store/useStore";
import { useGap } from "@/parcours-gap/store";

export function EtatSync() {
  useEffect(() => {
    const email = getEmail();
    if (!email) return;

    let annule = false;
    const push = () => pushEtat(email, anonId());

    (async () => {
      // Restauration au démarrage (le plus avancé gagne), puis on sème le serveur.
      await pullEtat(email);
      if (annule) return;
      push();
    })();

    // Toute évolution de l'état local remonte au serveur (débouncé).
    const unsubs = [
      useParcoursStore.subscribe(push),
      useStore.subscribe(push),
      useGap.subscribe(push),
    ];
    return () => {
      annule = true;
      unsubs.forEach((u) => u());
    };
  }, []);

  return null;
}
