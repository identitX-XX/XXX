"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; gold: boolean };

export function Welcome({ onStart }: { onStart: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = window.devicePixelRatio || 1;
    const N = 46;
    const LINK = 150;
    let W = 0;
    let H = 0;
    let raf = 0;
    const nodes: Node[] = [];

    const resize = () => {
      W = c.width = window.innerWidth * dpr;
      H = c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      if (nodes.length === 0) {
        for (let i = 0; i < N; i++) {
          nodes.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.14 * dpr,
            vy: (Math.random() - 0.5) * 0.14 * dpr,
            r: (Math.random() * 1.4 + 0.8) * dpr,
            gold: Math.random() < 0.35,
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
        }
      }
      for (let i = 0; i < N; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < N; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK * dpr) {
            const alpha = (1 - d / (LINK * dpr)) * 0.1;
            ctx.strokeStyle = "rgba(255,138,76," + alpha + ")";
            ctx.lineWidth = dpr * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.gold ? "rgba(255,79,163,.35)" : "rgba(255,138,76,.30)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const mask =
    "radial-gradient(ellipse 62% 62% at 50% 46%, #000 42%, rgba(0,0,0,.55) 60%, transparent 76%)";

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#0A090D",
        color: "#F4EEEA",
        fontFamily: "'Inter','Outfit',sans-serif",
        fontWeight: 300,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes idx-spin { to { transform: rotate(360deg) } }
        @keyframes idx-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
      `}</style>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.9 }}
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
            fontFamily: "'Fraunces',serif",
            fontWeight: 500,
            fontSize: 19,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Identit<span style={{ color: "#FF4FA3" }}>X</span>
        </div>

        <div
          role="img"
          aria-label="Portrait — Marina"
          style={{
            width: "min(76vw, 280px)",
            aspectRatio: "1 / 1",
            backgroundImage: "url('/hero.jpg')",
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
            fontFamily: "'Fraunces',serif",
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
              background: "linear-gradient(90deg,#FF4FA3,#FF8A4C)",
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
            fontFamily: "'Fraunces',serif",
            fontStyle: "italic",
            fontSize: 17,
            lineHeight: 1.5,
            color: "#DFCBD8",
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
                color: i % 2 === 0 ? "#FF8A4C" : "#F4EEEA",
                padding: "8px 14px",
                background: "rgba(255,138,76,.08)",
                borderRadius: 999,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div
          aria-hidden="true"
          style={{ position: "relative", width: 78, height: 78, margin: "30px 0 6px" }}
        >
          <div style={{ position: "absolute", inset: 0, animation: "idx-spin 9s linear infinite" }}>
            <span
              style={{
                position: "absolute",
                top: -4,
                left: "calc(50% - 4px)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF4FA3",
                boxShadow: "0 0 12px rgba(255,79,163,.8)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 12,
              animation: "idx-spin 14s linear infinite reverse",
            }}
          >
            <span
              style={{
                position: "absolute",
                bottom: -3,
                left: "calc(50% - 3px)",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FF8A4C",
                boxShadow: "0 0 10px rgba(255,138,76,.8)",
              }}
            />
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF4FA3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", inset: 20, width: 38, height: 38 }}
          >
            <circle cx="12" cy="12" r="9.2" />
            <path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5 5-2.2Z" />
          </svg>
        </div>

        <button
          onClick={onStart}
          style={{
            marginTop: 20,
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
      </main>
    </div>
  );
}
