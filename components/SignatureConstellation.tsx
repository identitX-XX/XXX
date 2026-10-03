"use client";

// « SignatureConstellation » — rend la composition générative (empreinte unique)
// et la fait SE CONSTRUIRE : les nœuds apparaissent du centre vers l'extérieur,
// puis les liens se tracent. Minéral (encre + poussière bleutée), le noyau
// primaire en ROUGE = signal/révélation. Respecte prefers-reduced-motion (le bloc
// global réduit les transitions à ~0 → apparition immédiate, parfaitement lisible).

import { useEffect, useRef, useState } from "react";
import type { Composition, NodeC } from "@/parcours-archetypes/constellationSignature";

const dist = (a: NodeC, b: NodeC) => Math.hypot(a.x - b.x, a.y - b.y);

function fill(n: NodeC): string {
  if (n.kind === "primary") return "var(--prune)"; // rouge signal
  if (n.kind === "secondary") return "var(--ink)";
  if (n.kind === "dimension") return "var(--ink)";
  return "var(--muted)"; // poussière
}

export function SignatureConstellation({
  composition,
  size = 320,
  className = "",
}: {
  composition: Composition;
  size?: number;
  className?: string;
}) {
  const [built, setBuilt] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [par, setPar] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = requestAnimationFrame(() => setBuilt(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Sensibilité très légère au curseur (desktop). Quelques pixels, jamais gadget.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || window.matchMedia?.("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      setPar({ x: dx * 8, y: dy * 8 });
    };
    const onLeave = () => setPar({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const { nodes, links } = composition;
  const byId = (id: number) => nodes.find((n) => n.id === id)!;
  const primary = nodes[0];

  // Ordre d'apparition : du noyau vers l'extérieur.
  const ordre = [...nodes].sort((a, b) => dist(a, primary) - dist(b, primary));
  const delai = new Map(ordre.map((n, i) => [n.id, i * 55]));
  const finNodes = ordre.length * 55;

  return (
    <div ref={wrapRef} className={className} style={{ width: size, maxWidth: "100%" }}>
      <svg viewBox="0 0 400 400" width="100%" role="img" aria-label="Ta constellation identitaire">
        <defs>
          <radialGradient id="idx-sig-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--prune)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--prune)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g
          style={{
            transform: `translate(${par.x}px, ${par.y}px)`,
            transition: "transform 0.5s var(--ease-out)",
          }}
        >
          {/* Halo très diffus derrière le noyau primaire (révélation). */}
          <circle
            cx={primary.x}
            cy={primary.y}
            r="70"
            fill="url(#idx-sig-halo)"
            style={{
              opacity: built ? 0.5 : 0,
              transition: `opacity var(--dur-slow) var(--ease-out)`,
              transitionDelay: `${finNodes + 200}ms`,
            }}
          />

          {/* Liens — se tracent après les premiers nœuds. */}
          <g stroke="var(--muted)" strokeWidth="0.8" strokeLinecap="round" fill="none">
            {links.map((l, i) => {
              const a = byId(l.a);
              const b = byId(l.b);
              const len = Math.hypot(a.x - b.x, a.y - b.y);
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  opacity={0.45}
                  strokeDasharray={len}
                  style={{
                    strokeDashoffset: built ? 0 : len,
                    transition: `stroke-dashoffset var(--dur-reveal) var(--ease-out)`,
                    transitionDelay: `${finNodes * 0.4 + i * 45}ms`,
                  }}
                />
              );
            })}
          </g>

          {/* Nœuds — apparaissent du centre vers l'extérieur. */}
          <g>
            {nodes.map((n) => (
              <circle
                key={n.id}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={fill(n)}
                opacity={n.kind === "ambient" ? 0.5 : 1}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  opacity: built ? (n.kind === "ambient" ? 0.5 : 1) : 0,
                  transform: built ? "scale(1)" : "scale(0.2)",
                  transition: `opacity var(--dur) var(--ease-out), transform var(--dur-slow) var(--ease-out)`,
                  transitionDelay: `${delai.get(n.id) ?? 0}ms`,
                }}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
