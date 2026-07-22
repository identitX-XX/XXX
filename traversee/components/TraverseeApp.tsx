"use client";

// L'expérience La Traversée — le rituel quotidien. Démarrage minimal (prénom),
// puis les quatre temps du jour, branchés sur le vrai store. Accès discret au
// Vestiaire. ?day=N pour parcourir en test (devSetDay).

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTraversee } from "../store/useTraversee";
import { Portrait } from "./Portrait";
import { BoucleJour } from "./BoucleJour";
import { Passage } from "./Passage";
import { jourN, acteDuJour, ACTES } from "../content/jours";
import { territoireByKey } from "../content/territoires";
import { composerSignal, voiceClarity, registre } from "../lib/voice";

const REG_LABEL: Record<string, string> = { brume: "Brume", assure: "Assuré", intime: "Intime" };

export function TraverseeApp() {
  const s = useTraversee();
  const [mounted, setMounted] = useState(false);
  const [jourAffiche, setJourAffiche] = useState(1);
  const [prenomSaisi, setPrenomSaisi] = useState("");

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

  const renoncements = Object.values(s.reponses)
    .filter((r) => r.verbe === "laisser" && r.cible)
    .map((r) => r.cible as string);

  const signal = contenu ? composerSignal(contenu, { prenom: s.profil.prenom, renoncements }) : "";
  const acte = ACTES.find((a) => a.key === acteDuJour(jourAffiche));
  const terr = contenu ? territoireByKey[contenu.territoire] : null;
  const reg = registre(voiceClarity(jourAffiche));

  return (
    <div style={ST.page}>
      {demarre && (
        <Link href="/vestiaire" style={ST.lienVestiaire}>
          Le Vestiaire
        </Link>
      )}
      <div style={ST.inner}>
        {!demarre ? (
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
            {jourAffiche >= 30 ? (
              <Passage
                key="passage"
                signal={signal}
                prenom={s.profil.prenom}
                nomFutur={s.nomFutur}
                reponses={s.reponses}
                etoiles={s.etoiles}
                clarity={clarity}
                onNommer={(nom) => s.nommer(nom)}
              />
            ) : (
              <>
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
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

const ST: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background:
      "radial-gradient(1000px 560px at 50% -6%, #17122a 0%, rgba(23,18,42,0) 60%), #08060f",
    color: "#ece8f4",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  lienVestiaire: {
    position: "absolute", top: 20, right: 22, fontSize: 12, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#635d78", textDecoration: "none", fontWeight: 600,
    zIndex: 3,
  },
  inner: { maxWidth: 640, margin: "0 auto", padding: "64px 24px 120px", textAlign: "center" },
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
