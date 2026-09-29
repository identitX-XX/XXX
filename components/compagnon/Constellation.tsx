// La constellation du jour : cinq signaux sur un pentagone, l'élan au centre.
// Coordonnées pré-calculées (centre 150,150 ; rayon 110) pour un rendu stable.

const EXTERIEUR = "150,40 254.6,116 214.7,239 85.3,239 45.4,116";
const MILIEU = "150,95 202.3,133 182.3,194.5 117.7,194.5 97.7,133";
const VALEURS: [number, number][] = [
  [150, 59.8], // sommeil
  [223.2, 126.2], // cardio
  [198.5, 216.7], // humeur
  [98.3, 221.2], // énergie
  [50.6, 117.7], // ambition
];
const LIBELLES: { t: string; x: number; y: number; a: "middle" | "start" | "end" }[] = [
  { t: "SOMMEIL", x: 150, y: 24, a: "middle" },
  { t: "CARDIO", x: 266, y: 112, a: "start" },
  { t: "HUMEUR", x: 222, y: 262, a: "start" },
  { t: "ÉNERGIE", x: 78, y: 262, a: "end" },
  { t: "AMBITION", x: 34, y: 112, a: "end" },
];
const eclat = (s: number) => `M0,${-s} L${s / 4},${-s / 4} L${s},0 L${s / 4},${s / 4} L0,${s} L${-s / 4},${s / 4} L${-s},0 L${-s / 4},${-s / 4}Z`;

export function Constellation({ elan, avecLibelles = true, className = "" }: { elan: number; avecLibelles?: boolean; className?: string }) {
  return (
    <svg
      viewBox={avecLibelles ? "-45 8 390 296" : "30 30 240 220"}
      className={className}
      role="img"
      aria-label={`Constellation du jour : sommeil, cardio, humeur, énergie, ambition. Élan ${elan}.`}
    >
      <polygon points={EXTERIEUR} fill="none" stroke="rgba(183,162,122,0.35)" strokeWidth={avecLibelles ? 1 : 3} />
      {avecLibelles && <polygon points={MILIEU} fill="none" stroke="rgba(183,162,122,0.2)" />}
      {avecLibelles &&
        EXTERIEUR.split(" ").map((p) => {
          const [x, y] = p.split(",");
          return <line key={p} x1="150" y1="150" x2={x} y2={y} stroke="rgba(183,162,122,0.2)" />;
        })}
      <polygon points={VALEURS.map((v) => v.join(",")).join(" ")} fill="rgba(90,23,38,0.6)" stroke="#b7a27a" strokeWidth={avecLibelles ? 1.5 : 4} />
      {avecLibelles &&
        VALEURS.map(([x, y], i) => (
          <path key={i} transform={`translate(${x} ${y})`} d={eclat(i === 4 ? 10 : 8)} fill={i === 4 ? "#b7a27a" : "#f3ede3"} />
        ))}
      {avecLibelles &&
        LIBELLES.map((l) => (
          <text key={l.t} x={l.x} y={l.y} textAnchor={l.a} fill="#b7a27a" style={{ font: "600 11px var(--font-sans)", letterSpacing: "0.14em" }}>
            {l.t}
          </text>
        ))}
      <text x="150" y={avecLibelles ? 160 : 170} textAnchor="middle" fill="#f3ede3" style={{ font: `800 ${avecLibelles ? 52 : 80}px var(--font-serif)` }}>
        {elan}
      </text>
      {avecLibelles && (
        <text x="150" y="182" textAnchor="middle" fill="#b7a27a" style={{ font: "600 10px var(--font-sans)", letterSpacing: "0.3em" }}>
          ÉLAN
        </text>
      )}
    </svg>
  );
}
