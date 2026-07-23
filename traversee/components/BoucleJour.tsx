"use client";

// La boucle quotidienne — les quatre temps, un seul écran à la fois, une seule
// action par écran (la thèse : moins, jamais plus) :
//   ① LE SIGNAL       message du moi du futur, dans son registre.
//   ② LE PRÉLÈVEMENT  une question tranchante, un seul geste.
//   ③ L'ACTE          nommer une chose : l'EMPORTER ou la LAISSER.
//   ④ LA TRACE        la constellation a bougé ; on la regarde.
//
// Aucun streak, aucun score, aucune culpabilité. Certains jours n'agissent pas
// (choix neutre) : on peut passer sans trancher. Transitions lentes, coupées
// si prefers-reduced-motion.

import { useState, ReactNode } from "react";
import { JourContenu, Etoile, Verbe } from "../types";
import { Constellation } from "./Constellation";

type Temps = "signal" | "prelevement" | "acte" | "trace";

interface Props {
  contenu: JourContenu;
  signal: string;
  etoiles: Etoile[];
  dejaVecu: boolean;
  onVivre: (choixId: string, verbe: Verbe | undefined, cible: string) => void;
  onTermine: () => void;
  // Battement propre à l'acte, affiché sous la trace : un Signe (Acte III),
  // l'Atterrissage (Acte IV)…
  traceExtra?: ReactNode;
}

const EYEBROW: Record<Temps, string> = {
  signal: "Le signal",
  prelevement: "Le prélèvement",
  acte: "L'acte",
  trace: "La trace",
};

