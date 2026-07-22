"use client";

// Le Vestiaire — ce qu'elle a laissé. Rien n'y est effacé : chaque dépôt reste,
// comme trace. Pendant 24 h, elle peut se raviser et REPRENDRE (l'étoile se
// rallume). Passé ce délai, le dépôt demeure, mais posé pour de bon.

import { Depot } from "../types";
import { territoireByKey } from "../content/territoires";
import { estReversible, heuresRestantes, parPlusRecent } from "../lib/vestiaire";

export function Vestiaire({
  depots,
  onReprendre,
}: {
  depots: Depot[];
  onReprendre: (id: string) => void;
}) {
  const liste = parPlusRecent(depots);

  return (
    <div style={S.wrap}>
      <p style={S.eyebrow}>Le Vestiaire</p>
      <p style={S.intro}>
        Ce que tu as laissé. Rien n'est effacé — c'est rangé. Tant que c'est
        récent, tu peux le reprendre.
      </p>

      {liste.length === 0 ? (
        <p style={S.vide}>
          Tu n'as encore rien déposé ici. Ce que tu laisseras au fil des jours
          t'attendra là.
        </p>
      ) : (
        <ul style={S.liste}>
          {liste.map((d) => {
            const reversible = estReversible(d);
            const h = heuresRestantes(d);
            return (
              <li key={d.id} style={S.item}>
                <div style={S.itemHead}>
                  <span style={S.terr}>{territoireByKey[d.territoire]?.nom ?? d.territoire}</span>
                  <span style={S.etat}>
                    {reversible ? `réversible encore ${h} h` : "posé"}
                  </span>
                </div>
                <p style={S.label}>{d.label}</p>
                {reversible && (
                  <button style={S.reprendre} onClick={() => onReprendre(d.id)}>
                    Reprendre
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 520, margin: "0 auto" },
  eyebrow: {
    fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "#e8823f", fontWeight: 600, margin: "0 0 16px", textAlign: "center",
  },
  intro: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 18, lineHeight: 1.5, color: "#c9c2dd", margin: "0 0 34px",
    textAlign: "center",
  },
  vide: {
    fontSize: 15, lineHeight: 1.6, color: "#635d78", textAlign: "center",
    padding: "30px 0",
  },
  liste: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 },
  item: {
    border: "1px solid #241d33", borderRadius: 14, padding: "16px 18px",
    background: "linear-gradient(180deg, #14111f, #0c0a15)",
  },
  itemHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 },
  terr: {
    fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
    color: "#8f99e6", fontWeight: 600,
  },
  etat: {
    fontSize: 11.5, color: "#635d78", fontVariantNumeric: "tabular-nums",
  },
  label: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 18, color: "#f2eef8", margin: "0 0 4px",
  },
  reprendre: {
    fontFamily: "inherit", fontSize: 13.5, fontWeight: 600, marginTop: 8,
    padding: "8px 18px", borderRadius: 999, cursor: "pointer",
    background: "rgba(125,136,223,.13)", border: "1px solid rgba(125,136,223,.5)",
    color: "#8f99e6",
  },
};
