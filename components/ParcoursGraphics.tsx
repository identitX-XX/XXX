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
      {/* Bille 3D : lumière en haut-gauche, cœur doré, bord sombre → volume. */}
      <radialGradient id={`${id}-sphere`} cx="34%" cy="28%" r="80%">
        <stop offset="0%" stopColor="#faf1d8" />
        <stop offset="26%" stopColor={A} />
        <stop offset="78%" stopColor={B} />
        <stop offset="100%" stopColor="#171019" />
      </radialGradient>
      {/* Ombre portée douce (pour « poser » la sphère, lui donner du poids). */}
      <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
        <stop offset="65%" stopColor="#000000" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
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

// ── Planètes : trois territoires EN MOUVEMENT autour de l'identité ───────────
// Chaque planète orbite réellement (animateMotion le long de son ellipse), à sa
// propre vitesse — la figure vit au lieu d'être un schéma figé.
export function Planetes({ h = 200 }: { h?: number }) {
  const id = "pla";
  const cx = 160;
  const cy = 104;
  const orbites = [
    { r: 48, nom: "Perso", taille: 10, dur: 26, phase: -3 },
    { r: 74, nom: "Pro", taille: 11, dur: 38, phase: -16 },
    { r: 98, nom: "Relationnel", taille: 9, dur: 52, phase: -34 },
  ];
  // Ellipse fermée centrée sur le cœur, servant de rail à animateMotion.
  const rail = (r: number) => {
    const ry = r * 0.6;
    return `M ${cx - r} ${cy} a ${r} ${ry} 0 1 0 ${2 * r} 0 a ${r} ${ry} 0 1 0 ${-2 * r} 0`;
  };
  return (
    <svg viewBox="0 0 320 208" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      {/* Rails d'orbite (guides + chemins d'animation) */}
      {orbites.map((o, i) => (
        <path
          key={"r" + i}
          id={`${id}-rail-${i}`}
          d={rail(o.r)}
          fill="none"
          stroke={A}
          strokeWidth="1"
          opacity="0.28"
        />
      ))}
      {/* Cœur — l'identité, une petite sphère lumineuse (avec son ombre) */}
      <ellipse cx={cx} cy={cy + 16} rx="16" ry="5" fill={`url(#${id}-shadow)`} />
      <circle cx={cx} cy={cy} r="26" fill={`url(#${id}-halo)`} />
      <circle cx={cx} cy={cy} r="18" fill="none" stroke={A} strokeWidth="1.2" opacity="0.5" />
      <circle cx={cx} cy={cy} r="10" fill={`url(#${id}-sphere)`} filter={`url(#${id}-glow)`} />
      {/* Planètes en orbite : le groupe (origine 0,0) suit le rail. */}
      {orbites.map((o, i) => (
        <g key={"p" + i}>
          <ellipse cx={0} cy={o.taille + 6} rx={o.taille * 1.15} ry={o.taille * 0.36} fill={`url(#${id}-shadow)`} />
          <circle cx={0} cy={0} r={o.taille + 9} fill={`url(#${id}-halo)`} />
          <circle cx={0} cy={0} r={o.taille} fill={`url(#${id}-sphere)`} filter={`url(#${id}-glow)`} />
          <text x={0} y={-o.taille - 9} fill={INK} fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="inherit">
            {o.nom}
          </text>
          <animateMotion dur={`${o.dur}s`} begin={`${o.phase}s`} repeatCount="indefinite" rotate="0">
            <mpath href={`#${id}-rail-${i}`} xlinkHref={`#${id}-rail-${i}`} />
          </animateMotion>
        </g>
      ))}
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
        // Les barres « respirent » (largeur qui oscille légèrement) : l'écart
        // vit, il n'est jamais figé. Amplitude modérée pour rester dans le cadre.
        const lo = r.w - 6;
        const hi = r.w + 6;
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
            >
              <animate
                attributeName="width"
                values={`${lo};${hi};${lo}`}
                dur={`${4.2 + i * 0.9}s`}
                begin={`${-i * 1.3}s`}
                repeatCount="indefinite"
              />
            </rect>
          </g>
        );
      })}
      <path d="M214 30 q11 0 11 11 v24 q0 11 11 11 q-11 0 -11 11 v24 q0 11 -11 11" fill="none" stroke={`url(#${id}-or)`} strokeWidth="2" />
      <text x="242" y="84" fill={A} fontSize="13" fontWeight="800" fontFamily="inherit">
        l'écart
        <animate attributeName="opacity" values="0.65;1;0.65" dur="3.6s" repeatCount="indefinite" />
      </text>
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

