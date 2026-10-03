"use client";

// « SignatureJoin » — à la clôture d'une capsule, le point du JOUR rejoint la
// constellation‑signature : la figure déjà là (en retrait), puis un nouveau nœud
// arrive de l'extérieur, se pose, un lien se trace vers son plus proche voisin,
// et un halo ROUGE (signal) le marque un instant. La capsule nourrit la signature
// — elle n'est plus un formulaire sans suite. Déterministe (même journée → même
// point). Respecte prefers-reduced-motion (tout est montré d'emblée, lisible).

import { useEffect, useState } from "react";
import type { Composition, NodeC } from "@/parcours-archetypes/constellationSignature";

const CENTER = 200;
const clamp = (v: number) => Math.max(18, Math.min(382, v));

function fill(n: NodeC): string {
  if (n.kind === "primary") return "var(--prune)";
  return "var(--ink)";
}

// Position déterministe du point du jour, sur une orbite semée. On évite le
// centre (réservé au noyau) et les bords. Le voisin le plus proche (hors
// poussière) reçoit le lien → le jour s'ancre à une vraie branche de la figure.
function pointDuJour(composition: Composition, seed: number) {
  const a = (seed % 360) * (Math.PI / 180);
  const rad = 92 + (seed % 7) * 6; // 92..128
  const x = clamp(CENTER + Math.cos(a) * rad);
  const y = clamp(CENTER + Math.sin(a) * rad);
  let best: NodeC | null = null;
  let bestD = Infinity;
  for (const n of composition.nodes) {
    if (n.kind === "ambient") continue;
    const d = Math.hypot(n.x - x, n.y - y);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return { x, y, voisin: best ?? composition.nodes[0] };
}

export function SignatureJoin({
  composition,
  seed,
  size = 220,
}: {
  composition: Composition;
  seed: number;
  size?: number;
}) {
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setJoined(true);
      return;
    }
    const t = setTimeout(() => setJoined(true), 360);
    return () => clearTimeout(t);
  }, []);

  const { nodes, links } = composition;
  const byId = (id: number) => nodes.find((n) => n.id === id)!;
  const primary = nodes[0];
  const jour = pointDuJour(composition, seed);

  // Vecteur d'entrée : le point arrive depuis l'extérieur, le long de son rayon.
  const ux = jour.x - CENTER;
  const uy = jour.y - CENTER;
  const norm = Math.hypot(ux, uy) || 1;
  const entryDx = (ux / norm) * 46;
  const entryDy = (uy / norm) * 46;

  const lienLen = Math.hypot(jour.x - jour.voisin.x, jour.y - jour.voisin.y);

  return (
    <div style={{ width: size, maxWidth: "100%", margin: "0 auto" }}>
      <svg viewBox="0 0 400 400" width="100%" role="img" aria-label="Ta capsule rejoint ta constellation">
        <defs>
          <radialGradient id="idx-join-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--prune)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--prune)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* La figure déjà là — en retrait, elle s'éclaire légèrement à l'arrivée. */}
        <g
          style={{
            opacity: joined ? 0.78 : 0.4,
            transition: "opacity var(--dur-slow) var(--ease-out)",
          }}
        >
          <g stroke="var(--muted)" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4">
            {links.map((l, i) => {
              const a = byId(l.a);
              const b = byId(l.b);
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
            })}
          </g>
          {nodes.map((n) => (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={fill(n)}
              opacity={n.kind === "ambient" ? 0.45 : 1}
            />
          ))}
        </g>

        {/* Le lien du jour — se trace vers le plus proche voisin, après l'arrivée. */}
        <line
          x1={jour.x}
          y1={jour.y}
          x2={jour.voisin.x}
          y2={jour.voisin.y}
          stroke="var(--prune)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
          strokeDasharray={lienLen}
          style={{
            strokeDashoffset: joined ? 0 : lienLen,
            transition: "stroke-dashoffset var(--dur-reveal) var(--ease-out)",
            transitionDelay: "240ms",
          }}
        />

        {/* Halo rouge (signal) — pulse une fois à l'arrivée. */}
        <circle
          cx={jour.x}
          cy={jour.y}
          r="34"
          fill="url(#idx-join-halo)"
          style={{
            opacity: joined ? 0.5 : 0,
            transformBox: "fill-box",
            transformOrigin: "center",
            transition: "opacity var(--dur-slow) var(--ease-out)",
            animation: joined ? "idx-pulse-ring 2.2s var(--ease-out) 0.3s 2" : undefined,
          }}
        />

        {/* Le point du jour — arrive de l'extérieur et se pose. */}
        <g
          style={{
            transform: joined ? "translate(0px, 0px)" : `translate(${entryDx}px, ${entryDy}px)`,
            transition: "transform var(--dur-slow) var(--ease-out)",
          }}
        >
          <circle
            cx={jour.x}
            cy={jour.y}
            r="5.5"
            fill="var(--prune)"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              opacity: joined ? 1 : 0,
              transform: joined ? "scale(1)" : "scale(0.2)",
              transition: "opacity var(--dur) var(--ease-out), transform var(--dur-slow) var(--ease-out)",
            }}
          />
        </g>
      </svg>
    </div>
  );
}
