// La constellation du jour : cinq signaux sur un pentagone, l'élan au centre.
// Chaque branche s'étend selon le score du signal (0–100) ; un signal absent
// reste au centre, en pointillé.

import type { NomSignal } from "@/lib/compagnon/elan";

const AXES: { nom: NomSignal; libelle: string; angle: number; ancre: "middle" | "start" | "end" }[] = [
  { nom: "sommeilMinutes", libelle: "SOMMEIL", angle: -90, ancre: "middle" },
  { nom: "cardioRepos", libelle: "CARDIO", angle: -18, ancre: "start" },
  { nom: "humeur", libelle: "HUMEUR", angle: 54, ancre: "start" },
  { nom: "energie", libelle: "ÉNERGIE", angle: 126, ancre: "end" },
  { nom: "ambition", libelle: "AMBITION", angle: 198, ancre: "end" },
];

const C = 150;
const R = 110;
const pt = (angle: number, r: number) => {
  const a = (angle * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const poly = (r: number) => AXES.map((x) => pt(x.angle, r).join(",")).join(" ");
const eclat = (s: number) => `M0,${-s} L${s / 4},${-s / 4} L${s},0 L${s / 4},${s / 4} L0,${s} L${-s / 4},${s / 4} L${-s},0 L${-s / 4},${-s / 4}Z`;

type Props = {
  elan: number | null;
  scores: Partial<Record<NomSignal, number>>;
  avecLibelles?: boolean;
  className?: string;
};

export function Constellation({ elan, scores, avecLibelles = true, className = "" }: Props) {
  const sommets = AXES.map((x) => pt(x.angle, Math.max(6, (R * (scores[x.nom] ?? 0)) / 100)));
  return (
    <svg
      viewBox={avecLibelles ? "-45 8 390 296" : "30 30 240 220"}
      className={className}
      role="img"
      aria-label={elan == null ? "Constellation du jour : pas encore de point." : `Constellation du jour. Élan ${elan} sur 100.`}
    >
      <polygon points={poly(R)} fill="none" stroke="rgba(183,162,122,0.35)" strokeWidth={avecLibelles ? 1 : 3} />
      {avecLibelles && <polygon points={poly(R / 2)} fill="none" stroke="rgba(183,162,122,0.2)" />}
      {avecLibelles &&
        AXES.map((x) => {
          const [x2, y2] = pt(x.angle, R);
          return <line key={x.nom} x1={C} y1={C} x2={x2} y2={y2} stroke="rgba(183,162,122,0.2)" />;
        })}
      {elan != null && (
        <polygon points={sommets.map((s) => s.join(",")).join(" ")} fill="rgba(90,23,38,0.6)" stroke="#b7a27a" strokeWidth={avecLibelles ? 1.5 : 4} />
      )}
      {avecLibelles &&
        AXES.map((x, i) => {
          const present = scores[x.nom] != null;
          const [sx, sy] = sommets[i];
          const [lx, ly] = pt(x.angle, R + 20);
          return (
            <g key={x.nom}>
              {elan != null && present && <path transform={`translate(${sx} ${sy})`} d={eclat(8)} fill="#f3ede3" />}
              <text
                x={lx}
                y={ly + 4}
                textAnchor={x.ancre}
                fill={present ? "#b7a27a" : "rgba(183,162,122,0.45)"}
                style={{ font: "600 11px var(--font-sans)", letterSpacing: "0.14em" }}
              >
                {x.libelle}
              </text>
            </g>
          );
        })}
      <text x={C} y={avecLibelles ? 160 : 170} textAnchor="middle" fill="#f3ede3" style={{ font: `500 ${avecLibelles ? 52 : 80}px var(--font-serif)` }}>
        {elan ?? "—"}
      </text>
      {avecLibelles && (
        <text x={C} y="182" textAnchor="middle" fill="#b7a27a" style={{ font: "600 10px var(--font-sans)", letterSpacing: "0.3em" }}>
          ÉLAN
        </text>
      )}
    </svg>
  );
}
