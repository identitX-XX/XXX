"use client";
// parcours-archetypes/components/charts.tsx
// Visualisations. Recharts pour radar/courbes/barres, heatmap en CSS pur.
// Style aligné IdentitX (noir/fuchsia/orange, Fraunces/Inter). Autonome : ces
// composants n'exigent pas la config Tailwind du projet (styles inline).

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CelluleEmotion,
  PartSphere,
  PointEvolution,
  PointRadar,
  Progression,
} from "../indicateurs";

const FUCHSIA = "#ff4fa3";
const ORANGE = "#ff8a4c";
const LINE = "rgba(255,255,255,0.10)";
const MUTED = "rgba(240,235,246,0.55)";
const INK = "#f2eef5";
const SURFACE = "rgba(255,255,255,0.03)";

const tooltipStyle = {
  background: "#14121a",
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  color: INK,
  fontSize: 12,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
};

function Titre({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: MUTED,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

// 1. Radar des 12 archétypes — la pièce signature.
export function RadarArchetypes({ data }: { data: PointRadar[] }) {
  // Libellé court : on retire l'article de tête (L', Le, La, Le·la) puis on
  // garde le premier mot distinctif. (Pas de flag /i sur une classe de
  // lettres, sinon on mangerait la 1re lettre du nom.)
  const court = data.map((d) => ({
    ...d,
    court: d.name
      .replace(/^(Le·la|Le|La|L['’])\s*/, "")
      .split(/[\s·]/)[0],
  }));
  return (
    <div>
      <Titre>Radar des 12 lentilles</Titre>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={court} outerRadius="72%">
          <PolarGrid stroke={LINE} />
          <PolarAngleAxis
            dataKey="court"
            tick={{ fill: MUTED, fontSize: 10 }}
          />
          <Radar
            dataKey="valeur"
            stroke={FUCHSIA}
            fill={FUCHSIA}
            fillOpacity={0.28}
            isAnimationActive
          />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}`, "Activation"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 2. Courbe d'évolution : cohérence + respiration par jour.
export function CourbeEvolution({ data }: { data: PointEvolution[] }) {
  return (
    <div>
      <Titre>Évolution — cohérence & respiration</Titre>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={LINE} vertical={false} />
          <XAxis dataKey="jour" tick={{ fill: MUTED, fontSize: 10 }} stroke={LINE} />
          <YAxis domain={[0, 100]} tick={{ fill: MUTED, fontSize: 10 }} stroke={LINE} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="coherence" name="Cohérence" stroke={FUCHSIA} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="respiration" name="Respiration" stroke={ORANGE} strokeWidth={2} strokeDasharray="4 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. Équilibre des sphères (barres horizontales).
export function EquilibreSpheres({ data }: { data: PartSphere[] }) {
  return (
    <div>
      <Titre>Équilibre des sphères</Titre>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart layout="vertical" data={data} margin={{ left: 24, right: 12 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: MUTED, fontSize: 10 }}
            width={110}
            stroke={LINE}
            tickFormatter={(l: string) => l.split(" ")[0]}
          />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}`, "Énergie"]} />
          <Bar dataKey="valeur" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i % 2 ? ORANGE : FUCHSIA} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 4. Cohérence identitaire — libellé qualitatif (jamais un verdict chiffré :
// l'outil refuse d'étiqueter). L'anneau donne l'allure, le mot donne le sens.
function libelleCoherence(v: number): string {
  if (v < 25) return "en formation";
  if (v < 45) return "qui s'esquisse";
  if (v < 65) return "qui se précise";
  if (v < 82) return "claire";
  return "affirmée";
}

export function JaugeCoherence({ valeur }: { valeur: number }) {
  const angle = (Math.max(0, Math.min(100, valeur)) / 100) * 360;
  return (
    <div>
      <Titre>Cohérence identitaire</Titre>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: `conic-gradient(${FUCHSIA} ${angle}deg, ${LINE} ${angle}deg)`,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: "50%",
              background: "#0a090d",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              fontFamily: "var(--font-fraunces), serif",
              fontSize: 13,
              lineHeight: 1.2,
              color: INK,
              padding: "0 6px",
            }}
          >
            {libelleCoherence(valeur)}
          </div>
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.5, color: MUTED, margin: 0 }}>
          Non pas « à quel point tu es X », mais la clarté d'une lentille
          dominante et sa stabilité dans le temps. Jamais l'uniformité entre
          contextes : une lentille peut se lire autrement selon la sphère.
        </p>
      </div>
    </div>
  );
}

// 5. Heatmap des émotions (CSS pur).
export function HeatmapEmotions({ data }: { data: CelluleEmotion[] }) {
  return (
    <div>
      <Titre>Climat émotionnel</Titre>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((c) => {
          const teinte = c.valence >= 0 ? ORANGE : FUCHSIA;
          const op = 0.12 + c.frequence * 0.7;
          return (
            <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 96, fontSize: 12, color: MUTED }}>{c.label}</div>
              <div
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 6,
                  border: `1px solid ${LINE}`,
                  background: teinte,
                  opacity: op,
                }}
              />
              <div style={{ width: 28, textAlign: "right", fontSize: 12, color: MUTED }}>
                {c.compte}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 6. Progression sur 30 jours.
export function BarreProgression({ progression }: { progression: Progression }) {
  return (
    <div>
      <Titre>Progression</Titre>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 28, color: INK }}>
          {progression.faits}
        </span>
        <span style={{ fontSize: 12, color: MUTED }}>/ {progression.total} jours</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: LINE, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${progression.part}%`,
            background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
          }}
        />
      </div>
    </div>
  );
}