export function BoucleJour({ contenu, signal, etoiles, dejaVecu, onVivre, onTermine, traceExtra }: Props) {
  const [temps, setTemps] = useState<Temps>(dejaVecu ? "trace" : "signal");
  const [choixId, setChoixId] = useState<string | null>(null);
  const [verbe, setVerbe] = useState<Verbe | undefined>(undefined);
  const [cible, setCible] = useState("");

  const choixChoisi = contenu.prelevement.choix.find((c) => c.id === choixId);

  function choisir(id: string, v?: Verbe) {
    setChoixId(id);
    setVerbe(v);
    setTemps("acte");
  }

  function agir(v: Verbe) {
    if (!cible.trim() || !choixId) return;
    onVivre(choixId, v, cible.trim());
    setVerbe(v);
    setTemps("trace");
  }

  function passer() {
    if (!choixId) return;
    onVivre(choixId, undefined, "");
    setVerbe(undefined);
    setTemps("trace");
  }

  return (
    <div style={S.wrap}>
      <style>{`
        .tx-step { animation: tx-fade 1.05s cubic-bezier(.16,1,.3,1) both; }
        @keyframes tx-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .tx-step { animation: none; } }
        .tx-choix:hover, .tx-choix:focus-visible { border-color: rgba(255,78,168,.5); color: #f2eef8; outline: none; }
        .tx-verb { transition: transform .2s ease, background .2s ease; }
        .tx-verb:active { transform: scale(.98); }
      `}</style>

      <p style={S.eyebrow}>{EYEBROW[temps]}</p>

      {/* ① LE SIGNAL */}
      {temps === "signal" && (
        <div className="tx-step" key="signal">
          <p style={S.signal}>{signal}</p>
          <button style={S.next} onClick={() => setTemps("prelevement")}>
            Je continue
          </button>
        </div>
      )}

      {/* ② LE PRÉLÈVEMENT */}
      {temps === "prelevement" && (
        <div className="tx-step" key="prel">
          <p style={S.question}>{contenu.prelevement.question}</p>
          <div style={S.choixCol}>
            {contenu.prelevement.choix.map((c) => (
              <button
                key={c.id}
                className="tx-choix"
                style={S.choix}
                onClick={() => choisir(c.id, c.verbe)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ③ L'ACTE */}
      {temps === "acte" && (
        <div className="tx-step" key="acte">
          {verbe ? (
            <>
              <p style={S.invit}>{contenu.acteInvitation[verbe]}</p>
              <input
                autoFocus
                value={cible}
                onChange={(e) => setCible(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && agir(verbe)}
                placeholder="En un mot, ou une phrase."
                style={S.input}
                aria-label={verbe === "emporter" ? "Ce que tu emportes" : "Ce que tu laisses"}
              />
              <button
                className="tx-verb"
                style={{ ...S.act, ...(verbe === "emporter" ? S.actEmp : S.actLai) }}
                onClick={() => agir(verbe)}
                disabled={!cible.trim()}
              >
                {verbe === "emporter" ? "Je l'emporte" : "Je le laisse ici"}
              </button>
            </>
          ) : (
            <>
              <p style={S.invit}>
                Nomme une chose. Tu l'emportes de l'autre côté, ou tu la déposes ici.
              </p>
              <input
                autoFocus
                value={cible}
                onChange={(e) => setCible(e.target.value)}
                placeholder="En un mot, ou une phrase."
                style={S.input}
                aria-label="Ce que tu emportes ou laisses"
              />
              <div style={S.verbRow}>
                <button
                  className="tx-verb"
                  style={{ ...S.act, ...S.actEmp, flex: 1 }}
                  onClick={() => agir("emporter")}
                  disabled={!cible.trim()}
                >
                  Je l'emporte
                </button>
                <button
                  className="tx-verb"
                  style={{ ...S.act, ...S.actLai, flex: 1 }}
                  onClick={() => agir("laisser")}
                  disabled={!cible.trim()}
                >
                  Je le laisse ici
                </button>
              </div>
              <button style={S.passer} onClick={passer}>
                Passer sans trancher aujourd'hui
              </button>
            </>
          )}
        </div>
      )}

      {/* ④ LA TRACE */}
      {temps === "trace" && (
        <div className="tx-step" key="trace" style={{ textAlign: "center" }}>
          <div style={{ margin: "0 auto 8px", width: 300 }}>
            <Constellation etoiles={etoiles} size={300} />
          </div>
          <p style={S.trace}>
            {verbe === "emporter" && "Un point s'est avivé. Tu l'emportes."}
            {verbe === "laisser" &&
              "Un point s'est éteint. Ce que tu as posé t'attend au Vestiaire — réversible aujourd'hui."}
            {!verbe && "Rien tranché aujourd'hui. La carte t'a vue passer."}
          </p>
          {traceExtra}
          <button style={{ ...S.next, marginTop: 22 }} onClick={onTermine}>
            C'est tout pour aujourd'hui
          </button>
        </div>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 520, margin: "0 auto", textAlign: "center" },
  eyebrow: {
    fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "#635d78", fontWeight: 600, margin: "0 0 22px",
  },
  signal: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 22, lineHeight: 1.5, color: "#f2eef8", margin: "0 0 34px",
  },
  question: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 21, lineHeight: 1.45, color: "#f2eef8", margin: "0 0 28px",
  },
  choixCol: { display: "flex", flexDirection: "column", gap: 12 },
  choix: {
    fontFamily: "inherit", fontSize: 16, padding: "16px 20px", borderRadius: 14,
    border: "1px solid #2f2643", background: "#14111f", color: "#c9c2dd",
    cursor: "pointer", transition: "border-color .2s ease, color .2s ease",
  },
  invit: { fontSize: 17, lineHeight: 1.5, color: "#c9c2dd", margin: "0 0 22px" },
  input: {
    width: "100%", fontFamily: "inherit", fontSize: 17, padding: "14px 16px",
    borderRadius: 12, border: "1px solid #2f2643", background: "#0c0a15",
    color: "#f2eef8", marginBottom: 20, textAlign: "center",
  },
  verbRow: { display: "flex", gap: 12 },
  act: {
    fontFamily: "inherit", fontSize: 16, fontWeight: 600, padding: "14px 22px",
    borderRadius: 999, border: "1px solid transparent", cursor: "pointer",
  },
  actEmp: { background: "rgba(255,78,168,.14)", borderColor: "rgba(255,78,168,.5)", color: "#ff5cae" },
  actLai: { background: "rgba(125,136,223,.13)", borderColor: "rgba(125,136,223,.5)", color: "#8f99e6" },
  passer: {
    display: "block", margin: "18px auto 0", background: "none", border: "none",
    color: "#635d78", fontSize: 13, cursor: "pointer", textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  next: {
    fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "13px 30px",
    borderRadius: 999, border: "1px solid #2f2643", background: "#191524",
    color: "#ece8f4", cursor: "pointer", marginTop: 8,
  },
  trace: { fontSize: 16, lineHeight: 1.5, color: "#c9c2dd", maxWidth: "34em", margin: "0 auto 6px" },
  nette: {
    fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
    color: "#8b84a3", fontWeight: 600, margin: "0 0 26px",
    fontVariantNumeric: "tabular-nums",
  },
};
