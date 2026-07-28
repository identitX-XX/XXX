"use client";

import { useEffect, useState } from "react";
import { anonId } from "@/lib/metrics";

// Clé versionnée : la bumper invalide tous les accès mémorisés → chacun doit
// ressaisir le code. À incrémenter à chaque rotation du GATE_CODE (Vercel).
const GATE_KEY = "identitx-gate-2";

type Mode = "code" | "email";

export function Gate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState<Mode>("code");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [welcome, setWelcome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(GATE_KEY) === "ok") setUnlocked(true);
    } catch {}
    // Le Gate s'affiche AVANT ClientShell : il doit appliquer lui-même la
    // palette (Nuit & Or par défaut) et le thème sur <html>, sinon l'écran
    // d'accès retombe sur le rose du :root. Même logique que ClientShell.
    try {
      const raw = localStorage.getItem("identitx");
      const st = raw ? JSON.parse(raw)?.state : null;
      const palette = st?.palette ?? "nuit";
      const theme = st?.theme ?? "dark";
      const root = document.documentElement;
      root.classList.toggle("light", theme === "light");
      ["pal-nuit", "pal-ardoise", "pal-or", "pal-aubergine", "pal-parme"].forEach(
        (c) => root.classList.remove(c)
      );
      if (palette && palette !== "origine") root.classList.add(`pal-${palette}`);
    } catch {}
    setChecked(true);
  }, []);

  const enter = () => {
    try {
      localStorage.setItem(GATE_KEY, "ok");
    } catch {}
    setUnlocked(true);
  };

  const submitCode = async () => {
    const value = code.trim();
    if (!value || loading) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/gate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      if (r.ok) enter();
      else setError("Code incorrect — réessaie.");
    } catch {
      setError("Code incorrect — réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = async () => {
    const value = email.trim();
    if (!value || loading) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Adresse email invalide.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ anon_id: anonId(), email: value }),
      });
      const data = await r.json().catch(() => ({ ok: false }));
      if (r.ok && data.ok) {
        setWelcome(
          data.magic
            ? "Lien magique envoyé — on t'a aussi ouvert l'espace."
            : "Bienvenue — ton espace s'ouvre."
        );
        setTimeout(enter, 1200);
      } else {
        setError("Cet email n'a pas pu être enregistré. Réessaie.");
      }
    } catch {
      setError("Un souci réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  if (!checked) return null;
  if (unlocked) return <>{children}</>;

  const submit = mode === "code" ? submitCode : submitEmail;

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--noir)",
        color: "var(--ink)",
        fontFamily: "var(--font-inter),'Outfit',sans-serif",
        fontWeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(55% 38% at 85% 0%, color-mix(in srgb, var(--fuchsia) 12%, transparent), transparent 70%), radial-gradient(45% 32% at 10% 100%, color-mix(in srgb, var(--orange) 10%, transparent), transparent 70%)",
        }}
      />

      {/* Le visage dense accueille dès le seuil, fondu dans le noir. */}
      <img
        src="/visage-dense.png"
        alt=""
        aria-hidden="true"
        className="visage-dense"
        style={{ width: 230, maxWidth: "68vw", height: "auto", marginBottom: 4 }}
      />

      <div
        style={{
          fontFamily: "var(--font-fraunces),serif",
          fontWeight: 500,
          fontSize: 17,
          letterSpacing: ".16em",
          textTransform: "uppercase",
        }}
      >
        Identit<span style={{ color: "var(--fuchsia)" }}>X</span>
      </div>

      <p
        style={{
          fontFamily: "var(--font-fraunces),serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "var(--muted)",
          margin: "14px 0 22px",
          textAlign: "center",
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        Laisse-moi ton email pour ouvrir ton espace.
      </p>

      {welcome ? (
        <div style={{ fontSize: 14, color: "var(--fuchsia)", textAlign: "center", maxWidth: 320, lineHeight: 1.5 }}>
          {welcome}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 340 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && submitEmail()}
            placeholder="ton@email.com"
            autoComplete="email"
            style={{
              flex: 1,
              background: "color-mix(in srgb, var(--orange) 6%, transparent)",
              border: error
                ? "1px solid color-mix(in srgb, var(--danger) 60%, transparent)"
                : "1px solid color-mix(in srgb, var(--orange) 25%, transparent)",
              borderRadius: 14,
              color: "var(--ink)",
              fontSize: 16,
              padding: "15px 16px",
              outline: "none",
              fontFamily: "var(--font-inter),sans-serif",
              textAlign: "left",
            }}
          />
          <button
            onClick={submitEmail}
            disabled={loading || !email.trim()}
            aria-label="Entrer"
            style={{
              background:
                loading || !email.trim()
                  ? "color-mix(in srgb, var(--fuchsia) 25%, transparent)"
                  : "linear-gradient(90deg,var(--fuchsia),var(--orange))",
              color: "var(--noir)",
              border: "none",
              borderRadius: 14,
              padding: "0 20px",
              fontSize: 18,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            →
          </button>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 14, fontSize: 13, color: "var(--danger)" }}>{error}</div>
      )}

      {!welcome && (
        <p style={{ marginTop: 14, fontSize: 12, color: "var(--muted)", textAlign: "center", maxWidth: 300, lineHeight: 1.5 }}>
          Ton email sert à t'ouvrir l'espace et à te recontacter. Rien d'autre.
        </p>
      )}
    </div>
  );
}
