"use client";

import { Lock } from "lucide-react";
import { ConstellationBg } from "./ConstellationBg";
import { Constellation } from "./Constellation";

// Écran d'accueil = première impression, donc surface de conversion n°1.
// On y vend la transformation (le résultat), pas les fonctionnalités : promesse
// claire, trois piliers de valeur, une réassurance, un seul CTA confiant.
export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--noir)",
        color: "var(--ink)",
        fontFamily: "var(--font-inter),'Outfit',sans-serif",
        fontWeight: 300,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ConstellationBg
        count={46}
        speed={0.14}
        linkOpacity={0.1}
        dotFuchsia={0.35}
        dotOrange={0.3}
        opacity={0.9}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(55% 40% at 88% 8%, color-mix(in srgb, var(--orange) 10%, transparent), transparent 70%), radial-gradient(45% 32% at 8% 92%, color-mix(in srgb, var(--fuchsia) 7%, transparent), transparent 70%)",
        }}
      />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "56px 24px 64px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontWeight: 500,
            fontSize: 18,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            marginBottom: 22,
          }}
        >
          Identit<span style={{ color: "var(--fuchsia)" }}>X</span>
        </div>

        <div style={{ marginTop: -4, marginBottom: 12 }}>
          <Constellation size={300} />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontWeight: 400,
            fontSize: "clamp(28px,6.4vw,46px)",
            lineHeight: 1.08,
            letterSpacing: "-.01em",
            margin: "0",
            maxWidth: 680,
          }}
        >
          <span
            style={{
              background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Explore tes constellations identitaires
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontStyle: "italic",
            fontSize: 18,
            lineHeight: 1.5,
            color: "var(--muted)",
            maxWidth: 460,
            margin: "16px 0 0",
          }}
        >
          pour voir émerger tes possibles.
        </p>

        {/* Trois piliers de valeur : ce que l'utilisateur repart avec. */}
        <div
          style={{
            marginTop: 30,
            maxWidth: 460,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {[
            { t: "Ton archétype", s: "révélé en 12 questions" },
            { t: "30 jours guidés", s: "une capsule, ≈ 4 min/jour" },
            { t: "Tes scénarios", s: "3 possibles activables" },
          ].map((p) => (
            <div
              key={p.t}
              style={{
                padding: "18px 12px",
                borderRadius: 16,
                border: "1px solid var(--line)",
                background:
                  "radial-gradient(130% 130% at 50% 0%, rgba(255,255,255,.04), rgba(255,255,255,0) 100%)",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "var(--fuchsia)",
                  margin: "0 auto 12px",
                }}
              />
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--ink)",
                }}
              >
                {p.t}
              </div>
              <div style={{ marginTop: 3, fontSize: 11, color: "var(--muted)" }}>
                {p.s}
              </div>
            </div>
          ))}
        </div>

        {/* Réassurance : le local-first est un argument, pas un détail. */}
        <div
          style={{
            marginTop: 18,
            fontSize: 12,
            color: "var(--muted)",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <Lock size={12} aria-hidden="true" />
          100 % local — rien ne quitte ton appareil.
        </div>

        <button
          onClick={onStart}
          style={{
            marginTop: 30,
            background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
            fontFamily: "var(--font-inter),'Outfit',sans-serif",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: ".01em",
            padding: "16px 34px",
            boxShadow: "0 10px 40px -12px var(--fuchsia)",
          }}
        >
          Commencer ma quête →
        </button>

        <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--muted)" }}>
          Accès sur invitation · tes journées déjà vécues t'attendent.
        </div>
      </main>
    </div>
  );
}
