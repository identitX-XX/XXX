"use client";

// Symbolique ÉPURÉE du parcours — le premium par la retenue. Traits fins (hairline),
// un seul accent doré, beaucoup d'air, un mouvement lent et discret. Pas de
// dégradés, pas de lueurs, pas d'ombres : de l'élégance, pas de la surcharge.
// Une figure par étape : ADN (signature), orbites (territoires), constellation
// (coach), arborescence (scénarios), cycle (quête), écart (exercices).

const A = "var(--fuchsia)"; // accent (or en Nuit & Or)
const INK = "var(--ink)";
const MUT = "var(--muted)";
const SW = 1.1; // épaisseur de trait unique (hairline)

// ── ADN : double hélice — la signature comme code unique ─────────────────────
export function ADN({ h = 120 }: { h?: number }) {
  const N = 11;
  const pts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const x = 40 + t * 240;
    const y1 = 60 + 34 * Math.sin(t * Math.PI * 2.4);
    const y2 = 60 - 34 * Math.sin(t * Math.PI * 2.4);
    return { x, y1, y2 };
  });
  const d = (k: "y1" | "y2") =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p[k].toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 320 120" width="100%" height={h} aria-hidden="true" style={{ display: "block" }}>
      <g stroke={A} strokeWidth={SW} fill="none" strokeLinecap="round">
        <path d={d("y1")} opacity="0.85" />
        <path d={d("y2")} opacity="0.85" />
      </g>
      {pts.map((p, i) => (
        <line key={i} x1={p.x} y1={p.y1} x2={p.x} y2={p.y2} stroke={A} strokeWidth={SW} opacity="0.18" />
      ))}
      {pts.map((p, i) => (
        <circle key={"d" + i} cx={p.x} cy={p.y1} r={i === Math.floor(N / 2) ? 3 : 2} fill={i === Math.floor(N / 2) ? A : INK} opacity={i === Math.floor(N / 2) ? 1 : 0.5} />
      ))}
    </svg>
  );
}

// Rail elliptique pour animateMotion.
function rail(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
}

// ── Orbites : trois territoires — anneaux fins, un point par territoire ───────
export function Planetes({ h = 150 }: { h?: number }) {
  const cx = 160;
  const cy = 78;
  const orbites = [
    { rx: 44, nom: "Perso", dur: 30, phase: -2 },
    { rx: 78, nom: "Pro", dur: 44, phase: -18 },
    { rx: 112, nom: "Relationnel", dur: 60, phase: -40 },
  ];
  return (
    <svg viewBox="0 0 320 156" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      {orbites.map((o, i) => (
        <path key={"r" + i} id={`epla-${i}`} d={rail(cx, cy, o.rx, o.rx * 0.42)} fill="none" stroke={A} strokeWidth={SW} opacity="0.3" />
      ))}
      {/* Cœur — un simple point */}
      <circle cx={cx} cy={cy} r="3.5" fill={A} />
      {orbites.map((o, i) => (
        <g key={"p" + i}>
          <circle cx={0} cy={0} r="3.5" fill={A} />
          <text x={0} y={-9} fill={MUT} fontSize="11" textAnchor="middle" fontFamily="inherit">
            {o.nom}
          </text>
          <animateMotion dur={`${o.dur}s`} begin={`${o.phase}s`} repeatCount="indefinite" rotate="0">
            <mpath href={`#epla-${i}`} xlinkHref={`#epla-${i}`} />
          </animateMotion>
        </g>
      ))}
    </svg>
  );
}

// ── Constellation : le coach — points reliés, sobres ─────────────────────────
export function Neurones({ h = 140 }: { h?: number }) {
  const nodes = [
    { x: 60, y: 44, on: false }, { x: 60, y: 96, on: false },
    { x: 150, y: 30, on: true }, { x: 150, y: 70, on: true }, { x: 150, y: 110, on: false },
    { x: 240, y: 52, on: false }, { x: 240, y: 92, on: true },
  ];
  const links: [number, number][] = [
    [0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6],
  ];
  return (
    <svg viewBox="0 0 320 140" width="100%" height={h} aria-hidden="true" style={{ display: "block" }}>
      <g stroke={A} strokeWidth={SW} opacity="0.2">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.on ? 3.5 : 2.5} fill={n.on ? A : INK} opacity={n.on ? 1 : 0.5}>
          {n.on && <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />}
        </circle>
      ))}
    </svg>
  );
}

