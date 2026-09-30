import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { AppState } from "react-native";
import { SUPABASE_ANON_KEY, SUPABASE_URL, configure } from "./config";

// La session est gardée dans le trousseau (iOS) / Keystore (Android), jamais en clair.
// SecureStore limite chaque valeur à ~2 Ko : on découpe la session en morceaux.
const TAILLE = 1800;
const coffre = {
  async getItem(cle: string) {
    const n = Number(await SecureStore.getItemAsync(`${cle}.n`));
    if (!n) return SecureStore.getItemAsync(cle);
    const morceaux = await Promise.all(Array.from({ length: n }, (_, i) => SecureStore.getItemAsync(`${cle}.${i}`)));
    return morceaux.some((m) => m == null) ? null : morceaux.join("");
  },
  async setItem(cle: string, valeur: string) {
    await coffre.removeItem(cle);
    const n = Math.ceil(valeur.length / TAILLE);
    for (let i = 0; i < n; i++) await SecureStore.setItemAsync(`${cle}.${i}`, valeur.slice(i * TAILLE, (i + 1) * TAILLE));
    await SecureStore.setItemAsync(`${cle}.n`, String(n));
  },
  async removeItem(cle: string) {
    const n = Number(await SecureStore.getItemAsync(`${cle}.n`)) || 0;
    await Promise.all([
      SecureStore.deleteItemAsync(cle),
      SecureStore.deleteItemAsync(`${cle}.n`),
      ...Array.from({ length: n }, (_, i) => SecureStore.deleteItemAsync(`${cle}.${i}`)),
    ]);
  },
};

export const supabase = createClient(SUPABASE_URL || "https://non-configure.invalid", SUPABASE_ANON_KEY || "non-configure", {
  auth: { storage: coffre, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});

// Le jeton ne se rafraîchit que lorsque l'application est au premier plan.
if (configure) {
  AppState.addEventListener("change", (etat) => {
    if (etat === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
