"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { demarrerPartieGaspi, terminerPartieGaspi, toucherObjet, type FinGaspi } from "@/app/jeux/actions-maison";
import { MessageErreur } from "@/components/Formulaire";
import { MEDAILLES } from "@/lib/carte";
import { PIECES, type Piece } from "@/lib/jeux/gaspi";
import { Celebration } from "./Celebration";

type Objet = { id: string; piece: Piece; emoji: string; description: string };
type Etat = { gaspi: boolean; explication: string };

export function ChasseGaspi({ record }: { record: { trouves: number; dureeMs: number } | null }) {
  const [phase, setPhase] = useState<"accueil" | "jeu" | "fin">("accueil");
  const [partieId, setPartieId] = useState("");
  const [objets, setObjets] = useState<Objet[]>([]);
  const [total, setTotal] = useState(10);
  const [etats, setEtats] = useState<Record<string, Etat>>({});
  const [dernier, setDernier] = useState<{ objet: Objet; etat: Etat } | null>(null);
  const [trouves, setTrouves] = useState(0);
  const [erreurs, setErreurs] = useState(0);
  const [restant, setRestant] = useState(0);
  const [fin, setFin] = useState<Extract<FinGaspi, { trouves: number }> | null>(null);
  const [message, setMessage] = useState<string>();
  const [occupe, setOccupe] = useState(false);
  const echeance = useRef(0);
  const termine = useRef(false);

  const terminer = useCallback(async (id: string) => {
    if (termine.current) return;
    termine.current = true;
    const r = await terminerPartieGaspi(id);
    if ("erreur" in r) setMessage(r.erreur);
    else setFin(r);
    setPhase("fin");
  }, []);

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
    const r = await demarrerPartieGaspi();
    setOccupe(false);
    if ("erreur" in r) return setMessage(r.erreur);
    termine.current = false;
    setPartieId(r.partieId);
    setObjets(r.objets);
    setTotal(r.total);
    setEtats({});
    setDernier(null);
    setTrouves(0);
    setErreurs(0);
    setFin(null);
    echeance.current = Date.now() + r.dureeMaxMs;
    setRestant(r.dureeMaxMs);
    setPhase("jeu");
  }

  async function toucher(o: Objet) {
    if (occupe || etats[o.id]) return;
    setOccupe(true);
    const r = await toucherObjet(partieId, o.id);
    setOccupe(false);
    if ("erreur" in r) {
      setMessage(r.erreur);
      return terminer(partieId);
    }
    const etat = { gaspi: r.gaspi, explication: r.explication };
    setEtats((e) => ({ ...e, [o.id]: etat }));
    setDernier({ objet: o, etat });
    setTrouves(r.trouves);
    setErreurs(r.erreurs);
    if (r.trouves >= total) terminer(partieId);
  }

  if (phase === "accueil") {
    return (
      <section className="panneau space-y-4 text-center">
        <p aria-hidden className="text-5xl">
          🔍
        </p>
        <h2 className="text-lg font-bold">10 gaspillages cachés dans l&apos;appartement</h2>
        <p className="text-sm text-muted">
          Touchez tout ce qui gaspille l&apos;énergie ou l&apos;eau. Attention aux pièges : certains objets sont de bons gestes !
        </p>
        {record && (
          <p className="text-sm">
            Votre record : <strong>{record.trouves}/10</strong> en {Math.round(record.dureeMs / 1000)} s
          </p>
        )}
        <MessageErreur message={message} />
        <button type="button" className="btn-primaire" onClick={demarrer} disabled={occupe}>
          {occupe ? "Préparation…" : "Entrer dans l'appartement"}
        </button>
      </section>
    );
  }

  if (phase === "fin") {
    return (
      <section className="space-y-4">
        {fin?.gain && <Celebration gain={fin.gain} />}
        <div className="panneau space-y-3 text-center">
          <h2 className="text-lg font-bold">Visite terminée</h2>
          {fin && (
            <>
              <p className="text-4xl font-bold text-green-text">
                {fin.trouves}
                <span className="text-xl text-muted">/{fin.total}</span>
              </p>
              <p className="text-sm text-muted">
                en {Math.round(fin.dureeMs / 1000)} s · {fin.erreurs} erreur{fin.erreurs > 1 ? "s" : ""} ·{" "}
                {fin.niveau ? `niveau ${MEDAILLES[fin.niveau]}` : "pas de médaille cette fois"}
              </p>
              {!fin.gain && fin.niveau > 0 && <p className="text-sm text-muted">Vous aviez déjà cette médaille : visez plus haut !</p>}
            </>
          )}
          <MessageErreur message={message} />
          <button type="button" className="btn-primaire" onClick={demarrer} disabled={occupe}>
            Rejouer
          </button>
        </div>
        {fin && fin.manques.length > 0 && (
          <div className="panneau">
            <h3 className="mb-2 font-bold">Les gaspillages qui vous ont échappé</h3>
            <ul className="space-y-3 text-sm">
              {fin.manques.map((m) => (
                <li key={m.description}>
                  <span aria-hidden>{m.emoji} </span>
                  <strong>{m.description}</strong>
                  <p className="text-muted">{m.explication}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }

  return (
    <section aria-label="Partie de Chasse au Gaspi" className="space-y-4">
      <div className="sticky top-[72px] z-10 -mx-5 space-y-2 bg-bg px-5 py-2">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>
            🔍 {trouves}/{total} trouvés · ✗ {erreurs}
          </span>
          <span className={restant < 30_000 ? "text-alert" : "text-muted"}>⏱ {Math.ceil(restant / 1000)} s</span>
        </div>
        {dernier && (
          <p
            role="status"
            className={`rounded-xl p-3 text-sm ${dernier.etat.gaspi ? "bg-green-50 text-green-text" : "bg-alert-bg text-alert"}`}
          >
            <strong>{dernier.etat.gaspi ? "✓ Gaspillage trouvé !" : "✗ Raté, c'est un bon geste."}</strong> {dernier.etat.explication}
          </p>
        )}
      </div>

      {PIECES.map((p) => (
        <div key={p.id} className="panneau">
          <h3 className="mb-3 font-bold">
            <span aria-hidden>{p.emoji} </span>
            {p.nom}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {objets
              .filter((o) => o.piece === p.id)
              .map((o) => {
                const e = etats[o.id];
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toucher(o)}
                    disabled={!!e || occupe}
                    aria-label={`${o.description}${e ? (e.gaspi ? " : gaspillage trouvé" : " : bon geste") : ""}`}
                    className={`flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 text-center text-xs font-medium leading-tight transition-transform active:scale-95 ${
                      e ? (e.gaspi ? "border-green-600 bg-green-50" : "border-alert bg-alert-bg") : "border-line bg-surface"
                    }`}
                  >
                    <span aria-hidden className="text-3xl">
                      {e ? (e.gaspi ? "✅" : "👍") : o.emoji}
                    </span>
                    {o.description}
                  </button>
                );
              })}
          </div>
        </div>
      ))}

      <button type="button" className="btn-secondaire" onClick={() => terminer(partieId)}>
        J&apos;ai fini ma visite
      </button>
      <MessageErreur message={message} />
    </section>
  );
}
