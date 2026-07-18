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
        background: "#0A090D",
        color: "#F4EEEA",
        fontFamily: "'Inter','Outfit',sans-serif",
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
      <style>{`@keyframes idx-spin { to { transform: rotate(360deg) } }`}</style>

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
          
