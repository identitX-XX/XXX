"use client";

import { Emblem } from "./Emblem";
import { ConstellationBg } from "./ConstellationBg";

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
            fontSize: 19,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Identit<span style={{ color: "var(--fuchsia)" }}>X</span>
        </div>

        <div
          role="img"
          aria-label="Portrait — Marina"
          style={{
            width: "min(76vw, 280px)",
            aspectRatio: "1 / 1",
            backgroundImage: "url('/hero.jpg%20.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitMaskImage: mask,
            maskImage: mask,
            marginBottom: 10,
            animation: "idx-breathe 8s ease-in-out infinite",
          }}
        />

        <h1
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontWeight: 400,
            fontSize: "clamp(28px,7.4vw,52px)",
            lineHeight: 1.08,
            letterSpacing: "-.01em",
            margin: "8px 0 0",
          }}
        >
          Bienvenue dans{" "}
          <span
            style={{
              background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            IdentitX
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontStyle: "italic",
            fontSize: 17,
            lineHeight: 1.5,
            color: "var(--muted)",
            maxWidth: 420,
            margin: "18px 0 0",
          }}
        >
          Explore ta constellation identitaire — et transforme-la en trajectoire.
        </p>

        <div
          style={{
            marginTop: 28,
            maxWidth: 420,
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
            padding: "20px 18px",
            background:
              "radial-gradient(130% 130% at 50% 0%, rgba(38,22,41,.5), rgba(10,9,13,0) 100%)",
            borderRadius: 20,
          }}
        >
          {["Moi", "Marina", "Origine X", "Optimiste"].map((t, i) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: i % 2 === 0 ? "var(--orange)" : "var(--ink)",
                padding: "8px 14px",
                background: "rgba(255,138,76,.08)",
                borderRadius: 999,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ margin: "30px 0 6px" }}>
          <Emblem size={78} />
        </div>

        <button
          onClick={onStart}
          style={{
            marginTop: 20,
            background: "var(--fuchsia)",
            color: "var(--noir)",
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            fontFamily: "var(--font-inter),'Outfit',sans-serif",
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            padding: "17px 32px",
          }}
        >
          Continuer →
        </button>
      </main>
    </div>
  );
}
