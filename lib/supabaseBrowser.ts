import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client navigateur Supabase — sert UNIQUEMENT à l'auth par lien magique
// (connexion facultative). Il lit les variables PUBLIQUES ; si elles ne sont
// pas posées, il renvoie null et l'app reste 100 % fonctionnelle en mode
// anonyme (local) — la connexion est simplement indisponible, rien ne casse.
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached =
    url && key
      ? createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: "pkce",
          },
        })
      : null;
  return cached;
}
