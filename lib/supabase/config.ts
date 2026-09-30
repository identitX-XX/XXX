// Configuration Supabase. Les deux valeurs viennent de Supabase :
// Project Settings → API → « Project URL » et « anon public key ».
// Elles sont publiques par nature : la sécurité repose sur les règles RLS
// (supabase/migrations), jamais sur le secret de ces clés.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Faux tant que les clés ne sont pas renseignées : les écrans du compte l'annoncent. */
export const supabaseConfigure = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
