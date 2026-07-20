"use client";
// parcours-archetypes/components/JourView.tsx
// L'écran-laboratoire d'une journée : les 10 sections + la saisie (curseurs par
// sphère, émotions, micro-défi, note). À la clôture → store.repondreJour, qui
// fait avancer le moteur d'évolution.
//
// Relecture : si une réponse existe déjà pour ce jour (`reponse`), l'écran est
// en LECTURE SEULE et réaffiche les choix enregistrés. L'historique n'est
// jamais perdu ni écrasé (repondreJour est idempotent).

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
  reponse,
  onClose,
}: {
  jour: Jour;
  reponse?: ReponseJour;
  onClose?: (r: ReponseJour) => void;
}) {
  const repondreJour = useParcoursStore((s) => s.repondreJour);
  const readOnly = Boolean(reponse);
  const a = archetypeByKey[jour.archetype];
  const phase = phaseDuJour(jour.n);

  const [curseurs, setCurseurs] = useState<Record<SphereKey, number>>(() => {
    if (reponse) return reponse.curseurs;
    const init = {} as Record<SphereKey, number>;
    for (const s of SPHERES) init[s.key] = s.key === jour.sphereFocus ? 55 : 25;
    return init;
  });
  const [emotions, setEmotions] = useState<EmotionKey[]>(
    reponse ? reponse.emotions : []
  );
  const [intensiteDefi, setIntensiteDefi] = useState(
    reponse ? reponse.intensiteDefi : 40
  );
  const [note, setNote] = useState(reponse ? reponse.note : "");

  const sectionsByKind = useMemo(
    () => Object.fromEntries(jour.sections.map((s) => [s.kind, s])),
    [jour]
  );

  const toggleEmotion = (k: EmotionKey) => {
    if (readOnly) return;
    setEmotions((prev) =>
      prev.includes(k) ? prev.filter((e) => e !== k) : [...prev, k]
    );
  };

  const cloturer = () => {
    if (readOnly) return;
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
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: FUCHSIA }}>
          Jour {jour.n} / 30 · {phase.label}
        </div>
        <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: 34, margin: "8px 0 4px", color: INK }}>
          {a.name}
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: MUTED, margin: 0 }}>{a.lens}</p>
      </div>

      {/* Bandeau relecture */}
      {readOnly && (
        <div
          style={{
            marginBottom: 18,
            borderRadius: 12,
            border: `1px solid ${LINE}`,
            background: "rgba(255,79,163,0.06)",
            padding: "10px 14px",
            fontSize: 12.5,
            color: MUTED,
          }}
        >
          Tu revois une journée déjà close — tes choix sont conservés, rien
          n'est modifiable ici.
        </div>
      )}

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
                  disabled={readOnly}
                  onChange={(e) =>
                    setCurseurs((prev) => ({ ...prev, [s.key]: Number(e.target.value) }))
                  }
                  style={{
                    width: "100%",
                    accentColor: FUCHSIA,
                    cursor: readOnly ? "default" : "pointer",
                    opacity: readOnly ? 0.7 : 1,
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
                  disabled={readOnly && !on}
                  style={{
                    borderRadius: 999,
                    padding: "7px 14px",
                    fontSize: 12,
                    cursor: readOnly ? "default" : "pointer",
                    border: `1px solid ${on ? "transparent" : LINE}`,
                    background: on ? `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})` : "transparent",
                    color: on ? "#fff" : MUTED,
                    opacity: readOnly && !on ? 0.35 : 1,
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
            disabled={readOnly}
            onChange={(e) => setIntensiteDefi(Number(e.target.value))}
            style={{ width: "100%", accentColor: ORANGE, cursor: readOnly ? "default" : "pointer", opacity: readOnly ? 0.7 : 1 }}
          />
        </Bloc>

        {/* Note */}
        <Bloc titre={sectionsByKind["note"]?.titre ?? "Note libre"}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            readOnly={readOnly}
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
              opacity: readOnly ? 0.85 : 1,
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
          disabled={readOnly}
          style={{
            borderRadius: 999,
            padding: "13px 26px",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.04em",
            cursor: readOnly ? "default" : "pointer",
            border: "none",
            color: "#fff",
            opacity: readOnly ? 0.4 : 1,
            background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
          }}
        >
          {readOnly ? "Journée close ✓" : "Clore la journée"}
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
