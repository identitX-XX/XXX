"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { FusionEntry as Entry } from "@/types";
import { Emblem } from "./Emblem";

// ===== Scoring (inline, zéro dépendance) =====

const WEIGHTS = {
  etatInterne: 0.15,
  clarte: 0.2,
  actionRelationnelle: 0.3,
  exposition: 0.35,
} as const;

const DIMS = Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[];
const MIN_DENSITY: Record<number, number> = { 7: 4, 30: 15 };

function dailyScore(e: Entry): number | null {
  let sum = 0;
  let wsum = 0;
  for (const d of DIMS) {
    const v = e[d];
    if (v !== null && v !== undefined) {
      sum += WEIGHTS[d] * v;
      wsum += WEIGHTS[d];
    }
  }
  if (wsum === 0) return null;
  return Math.round((sum / wsum) * 10 * 10) / 10;
}

function toTime(d: string): number {
  return new Date(d + "T00:00:00Z").getTime();
}

function windowEntries(entries: Entry[], days: number, endDate: string): Entry[] {
  const end = toTime(endDate);
  const start = end - (days - 1) * 86400000;
  return entries.filter((e) => {
    const t = toTime(e.date);
    return t >= start && t <= end;
  });
}

function rollingAverage(entries: Entry[], days: number, endDate: string): number | null {
  const win = windowEntries(entries, days, endDate);
  const minReq = MIN_DENSITY[days] ?? Math.ceil(days / 2);
  const scored = win
    .map((e) => ({ s: dailyScore(e), w: e.poidsJour ?? 1 }))
    .filter((x): x is { s: number; w: number } => x.s !== null);
  if (scored.length < minReq) return null;
  const wsum = scored.reduce((a, x) => a + x.w, 0);
  const sum = scored.reduce((a, x) => a + x.w * x.s, 0);
  return Math.round((sum / wsum) * 10) / 10;
}

function progression(entries: Entry[], days: number, endDate: string) {
  const current = rollingAverage(entries, days, endDate);
  const prevEnd = new Date(toTime(endDate) - days * 86400000).toISOString().slice(0, 10);
  const previous = rollingAverage(entries, days, prevEnd);
  if (current === null || previous === null || previous === 0) return null;
  const points = Math.round((current - previous) * 10) / 10;
  const percent = Math.round((points / previous) * 1000) / 10;
  return { points, percent };
}

function momentum(entries: Entry[], endDate: string): string | null {
  const mg7 = rollingAverage(entries, 7, endDate);
  const mg30 = rollingAverage(entries, 30, endDate);
  if (mg7 === null || mg30 === null) return null;
  const d = mg7 - mg30;
  if (d > 3) return "acceleration";
  if (d < -3) return "deceleration";
  return "stable";
}

function scoreLabel(s: number): string {
  if (s < 40) return "contraction";
  if (s < 55) return "maintenance";
  if (s < 70) return "ouverture";
  if (s < 85) return "expansion";
  return "expansion soutenue";
}

const LABEL_COLORS: Record<string, string> = {
  contraction: "var(--danger)",
  maintenance: "var(--muted)",
  ouverture: "var(--ink)",
  expansion: "var(--orange)",
  "expansion soutenue": "var(--fuchsia)",
};

