"use client";

// Retour du lien magique : Supabase (detectSessionInUrl) échange le code présent
// dans l'URL contre une vraie session, puis on rentre dans l'app. On débloque
// aussi le portail (GATE_KEY) pour que la navigation suivante passe sans friction.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseBrowser";

const GATE_KEY = "identitx-gate-2";

export default function AuthCallback() {
  const router = useRouter();
  const [msg, setMsg] = useState("Connexion en cours…");

  useEffect(() => {
    try {
      localStorage.setItem(GATE_KEY, "ok");
    } catch {}

    const supabase = getSupabase();
    if (!supabase) {
      router.replace("/aujourdhui");
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      router.replace("/aujourdhui");
    };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) finish();
    });

    // Filet : même si la session tarde, on rentre (mode facultatif, non bloquant).
    const t = setTimeout(finish, 4000);
    return () => {
      clearTimeout(t);
      sub.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        background: "var(--noir)",
        color: "var(--ink)",
        fontFamily: "var(--font-inter), sans-serif",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          className="brand-gradient"
          style={{ width: 40, height: 40, borderRadius: 12, margin: "0 auto 16px" }}
        />
        <p style={{ fontSize: 15, color: "var(--muted)" }}>{msg}</p>
      </div>
    </div>
  );
}
