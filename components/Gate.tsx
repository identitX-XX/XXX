"use client";

import { useEffect, useState } from "react";

const GATE_KEY = "identitx-gate";

export function Gate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(GATE_KEY) === "ok") setUnlocked(true);
    } catch {}
    setChecked(true);
  }, []);

  const submit = async () => {
    const value = code.trim();
    if (!value || loading) return;
    setLoading(true);
    setError(false);
    try {
      const r = await fetch("/api/gate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      if (r.ok) {
        try {
          localStorage.setItem(GATE_KEY, "ok");
        } catch {}
        setUnlocked(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!checked) return null;
  if (unlocked) return <>{children}</>;

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
            "radial-gradient(55% 38% at 85% 0%, rgba(255,79,163,.10), transparent 70%), radial-gradient(45% 32% at 10% 100%, rgba(255,138,76,.08), transparent 70%)",
        }}
      />

      <div aria-hidden="true" style={{ position: "relative", width: 70, height: 70, marginBottom: 22 }}>
        <div style={{ position: "absolute", inset: 0, animation: "idx-spin 9s linear infinite" }}>
          <span
            style={{
              position: "absolute",
              top: -4,
              left: "calc(50% - 4px)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--fuchsia)",
              boxShadow: "0 0 12px rgba(255,79,163,.8)",
            }}
          />
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: "absolute", inset: 17, width: 36, height: 36, color: "var(--fuchsia)" }}
        >
          <circle cx="12" cy="12" r="9.2" />
          <path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5 5-2.2Z" />
        </svg>
      </div>

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
          margin: "14px 0 26px",
          textAlign: "center",
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        Accès sur invitation. Entre ton code pour ouvrir l'espace.
      </p>

      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 340 }}>
        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Code d'accès"
          autoComplete="off"
          style={{
            flex: 1,
            background: "rgba(255,138,76,.06)",
            border: error ? "1px solid rgba(255,90,90,.6)" : "1px solid rgba(255,138,76,.25)",
            borderRadius: 14,
            color: "var(--ink)",
            fontSize: 16,
            padding: "15px 16px",
            outline: "none",
            fontFamily: "var(--font-inter),sans-serif",
            textAlign: "center",
            letterSpacing: ".2em",
          }}
        />
        <button
          onClick={submit}
          disabled={loading || !code.trim()}
          aria-label="Entrer"
          style={{
            background:
              loading || !code.trim()
                ? "rgba(255,79,163,.25)"
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

      {error && (
        <div style={{ marginTop: 14, fontSize: 13, color: "var(--danger)" }}>
          Code incorrect — réessaie.
        </div>
      )}
    </div>
  );
}