// ── Sphère : les 30 jours — une VRAIE sphère (volume, méridiens, parallèles),
// avec un satellite qui l'orbite. Plus un cercle plat : du relief.
export function Orbite({ h = 208 }: { h?: number }) {
  const id = "orb";
  const cx = 160;
  const cy = 106;
  const R = 60;
  const oRx = 100;
  const oRy = 30; // anneau en perspective (aplati)
  const rail = `M ${cx - oRx} ${cy} a ${oRx} ${oRy} 0 1 0 ${2 * oRx} 0 a ${oRx} ${oRy} 0 1 0 ${-2 * oRx} 0`;
  const meridiens = [0.3, 0.62, 0.88].map((f) => R * f); // demi-largeurs des méridiens
  const paralleles = [-0.6, -0.28, 0.28, 0.6].map((f) => R * f); // décalages verticaux
  return (
    <svg viewBox="0 0 320 216" width="100%" height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      <clipPath id={`${id}-ball`}>
        <circle cx={cx} cy={cy} r={R} />
      </clipPath>

      {/* Ombre portée sous la sphère — elle « tient la route ». */}
      <ellipse cx={cx + 6} cy={cy + R + 14} rx={R * 0.82} ry={R * 0.17} fill={`url(#${id}-shadow)`} />

      {/* Halo + anneau orbital (derrière la sphère) */}
      <circle cx={cx} cy={cy} r={R + 22} fill={`url(#${id}-halo)`} />
      <ellipse cx={cx} cy={cy} rx={oRx} ry={oRy} fill="none" stroke={A} strokeWidth="1.2" opacity="0.3" />

      {/* La sphère : dégradé = lumière/volume */}
      <circle cx={cx} cy={cy} r={R} fill={`url(#${id}-sphere)`} />

      {/* Méridiens (longitudes) + parallèles (latitudes), clippés à la sphère */}
      <g clipPath={`url(#${id}-ball)`} stroke={B} fill="none" opacity="0.22" strokeWidth="1">
        <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} />
        {meridiens.map((m, i) => (
          <ellipse key={"m" + i} cx={cx} cy={cy} rx={m} ry={R} />
        ))}
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} />
        {paralleles.map((o, i) => {
          const w = Math.sqrt(Math.max(0, R * R - o * o));
          return <ellipse key={"p" + i} cx={cx} cy={cy + o} rx={w} ry={w * 0.16} />;
        })}
      </g>

      {/* Reflet spéculaire + liseré de bord (rebond de lumière) */}
      <ellipse cx={cx - R * 0.32} cy={cy - R * 0.38} rx={R * 0.28} ry={R * 0.18} fill="#fbf3dd" opacity="0.5" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={A} strokeWidth="1" opacity="0.5" />

      {/* Satellite en orbite (mouvement réel le long de l'anneau) */}
      <path id={`${id}-rail`} d={rail} fill="none" stroke="none" />
      <g>
        <circle cx={0} cy={0} r="11" fill={`url(#${id}-halo)`} />
        <circle cx={0} cy={0} r="5.5" fill={`url(#${id}-or)`} filter={`url(#${id}-glow)`} />
        <animateMotion dur="16s" repeatCount="indefinite" rotate="0">
          <mpath href={`#${id}-rail`} xlinkHref={`#${id}-rail`} />
        </animateMotion>
      </g>

      <text x={cx} y={cy + R + 26} fill={INK} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="inherit">
        30 jours
      </text>
    </svg>
  );
}
