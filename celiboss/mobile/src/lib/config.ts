import Constants from "expo-constants";

// Réglages : variables EXPO_PUBLIC_* (fichier .env ou EAS), sinon app.json › extra.
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

export const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL || extra.siteUrl || "").replace(/\/$/, "");
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl || "";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.supabaseAnonKey || "";

export const configure = Boolean(SITE_URL && SUPABASE_URL && SUPABASE_ANON_KEY);
