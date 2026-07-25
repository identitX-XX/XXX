"use client";

import { useEffect, useRef } from "react";

// Réseau de neurones animé — l'emblème de l'accueil. Un feed-forward qui
// « pense » : des couches de nœuds reliées, parcourues de signaux. Dessine
// dans l'accent de la palette courante (--fuchsia). Respecte prefers-reduced-motion.
export function NeuralNet({ size = 340 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = size;
    const H = Math.round(size * 0.82);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    // Lu à chaque frame : suit la palette même si la classe est appliquée
    // après le montage (l'effet parent tourne après l'effet enfant).
    const readAccent = () =>
      (
        getComputedStyle(document.documentElement).getPropertyValue("--fuchsia") ||
        "#c6a461"
      ).trim();

    // Couches du réseau (nombre de nœuds par colonne). Dense, pour une
    // présence forte ; se termine sur 3 « possibles ».
    const layers = [4, 7, 8, 6, 3];
    const padX = 24;
    const usableW = W - padX * 2;
    const nodes: { x: number; y: number; r: number; phase: number }[][] = [];

    layers.forEach((n, li) => {
      const col: typeof nodes[number] = [];
      const x = padX + (usableW * li) / (layers.length - 1);
      for (let i = 0; i < n; i++) {
        const y = (H * (i + 1)) / (n + 1);
        col.push({ x, y, r: 3.6, phase: Math.random() * Math.PI * 2 });
      }
      nodes.push(col);
    });

    // Arêtes entre couches consécutives.
    const edges: { a: [number, number]; b: [number, number] }[] = [];
    for (let li = 0; li < nodes.length - 1; li++) {
      for (let i = 0; i < nodes[li].length; i++) {
        for (let j = 0; j < nodes[li + 1].length; j++) {
          edges.push({ a: [li, i], b: [li + 1, j] });
        }
      }
    }

    // Signaux qui parcourent quelques arêtes.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const signals = Array.from({ length: reduced ? 0 : 14 }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.006,
    }));

    const nodeAt = (p: [number, number]) => nodes[p[0]][p[1]];
    let raf = 0;
    let frame = 0;

    const draw = () => {
      frame++;
      const accent = readAccent();
      ctx.clearRect(0, 0, W, H);

      // Arêtes (fines, discrètes).
      ctx.lineWidth = 0.6;
      for (const e of edges) {
        const a = nodeAt(e.a);
        const b = nodeAt(e.b);
        ctx.strokeStyle = hexA(accent, 0.14);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Signaux le long des arêtes.
      for (const s of signals) {
        const e = edges[s.edge];
        const a = nodeAt(e.a);
        const b = nodeAt(e.b);
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 5);
        grad.addColorStop(0, hexA(accent, 0.9));
        grad.addColorStop(1, hexA(accent, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        s.t += s.speed;
        if (s.t >= 1) {
          s.t = 0;
          s.edge = Math.floor(Math.random() * edges.length);
        }
      }

      // Nœuds (respiration douce).
      for (const col of nodes) {
        for (const nd of col) {
          const pulse = reduced ? 0.7 : 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(frame * 0.03 + nd.phase));
          ctx.fillStyle = hexA(accent, 0.25 + 0.5 * pulse);
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
          ctx.fill();
          // halo
          ctx.fillStyle = hexA(accent, 0.08 * pulse);
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, nd.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    // Un rAF avant la première frame : laisse l'effet parent poser la palette.
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return <canvas ref={ref} aria-hidden="true" style={{ display: "block" }} />;
}

// Convertit un hex (#rgb ou #rrggbb) en rgba() avec alpha.
function hexA(hex: string, a: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}
