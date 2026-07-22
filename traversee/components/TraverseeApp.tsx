"use client";

// L'expérience La Traversée — le rituel quotidien, branché sur le vrai store.
// Orchestre les cinq actes : la boucle des 4 temps chaque jour, plus les
// battements propres à chaque acte — le Signe (III), l'Atterrissage (IV), et le
// Passage (V, J30). Accès discret au Vestiaire. ?day=N pour parcourir en test.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTraversee } from "../store/useTraversee";
import { Portrait } from "./Portrait";
import { BoucleJour } from "./BoucleJour";
import { Passage } from "./Passage";
import { Onboarding } from "./Onboarding";
import { Atterrissage } from "./Atterrissage";
import { jourN, acteDuJour, ACTES } from "../content/jours";
import { territoireByKey } from "../content/territoires";
import { composerSignal, voiceClarity, registre } from "../lib/voice";
import { signes } from "../lib/derivation";

const REG_LABEL: Record<string, string> = { brume: "Brume", assure: "Assuré", intime: "Intime" };

export function TraverseeApp() {
  const s = useTraversee();
  const [mounted, setMounted] = useState(false);
  const [jourAffiche, setJourAffiche] = useState(1);
  const [resetArme, setResetArme] = useState(false);

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

  // Acte IV : dériver les trois destinations en entrant dans l'atterrissage.
  useEffect(() => {
    if (!mounted || s.journey.startDate === null) return;
    if (acteDuJour(jourAffiche) === "atterrissage" && s.destinations.candidates.length === 0) {
      s.genererDestinations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, jourAffiche, s.destinations.candidates.length]);

  // Quand un seul chemin reste, il devient la destination.
  useEffect(() => {
    if (s.destinations.candidates.length === 0) return;
    const rest = s.destinations.candidates.filter((c) => !s.destinations.eliminees.includes(c.id));
    if (rest.length === 1 && !s.destinations.choisie) s.choisirDestination(rest[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.destinations.candidates.length, s.destinations.eliminees.length, s.destinations.choisie]);

  if (!mounted) return <div style={ST.page} />;

  const demarre = s.journey.startDate !== null;
  const contenu = jourN(jourAffiche);
  const clarity = s.portrait.clarity;
  const acteKey = acteDuJour(jourAffiche);

  const renoncements = Object.values(s.reponses)
    .filter((r) => r.verbe === "laisser" && r.cible)
    .map((r) => r.cible as string);

  const signal = contenu ? composerSignal(contenu, { prenom: s.profil.prenom, renoncements }) : "";
  const acte = ACTES.find((a) => a.key === acteKey);
  const terr = contenu ? territoireByKey[contenu.territoire] : null;
  const reg = registre(voiceClarity(jourAffiche));

  const destChoisie = s.destinations.candidates.find((c) => c.id === s.destinations.choisie) ?? null;

  // Battement propre à l'acte, montré sous la trace.
  let traceExtra: React.ReactNode = null;
  if (acteKey === "signes") {
    const sg = signes(s.reponses)[0];
    if (sg) {
      traceExtra = (
        <div style={ST.signe}>
          <p style={ST.signeEyebrow}>Un signe</p>
          <p style={ST.signeTexte}>{sg.texte}</p>
          <p style={ST.signePreuve}>{sg.preuve}</p>
        </div>
      );
    }
  } else if (acteKey === "atterrissage") {
    traceExtra = (
      <Atterrissage
        candidates={s.destinations.candidates}
        eliminees={s.destinations.eliminees}
        choisie={s.destinations.choisie}
        onEliminer={s.eliminerDestination}
      />
    );
  }

  return (
    <div style={ST.page}>
      <style>{`
        .tx-page { animation: tx-page-in 1.4s cubic-bezier(.16,1,.3,1) both; }
        @keyframes tx-page-in { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .tx-page { animation: none; } }
      `}</style>
      {demarre && (
        <Link href="/vestiaire" style={ST.lienVestiaire}>
          Le Vestiaire
        </Link>
      )}
      {/* Aide au test — repartir de zéro. À retirer avant le lancement. */}
      {demarre &&
        (resetArme ? (
          <div style={ST.resetRow}>
            <button
              style={ST.resetConfirm}
              onClick={() => {
                s.reinitialiser();
                setJourAffiche(1);
                setResetArme(false);
              }}
            >
              Tout effacer
            </button>
            <button style={ST.resetAnnuler} onClick={() => setResetArme(false)}>
              Annuler
            </button>
          </div>
        ) : (
          <button style={ST.resetLien} onClick={() => setResetArme(true)}>
            Recommencer
          </button>
        ))}
      <div className="tx-page" style={ST.inner}>
        {!demarre ? (
          <Onboarding onDemarrer={(prenom, heure) => s.demarrer(prenom, heure)} />
        ) : contenu ? (
          <>
            <p style={ST.meta}>
              {acte?.nom} — Jour {jourAffiche} · {terr?.nom} · registre {REG_LABEL[reg]}
              {s.profil.heureRituel ? ` · rendez-vous ${s.profil.heureRituel}` : ""}
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
                destination={destChoisie}
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
                  traceExtra={traceExtra}
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
  resetLien: {
    position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
    fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#463f5c",
    background: "none", border: "none", cursor: "pointer", zIndex: 3, fontWeight: 600,
  },
  resetRow: {
    position: "fixed", bottom: 14, left: "50%", transform: "translateX(-50%)",
    display: "flex", gap: 10, alignItems: "center", zIndex: 3,
  },
  resetConfirm: {
    fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 999, cursor: "pointer",
    color: "#e8823f", background: "rgba(232,130,63,.12)", border: "1px solid rgba(232,130,63,.5)",
  },
  resetAnnuler: {
    fontSize: 12, padding: "7px 12px", borderRadius: 999, cursor: "pointer",
    color: "#635d78", background: "none", border: "none",
  },
  inner: { maxWidth: 640, margin: "0 auto", padding: "64px 24px 120px", textAlign: "center" },
  meta: { color: "#635d78", fontSize: 13, margin: "0 0 26px" },
  signe: {
    marginTop: 26, padding: "18px 20px", borderRadius: 14,
    border: "1px solid rgba(232,130,63,.28)", background: "rgba(232,130,63,.06)",
    maxWidth: 460, marginLeft: "auto", marginRight: "auto",
  },
  signeEyebrow: {
    fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase",
    color: "#e8823f", fontWeight: 600, margin: "0 0 8px",
  },
  signeTexte: {
    fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
    fontSize: 17, lineHeight: 1.45, color: "#f2eef8", margin: "0 0 6px",
  },
  signePreuve: { fontSize: 12, color: "#8b84a3", margin: 0, fontVariantNumeric: "tabular-nums" },
};
