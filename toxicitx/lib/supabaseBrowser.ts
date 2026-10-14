"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client Supabase côté navigateur, en clé anonyme.
 * `null` si les variables d'environnement ne sont pas configurées : l'app
 * reste alors 100 % local-first (aucun envoi), sans planter.
 * On désactive toute persistance de session d'auth : ToxicitX n'authentifie
 * personne — aucune donnée identifiante.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
