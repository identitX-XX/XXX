"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { demarrerPartieTri, repondreTri, terminerPartieTri, type FinPartie } from "@/app/jeux/actions";
import { MessageErreur } from "@/components/Formulaire";
import { BACS, type Bac } from "@/lib/jeux/tri";
import { MEDAILLES } from "@/lib/carte";
import { Celebration } from "./Celebration";

type Item = { id: string; nom: string; emoji: string };
type Retour = { correct: boolean; bonBac: Bac; explication: string };
type Erreur = { item: Item; bonBac: Bac; explication: string };

const nomBac = (b: Bac) => BACS.find((x) => x.id === b)?.nom ?? b;
const secondes = (ms: number) => `${Math.round(ms / 1000)} s`;

export function JeuTri({ record, partiesRestantes }: { record: { score: number; dureeMs: number } | null; partiesRestantes: number }) {
  const [phase, setPhase] = useState<"accueil" | "jeu" | "fin">("accueil");
  const [partieId, setPartieId] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [i, setI] = useState(0);
  const [retour, setRetour] = useState<Retour | null>(null);
  const [erreurs, setErreurs] = useState<Erreur[]>([]);
  const [bonnes, setBonnes] = useState(0);
  const [fin, setFin] = useState<Extract<FinPartie, { score: number }> | null>(null);
  const [message, setMessage] = useState<string>();
  const [occupe, setOccupe] = useState(false);
  const [restant, setRestant] = useState(0);
  const [restantes, setRestantes] = useState(partiesRestantes);
  const echeance = useRef(0);
  const termine = useRef(false);

  const terminer = useCallback(async (id: string) => {
    if (termine.current) return;
    termine.current = true;
    const r = await terminerPartieTri(id);
    if ("erreur" in r) setMessage(r.erreur);
    else setFin(r);
    setPhase("fin");
  }, []);

  // Chronomètre
  useEffect(() => {
    if (phase !== "jeu") return;
    const t = setInterval(() => {
      const reste = Math.max(0, echeance.current - Date.now());
      setRestant(reste);
      if (reste === 0) terminer(partieId);
    }, 250);
    return () => clearInterval(t);
  }, [phase, partieId, terminer]);

  async function demarrer() {
    setOccupe(true);
    setMessage(undefined);
    const r = await demarrerPartieTri();
    setOccupe(false);
    if ("erreur" in r) return setMessage(r.erreur);
    termine.current = false;
    setPartieId(r.partieId);
    setItems(r.dechets);
    setI(0);
    setBonnes(0);
    setErreurs([]);
    setRetour(null);
    setFin(null);
    echeance.current = Date.now() + r.dureeMaxMs;
    setRestant(r.dureeMaxMs);
    setRestantes((n) => n - 1);
    setPhase("jeu");
  }

  function suivant() {
    setRetour(null);
    if (i + 1 >= items.length) terminer(partieId);
    else setI(i + 1);
  }

  async function trier(bac: Bac) {
    if (occupe || retour) return;
    setOccupe(true);
    const r = await repondreTri(partieId, items[i].id, bac);
    setOccupe(false);
    if ("erreur" in r) {
      setMessage(r.erreur);
      return terminer(partieId);
    }
    setRetour(r);
    if (r.correct) {
      setBonnes((n) => n + 1);
      setTimeout(suivant, 650);
    } else {
      setErreurs((e) => [...e, { item: items[i], bonBac: r.bonBac, explication: r.explication }]);
    }
  }

  // ---------------------------------------------------------------- accueil
  if (phase === "accueil") {
    return (
      <section className="panneau space-y-4 text-center">
        <p aria-hidden className="text-5xl">
          ♻️
        </p>
        <h2 className="text-lg font-bold">12 déchets, 5 bacs, 2 minutes</h2>
        <p className="text-sm text-muted">Touchez le bon bac pour chaque déchet. Les consignes suivent les règles nationales de tri.</p>
        {record && (
          <p className="text-sm">
            Votre record : <strong>{record.score}/12</strong> en {secondes(record.dureeMs)}
          </p>
        )}
        <MessageErreur message={message} />
        <button type="button" className="btn-primaire" onClick={demarrer} disabled={occupe || restantes <= 0}>
          {occupe ? "Préparation…" : "Lancer la partie"}
        </button>
        <p className="text-xs text-muted">
          {restantes > 0 ? `${restantes} partie${restantes > 1 ? "s" : ""} possible${restantes > 1 ? "s" : ""} aujourd'hui` : "Revenez demain !"}
        </p>
      </section>
    );
  }

  // ---------------------------------------------------------------- fin
  if (phase === "fin") {
    return (
      <section className="space-y-4">
        {fin?.gain && <Celebration gain={fin.gain} />}
        <div className="panneau space-y-3 text-center">
          <h2 className="text-lg font-bold">Partie terminée</h2>
          {fin && (
            <>
              <p className="text-4xl font-bold text-green-text">
                {fin.score}
                <span className="text-xl text-muted">/{fin.total}</span>
              </p>
              <p className="text-sm text-muted">
                en {secondes(fin.dureeMs)} · {fin.niveau ? `niveau ${MEDAILLES[fin.niveau]}` : "pas de médaille cette fois"}
              </p>
              {!fin.gain && fin.niveau > 0 && <p className="text-sm text-muted">Vous aviez déjà cette médaille : visez plus haut !</p>}
            </>
          )}
          <MessageErreur message={message} />
          <button type="button" className="btn-primaire" onClick={demarrer} disabled={occupe || restantes <= 0}>
            {restantes > 0 ? "Rejouer" : "Revenez demain"}
          </button>
        </div>
        {erreurs.length > 0 && (
          <div className="panneau">
            <h3 className="mb-2 font-bold">À retenir</h3>
            <ul className="space-y-3 text-sm">
              {erreurs.map((e) => (
                <li key={e.item.id}>
                  <span aria-hidden>{e.item.emoji} </span>
                  <strong>{e.item.nom}</strong> → {nomBac(e.bonBac)}
                  <p className="text-muted">{e.explication}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }

  // ---------------------------------------------------------------- jeu
  const item = items[i];
  return (
    <section aria-label="Partie de Tri Master" className="space-y-4">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>
          Déchet {i + 1}/{items.length} · ✓ {bonnes}
        </span>
        <span className={restant < 20_000 ? "text-alert" : "text-muted"} aria-live="off">
          ⏱ {Math.ceil(restant / 1000)} s
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-green-100" aria-hidden>
        <div className="h-full bg-green-600 transition-[width]" style={{ width: `${(i / items.length) * 100}%` }} />
      </div>

      <div
        key={item.id}
        className={`animate-monte rounded-carte border-2 p-6 text-center transition-colors ${
          retour ? (retour.correct ? "border-green-600 bg-green-50" : "border-alert bg-alert-bg") : "border-line bg-surface"
        }`}
      >
        <p aria-hidden className="text-6xl">
          {item.emoji}
        </p>
        <p className="mt-3 text-xl font-bold" aria-live="polite">
          {item.nom}
        </p>
        {retour && (
          <div role="status" className="mt-3 text-sm">
            {retour.correct ? (
              <p className="font-semibold text-green-text">✓ Bien trié !</p>
            ) : (
              <>
                <p className="font-semibold text-alert">✗ C&apos;était : {nomBac(retour.bonBac)}</p>
                <p className="mt-1 text-muted">{retour.explication}</p>
              </>
            )}
          </div>
        )}
      </div>

      {retour && !retour.correct ? (
        <button type="button" className="btn-primaire" onClick={suivant} autoFocus>
          {i + 1 >= items.length ? "Voir mon score" : "Déchet suivant"}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {BACS.map((b, n) => (
            <button
              key={b.id}
              type="button"
              onClick={() => trier(b.id)}
              disabled={occupe || !!retour}
              className={`flex min-h-[64px] items-center gap-2 rounded-2xl border-2 border-line bg-surface px-3 text-left text-sm font-semibold transition-transform active:scale-95 ${
                n === BACS.length - 1 ? "col-span-2 justify-center" : ""
              }`}
              style={{ borderLeft: `8px solid ${b.couleur}` }}
            >
              <span aria-hidden className="text-xl">
                {b.emoji}
              </span>
              {b.nom}
            </button>
          ))}
        </div>
      )}
      <MessageErreur message={message} />
    </section>
  );
}
