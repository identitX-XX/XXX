"use client";

import { useEffect, useMemo, useState } from "react";

// ===== Logique de scoring (inline, zéro dépendance) =====
type DailyEntry = {
  date: string; // "YYYY-MM-DD"
  etatInterne: number | null;        // 0-10
  clarte: number | null;             // 0-10
  actionRelationnelle: number | null;// 0-10
  exposition: number | null;         // 0-10
  poidsJour?: number;                // 0.5-2, défaut 1
};

// --- Pondérations : comportement (65%) > état (35%) ---
const WEIGHTS = {
  etatInterne: 0.15,
  clarte: 0.2,
  actionRelationnelle: 0.3,
  exposition: 0.35,
} as const;

const DIMS = Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[];

// Densité minimale pour qu'une moyenne soit honnête
const MIN_DENSITY: Record<number, number> = { 7: 4, 30: 15 };

// ---------- Score journalier (0-100) ----------
function dailyScore(e: DailyEntry): number | null {
  let sum = 0;
  let wsum = 0;
  for (const d of DIMS) {
    const v = e[d];
    if (v !== null && v !== undefined) {
      sum += WEIGHTS[d] * v;
      wsum += WEIGHTS[d];
    }
  }
  if (wsum === 0) return null; // entrée vide
  return Math.round((sum / wsum) * 10 * 10) / 10; // renormalisé, /100, 1 décimale
}

// ---------- Complétude ----------
function dayCompleteness(e: DailyEntry): number {
  const filled = DIMS.filter((d) => e[d] !== null && e[d] !== undefined).length;
  return filled / DIMS.length; // 0-1
}

function periodCompleteness(entries: DailyEntry[], days: number, endDate: string): number {
  const win = windowEntries(entries, days, endDate);
  if (days === 0) return 0;
  const presence = win.length / days;
  const avgDay = win.length ? win.reduce((s, e) => s + dayCompleteness(e), 0) / win.length : 0;
  return Math.round(presence * avgDay * 100); // 0-100
}

// ---------- Fenêtres calendaires ----------
function toTime(d: string): number {
  return new Date(d + "T00:00:00Z").getTime();
}

function windowEntries(entries: DailyEntry[], days: number, endDate: string): DailyEntry[] {
  const end = toTime(endDate);
  const start = end - (days - 1) * 86400000;
  return entries.filter((e) => {
    const t = toTime(e.date);
    return t >= start && t <= end;
  });
}

// ---------- Moyenne glissante pondérée (null si densité insuffisante) ----------
function rollingAverage(
  entries: DailyEntry[],
  days: number,
  endDate: string
): number | null {
  const win = windowEntries(entries, days, endDate);
  const minReq = MIN_DENSITY[days] ?? Math.ceil(days / 2);
  const scored = win
    .map((e) => ({ s: dailyScore(e), w: e.poidsJour ?? 1 }))
    .filter((x): x is { s: number; w: number } => x.s !== null);
  if (scored.length < minReq) return null; // données insuffisantes
  const wsum = scored.reduce((a, x) => a + x.w, 0);
  const sum = scored.reduce((a, x) => a + x.w * x.s, 0);
  return Math.round((sum / wsum) * 10) / 10;
}

// ---------- Progression entre deux fenêtres identiques adjacentes ----------
function progression(
  entries: DailyEntry[],
  days: number,
  endDate: string
): { points: number; percent: number } | null {
  const current = rollingAverage(entries, days, endDate);
  const prevEnd = new Date(toTime(endDate) - days * 86400000).toISOString().slice(0, 10);
  const previous = rollingAverage(entries, days, prevEnd);
  if (current === null || previous === null || previous === 0) return null;
  const points = Math.round((current - previous) * 10) / 10;
  const percent = Math.round((points / previous) * 1000) / 10;
  return { points, percent };
}

// ---------- Momentum : MG7 vs MG30 (le signal anti-humeur) ----------
function momentum(entries: DailyEntry[], endDate: string): string | null {
  const mg7 = rollingAverage(entries, 7, endDate);
  const mg30 = rollingAverage(entries, 30, endDate);
  if (mg7 === null || mg30 === null) return null;
  const d = mg7 - mg30;
  if (d > 3) return "acceleration";
  if (d < -3) return "deceleration";
  return "stable";
}

