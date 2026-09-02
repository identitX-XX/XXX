"use client";
// parcours-archetypes/components/Objectifs.tsx
// Poser / ajuster un objectif par périmètre de vie (perso / pro / relationnel).
// Utilisé au départ ("Pose ton cap") ET pour modifier en cours de route.

import { useState } from "react";
import { archetypeByKey } from "../archetypes";
import { Objectifs as ObjectifsT, PerimetreKey } from "../types";
import { useParcoursStore } from "../store";
import { SphereIcon } from "@/components/SphereIcon";
import { track } from "@/lib/metrics";

const FUCHSIA = "var(--fuchsia)";
const ORANGE = "var(--orange)";
const LINE = "var(--line)";
const MUTED = "var(--muted)";
const INK = "var(--ink)";
const NOIR = "var(--surface)"; // fond de champ — via token pour suivre le thème
const serif = "var(--font-fraunces), Georgia, serif";
const sans = "var(--font-inter), system-ui, sans-serif";

const CHAMPS: { key: PerimetreKey; label: string; hint: string }[] = [
  { key: "perso", label: "Perso", hint: "Pour toi : ton équilibre, ton corps, ton sens, ta création." },
  { key: "pro", label: "Pro", hint: "Côté travail et projets : ce que tu veux faire avancer." },
  { key: "relationnel", label: "Relationnel", hint: "Dans tes liens : amour, famille, amis." },
];

const VIDE: ObjectifsT = { perso: "", pro: "", relationnel: "" };

// Suggestions cliquables par sphère (chips) qui pré-remplissent le champ.
const SUGGESTIONS: Record<PerimetreKey, string[]> = {
  perso: [
    "Nourrir ma curiosité",
    "Protéger mon énergie",
    "Connaissance de soi",
    "Bouger",
    "Écrire, lire, dessiner",
    "Méditer",
    "Réorganiser quelque chose",
  ],
  pro: [
    "Changer de poste",
    "Poser mes limites",
    "Entreprendre",
    "Reconversion",
    "Changer de dimension",
    "Mobilité",
  ],
  relationnel: [
    "Actualiser mes relations",
    "Identifier mes schémas",
    "Faire des rencontres",
    "Me débarrasser des liens toxiques",
  ],
};

