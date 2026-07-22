"use client";

// Le Passage — J30. Elle nomme celle qu'elle devient ; le portrait s'ouvre
// entièrement ; l'artefact se compose (lettre du moi du futur + pacte +
// constellation) et s'emporte, en image ou en texte, sans serveur. Vraie fin.

import { useState } from "react";
import { ReponseJour, Etoile } from "../types";
import { Portrait } from "./Portrait";
import { Constellation } from "./Constellation";
import { composerArtefact } from "../lib/artefact";
import { exporterImage, exporterTexte } from "../lib/exportArtefact";

type Etape = "signal" | "nommer" | "artefact";

interface Props {
  signal: string;
  prenom: string | null;
  nomFutur: string | null;
  reponses: Record<number, ReponseJour>;
  etoiles: Etoile[];
  clarity: number;
  onNommer: (nom: string) => void;
}

export function Passage({ signal, prenom, nomFutur, reponses, etoiles, clarity, onNommer }: Props) {
  const [etape, setEtape] = useState<Etape>(nomFutur ? "artefact" : "signal");
  const [nom, setNom] = useState("");

  function nommer() {
    if (!nom.trim()) return;
    onNommer(nom.trim());
    setEtape("artefact");
  }

  const artefact = composerArtefact({ prenom, nomFutur: nomFutur ?? nom, reponses });

  return (
    <div style={S.wrap}>
      <style>{`
        .tx-step { animation: tx-fade 1s cubic-bezier(.16,1,.3,1) both; }
        @keyframes tx-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .tx-step { animation: none; } }
      `}</style>

      {etape === "signal" && (
        <div className="tx-step" style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 30 }}>
            <Portrait clarity={clarity} size={220} />
          </div>
          <p style={S.signal}>{signal}</p>
          <button style={S.next} onClick={() => setEtape("nommer")}>
            Je continue
          </button>
        </div>
      )}

      {etape === "nommer" && (
        <div className="tx-step" style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 30 }}>
            <Portrait clarity={clarity} size={220} />
          </div>
          <p style={S.eyebrow}>Le passage</p>
          <p style={S.invit}>Regarde-la. Donne-lui un nom. C'est toi, de l'autre côté.</p>
          <input
            autoFocus
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && nommer()}
            placeholder="Le nom de celle que tu deviens"
            aria-label="Le nom de celle que tu deviens"
            style={S.input}
          />
          <button style={S.act} onClick={nommer} disabled={!nom.trim()}>
            La nommer
          </button>
        </div>
      )}

      {etape === "artefact" && (
        <div className="tx-step" style={{ textAlign: "center" }}>
          <div style={{ margin: "0 auto 10px", width: 300 }}>
            <Constellation etoiles={etoiles} size={300} />
          </div>
          <p style={S.nom}>{artefact.nom}</p>
          <p style={S.sousNom}>celle que tu es devenue</p>

          <div style={S.lettre}>
            {artefact.lettre.map((p, i) => (
              <p key={i} style={S.para}>{p}</p>
            ))}
          </div>

          <div style={S.pacte}>
            {artefact.pacte.map((l, i) => (
              <p key={i} style={S.pacteLigne}>{l}</p>
            ))}
          </div>

          <div style={S.exportRow}>
            <button style={S.exp} onClick={() => exporterImage(artefact, etoiles)}>
              Emporter l'image
            </button>
            <button style={S.expGhost} onClick={() => exporterTexte(artefact)}>
              Emporter le texte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 560, margin: "0 auto" },
  eyebrow: {
    fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "#635d78", fontWeight: 600, margin: "0 0 16px",
  },
  signal: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 22, lineHeight: 1.5, color: "#f2eef8", margin: "0 0 34px",
  },
  invit: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 20, lineHeight: 1.5, color: "#c9c2dd", margin: "0 0 26px",
  },
  input: {
    width: "100%", fontFamily: "inherit", fontSize: 18, padding: "15px 16px",
    borderRadius: 12, border: "1px solid #2f2643", background: "#0c0a15",
    color: "#f2eef8", marginBottom: 20, textAlign: "center",
  },
  act: {
    fontFamily: "inherit", fontSize: 16, fontWeight: 600, padding: "14px 30px",
    borderRadius: 999, border: "1px solid rgba(255,78,168,.5)",
    background: "rgba(255,78,168,.14)", color: "#ff5cae", cursor: "pointer",
  },
  nom: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 32, color: "#ff5cae", margin: "0 0 4px",
  },
  sousNom: {
    fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
    color: "#635d78", fontWeight: 600, margin: "0 0 34px",
  },
  lettre: { textAlign: "left", margin: "0 0 30px" },
  para: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 18, lineHeight: 1.6, color: "#e7e2f2", margin: "0 0 16px",
  },
  pacte: {
    textAlign: "left", borderTop: "1px solid #241d33", paddingTop: 24, margin: "0 0 34px",
  },
  pacteLigne: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 19, color: "#f2eef8", margin: "0 0 8px",
  },
  exportRow: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  exp: {
    fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "13px 26px",
    borderRadius: 999, border: "1px solid rgba(255,78,168,.5)",
    background: "rgba(255,78,168,.14)", color: "#ff5cae", cursor: "pointer",
  },
  expGhost: {
    fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "13px 26px",
    borderRadius: 999, border: "1px solid #2f2643", background: "#191524",
    color: "#c9c2dd", cursor: "pointer",
  },
  next: {
    fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "13px 30px",
    borderRadius: 999, border: "1px solid #2f2643", background: "#191524",
    color: "#ece8f4", cursor: "pointer",
  },
};