// ---------- Seuils de lecture ----------
function scoreLabel(s: number): string {
  if (s < 40) return "contraction";
  if (s < 55) return "maintenance";
  if (s < 70) return "ouverture";
  if (s < 85) return "expansion";
  return "expansion soutenue";
}

function progressionLabel(percent: number): string {
  if (percent >= 10) return "transformation reelle";
  if (percent >= 3) return "progression";
  if (percent > -3) return "plateau";
  return "regression";
}

function reliability(completeness0to100: number): "fiable" | "indicative" | "insuffisante" {
  if (completeness0to100 >= 80) return "fiable";
  if (completeness0to100 >= 60) return "indicative";
  return "insuffisante";
}

// ---------- Rapport complet (l'appel unique côté front) ----------
function report(entries: DailyEntry[], endDate: string) {
  const mg7 = rollingAverage(entries, 7, endDate);
  const mg30 = rollingAverage(entries, 30, endDate);
  const prog = progression(entries, 30, endDate);
  const comp = periodCompleteness(entries, 30, endDate);
  return {
    mg7,
    mg30,
    label: mg30 !== null ? scoreLabel(mg30) : null,
    progression: prog,
    progressionLabel: prog ? progressionLabel(prog.percent) : null,
    momentum: momentum(entries, endDate),
    completeness: comp,
    reliability: reliability(comp),
  };
}
// ===== Fin scoring =====

const STORAGE_KEY = "identitx-journal";

const DIM_META: { key: keyof Pick<DailyEntry, "etatInterne" | "clarte" | "actionRelationnelle" | "exposition">; label: string; color: string }[] = [
  { key: "etatInterne", label: "État interne", color: "#DFCBD8" },
  { key: "clarte", label: "Clarté cognitive", color: "#F4EEEA" },
  { key: "actionRelationnelle", label: "Action relationnelle", color: "#FF8A4C" },
  { key: "exposition", label: "Exposition à l'expansion", color: "#FF4FA3" },
];

const LABEL_COLORS: Record<string, string> = {
  contraction: "#FF5A5A",
  maintenance: "#DFCBD8",
  ouverture: "#F4EEEA",
  expansion: "#FF8A4C",
  "expansion soutenue": "#FF4FA3",
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// --- Emblème planète-boussole (signature IdentitX, identique à Welcome) ---
function Emblem({ size = 78 }: { size?: number }) {
  return (
    <div aria-hidden="true" style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", inset: 0, animation: "idx-spin 9s linear infinite" }}>
        <span
          style={{
            position: "absolute",
            top: -4,
            left: "calc(50% - 4px)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#FF4FA3",
            boxShadow: "0 0 12px rgba(255,79,163,.8)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 12,
          animation: "idx-spin 14s linear infinite reverse",
        }}
      >
        <span
          style={{
            position: "absolute",
            bottom: -3,
            left: "calc(50% - 3px)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#FF8A4C",
            boxShadow: "0 0 10px rgba(255,138,76,.8)",
          }}
        />
      </div>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF4FA3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "absolute", inset: size * 0.26, width: size * 0.49, height: size * 0.49 }}
      >
        <circle cx="12" cy="12" r="9.2" />
        <path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5 5-2.2Z" />
      </svg>
    </div>
  );
}