export function Objectifs({
  initial,
  eyebrow = "Ma direction",
  titre = "Ce que je veux faire émerger",
  intro,
  submitLabel = "Choisir ma direction →",
  onSubmit,
  onCancel,
}: {
  initial?: ObjectifsT;
  eyebrow?: string;
  titre?: string;
  intro?: React.ReactNode;
  submitLabel?: string;
  onSubmit?: (o: ObjectifsT) => void;
  onCancel?: () => void;
}) {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const definirObjectifs = useParcoursStore((s) => s.definirObjectifs);
  const [vals, setVals] = useState<ObjectifsT>(initial ?? VIDE);
  // Champ libre optionnel, replié par défaut : le choix se fait d'abord au tap.
  const [custom, setCustom] = useState<Record<string, boolean>>(() => {
    const init = initial ?? VIDE;
    const out: Record<string, boolean> = {};
    (["perso", "pro", "relationnel"] as PerimetreKey[]).forEach((k) => {
      const v = init[k]?.trim();
      out[k] = Boolean(v) && !SUGGESTIONS[k].includes(v);
    });
    return out;
  });

  const set = (k: PerimetreKey, v: string) => setVals((p) => ({ ...p, [k]: v }));
  // Tap sur une proposition : sélectionne, ou désélectionne si déjà choisie.
  const toggle = (k: PerimetreKey, s: string) =>
    setVals((p) => ({ ...p, [k]: p[k] === s ? "" : s }));
  const arch = diagnostic ? archetypeByKey[diagnostic.dominant] : null;
  const submit = () => {
    // Fuite majeure du funnel : on mesure le passage ET combien d'objectifs sont
    // réellement remplis (0 étant permis désormais).
    if (!onCancel) {
      const rempli = Object.values(vals).filter((v) => v.trim().length > 0).length;
      track("goals_screen_passed", { rempli });
    }
    (onSubmit ?? definirObjectifs)(vals);
  };

  const introDefaut = (
    <>
      {arch ? <>Ta signature <strong style={{ color: INK }}>{arch.name}</strong> t'accompagnera. </> : null}
      Choisis une direction à observer par périmètre — perso, pro, relationnel.
      Rien de définitif : elles pourront évoluer.
    </>
  );

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", fontFamily: sans, color: INK }}>
      <div style={{ fontSize: 12, letterSpacing: ".22em", fontWeight: 700, textTransform: "uppercase", color: FUCHSIA }}>
        {eyebrow}
      </div>
      <h1 className="fr-title" style={{ fontFamily: serif, fontWeight: 600, fontSize: 32, margin: "8px 0 0", color: INK }}>
        {titre}
      </h1>
      <p style={{ color: MUTED, fontSize: 15, margin: "8px 0 22px", lineHeight: 1.55 }}>
        {intro ?? introDefaut}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {CHAMPS.map((c) => (
          <div
            key={c.key}
            style={{ borderRadius: 16, border: `1px solid ${LINE}`, background: "var(--surface)", padding: "16px 18px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <SphereIcon sphere={c.key} size={18} />
              <span style={{ fontFamily: serif, fontSize: 18, color: INK }}>{c.label}</span>
            </div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 10 }}>{c.hint}</div>
            {/* Choix au tap : une proposition sélectionnée devient la direction.
                Un second tap la désélectionne. Pas d'obligation d'écrire. */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {SUGGESTIONS[c.key].map((s) => {
                const on = vals[c.key] === s;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => { toggle(c.key, s); setCustom((p) => ({ ...p, [c.key]: false })); }}
                    style={{
                      borderRadius: 999,
                      border: `1px solid ${on ? FUCHSIA : LINE}`,
                      background: on ? FUCHSIA : "transparent",
                      color: on ? "var(--on-brand)" : MUTED,
                      fontFamily: sans, fontSize: 13, fontWeight: on ? 600 : 400,
                      padding: "8px 13px", cursor: "pointer", transition: "all .12s",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
              {/* Écrire la mienne — replié par défaut. */}
              <button
                type="button"
                aria-pressed={custom[c.key] || false}
                onClick={() => {
                  const next = !custom[c.key];
                  setCustom((p) => ({ ...p, [c.key]: next }));
                  if (next && SUGGESTIONS[c.key].includes(vals[c.key])) set(c.key, "");
                }}
                style={{
                  borderRadius: 999, border: `1px dashed ${custom[c.key] ? FUCHSIA : LINE}`,
                  background: "transparent", color: custom[c.key] ? INK : MUTED,
                  fontFamily: sans, fontSize: 13, padding: "8px 13px", cursor: "pointer",
                }}
              >
                ＋ écrire la mienne
              </button>
            </div>
            {custom[c.key] && (
              <textarea
                value={vals[c.key]}
                onChange={(e) => set(c.key, e.target.value)}
                rows={2}
                autoFocus
                placeholder="Ma direction, en mes mots…"
                style={{
                  width: "100%", resize: "none", borderRadius: 12, marginTop: 10,
                  border: `1px solid ${LINE}`, background: NOIR, color: INK,
                  fontFamily: sans, fontSize: 14.5, padding: "11px 13px", lineHeight: 1.5,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {!onCancel && (
        <p style={{ fontSize: 12.5, color: MUTED, fontStyle: "italic", lineHeight: 1.5, margin: "16px 2px 0" }}>
          Il ne s'agit pas de choisir définitivement. Tu pourras ajuster ces
          directions.
        </p>
      )}

      <button
        onClick={submit}
        style={{
          marginTop: 16, width: "100%", padding: "17px 26px", minHeight: 52, borderRadius: 999,
          border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
          cursor: "pointer", opacity: 1,
          background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
        }}
      >
        {submitLabel}
      </button>
      {/* Passage non bloquant : on peut entrer dans le parcours sans objectif et
          les poser plus tard (depuis « Ma quête » / Réglages). */}
      {!onCancel && (
        <button
          onClick={submit}
          style={{
            marginTop: 12, width: "100%", padding: "10px", borderRadius: 12,
            border: "none", background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer",
          }}
        >
          Je définirai ça plus tard
        </button>
      )}
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            marginTop: 12, width: "100%", padding: "10px", borderRadius: 12,
            border: "none", background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer",
          }}
        >
          Annuler
        </button>
      )}
    </div>
  );
}
