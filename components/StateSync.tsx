"use client";

// Monté haut dans l'app : dès qu'une session (lien magique) est présente, il
// REPREND la progression sauvegardée (pull + fusion « le plus avancé gagne »),
// puis SAUVEGARDE en continu (débounce) chaque changement d'état vers le serveur.
// Sans backend configuré, getSupabase() renvoie null → il ne fait rien.

import { useEffect, useRef } from "react";
import { getSupabase } from "@/lib/supabaseBrowser";
import { pullAndMerge, pushState } from "@/lib/stateSync";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { useStore } from "@/store/useStore";

export function StateSync() {
  const armed = useRef(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    let stopPush: (() => void) | undefined;

    // Sauvegarde continue : on regroupe les rafales de changements (curseurs,
    // saisie) en un seul envoi, 1,5 s après le dernier.
    const startPushing = () => {
      if (stopPush) return;
      let t: ReturnType<typeof setTimeout> | undefined;
      const debounced = () => {
        if (t) clearTimeout(t);
        t = setTimeout(() => {
          pushState();
        }, 1500);
      };
      const u1 = useParcoursStore.subscribe(debounced);
      const u2 = useStore.subscribe(debounced);
      stopPush = () => {
        if (t) clearTimeout(t);
        u1();
        u2();
      };
    };

    const onSession = async (hasSession: boolean) => {
      if (!hasSession || armed.current) return;
      armed.current = true;
      await pullAndMerge(); // reprise à la connexion
      startPushing();
    };

    sb.auth.getSession().then(({ data }) => onSession(Boolean(data.session)));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) =>
      onSession(Boolean(session))
    );

    return () => {
      sub.subscription.unsubscribe();
      stopPush?.();
    };
  }, []);

  return null;
}
