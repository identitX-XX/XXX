"use client";

import { useEffect, useRef, useState } from "react";
import { annulerDouche, demarrerDouche, terminerDouche, type FinDouche } from "@/app/jeux/actions-maison";
import { MessageErreur } from "@/components/Formulaire";
import { OBJECTIF_S, formaterChrono } from "@/lib/jeux/douche";
import { Celebration } from "./Celebration";

type EnCours = { id: string; debutLocal: number };

/** Minuteur de douche : un cercle qui se vide en 5 minutes. Le serveur mesure la vraie durée. */
export function DoucheChrono({ ouverte }: { ouverte: { id: string; ecouleS: number } | null }) {
  const [enCours, setEnCours] = useState<EnCours | null>(ouverte ? { id: ouverte.id, debutLocal: Date.now() - ouverte.ecouleS * 1000 } : null);
  const [ecoule, setEcoule] = useState(ouverte?.ecouleS ?? 0);
  const [resultat, setResultat] = useState<Extract<FinDouche, { dureeS: number }> | null>(null);
  const [message, setMessage] = useState<string>();
  const [occupe, setOccupe] = useState(false);
  const verrou = useRef<{ release: () => Promise<void> } | null>(null);
  const alerte = useRef(false);

  useEffect(() => {
    if (!enCours) return;
    const t = setInterval(() => {
      const s = (Date.now() - enCours.debutLocal) / 1000;
      setEcoule(s);
      if (s >= OBJECTIF_S && !alerte.current) {
        alerte.current = true;
        navigator.vibrate?.([300, 150, 300]);
      }
    }, 250);
    return () => clearInterval(t);
  }, [enCours]);

  async function garderEcranAllume() {
    try {
      const wl = (navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } }).wakeLock;
      verrou.current = (await wl?.request("screen")) ?? null;
    } catch {
      /* non pris en charge : sans importance */
    }
  }

  async function commencer() {
    setOccupe(true);
    setMessage(undefined);
    setResultat(null);
    const r = await demarrerDouche();
    setOccupe(false);
    alerte.current = false;
    const decalage = new Date(r.maintenant).getTime() - new Date(r.debut).getTime();
    setEnCours({ id: r.id, debutLocal: Date.now() - decalage });
    setEcoule(decalage / 1000);
    garderEcranAllume();
  }

  async function finir() {
    if (!enCours) return;
    setOccupe(true);
    const r = await terminerDouche(enCours.id);
    setOccupe(false);
    verrou.current?.release().catch(() => {});
    setEnCours(null);
    if ("erreur" in r) setMessage(r.erreur);
    else setResultat(r);
  }

  async function annuler() {
    if (!enCours) return;
    await annulerDouche(enCours.id);
    verrou.current?.release().catch(() => {});
    setEnCours(null);
    setEcoule(0);
  }

  const reste = Math.max(0, OBJECTIF_S - ecoule);
  const depasse = ecoule > OBJECTIF_S;
  const ratio = Math.min(1, ecoule / OBJECTIF_S);
  const R = 88;
  const C = 2 * Math.PI * R;

  return (
    <section className="space-y-4">
      {resultat?.gain && <Celebration gain={resultat.gain} onFermer={() => setResultat({ ...resultat, gain: null })} />}

      <div className="panneau flex flex-col items-center gap-4 text-center">
        <div className="relative h-52 w-52" role="timer" aria-live="off" aria-label={enCours ? `Temps restant ${formaterChrono(reste)}` : "Minuteur prêt : 5 minutes"}>
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="100" cy="100" r={R} fill="none" stroke="var(--green-100)" strokeWidth="14" />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={depasse ? "var(--alert)" : "var(--green-600)"}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={enCours ? C * ratio : 0}
              style={{ transition: "stroke-dashoffset .25s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span aria-hidden className="text-3xl">
              {depasse ? "⏰" : "🚿"}
            </span>
            <span className={`text-4xl font-bold tabular-nums ${depasse ? "text-alert" : ""}`}>
              {enCours ? (depasse ? `+${formaterChrono(ecoule - OBJECTIF_S)}` : formaterChrono(reste)) : "5:00"}
            </span>
            <span className="text-xs text-muted">{enCours ? (depasse ? "c'est l'heure de sortir !" : "restantes") : "objectif"}</span>
          </div>
        </div>

        {!enCours ? (
          <button type="button" className="btn-primaire" onClick={commencer} disabled={occupe}>
            🚿 Je commence ma douche
          </button>
        ) : (
          <>
            <button type="button" className="btn-primaire" onClick={finir} disabled={occupe}>
              ✋ J&apos;ai fini
            </button>
            <button type="button" className="text-sm text-muted underline" onClick={annuler}>
              Annuler ce minuteur
            </button>
          </>
        )}
        <p className="text-xs text-muted">Posez le téléphone hors de portée des éclaboussures. Il vibre à 5 minutes.</p>
      </div>

      {resultat && (
        <div role="status" className={`rounded-2xl p-4 text-sm ${resultat.verdict === "reussie" ? "bg-green-50 text-green-text" : "bg-alert-bg text-alert"}`}>
          {resultat.verdict === "reussie" && (
            <p>
              <strong>Bravo, {formaterChrono(resultat.dureeS)} !</strong> Environ {Math.round(resultat.litres)} litres d&apos;eau chaude économisés par rapport à une
              douche de 10 minutes.
            </p>
          )}
          {resultat.verdict === "depassee" && (
            <p>
              <strong>{formaterChrono(resultat.dureeS)}</strong>, un peu plus que 5 minutes. Astuce : coupez l&apos;eau pendant que vous vous savonnez !
            </p>
          )}
          {resultat.verdict === "trop-court" && <p>Moins d&apos;une minute : ce minuteur n&apos;est pas compté. Relancez-le au début de votre douche.</p>}
          {resultat.verdict === "trop-long" && <p>Plus d&apos;une heure : le minuteur avait sans doute été oublié. Il n&apos;est pas compté.</p>}
        </div>
      )}
      <MessageErreur message={message} />
    </section>
  );
}