// ── Écart : croire / penser / faire — trois traits fins décalés ──────────────
export function EcartVisu({ h = 138 }: { h?: number }) {
  const rows = [
    { label: "Je crois", x: 24, w: 150 },
    { label: "Je pense", x: 48, w: 140 },
    { label: "Je fais", x: 78, w: 128 },
  ];
  return (
    <svg viewBox="0 0 320 140" width="100%" height={h} aria-hidden="true" style={{ display: "block" }}>
      {rows.map((r, i) => {
        const y = 26 + i * 38;
        const actif = i === 2;
        return (
          <g key={i}>
            <text x="24" y={y - 8} fill={actif ? INK : MUT} fontSize="11" fontFamily="inherit">
              {r.label}
            </text>
            <line
              x1={r.x}
              y1={y}
              x2={r.x + r.w}
              y2={y}
              stroke={A}
              strokeWidth={actif ? 3 : 2}
              strokeLinecap="round"
              opacity={actif ? 1 : 0.4}
            >
              <animate attributeName="x2" values={`${r.x + r.w - 6};${r.x + r.w + 6};${r.x + r.w - 6}`} dur={`${5 + i}s`} begin={`${-i}s`} repeatCount="indefinite" />
            </line>
          </g>
        );
      })}
      {/* Accolade fine + label */}
      <path d="M218 26 q8 0 8 9 v18 q0 9 8 9 q-8 0 -8 9 v18 q0 9 -8 9" fill="none" stroke={A} strokeWidth={SW} opacity="0.7" />
      <text x="240" y="70" fill={A} fontSize="12" fontWeight="600" fontFamily="inherit">l'écart</text>
    </svg>
  );
}

// ── Arborescence : ce que tes directions rendent possible ────────────────────
export function Possibles({ h = 140 }: { h?: number }) {
  const start = { x: 44, y: 70 };
  const ends = [
    { x: 276, y: 30 },
    { x: 276, y: 70 },
    { x: 276, y: 110 },
  ];
  return (
    <svg viewBox="0 0 320 140" width="100%" height={h} aria-hidden="true" style={{ display: "block" }}>
      <g stroke={A} strokeWidth={SW} fill="none" opacity="0.7">
        {ends.map((e, i) => (
          <path key={i} d={`M${start.x} ${start.y} C 160 ${start.y}, 160 ${e.y}, ${e.x} ${e.y}`} />
        ))}
      </g>
      <circle cx={start.x} cy={start.y} r="3.5" fill={A} />
      {ends.map((e, i) => (
        <circle key={"e" + i} cx={e.x} cy={e.y} r="3" fill={A} opacity={0.85}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

// ── Cycle : les 30 jours — un anneau fin, un point qui l'orbite ──────────────
export function Orbite({ h = 150 }: { h?: number }) {
  const cx = 160;
  const cy = 76;
  const r = 54;
  return (
    <svg viewBox="0 0 320 156" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={A} strokeWidth={SW} opacity="0.4" />
      {/* jalons discrets */}
      {[0, 90, 180, 270].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        return (
          <circle key={i} cx={cx + r * Math.cos(rad)} cy={cy + r * Math.sin(rad)} r="1.6" fill={A} opacity="0.4" />
        );
      })}
      <path id="eorb" d={rail(cx, cy, r, r)} fill="none" stroke="none" />
      <g>
        <circle cx={0} cy={0} r="4" fill={A} />
        <animateMotion dur="18s" repeatCount="indefinite" rotate="0">
          <mpath href="#eorb" xlinkHref="#eorb" />
        </animateMotion>
      </g>
      <text x={cx} y={cy + 4} fill={INK} fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="inherit">30 jours</text>
    </svg>
  );
}
