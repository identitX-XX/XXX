"use client";

// La boucle quotidienne, branchée sur le VRAI store (vivreJour). Route neuve,
// non reliée — la racine `/` reste intacte. Démarrage minimal (prénom), puis
// les quatre temps du jour. ?day=N pour parcourir en test (devSetDay).

import { useEffect, useState } from "react";
import { useTraversee } from "../../../traversee/store/useTraversee";
import { Portrait } from "../../../traversee/components/Portrait";
import { BoucleJour } from "../../../traversee/components/BoucleJour";
import { jourN, acteDuJour, ACTES } from "../../../traversee/content/jours";
import { territoireByKey } from "../../../traversee/content/territoires";
import { composerSignal, voiceClarity, registre } from "../../../traversee/lib/voice";

const REG_LABEL: Record<string, string> = { brume: "Brume", assure: "Assuré", intime: "Intime" };

export default function PageJour() {
  const s = useTraversee();
  const [mounted, setMounted] = useState(false);
  const [jourAffiche, setJourAffiche] = useState(1);
  const [prenomSaisi, setPrenomSaisi] = useState("");

  // Après montage : caler le jour affiché sur le store, honorer ?day=N.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("day");
    const n = p ? parseInt(p, 10) : NaN;
    if (!Number.isNaN(n)) {
      const d = Math.max(1, Math.min(30, n));
      s.devSetDay(d);
      setJourAffiche(d);
    } else {
      setJourAffiche(s.journey.currentDay);
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return <div style={ST.page} />;

  const demarre = s.journey.startDate !== null;
  const contenu = jourN(jourAffiche);
  const clarity = s.portrait.clarity;

  // Renoncements dans ses mots : les cibles LAISSÉES, pour que la voix intime
  // les cite.
  const renoncements = Object.values(s.reponses)
    .filter((r) => r.verbe === "laisser" && r.cible)
    .map((r) => r.cible as string);

  const signal = contenu
    ? composerSignal(contenu, { prenom: s.profil.prenom, renoncements })
    : "";
  const acte = ACTES.find((a) => a.key === acteDuJour(jourAffiche));
  const terr = contenu ? territoireByKey[contenu.territoire] : null;
  const reg = registre(voiceClarity(jourAffiche));

  return (
    <div style={ST.page}>
      <div style={ST.inner}>
        {!demarre ? (
          // Temps 0 : le seul renseignement demandé — le prénom.
          <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
            <p style={ST.eyebrow}>La traversée</p>
            <p style={ST.intro}>
              Trente jours. Un seul geste par jour. On ne se recompose pas en
              s'ajoutant — on choisit ce qu'on emporte.
            </p>
            <input
              value={prenomSaisi}
              onChange={(e) => setPrenomSaisi(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && prenomSaisi.trim() && s.demarrer(prenomSaisi, "")}
              placeholder="Ton prénom"
              aria-label="Ton prénom"
              style={ST.input}
            />
            <button
              style={ST.start}
              onClick={() => prenomSaisi.trim() && s.demarrer(prenomSaisi, "")}
              disabled={!prenomSaisi.trim()}
            >
              Commencer
            </button>
          </div>
        ) : contenu ? (
          <>
            <p style={ST.meta}>
              {acte?.nom} — Jour {jourAffiche} · {terr?.nom} · registre {REG_LABEL[reg]}
            </p>
            <div style={{ marginBottom: 34 }}>
              <Portrait clarity={clarity} size={180} />
            </div>
            <BoucleJour
              key={jourAffiche}
              contenu={contenu}
              signal={signal}
              etoiles={s.etoiles}
              dejaVecu={!!s.reponses[jourAffiche]}
              onVivre={(choixId, verbe, cible) => s.vivreJour(jourAffiche, choixId, verbe, cible)}
              onTermine={() => setJourAffiche(s.journey.currentDay)}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

const ST: Record<string, React.CSSProperties> = {
  page: {
    position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto",
    background:
      "radial-gradient(1000px 560px at 50% -6%, #17122a 0%, rgba(23,18,42,0) 60%), #08060f",
    color: "#ece8f4",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  inner: { maxWidth: 640, margin: "0 auto", padding: "48px 24px 120px", textAlign: "center" },
  eyebrow: {
    fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "#e8823f", fontWeight: 600, margin: "0 0 20px",
  },
  intro: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 19, lineHeight: 1.5, color: "#c9c2dd", margin: "0 0 30px",
  },
  meta: { color: "#635d78", fontSize: 13, margin: "0 0 26px" },
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