const DIM_META: { key: (typeof DIMS)[number]; label: string; color: string }[] = [
  { key: "etatInterne", label: "État interne", color: "var(--muted)" },
  { key: "clarte", label: "Clarté cognitive", color: "var(--ink)" },
  { key: "actionRelationnelle", label: "Action relationnelle", color: "var(--orange)" },
  { key: "exposition", label: "Exposition à l'expansion", color: "var(--fuchsia)" },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function frDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

// ===== Composant principal =====
export function JournalFusion() {
  const entries = useStore((s) => s.journalFusion);
  const setJournalFusion = useStore((s) => s.setJournalFusion);
  const date = today();

  const entry: Entry = useMemo(
    () =>
      entries.find((e) => e.date === date) ?? {
        date,
        etatInterne: null,
        clarte: null,
        actionRelationnelle: null,
        exposition: null,
        poidsJour: 1,
        gratitude: "",
        pensees: "",
      },
    [entries, date]
  );

  const setField = (key: keyof Entry, value: number | string) => {
    const rest = entries.filter((e) => e.date !== date);
    setJournalFusion([...rest, { ...entry, [key]: value }]);
  };

  const removeEntry = (d: string) => setJournalFusion(entries.filter((e) => e.date !== d));

  const score = dailyScore(entry);
  const mg7 = rollingAverage(entries, 7, date);
  const mg30 = rollingAverage(entries, 30, date);
  const prog = progression(entries, 30, date);
  const mom = momentum(entries, date);

  const history = useMemo(
    () =>
      entries
        .filter((e) => e.date !== date)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [entries, date]
  );

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 460,
    borderRadius: 18,
    border: "1px solid rgba(255,138,76,.14)",
    background: "radial-gradient(130% 130% at 50% 0%, rgba(38,22,41,.5), rgba(10,9,13,0) 100%)",
    padding: "18px 16px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,138,76,.06)",
    border: "1px solid rgba(255,138,76,.2)",
    borderRadius: 12,
    color: "var(--ink)",
    fontSize: 14,
    padding: "12px 13px",
    outline: "none",
    fontFamily: "var(--font-inter),sans-serif",
    marginTop: 8,
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--noir)",
        color: "var(--ink)",
        fontFamily: "var(--font-inter),'Outfit',sans-serif",
        fontWeight: 300,
        padding: "48px 20px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-fraunces),serif",
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: ".16em",
          textTransform: "uppercase",
        }}
      >
        Identit<span style={{ color: "var(--fuchsia)" }}>X</span>
      </div>

      <Emblem size={78} />

      <h1
        style={{
          fontFamily: "var(--font-fraunces),serif",
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
            background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
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
          fontFamily: "var(--font-fraunces),serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "var(--muted)",
          textAlign: "center",
          maxWidth: 420,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Quatre mesures, une gratitude, une trajectoire.
      </p>

      {/* ===== Saisie du jour ===== */}
      <div style={card}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: ".26em",
            textTransform: "uppercase",
            color: "var(--orange)",
            marginBottom: 14,
          }}
        >
          Aujourd'hui — {frDate(date)}
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
              <span style={{ color: d.color, fontWeight: 500 }}>{entry[d.key] ?? "—"}</span>
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

        <div style={{ marginBottom: 4 }}>
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
            style={{ width: "100%", accentColor: "var(--muted)", marginTop: 4 }}
            aria-label="Poids du jour"
          />
        </div>

        <input
          value={entry.gratitude ?? ""}
          onChange={(e) => setField("gratitude", e.target.value)}
          placeholder="Gratitude du jour"
          maxLength={140}
          style={inputStyle}
          aria-label="Gratitude du jour"
        />

        <textarea
          value={entry.pensees ?? ""}
          onChange={(e) => setField("pensees", e.target.value)}
          placeholder="Pensées libres"
          rows={3}
          style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
          aria-label="Pensées libres"
        />

        {score !== null && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-fraunces),serif",
                fontSize: 40,
                background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
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
                color: LABEL_COLORS[scoreLabel(score)] ?? "var(--muted)",
              }}
            >
              {scoreLabel(score)}
            </div>
          </div>
        )}
      </div>

      {/* ===== Trajectoire ===== */}
      <div style={card}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: ".26em",
            textTransform: "uppercase",
            color: "var(--orange)",
            marginBottom: 14,
          }}
        >
          Trajectoire
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-fraunces),serif", fontSize: 26 }}>{mg7 ?? "—"}</div>
            <div style={{ fontSize: 10, letterSpacing: ".2em", color: "rgba(244,238,234,.45)" }}>
              MG 7 JOURS
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-fraunces),serif", fontSize: 26 }}>{mg30 ?? "—"}</div>
            <div style={{ fontSize: 10, letterSpacing: ".2em", color: "rgba(244,238,234,.45)" }}>
              MG 30 JOURS
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-fraunces),serif",
                fontSize: 26,
                color: prog && prog.points >= 0 ? "var(--orange)" : "var(--danger)",
              }}
            >
              {prog ? `${prog.points > 0 ? "+" : ""}${prog.points}` : "—"}
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
          {mg30 === null
            ? "La trajectoire apparaîtra au fil des entrées — chaque jour compte."
            : mom === "acceleration"
            ? "Ta semaine dépasse ta tendance de fond : accélération en cours."
            : mom === "deceleration"
            ? "Ta semaine est sous ta tendance de fond : phase de décélération."
            : "Régime stable — la tendance de fond tient."}
        </div>
      </div>

      {/* ===== Historique ===== */}
      {history.length > 0 && (
        <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: 14 }}>
          {history.map((e) => {
            const s = dailyScore(e);
            return (
              <div key={e.date} style={card}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-fraunces),serif",
                      fontSize: 17,
                      color: "var(--fuchsia)",
                    }}
                  >
                    {frDate(e.date)}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {s !== null && (
                      <span
                        style={{
                          fontFamily: "var(--font-fraunces),serif",
                          fontSize: 20,
                          background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {s}
                      </span>
                    )}
                    <button
                      onClick={() => removeEntry(e.date)}
                      aria-label={`Supprimer l'entrée du ${frDate(e.date)}`}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(244,238,234,.35)",
                        fontSize: 17,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 18px",
                    marginTop: 12,
                    fontSize: 12,
                    color: "rgba(244,238,234,.6)",
                  }}
                >
                  {DIM_META.map((d) => (
                    <div key={d.key} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{d.label}</span>
                      <span style={{ color: d.color }}>{e[d.key] ?? "—"}</span>
                    </div>
                  ))}
                </div>

                {e.gratitude && (
                  <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5 }}>
                    <span style={{ color: "rgba(244,238,234,.45)" }}>Gratitude : </span>
                    <span style={{ color: "var(--muted)", fontStyle: "italic" }}>{e.gratitude}</span>
                  </div>
                )}
                {e.pensees && (
                  <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
                    {e.pensees}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
