"use client";

import { Emblem } from "./Emblem";
import { ConstellationBg } from "./ConstellationBg";

// Écran d'accueil = première impression, donc surface de conversion n°1.
// On y vend la transformation (le résultat), pas les fonctionnalités : promesse
// claire, trois piliers de valeur, une réassurance, un seul CTA confiant.
export function Welcome({ onStart }: { onStart: () => void }) {
  const mask =
    "radial-gradient(ellipse 62% 62% at 50% 46%, black 42%, rgba(0,0,0,.55) 60%, transparent 76%)";

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
            "radial-gradient(55% 40% at 88% 8%, rgba(255,138,76,.10), transparent 70%), radial-gradient(45% 32% at 8% 92%, rgba(255,79,163,.07), transparent 70%)",
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

        <div
          role="img"
          aria-label="Portrait"
          style={{
            width: "min(58vw, 190px)",
            aspectRatio: "1 / 1",
            backgroundImage: "url('/hero.jpg%20.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitMaskImage: mask,
            maskImage: mask,
            marginBottom: 6,
            animation: "idx-breathe 8s ease-in-out infinite",
          }}
        />

        <h1
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontWeight: 400,
            fontSize: "clamp(30px,7.2vw,50px)",
            lineHeight: 1.06,
            letterSpacing: "-.01em",
            margin: "6px 0 0",
            maxWidth: 620,
          }}
        >
          Un scénario clair,{" "}
          <span
            style={{
              background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            aligné sur qui tu es.
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontStyle: "italic",
            fontSize: 17,
            lineHeight: 1.5,
            color: "var(--muted)",
            maxWidth: 440,
            margin: "18px 0 0",
          }}
        >
          En 30 jours, transforme tes objectifs dispersés — perso, pro,
          relationnel — en une trajectoire nette.
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
            { i: "🧭", t: "Ton archétype", s: "révélé en 12 questions" },
            { i: "📅", t: "30 jours guidés", s: "une capsule, ≈ 4 min/jour" },
            { i: "✨", t: "Ton scénario", s: "3 sorties activables" },
          ].map((p) => (
            <div
              key={p.t}
              style={{
                padding: "16px 10px",
                borderRadius: 16,
                border: "1px solid var(--line)",
                background:
                  "radial-gradient(130% 130% at 50% 0%, rgba(255,255,255,.04), rgba(255,255,255,0) 100%)",
              }}
            >
              <div style={{ fontSize: 22, lineHeight: 1 }}>{p.i}</div>
              <div
                style={{
                  marginTop: 8,
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
          <span aria-hidden="true">🔒</span>
          100 % local — rien ne quitte ton appareil.
        </div>

        <div style={{ margin: "26px 0 4px" }}>
          <Emblem size={64} />
        </div>

        <button
          onClick={onStart}
          style={{
            marginTop: 16,
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
