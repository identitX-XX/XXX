// Le motif graphique de la marque : « Choisir son cercle ». Trois orbites
// autour de « Vous » — sentimental (intime), relationnel, pro (le plus large).
// SVG pur, traits fins champagne, tracé progressif à l'arrivée.

const ANNEAUX = [
  { r: 72, label: "Sentimental", angle: -35 },
  { r: 128, label: "Relationnel", angle: 205 },
  { r: 184, label: "Pro", angle: 62 },
];

function point(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: 200 + r * Math.cos(a), y: 200 + r * Math.sin(a) };
}

export function Orbite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-80 -10 560 420" className={className} role="img" aria-label="Trois cercles autour de vous : sentimental, relationnel, pro">
      {ANNEAUX.map((a, i) => (
        <circle
          key={a.r}
          cx="200"
          cy="200"
          r={a.r}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          pathLength={1}
          className="orbite-trace"
          style={{ animationDelay: `${i * 0.25}s`, opacity: 0.55 - i * 0.1 }}
        />
      ))}
      {ANNEAUX.map((a, i) => {
        const p = point(a.r, a.angle);
        const aDroite = p.x >= 200;
        return (
          <g key={a.label} className="orbite-point" style={{ animationDelay: `${1.2 + i * 0.2}s` }}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="currentColor" />
            <text
              x={p.x + (aDroite ? 10 : -10)}
              y={p.y + 4}
              textAnchor={aDroite ? "start" : "end"}
              fill="currentColor"
              style={{ font: "500 14px var(--font-sans)", letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              {a.label}
            </text>
          </g>
        );
      })}
      <circle cx="200" cy="200" r="26" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <text x="200" y="206" textAnchor="middle" fill="currentColor" style={{ font: "italic 400 22px var(--font-serif)" }}>
        Vous
      </text>
    </svg>
  );
}
