"use client";

import { useEffect, useMemo, useState } from "react";

type Identity = {
  id: string;
  name: string;
  given: number; // énergie donnée 0-10
  received: number; // énergie reçue 0-10
};

const STORAGE_KEY = "identitx-cognitive-map";
const COLORS = ["#FF4FA3", "#FF8A4C", "#DFCBD8", "#C86BFF", "#FFD16B", "#6BE3FF"];

function classify(g: number, r: number): { label: string; color: string; hint: string } {
  const hi = 5.5;
  if (r >= hi && g < hi)
    return { label: "Source", color: "#FF8A4C", hint: "Te nourrit plus qu'elle ne coûte. À amplifier." };
  if (r >= hi && g >= hi)
    return { label: "Moteur", color: "#FF4FA3", hint: "Intense mais rentable. À doser, pas à couper." };
  if (r < hi && g >= hi)
    return { label: "Vampire", color: "#FF5A5A", hint: "Coûte sans rendre. À renégocier ou quitter." };
  return { label: "Dormante", color: "#8E8497", hint: "Peu investie, peu nourrissante. À réveiller ou archiver." };
}

export function CognitiveMap({ onDone }: { onDone?: () => void }) {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [draft, setDraft] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIdentities(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identities));
    } catch {}
  }, [identities, loaded]);

  const add = () => {
    const name = draft.trim();
    if (!name || identities.length >= 8) return;
    setIdentities((prev) => [
      ...prev,
      { id: Date.now().toString(36), name, given: 5, received: 5 },
    ]);
    setDraft("");
  };

  const update = (id: string, key: "given" | "received", value: number) =>
    setIdentities((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));

  const remove = (id: string) => setIdentities((prev) => prev.filter((it) => it.id !== id));

  const bilan = useMemo(() => {
    if (identities.length === 0) return null;
    const totalG = identities.reduce((s, i) => s + i.given, 0);
    const totalR = identities.reduce((s, i) => s + i.received, 0);
    const delta = totalR - totalG;
    const vampires = identities.filter((i) => classify(i.given, i.received).label === "Vampire");
    const sources = identities.filter((i) => classify(i.given, i.received).label === "Source");
    return { totalG, totalR, delta, vampires, sources };
  }, [identities]);

  // --- Quadrant SVG ---
  const S = 300; // viewBox
  const PAD = 34;
  const plot = S - PAD * 2;
  const toX = (g: number) => PAD + (g / 10) * plot;
  const toY = (r: number) => S - PAD - (r / 10) * plot;

  const label = (text: string) => ({
    fontSize: 8.5,
    letterSpacing: ".18em",
    textTransform: "uppercase" as const,
    fill: "rgba(244,238,234,.34)",
    fontFamily: "'Inter',sans-serif",
  });

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#0A090D",
        color: "#F4EEEA",
        fontFamily: "'Inter','Outfit',sans-serif",
        fontWeight: 300,
        padding: "48px 20px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Fraunces',serif",
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Identit<span style={{ color: "#FF4FA3" }}>X</span>
      </div>

      <h1
        style={{
          fontFamily: "'Fraunces',serif",
          fontWeight: 400,
          fontSize: "clamp(24px,6vw,38px)",
          lineHeight: 1.1,
          textAlign: "center",
          margin: "6px 0 0",
        }}
      >
        Cartographie des{" "}
        <span
          style={{
            background: "linear-gradient(90deg,#FF4FA3,#FF8A4C)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          identités actives
        </span>
      </h1>

      <p
        style={{
          fontFamily: "'Fraunces',serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "#DFCBD8",
          textAlign: "center",
          maxWidth: 400,
          margin: "14px 0 28px",
          lineHeight: 1.5,
        }}
      >
        Nomme les rôles que tu portes. Note ce que chacun te coûte — et ce qu'il te rend.
      </p>

      {/* Saisie */}
      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 420 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Ex. Manager, Mère, Bâtisseuse…"
          maxLength={24}
          style={{
            flex: 1,
            background: "rgba(255,138,76,.06)",
            border: "1px solid rgba(255,138,76,.25)",
            borderRadius: 12,
            color: "#F4EEEA",
            fontSize: 14,
            padding: "13px 14px",
            outline: "none",
            fontFamily: "'Inter',sans-serif",
          }}
        />
        <button
          onClick={add}
          disabled={!draft.trim() || identities.length >= 8}
          style={{
            background: draft.trim() && identities.length < 8 ? "#FF4FA3" : "rgba(255,79,163,.25)",
            color: "#0A090D",
            border: "none",
            borderRadius: 12,
            padding: "0 18px",
            fontSize: 20,
            cursor: "pointer",
            fontWeight: 500,
          }}
          aria-label="Ajouter cette identité"
        >
          +
        </button>
      </div>
      <div style={{ fontSize: 11, color: "rgba(244,238,234,.4)", marginTop: 8 }}>
        {identities.length}/8 identités
      </div>

      {/* Quadrant */}
      {identities.length > 0 && (
        <svg
          viewBox={`0 0 ${S} ${S}`}
          style={{ width: "100%", maxWidth: 380, marginTop: 26 }}
          role="img"
          aria-label="Quadrant énergie donnée / énergie reçue"
        >
          <rect x={PAD} y={PAD} width={plot} height={plot} fill="rgba(255,138,76,.03)" rx={14} />
          <line x1={PAD} y1={S / 2} x2={S - PAD} y2={S / 2} stroke="rgba(244,238,234,.14)" strokeDasharray="3 5" />
          <line x1={S / 2} y1={PAD} x2={S / 2} y2={S - PAD} stroke="rgba(244,238,234,.14)" strokeDasharray="3 5" />

          <text x={PAD + 6} y={PAD + 14} {...{ style: label("") }}>Source</text>
          <text x={S - PAD - 6} y={PAD + 14} textAnchor="end" style={label("")}>Moteur</text>
          <text x={PAD + 6} y={S - PAD - 7} style={label("")}>Dormante</text>
          <text x={S - PAD - 6} y={S - PAD - 7} textAnchor="end" style={label("")}>Vampire</text>

          <text x={S / 2} y={S - 8} textAnchor="middle" style={label("")}>Énergie donnée →</text>
          <text x={12} y={S / 2} textAnchor="middle" transform={`rotate(-90 12 ${S / 2})`} style={label("")}>
            Énergie reçue →
          </text>

          {identities.map((it, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              <g key={it.id}>
                <circle
                  cx={toX(it.given)}
                  cy={toY(it.received)}
                  r={7}
                  fill={c}
                  opacity={0.9}
                  style={{ transition: "cx .25s ease, cy .25s ease" }}
                />
                <circle cx={toX(it.given)} cy={toY(it.received)} r={12} fill={c} opacity={0.15} />
                <text
                  x={toX(it.given)}
                  y={toY(it.received) - 14}
                  textAnchor="middle"
                  style={{ fontSize: 9.5, fill: "#F4EEEA", fontFamily: "'Inter',sans-serif" }}
                >
                  {it.name}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Cartes identité */}
      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
        {identities.map((it, i) => {
          const c = COLORS[i % COLORS.length];
          const verdict = classify(it.given, it.received);
          return (
            <div
              key={it.id}
              style={{
                background: "radial-gradient(130% 130% at 50% 0%, rgba(38,22,41,.5), rgba(10,9,13,0) 100%)",
                border: "1px solid rgba(255,138,76,.14)",
                borderRadius: 18,
                padding: "16px 16px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 10px ${c}` }} />
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, flex: 1 }}>{it.name}</span>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: verdict.color,
                    border: `1px solid ${verdict.color}55`,
                    borderRadius: 999,
                    padding: "5px 10px",
                  }}
                >
                  {verdict.label}
                </span>
                <button
                  onClick={() => remove(it.id)}
                  aria-label={`Retirer ${it.name}`}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(244,238,234,.35)",
                    fontSize: 18,
                    cursor: "pointer",
                    padding: "0 2px",
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(244,238,234,.55)" }}>
                  <span>Énergie donnée</span>
                  <span style={{ color: "#FF8A4C" }}>{it.given}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={it.given}
                  onChange={(e) => update(it.id, "given", Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#FF8A4C", marginTop: 4 }}
                  aria-label={`Énergie donnée par ${it.name}`}
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(244,238,234,.55)" }}>
                  <span>Énergie reçue</span>
                  <span style={{ color: "#FF4FA3" }}>{it.received}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={it.received}
                  onChange={(e) => update(it.id, "received", Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#FF4FA3", marginTop: 4 }}
                  aria-label={`Énergie reçue de ${it.name}`}
                />
              </div>

              <div style={{ fontSize: 12, color: "rgba(244,238,234,.5)", marginTop: 10, fontStyle: "italic" }}>
                {verdict.hint}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bilan global */}
      {bilan && identities.length >= 2 && (
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            marginTop: 26,
            padding: "20px 18px",
            borderRadius: 18,
            border: "1px solid rgba(255,79,163,.22)",
            background: "radial-gradient(130% 130% at 50% 0%, rgba(38,22,41,.6), rgba(10,9,13,0) 100%)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: ".26em", textTransform: "uppercase", color: "#FF8A4C" }}>
            Bilan énergétique
          </div>
          <div
            style={{
              fontFamily: "'Fraunces',serif",
              fontSize: 34,
              marginTop: 8,
              color: bilan.delta >= 0 ? "#FF8A4C" : "#FF5A5A",
            }}
          >
            {bilan.delta > 0 ? "+" : ""}
            {bilan.delta}
          </div>
          <div style={{ fontSize: 13, color: "#DFCBD8", marginTop: 6, lineHeight: 1.5 }}>
            {bilan.delta >= 0
              ? "Ta constellation te rend plus qu'elle ne te coûte."
              : "Ta constellation te coûte plus qu'elle ne te rend."}
            {bilan.vampires.length > 0 && (
              <>
                {" "}
                {bilan.vampires.length === 1
                  ? `« ${bilan.vampires[0].name} » draine sans rendre.`
                  : `${bilan.vampires.length} identités drainent sans rendre.`}
              </>
            )}
          </div>
        </div>
      )}

      {onDone && identities.length >= 2 && (
        <button
          onClick={onDone}
          style={{
            marginTop: 26,
            background: "#FF4FA3",
            color: "#0A090D",
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            fontFamily: "'Inter','Outfit',sans-serif",
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            padding: "17px 32px",
          }}
        >
          Continuer →
        </button>
      )}
    </div>
  );
}
