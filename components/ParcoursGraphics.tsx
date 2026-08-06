"use client";

// Symbolique premium du parcours — trait doré (accent de palette) sur fond
// sombre, halos lumineux, dégradés, nœuds vivants. Une figure par étape : ADN
// (signature), planètes (territoires), neurones (coach), arborescence
// (scénarios), orbite (quête), écart (exercices). Réutilisées dans l'onboarding
// et /presentation. Objectif : de la PRÉSENCE et du CARACTÈRE, pas du trait timide.

const A = "var(--fuchsia)"; // accent (or en Nuit & Or)
const B = "var(--orange)"; // second ton doré (dégradé)
const INK = "var(--ink)";
const LINE = "var(--line)";
const MUT = "var(--muted)";

// Dégradé doré + halo lumineux, définis une fois par figure (id unique).
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-or`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={A} />
        <stop offset="100%" stopColor={B} />
      </linearGradient>
      <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={A} stopOpacity="0.55" />
        <stop offset="100%" stopColor={A} stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="0" dy="0" stdDeviation="3.4" floodColor={A} floodOpacity="0.7" />
      </filter>
    </defs>
  );
}

// ── ADN : double hélice — la signature comme code identitaire unique ─────────
export function ADN({ h = 156 }: { h?: number }) {
  const id = "adn";
  const N = 13;
  const pts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const x = 30 + t * 260;
    const y1 = 70 + 44 * Math.sin(t * Math.PI * 3);
    const y2 = 70 - 44 * Math.sin(t * Math.PI * 3);
    return { x, y1, y2 };
  });
  const path = (k: "y1" | "y2") =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p[k].toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 320 148" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      <g stroke={`url(#${id}-or)`} strokeWidth="3.4" fill="none" strokeLinecap="round" filter={`url(#${id}-glow)`}>
        <path d={path("y1")} opacity="1" />
        <path d={path("y2")} opacity="0.7" />
      </g>
      {pts.map((p, i) => (
        <line key={i} x1={p.x} y1={p.y1} x2={p.x} y2={p.y2} stroke={A} strokeWidth="1.4" opacity="0.4" />
      ))}
      {pts.map((p, i) => (
        <g key={"n" + i}>
          <circle cx={p.x} cy={p.y1} r="11" fill={`url(#${id}-halo)`} />
          <circle cx={p.x} cy={p.y1} r={i % 2 ? 4 : 5.5} fill={`url(#${id}-or)`}>
            <animate attributeName="opacity" values="0.65;1;0.65" dur="3.4s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={p.x} cy={p.y2} r={i % 2 ? 3.5 : 4.5} fill={INK} opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

// ── Planètes : trois territoires en orbite autour de l'identité ──────────────
export function Planetes({ h = 200 }: { h?: number }) {
  const id = "pla";
  const orbites = [
    { r: 48, a: -28, nom: "Perso", taille: 10 },
    { r: 74, a: 120, nom: "Pro", taille: 11 },
    { r: 98, a: 218, nom: "Relationnel", taille: 9 },
  ];
  const cx = 160;
  const cy = 104;
  return (
    <svg viewBox="0 0 320 208" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      {orbites.map((o, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={o.r} ry={o.r * 0.6} fill="none" stroke={A} strokeWidth="1" opacity="0.28" />
      ))}
      {/* Cœur — l'identité */}
      <circle cx={cx} cy={cy} r="26" fill={`url(#${id}-halo)`} />
      <circle cx={cx} cy={cy} r="18" fill="none" stroke={A} strokeWidth="1.2" opacity="0.5" />
      <circle cx={cx} cy={cy} r="8" fill={`url(#${id}-or)`} filter={`url(#${id}-glow)`} />
      {orbites.map((o, i) => {
        const rad = (o.a * Math.PI) / 180;
        const x = cx + o.r * Math.cos(rad);
        const y = cy + o.r * 0.6 * Math.sin(rad);
        return (
          <g key={"p" + i}>
            <circle cx={x} cy={y} r={o.taille + 9} fill={`url(#${id}-halo)`} />
            <circle cx={x} cy={y} r={o.taille} fill={`url(#${id}-or)`} filter={`url(#${id}-glow)`} />
            <text x={x} y={y - o.taille - 9} fill={INK} fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="inherit">
              {o.nom}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Réseau de neurones : le coach / le moteur qui analyse et éclaire ─────────
export function Neurones({ h = 190 }: { h?: number }) {
  const id = "neu";
  const layers: [number, number[]][] = [
    [42, [58, 118]],
    [130, [42, 88, 132, 178]],
    [220, [66, 124]],
    [292, [96]],
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
    <svg viewBox="0 0 320 210" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      <g stroke={`url(#${id}-or)`} strokeWidth="1.2" opacity="0.32">
        {links.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      {nodes.map((nd, i) => (
        <g key={i}>
          {nd.on && <circle cx={nd.x} cy={nd.y} r="14" fill={`url(#${id}-halo)`} />}
          <circle
            cx={nd.x}
            cy={nd.y}
            r={nd.on ? 7 : 4.5}
            fill={nd.on ? `url(#${id}-or)` : INK}
            opacity={nd.on ? 1 : 0.65}
            filter={nd.on ? `url(#${id}-glow)` : undefined}
          >
            {nd.on && <animate attributeName="r" values="6;8;6" dur="2.6s" begin={`${i * 0.2}s`} repeatCount="indefinite" />}
          </circle>
        </g>
      ))}
    </svg>
  );
}

// ── Écart : croire / penser / faire — les exercices ──────────────────────────
export function EcartVisu({ h = 164 }: { h?: number }) {
  const id = "eca";
  // Barres décalées (diagonale) : l'écart qui se creuse de « je crois » à « je
  // fais ». On garde tout DANS le cadre 320 pour que le label « l'écart » ne soit
  // jamais coupé à droite sur mobile.
  const rows = [
    { label: "Je crois", x: 24, w: 150 },
    { label: "Je pense", x: 50, w: 140 },
    { label: "Je fais", x: 82, w: 124 },
  ];
  return (
    <svg viewBox="0 0 320 162" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      {rows.map((r, i) => {
        const y = 30 + i * 46;
        const actif = i === 2;
        return (
          <g key={i}>
            <text x="24" y={y - 9} fill={i === 2 ? INK : MUT} fontSize="12" fontWeight={i === 2 ? 700 : 500} fontFamily="inherit">
              {r.label}
            </text>
            <rect
              x={r.x}
              y={y}
              width={r.w}
              height="17"
              rx="8.5"
              fill={actif ? `url(#${id}-or)` : "color-mix(in srgb, var(--fuchsia) 34%, transparent)"}
              filter={actif ? `url(#${id}-glow)` : undefined}
            />
          </g>
        );
      })}
      <path d="M214 30 q11 0 11 11 v24 q0 11 11 11 q-11 0 -11 11 v24 q0 11 -11 11" fill="none" stroke={`url(#${id}-or)`} strokeWidth="2" />
      <text x="242" y="84" fill={A} fontSize="13" fontWeight="800" fontFamily="inherit">l'écart</text>
    </svg>
  );
}

// ── Arborescence : ce que tes directions rendent possible (scénarios) ────────
export function Possibles({ h = 186 }: { h?: number }) {
  const id = "pos";
  const start = { x: 42, y: 104 };
  const ends = [
    { x: 280, y: 44 },
    { x: 280, y: 104 },
    { x: 280, y: 164 },
  ];
  return (
    <svg viewBox="0 0 320 208" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      <g stroke={`url(#${id}-or)`} strokeWidth="2.4" fill="none" strokeLinecap="round" filter={`url(#${id}-glow)`}>
        {ends.map((e, i) => (
          <path key={i} d={`M${start.x} ${start.y} C 152 ${start.y}, 152 ${e.y}, ${e.x} ${e.y}`} opacity="0.85" />
        ))}
      </g>
      <circle cx={start.x} cy={start.y} r="14" fill={`url(#${id}-halo)`} />
      <circle cx={start.x} cy={start.y} r="9" fill={`url(#${id}-or)`} filter={`url(#${id}-glow)`} />
      {ends.map((e, i) => (
        <g key={"e" + i}>
          <circle cx={e.x} cy={e.y} r="15" fill={`url(#${id}-halo)`} />
          <circle cx={e.x} cy={e.y} r="8" fill={`url(#${id}-or)`} filter={`url(#${id}-glow)`}>
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

// ── Orbite : les 30 jours, la signature qui se déplace ───────────────────────
export function Orbite({ h = 192 }: { h?: number }) {
  const id = "orb";
  const cx = 160;
  const cy = 100;
  const r = 72;
  const jalons = [0, 90, 180, 270];
  return (
    <svg viewBox="0 0 320 200" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={A} strokeWidth="1" opacity="0.28" />
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "idx-spin 20s linear infinite" }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#${id}-or)`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="70 382"
          filter={`url(#${id}-glow)`}
        />
      </g>
      {jalons.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <g key={i}>
            {i === 0 && <circle cx={x} cy={y} r="13" fill={`url(#${id}-halo)`} />}
            <circle cx={x} cy={y} r={i === 0 ? 7 : 4} fill={`url(#${id}-or)`} opacity={i === 0 ? 1 : 0.6} filter={i === 0 ? `url(#${id}-glow)` : undefined} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="18" fill={`url(#${id}-halo)`} />
      <circle cx={cx} cy={cy} r="5" fill={`url(#${id}-or)`} />
      <text x={cx} y={cy - 16} fill={INK} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="inherit">30 jours</text>
    </svg>
  );
}
