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
const NOIR = "#0a090d";
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

  const set = (k: PerimetreKey, v: string) => setVals((p) => ({ ...p, [k]: v }));
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
            <textarea
              value={vals[c.key]}
              onChange={(e) => set(c.key, e.target.value)}
              rows={2}
              placeholder="Mon objectif… (optionnel)"
              style={{
                width: "100%", resize: "none", borderRadius: 12,
                border: `1px solid ${LINE}`, background: NOIR, color: INK,
                fontFamily: sans, fontSize: 14.5, padding: "11px 13px", lineHeight: 1.5,
              }}
            />
            {/* Suggestions cliquables — un tap pré-remplit le champ. */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {SUGGESTIONS[c.key].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set(c.key, s)}
                  style={{
                    borderRadius: 999, border: `1px solid ${LINE}`, background: "transparent",
                    color: MUTED, fontFamily: sans, fontSize: 12.5, padding: "5px 11px", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = FUCHSIA; e.currentTarget.style.color = INK; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE; e.currentTarget.style.color = MUTED; }}
                >
                  {s}
                </button>
              ))}
            </div>
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
