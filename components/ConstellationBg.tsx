"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; gold: boolean };

/**
 * Fond animé « constellation » (canvas de particules reliées).
 * Auparavant dupliqué entre Welcome (hero) et Synthese (fond discret).
 * Les props reproduisent à l'identique les deux réglages.
 */
export function ConstellationBg({
  count = 40,
  speed = 0.12,
  linkOpacity = 0.08,
  dotFuchsia = 0.3,
  dotOrange = 0.26,
  opacity = 0.8,
}: {
  count?: number;
  speed?: number;
  linkOpacity?: number;
  dotFuchsia?: number;
  dotOrange?: number;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = window.devicePixelRatio || 1;
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
        for (let i = 0; i < count; i++) {
          nodes.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * speed * dpr,
            vy: (Math.random() - 0.5) * speed * dpr,
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
      for (let i = 0; i < count; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < count; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK * dpr) {
            ctx.strokeStyle =
              "rgba(255,138,76," + (1 - d / (LINK * dpr)) * linkOpacity + ")";
            ctx.lineWidth = dpr * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.gold
          ? "rgba(255,79,163," + dotFuchsia + ")"
          : "rgba(255,138,76," + dotOrange + ")";
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
  }, [count, speed, linkOpacity, dotFuchsia, dotOrange]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity,
      }}
    />
  );
}
