"use client";
// parcours-archetypes/components/JourView.tsx
// L'écran-laboratoire d'une journée : les 10 sections + la saisie (curseurs par
// sphère, émotions, micro-défi, note). À la clôture → store.repondreJour, qui
// fait avancer le moteur d'évolution. Style IdentitX, inline (drop-in safe).

import { useMemo, useState } from "react";
import { EMOTIONS, SPHERES, archetypeByKey, phaseDuJour } from "../archetypes";
import { EmotionKey, Jour, ReponseJour, SphereKey } from "../types";
import { useParcoursStore } from "../store";

const FUCHSIA = "#ff4fa3";
const ORANGE = "#ff8a4c";
const LINE = "rgba(255,255,255,0.10)";
const MUTED = "rgba(240,235,246,0.55)";
const INK = "#f2eef5";
const NOIR = "#0a090d";
const SURFACE = "rgba(255,255,255,0.03)";

const serif = "var(--font-fraunces), Georgia, serif";
const sans = "var(--font-inter), system-ui, sans-serif";

export function JourView({
  jour,
  onClose,
}: {
  jour: Jour;
  onClose?: (r: ReponseJour) => void;
}) {
  const repondreJour = useParcoursStore((s) => s.repondreJour);
  const dejaFait = useParcoursStore((s) => Boolean(s.reponses[jour.n]));
  const a = archetypeByKey[jour.archetype];
  const phase = phaseDuJour(jour.n);

  const [curseurs, setCurseurs] = useState<Record<SphereKey, number>>(() => {
    const init = {} as Record<SphereKey, number>;
    for (const s of SPHERES) init[s.key] = s.key === jour.sphereFocus ? 55 : 25;
    return init;
  });
  const [emotions, setEmotions] = useState<EmotionKey[]>([]);
  const [intensiteDefi, setIntensiteDefi] = useState(40);
  const [note, setNote] = useState("");

  const sectionsByKind = useMemo(
    () => Object.fromEntries(jour.sections.map((s) => [s.kind, s])),
    [jour]
  );

  const toggleEmotion = (k: EmotionKey) =>
    setEmotions((prev) =>
      prev.includes(k) ? prev.filter((e) => e !== k) : [...prev, k]
    );

  const cloturer = () => {
    const r: ReponseJour = {
      jour: jour.n,
      archetype: jour.archetype,
      sphereFocus: jour.sphereFocus,
      curseurs,
      emotions,
      intensiteDefi,
      note,
      date: new Date().toISOString(),
    };
    repondreJour(r);
    onClose?.(r);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: sans, color: INK }}>
      {/* En-tête */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: FUCHSIA }}>
          Jour {jour.n} / 30 · {phase.label}
        </div>
        <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: 34, margin: "8px 0 4px", color: INK }}>
          {a.name}
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: MUTED, margin: 0 }}>{a.lens}</p>
      </div>

      {/* Sections narratives */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {(["intention", "observation", "defi", "question"] as const).map((k) => (
          <Bloc key={k} titre={sectionsByKind[k]?.titre ?? ""}>
            {sectionsByKind[k]?.texte}
          </Bloc>
        ))}

        {/* Curseurs par sphère */}
        <Bloc titre={sectionsByKind["curseurs"]?.titre ?? "Où ça vibre"}>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>
            {sectionsByKind["curseurs"]?.texte}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SPHERES.map((s) => (
              <div key={s.key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: s.key === jour.sphereFocus ? INK : MUTED }}>
                    {s.label}
                    {s.key === jour.sphereFocus && (
                      <span style={{ color: FUCHSIA, marginLeft: 6 }}>· focus</span>
                    )}
                  </span>
                  <span style={{ fontFamily: serif, color: INK }}>{curseurs[s.key]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={curseurs[s.key]}
                  onChange={(e) =>
                    setCurseurs((prev) => ({ ...prev, [s.key]: Number(e.target.value) }))
                  }
                  style={{
                    width: "100%",
                    accentColor: FUCHSIA,
                    cursor: "pointer",
                  }}
                />
              </div>
            ))}
          </div>
        </Bloc>

        {/* Émotions */}
        <Bloc titre={sectionsByKind["emotions"]?.titre ?? "Émotions du jour"}>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
            {sectionsByKind["emotions"]?.texte}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EMOTIONS.map((e) => {
              const on = emotions.includes(e.key);
              return (
                <button
                  key={e.key}
                  onClick={() => toggleEmotion(e.key)}
                  style={{
                    borderRadius: 999,
                    padding: "7px 14px",
                    fontSize: 12,
                    cursor: "pointer",
                    border: `1px solid ${on ? "transparent" : LINE}`,
                    background: on ? `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})` : "transparent",
                    color: on ? "#fff" : MUTED,
                  }}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
        </Bloc>

        {/* Micro-défi : intensité */}
        <Bloc titre="Intensité du micro-défi">
          <input
            type="range"
            min={0}
            max={100}
            value={intensiteDefi}
            onChange={(e) => setIntensiteDefi(Number(e.target.value))}
            style={{ width: "100%", accentColor: ORANGE, cursor: "pointer" }}
          />
        </Bloc>

        {/* Note */}
        <Bloc titre={sectionsByKind["note"]?.titre ?? "Note libre"}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={sectionsByKind["note"]?.texte}
            style={{
              width: "100%",
              resize: "none",
              borderRadius: 12,
              border: `1px solid ${LINE}`,
              background: NOIR,
              color: INK,
              fontFamily: sans,
              fontSize: 14,
              padding: "12px 14px",
              lineHeight: 1.5,
            }}
          />
        </Bloc>

        {/* Écho + clôture (narratif) */}
        <Bloc titre={sectionsByKind["echo"]?.titre ?? "Écho"}>
          {sectionsByKind["echo"]?.texte}
        </Bloc>
        <Bloc titre={sectionsByKind["cloture"]?.titre ?? "Clôture"}>
          {sectionsByKind["cloture"]?.texte}
        </Bloc>
      </div>

      {/* Action */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={cloturer}
          disabled={dejaFait}
          style={{
            borderRadius: 999,
            padding: "13px 26px",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.04em",
            cursor: dejaFait ? "default" : "pointer",
            border: "none",
            color: "#fff",
            opacity: dejaFait ? 0.4 : 1,
            background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
          }}
        >
          {dejaFait ? "Journée close ✓" : "Clore la journée"}
        </button>
      </div>
    </div>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${LINE}`,
        background: SURFACE,
        padding: "16px 18px",
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>
        {titre}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: INK }}>{children}</div>
    </div>
  );
}
