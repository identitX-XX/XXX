"use client";

// La carte identitaire de la boucle : les dimensions en hexagone, éclairées à
// mesure qu'on les explore, reliées par les connexions révélées. La dernière
// connexion (celle qu'on vient de révéler) pulse pour attirer l'œil.
import { DIMENSIONS, DIM_KEYS, DimKey } from "./dimensions";
import type { Connexion } from "./store";

const W = 320;
const H = 280;
const CX = 160;
const CY = 140;
const R = 100;

function pos(i: number): { x: number; y: number } {
  const ang = (-90 + i * 60) * (Math.PI / 180);
  return { x: CX + R * Math.cos(ang), y: CY + R * Math.sin(ang) };
}

const POS: Record<DimKey, { x: number; y: number }> = Object.fromEntries(
  DIM_KEYS.map((k, i) => [k, pos(i)])
) as Record<DimKey, { x: number; y: number }>;

export function CarteBoucle({
  dimensions,
  connexions,
  highlight,
}: {
  dimensions: Record<string, number>;
  connexions: Connexion[];
  highlight?: [DimKey, DimKey];
}) {
  const estHL = (a: DimKey, b: DimKey) =>
    !!highlight &&
    ((highlight[0] === a && highlight[1] === b) ||
      (highlight[0] === b && highlight[1] === a));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }} aria-hidden="true">
      {/* liens de trame (éteints) entre voisins, pour donner une structure douce */}
      <g stroke="var(--line)" strokeWidth="1">
        {DIM_KEYS.map((k, i) => {
          const a = POS[k];
          const b = POS[DIM_KEYS[(i + 1) % DIM_KEYS.length]];
          return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity="0.5" />;
        })}
      </g>

      {/* connexions révélées */}
      {connexions.map((c, i) => {
        const a = POS[c.a];
        const b = POS[c.b];
        const hl = estHL(c.a, c.b);
        return (
          <g key={i}>
            {hl && (
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--fuchsia)"
                strokeWidth="10"
                opacity="0.25"
                strokeLinecap="round"
              >
                <animate attributeName="opacity" values="0.12;0.32;0.12" dur="2.2s" repeatCount="indefinite" />
              </line>
            )}
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--fuchsia)"
              strokeWidth={hl ? 3 : 2}
              strokeLinecap="round"
              opacity={hl ? 1 : 0.55}
            />
          </g>
        );
      })}

      {/* nœuds */}
      {DIM_KEYS.map((k) => {
        const p = POS[k];
        const on = (dimensions[k] ?? 0) > 0;
        const hl = !!highlight && (highlight[0] === k || highlight[1] === k);
        return (
          <g key={k}>
            {on && <circle cx={p.x} cy={p.y} r="16" fill="var(--fuchsia)" opacity="0.16" />}
            <circle
              cx={p.x}
              cy={p.y}
              r={on ? 9 : 6}
              fill={on ? "var(--fuchsia)" : "var(--raised)"}
              stroke={on ? "var(--fuchsia)" : "var(--line)"}
              strokeWidth="1.5"
            />
            <text
              x={p.x}
              y={p.y < CY ? p.y - 16 : p.y + 24}
              fill={on ? "var(--ink)" : "var(--muted)"}
              fontSize="12.5"
              fontWeight={hl ? 700 : 500}
              textAnchor="middle"
              fontFamily="inherit"
            >
              {DIMENSIONS[k].nom}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
