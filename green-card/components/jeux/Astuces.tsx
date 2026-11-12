"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { publierAstuce, signalerAstuce, voterAstuce } from "@/app/jeux/actions";
import { BoutonEnvoi, MessageErreur } from "@/components/Formulaire";
import { UNIVERS_ASTUCE } from "@/lib/jeux/astuces";
import type { Gain } from "@/lib/points";
import { Celebration } from "./Celebration";

export interface AstuceVue {
  id: string;
  titre: string;
  texte: string;
  univers: string;
  auteur: string;
  date: string;
  votes: number;
  aVote: boolean;
  aSignale: boolean;
  mienne: boolean;
}

const universInfo = (id: string) => UNIVERS_ASTUCE.find((u) => u.id === id);

export function FormAstuce() {
  const [etat, action] = useFormState(publierAstuce, undefined);
  const [ouvert, setOuvert] = useState(false);
  const [celebrer, setCelebrer] = useState(true);
  const [texte, setTexte] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat?.succes) {
      formRef.current?.reset();
      setTexte("");
      setOuvert(false);
      setCelebrer(true);
    }
  }, [etat?.cle, etat?.succes]);

  return (
    <section className="space-y-4">
      {etat?.gain && celebrer && <Celebration gain={etat.gain} onFermer={() => setCelebrer(false)} />}
      {etat?.succes && !ouvert && (
        <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
          ✅ {etat.succes}
        </p>
      )}

      {!ouvert ? (
        <button type="button" className="btn-primaire" onClick={() => setOuvert(true)}>
          💡 Partager une astuce
        </button>
      ) : (
        <form ref={formRef} action={action} className="panneau space-y-5" noValidate>
          <h2 className="text-lg font-bold">Votre astuce</h2>

          <fieldset>
            <legend className="etiquette">Thème</legend>
            <div className="flex flex-wrap gap-2">
              {UNIVERS_ASTUCE.map((u, i) => (
                <label key={u.id} className="cursor-pointer">
                  <input type="radio" name="univers" value={u.id} defaultChecked={i === 0} className="peer sr-only" />
                  <span className="inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-line px-3 text-sm font-medium peer-checked:border-green-600 peer-checked:bg-green-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-green-600">
                    <span aria-hidden>{u.emoji}</span> {u.nom}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="titre" className="etiquette">
              Titre
            </label>
            <input id="titre" name="titre" className="champ" maxLength={80} placeholder="ex. Le couvercle sur la casserole" />
          </div>

          <div>
            <label htmlFor="texte" className="etiquette">
              L&apos;astuce
            </label>
            <textarea
              id="texte"
              name="texte"
              rows={4}
              maxLength={500}
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              className="champ min-h-[120px] py-3 text-base"
              placeholder="Expliquez simplement, comme à un voisin sur le palier."
              aria-describedby="texte-aide"
            />
            <p id="texte-aide" className="aide flex justify-between">
              <span>Pas de lien, ni d&apos;e-mail, ni de téléphone.</span>
              <span aria-live="polite">{texte.length}/500</span>
            </p>
          </div>

          <MessageErreur message={etat?.erreur} />
          <BoutonEnvoi enCours="Publication…">Publier pour mes voisins</BoutonEnvoi>
          <button type="button" className="btn-secondaire" onClick={() => setOuvert(false)}>
            Annuler
          </button>
        </form>
      )}
    </section>
  );
}

export function ListeAstuces({ astuces, votesDonnes, objectifVotes }: { astuces: AstuceVue[]; votesDonnes: number; objectifVotes: number }) {
  const [filtre, setFiltre] = useState<string>("toutes");
  const [gain, setGain] = useState<Gain | null>(null);
  const [message, setMessage] = useState<string>();
  const [enCours, demarrer] = useTransition();

  const visibles = useMemo(
    () => (filtre === "toutes" ? astuces : filtre === "miennes" ? astuces.filter((a) => a.mienne) : astuces.filter((a) => a.univers === filtre)),
    [astuces, filtre],
  );

  function voter(id: string) {
    setMessage(undefined);
    demarrer(async () => {
      const r = await voterAstuce(id);
      if (r.erreur) setMessage(r.erreur);
      if (r.gain) setGain(r.gain);
    });
  }

  function signaler(id: string) {
    if (!confirm("Signaler cette astuce comme inappropriée ?")) return;
    demarrer(async () => {
      const r = await signalerAstuce(id);
      setMessage(r.erreur ?? r.succes);
    });
  }

  return (
    <section aria-labelledby="titre-astuces" className="space-y-3">
      {gain && <Celebration gain={gain} onFermer={() => setGain(null)} />}

      <div className="flex items-baseline justify-between">
        <h2 id="titre-astuces" className="text-lg font-bold">
          Les astuces de la résidence
        </h2>
        <span className="text-xs text-muted">
          Vos votes : {Math.min(votesDonnes, objectifVotes)}/{objectifVotes}
        </span>
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Filtrer les astuces">
        {[{ id: "toutes", nom: "Toutes", emoji: "" }, { id: "miennes", nom: "Les miennes", emoji: "" }, ...UNIVERS_ASTUCE].map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => setFiltre(u.id)}
            aria-pressed={filtre === u.id}
            className={`min-h-[40px] shrink-0 rounded-full border-2 px-3 text-sm font-medium ${
              filtre === u.id ? "border-green-600 bg-green-50 text-green-text" : "border-line bg-surface"
            }`}
          >
            {u.emoji && <span aria-hidden>{u.emoji} </span>}
            {u.nom}
          </button>
        ))}
      </div>

      {message && (
        <p role="status" className="rounded-2xl bg-bg p-3 text-sm">
          {message}
        </p>
      )}

      {visibles.length === 0 && <p className="panneau text-center text-sm text-muted">Aucune astuce ici pour l&apos;instant. Lancez-vous !</p>}

      <ul className="space-y-3">
        {visibles.map((a) => {
          const u = universInfo(a.univers);
          return (
            <li key={a.id} className="panneau">
              <article aria-labelledby={`astuce-${a.id}`}>
                <p className="text-xs text-muted">
                  {u && (
                    <>
                      <span aria-hidden>{u.emoji}</span> {u.nom} ·{" "}
                    </>
                  )}
                  {a.mienne ? "Vous" : a.auteur}
                </p>
                <h3 id={`astuce-${a.id}`} className="mt-1 font-semibold leading-snug">
                  {a.titre}
                </h3>
                <p className="mt-1 whitespace-pre-line text-sm text-muted">{a.texte}</p>
                <div className="mt-3 flex items-center justify-between">
                  {a.mienne ? (
                    <span className="text-sm font-semibold text-green-text">
                      👍 {a.votes} vote{a.votes > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => voter(a.id)}
                      disabled={enCours}
                      aria-pressed={a.aVote}
                      aria-label={`${a.aVote ? "Retirer mon vote" : "Voter"} pour « ${a.titre} », ${a.votes} vote${a.votes > 1 ? "s" : ""}`}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold ${
                        a.aVote ? "border-green-600 bg-green-600 text-white" : "border-line bg-surface"
                      }`}
                    >
                      👍 {a.votes}
                    </button>
                  )}
                  {!a.mienne && !a.aSignale && (
                    <button type="button" onClick={() => signaler(a.id)} className="min-h-[44px] px-2 text-xs text-muted underline">
                      Signaler
                    </button>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
