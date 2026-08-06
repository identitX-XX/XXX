"use client";

// Symbolique premium du parcours — trait doré (accent de palette) sur fond
// sombre, glows discrets, nœuds vivants. Une figure par étape : ADN (signature),
// planètes (territoires), neurones (coach), arborescence (scénarios), orbite
// (quête), écart (exercices). Réutilisées dans l'onboarding et /presentation.

const A = "var(--fuchsia)"; // accent (or en Nuit & Or)
const INK = "var(--ink)";
const LINE = "var(--line)";
const MUT = "var(--muted)";

// ── ADN : double hélice — la signature comme code identitaire unique ─────────
export function ADN({ h = 132 }: { h?: number }) {
  const N = 13;
  const pts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const x = 30 + t * 260;
    const y1 = 66 + 40 * Math.sin(t * Math.PI * 3);
    const y2 = 66 - 40 * Math.sin(t * Math.PI * 3);
    return { x, y1, y2 };
  });
  const path = (k: "y1" | "y2") =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p[k].toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 320 132" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <g stroke={A} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d={path("y1")} opacity="0.9" />
        <path d={path("y2")} opacity="0.55" />
      </g>
      {pts.map((p, i) => (
        <line key={i} x1={p.x} y1={p.y1} x2={p.x} y2={p.y2} stroke={A} strokeWidth="1" opacity="0.32" />
      ))}
      {pts.map((p, i) => (
        <g key={"n" + i}>
          <circle cx={p.x} cy={p.y1} r={i % 2 ? 3 : 4} fill={A}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={p.x} cy={p.y2} r={i % 2 ? 3 : 4} fill={INK} opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}

// ── Planètes : trois territoires en orbite autour de l'identité ──────────────
export function Planetes({ h = 178 }: { h?: number }) {
  const orbites = [
    { r: 46, a: -28, nom: "Perso", fill: A, taille: 8 },
    { r: 70, a: 120, nom: "Pro", fill: INK, taille: 9 },
    { r: 92, a: 218, nom: "Relationnel", fill: A, taille: 7 },
  ];
  const cx = 160;
  const cy = 100;
  return (
    <svg viewBox="0 0 320 200" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      {orbites.map((o, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={o.r} ry={o.r * 0.6} fill="none" stroke={LINE} strokeWidth="1" />
      ))}
      <circle cx={cx} cy={cy} r="16" fill="none" stroke={A} strokeWidth="1" opacity="0.4" />
      <circle cx={cx} cy={cy} r="6" fill={A} />
      {orbites.map((o, i) => {
        const rad = (o.a * Math.PI) / 180;
        const x = cx + o.r * Math.cos(rad);
        const y = cy + o.r * 0.6 * Math.sin(rad);
        return (
          <g key={"p" + i}>
            <circle cx={x} cy={y} r={o.taille + 6} fill={o.fill} opacity="0.14" />
            <circle cx={x} cy={y} r={o.taille} fill={o.fill} />
            <text x={x} y={y - o.taille - 8} fill={INK} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="inherit">
              {o.nom}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Réseau de neurones : le coach / le moteur qui analyse et éclaire ─────────
export function Neurones({ h = 168 }: { h?: number }) {
  const layers: [number, number[]][] = [
    [40, [55, 105]],
    [130, [40, 82, 124, 166]],
    [220, [62, 112]],
    [290, [96]],
  ];
  const nodes: { x: number; y: number; on: boolean }[] = [];
  layers.forEach(([x, ys], li) => ys.forEach((y) => nodes.push({ x, y, on: li === 1 || li === 3 })));
  const links: [number, number, number, number][] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const [x1, ys1] = layers[li];
    const [x2, ys2] = layers[li + 1];
    ys1.forEach((y1) => ys2.forEach((y2) => links.push([x1, y1, x2, y2])));
  }
  return (
    <svg viewBox="0 0 320 200" width="100%" height={h} aria-hidden="true" style={{ display: "block" }}>
      <g stroke={A} strokeWidth="0.8" opacity="0.22">
        {links.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      {nodes.map((nd, i) => (
        <g key={i}>
          {nd.on && <circle cx={nd.x} cy={nd.y} r="10" fill={A} opacity="0.16" />}
          <circle cx={nd.x} cy={nd.y} r={nd.on ? 6 : 4} fill={nd.on ? A : INK} opacity={nd.on ? 1 : 0.6}>
            {nd.on && <animate attributeName="r" values="5;6.5;5" dur="2.6s" begin={`${i * 0.2}s`} repeatCount="indefinite" />}
          </circle>
        </g>
      ))}
    </svg>
  );
}

// ── Écart : croire / penser / faire — les exercices ──────────────────────────
export function EcartVisu({ h = 150 }: { h?: number }) {
  // Barres décalées (diagonale) : l'écart qui se creuse de « je crois » à « je
  // fais ». On garde tout DANS le cadre 320 pour que le label « l'écart » ne soit
  // jamais coupé à droite sur mobile.
  const rows = [
    { label: "Je crois", x: 24, w: 150 },
    { label: "Je pense", x: 50, w: 140 },
    { label: "Je fais", x: 82, w: 124 },
  ];
  return (
    <svg viewBox="0 0 320 150" width="100%" height={h} aria-hidden="true" style={{ display: "block" }}>
      {rows.map((r, i) => {
        const y = 28 + i * 42;
        return (
          <g key={i}>
            <text x="24" y={y - 8} fill={MUT} fontSize="11" fontFamily="inherit">
              {r.label}
            </text>
            <rect x={r.x} y={y} width={r.w} height="14" rx="7" fill={i === 2 ? A : "color-mix(in srgb, var(--fuchsia) 40%, transparent)"} />
          </g>
        );
      })}
      <path d="M214 28 q10 0 10 10 v22 q0 10 10 10 q-10 0 -10 10 v22 q0 10 -10 10" fill="none" stroke={A} strokeWidth="1.4" />
      <text x="240" y="77" fill={A} fontSize="12" fontWeight="700" fontFamily="inherit">l'écart</text>
    </svg>
  );
}

// ── Arborescence : ce que tes directions rendent possible (scénarios) ────────
export function Possibles({ h = 168 }: { h?: number }) {
  const start = { x: 40, y: 100 };
  const ends = [
    { x: 280, y: 42 },
    { x: 280, y: 92 },
    { x: 280, y: 142 },
  ];
  return (
    <svg viewBox="0 0 320 190" width="100%" height={h} aria-hidden="true" style={{ display: "block" }}>
      <g stroke={A} strokeWidth="1.6" fill="none">
        {ends.map((e, i) => (
          <path key={i} d={`M${start.x} ${start.y} C 150 ${start.y}, 150 ${e.y}, ${e.x} ${e.y}`} opacity="0.7" />
        ))}
      </g>
      <circle cx={start.x} cy={start.y} r="8" fill={A} />
      {ends.map((e, i) => (
        <g key={"e" + i}>
          <circle cx={e.x} cy={e.y} r="10" fill={A} opacity="0.16" />
          <circle cx={e.x} cy={e.y} r="6" fill={INK} />
        </g>
      ))}
    </svg>
  );
}

// ── Orbite : les 30 jours, la signature qui se déplace ───────────────────────
export function Orbite({ h = 176 }: { h?: number }) {
  const cx = 160;
  const cy = 96;
  const r = 66;
  const jalons = [0, 90, 180, 270];
  return (
    <svg viewBox="0 0 320 190" width="100%" height={h} aria-hidden="true" style={{ display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE} strokeWidth="1" />
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "idx-spin 22s linear infinite" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={A} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="60 350" opacity="0.9" />
      </g>
      {jalons.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 3.5} fill={A} opacity={i === 0 ? 1 : 0.55} />;
      })}
      <circle cx={cx} cy={cy} r="4" fill={A} />
      <text x={cx} y={cy - 14} fill={INK} fontSize="11" textAnchor="middle" fontFamily="inherit">30 jours</text>
    </svg>
  );
}
