"use client";

// L'entrée dans la traversée — deux renseignements, un par écran (la thèse :
// moins). Le prénom, puis l'heure du rendez-vous quotidien (affichage seul,
// aucune notification, aucune pression).

import { useState } from "react";

export function Onboarding({ onDemarrer }: { onDemarrer: (prenom: string, heure: string) => void }) {
  const [etape, setEtape] = useState<"prenom" | "heure">("prenom");
  const [prenom, setPrenom] = useState("");
  const [heure, setHeure] = useState("08:00");

  return (
    <div style={S.wrap}>
      <style>{`
        .tx-ob { animation: tx-ob-fade 1s cubic-bezier(.16,1,.3,1) both; }
        @keyframes tx-ob-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .tx-ob { animation: none; } }
      `}</style>

      {etape === "prenom" ? (
        <div className="tx-ob" key="prenom">
          <p style={S.eyebrow}>La traversée</p>
          <p style={S.intro}>
            Trente jours. Un seul geste par jour. On ne se recompose pas en
            s'ajoutant — on choisit ce qu'on emporte.
          </p>
          <input
            autoFocus
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && prenom.trim() && setEtape("heure")}
            placeholder="Ton prénom"
            aria-label="Ton prénom"
            style={S.input}
          />
          <button style={S.start} onClick={() => prenom.trim() && setEtape("heure")} disabled={!prenom.trim()}>
            Continuer
          </button>
        </div>
      ) : (
        <div className="tx-ob" key="heure">
          <p style={S.eyebrow}>Ton rendez-vous</p>
          <p style={S.intro}>
            À quelle heure viendras-tu ? Ce n'est pas une alarme — juste l'heure
            que tu te réserves, chaque jour, pour toi.
          </p>
          <input
            type="time"
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onDemarrer(prenom, heure)}
            aria-label="Heure du rendez-vous"
            style={{ ...S.input, letterSpacing: "0.1em" }}
          />
          <button style={S.start} onClick={() => onDemarrer(prenom, heure)}>
            Commencer
          </button>
        </div>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 420, margin: "0 auto", textAlign: "center" },
  eyebrow: {
    fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "#e8823f", fontWeight: 600, margin: "0 0 20px",
  },
  intro: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 19, lineHeight: 1.5, color: "#c9c2dd", margin: "0 0 30px",
  },
  input: {
    width: "100%", fontFamily: "inherit", fontSize: 17, padding: "14px 16px",
    borderRadius: 12, border: "1px solid #2f2643", background: "#0c0a15",
    color: "#f2eef8", marginBottom: 18, textAlign: "center",
  },
  start: {
    fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "13px 34px",
    borderRadius: 999, border: "1px solid rgba(255,78,168,.5)",
    background: "rgba(255,78,168,.14)", color: "#ff5cae", cursor: "pointer",
  },
};