export function Journal({ onDone }: { onDone?: () => void }) {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const date = today();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries, loaded]);

  const entry: DailyEntry = useMemo(
    () =>
      entries.find((e) => e.date === date) ?? {
        date,
        etatInterne: null,
        clarte: null,
        actionRelationnelle: null,
        exposition: null,
        poidsJour: 1,
      },
    [entries, date]
  );

  const setField = (key: keyof DailyEntry, value: number) => {
    setEntries((prev) => {
      const rest = prev.filter((e) => e.date !== date);
      return [...rest, { ...entry, [key]: value }];
    });
  };

  const score = dailyScore(entry);
  const r = useMemo(() => report(entries, date), [entries, date]);

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    borderRadius: 18,
    border: "1px solid rgba(255,138,76,.14)",
    background: "radial-gradient(130% 130% at 50% 0%, rgba(38,22,41,.5), rgba(10,9,13,0) 100%)",
    padding: "18px 16px",
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#0A090D",
        color: "#F4EEEA",
        fontFamily: "'Inter','Outfit',sans-serif",
        fontWeight: 300,
        padding: "48px 20px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <style>{`
        @keyframes idx-spin { to { transform: rotate(360deg) } }
      `}</style>

      <div
        style={{
          fontFamily: "'Fraunces',serif",
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: ".16em",
          textTransform: "uppercase",
        }}
      >
        Identit<span style={{ color: "#FF4FA3" }}>X</span>
      </div>

      <Emblem />

      <h1
        style={{
          fontFamily: "'Fraunces',serif",
          fontWeight: 400,
          fontSize: "clamp(24px,6vw,38px)",
          lineHeight: 1.1,
          textAlign: "center",
          margin: 0,
        }}
      >
        Journal d'
        <span
          style={{
            background: "linear-gradient(90deg,#FF4FA3,#FF8A4C)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          expansion
        </span>
      </h1>

      <p
        style={{
          fontFamily: "'Fraunces',serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "#DFCBD8",
          textAlign: "center",
          maxWidth: 400,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Quatre mesures. Une trajectoire.
      </p>

      {/* Saisie du jour */}
      <div style={card}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: ".26em",
            textTransform: "uppercase",
            color: "#FF8A4C",
            marginBottom: 14,
          }}
        >
          Aujourd'hui — {date}
        </div>

        {DIM_META.map((d) => (
          <div key={d.key} style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "rgba(244,238,234,.6)",
              }}
            >
              <span>{d.label}</span>
              <span style={{ color: d.color, fontWeight: 500 }}>
                {entry[d.key] ?? "—"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={entry[d.key] ?? 5}
              onChange={(e) => setField(d.key, Number(e.target.value))}
              style={{ width: "100%", accentColor: d.color, marginTop: 4 }}
              aria-label={d.label}
            />
          </div>
        ))}

        <div style={{ marginTop: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "rgba(244,238,234,.45)",
            }}
          >
            <span>Poids du jour</span>
            <span>{(entry.poidsJour ?? 1).toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.5}
            value={entry.poidsJour ?? 1}
            onChange={(e) => setField("poidsJour", Number(e.target.value))}
            style={{ width: "100%", accentColor: "#DFCBD8", marginTop: 4 }}
            aria-label="Poids du jour"
          />
        </div>

        {score !== null && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <div
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: 40,
                background: "linear-gradient(90deg,#FF4FA3,#FF8A4C)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: LABEL_COLORS[scoreLabel(score)] ?? "#DFCBD8",
              }}
            >
              {scoreLabel(score)}
            </div>
          </div>
        )}
      </div>

      {/* Tendances */}
      <div style={card}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: ".26em",
            textTransform: "uppercase",
            color: "#FF8A4C",
            marginBottom: 14,
          }}
        >
          Trajectoire
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26, color: "#F4EEEA" }}>
              {r.mg7 ?? "—"}
            </div>
            <div style={{ fontSize: 10, letterSpacing: ".2em", color: "rgba(244,238,234,.45)" }}>
              MG 7 JOURS
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26, color: "#F4EEEA" }}>
              {r.mg30 ?? "—"}
            </div>
            <div style={{ fontSize: 10, letterSpacing: ".2em", color: "rgba(244,238,234,.45)" }}>
              MG 30 JOURS
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: 26,
                color:
                  r.progression && r.progression.points >= 0 ? "#FF8A4C" : "#FF5A5A",
              }}
            >
              {r.progression
                ? `${r.progression.points > 0 ? "+" : ""}${r.progression.points}`
                : "—"}
            </div>
            <div style={{ fontSize: 10, letterSpacing: ".2em", color: "rgba(244,238,234,.45)" }}>
              PROGRESSION
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "rgba(244,238,234,.5)",
            textAlign: "center",
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          {r.mg30 === null
            ? "La trajectoire apparaîtra après quelques jours de journal — chaque entrée compte."
            : r.momentum === "acceleration"
            ? "Ta semaine dépasse ta tendance de fond : accélération en cours."
            : r.momentum === "deceleration"
            ? "Ta semaine est sous ta tendance de fond : phase de décélération."
            : "Régime stable — la tendance de fond tient."}
          {r.reliability !== "fiable" && r.mg30 !== null && " (tendance indicative — complète ton journal pour fiabiliser)"}
        </div>
      </div>

      {onDone && (
        <button
          onClick={onDone}
          style={{
            marginTop: 8,
            background: "#FF4FA3",
            color: "#0A090D",
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            fontFamily: "'Inter','Outfit',sans-serif",
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            padding: "17px 32px",
          }}
        >
          Continuer →
        </button>
      )}
    </div>
  );
}
