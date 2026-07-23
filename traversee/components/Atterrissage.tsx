"use client";

// L'atterrissage (Acte IV, J21–27) — trois destinations DÉRIVÉES de ses choix.
// Elle en écarte deux, une à la fois, sans retour. Ce qui reste devient sa
// destination. On ne montre jamais d'étiquette imposée : chaque chemin cite la
// preuve dans ses propres données.

import { useState } from "react";
import { DestinationCandidate } from "../types";

interface Props {
  candidates: DestinationCandidate[];
  eliminees: string[];
  choisie: string | null;
  onEliminer: (id: string) => void;
}

export function Atterrissage({ candidates, eliminees, choisie, onEliminer }: Props) {
  const [aConfirmer, setAConfirmer] = useState<string | null>(null);
  const restantes = candidates.filter((c) => !eliminees.includes(c.id));

  if (candidates.length === 0) return null;

  // Une seule destination : le chemin est trouvé.
  if (restantes.length <= 1) {
    const d = restantes[0];
    return (
      <div style={S.wrap}>
        <p style={S.eyebrow}>Ta destination</p>
        {d ? (
          <>
            <p style={S.nom}>{d.nom}</p>
            <p style={S.fondement}>{d.fondement}</p>
          </>
        ) : (
          <p style={S.fondement}>Le chemin se dessine encore.</p>
        )}
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <p style={S.eyebrow}>L'atterrissage · {restantes.length} chemins</p>
      <p style={S.consigne}>
        Là où tu vas, il y a moins de place. Écarte un chemin — celui qui n'est
        plus toi. C'est sans retour.
      </p>
      <div style={S.liste}>
        {restantes.map((d) => (
          <div key={d.id} style={S.carte}>
            <p style={S.carteNom}>{d.nom}</p>
            <p style={S.carteFond}>{d.fondement}</p>
            {aConfirmer === d.id ? (
              <div style={S.confirmRow}>
                <button
                  style={S.confirm}
                  onClick={() => {
                    onEliminer(d.id);
                    setAConfirmer(null);
                  }}
                >
                  Oui, sans retour
                </button>
                <button style={S.annuler} onClick={() => setAConfirmer(null)}>
                  Annuler
                </button>
              </div>
            ) : (
              <button style={S.ecarter} onClick={() => setAConfirmer(d.id)}>
                Écarter ce chemin
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { marginTop: 30, textAlign: "center" },
  eyebrow: {
    fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
    color: "#635d78", fontWeight: 600, margin: "0 0 14px",
  },
  consigne: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 17, lineHeight: 1.5, color: "#c9c2dd", margin: "0 auto 22px", maxWidth: "34em",
  },
  liste: { display: "flex", flexDirection: "column", gap: 12, textAlign: "left" },
  carte: {
    border: "1px solid #241d33", borderRadius: 14, padding: "16px 18px",
    background: "linear-gradient(180deg, #14111f, #0c0a15)",
  },
  carteNom: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 18, color: "#f2eef8", margin: "0 0 6px",
  },
  carteFond: { fontSize: 13.5, lineHeight: 1.5, color: "#948da8", margin: "0 0 12px" },
  ecarter: {
    fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "8px 16px",
    borderRadius: 999, cursor: "pointer", color: "#8f99e6",
    background: "rgba(125,136,223,.1)", border: "1px solid rgba(125,136,223,.4)",
  },
  confirmRow: { display: "flex", gap: 10, alignItems: "center" },
  confirm: {
    fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "8px 16px",
    borderRadius: 999, cursor: "pointer", color: "#e8823f",
    background: "rgba(232,130,63,.12)", border: "1px solid rgba(232,130,63,.5)",
  },
  annuler: {
    fontFamily: "inherit", fontSize: 13, padding: "8px 14px", borderRadius: 999,
    cursor: "pointer", color: "#635d78", background: "none", border: "none",
  },
  nom: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 24, color: "#ff5cae", margin: "0 0 8px",
  },
  fondement: { fontSize: 14, lineHeight: 1.5, color: "#948da8", margin: 0, maxWidth: "34em", marginLeft: "auto", marginRight: "auto" },
};
