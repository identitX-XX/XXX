import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Client Supabase côté serveur (composants serveur, actions), lié à la
 * session de la personne via les cookies.
 */
export function supabaseServeur() {
  const magasin = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => magasin.getAll(),
      setAll: (aPoser) => {
        try {
          aPoser.forEach(({ name, value, options }) => magasin.set(name, value, options));
        } catch {
          // Appelé depuis un composant serveur : le middleware rafraîchit la session.
        }
      },
    },
  });
}

/**
 * Client pour l'API des autres appareils (appli native, montre) : la session
 * est portée par l'en-tête « Authorization: Bearer <jeton> », pas par un cookie.
 * Les règles RLS s'appliquent exactement de la même façon.
 */
export function supabaseJeton(jeton: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jeton}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** La personne connectée, ou null. getUser() revalide le jeton auprès de Supabase. */
export async function utilisateurCourant() {
  const {
    data: { user },
  } = await supabaseServeur().auth.getUser();
  return user;
}
