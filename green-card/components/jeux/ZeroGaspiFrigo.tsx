"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { declarerAntiGaspi, envoyerQuizFrigo, type ResultatQuiz } from "@/app/jeux/actions-maison";
import { BoutonEnvoi, MessageErreur } from "@/components/Formulaire";
import { ACTIONS_ANTIGASPI, INGREDIENTS, QUIZ, recettesPour } from "@/lib/jeux/frigo";
import { Celebration } from "./Celebration";

// ---------------------------------------------------------------------------
// Mon frigo : ingrédients → recettes → « Je l'ai cuisiné »
// ---------------------------------------------------------------------------
export function MonFrigo() {
  const [choisis, setChoisis] = useState<string[]>([]);
  const [ouverte, setOuverte] = useState<string | null>(null);
  const [etat, action] = useFormState(declarerAntiGaspi, undefined);
  const [celebrer, setCelebrer] = useState(true);
  useEffect(() => {
    if (etat?.succes) setCelebrer(true);
  }, [etat?.cle, etat?.succes]);

  const recettes = useMemo(() => recettesPour(choisis), [choisis]);
  const basculer = (id: string) => setChoisis((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <section className="space-y-4">
      {etat?.gain && celebrer && <Celebration gain={etat.gain} onFermer={() => setCelebrer(false)} />}
      <div className="panneau space-y-4">
        <div>
          <h2 className="text-lg font-bold">🧊 Qu&apos;y a-t-il à finir dans mon frigo ?</h2>
          <p className="text-sm text-muted">Touchez les restes à utiliser : on vous propose des recettes simples.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Ingrédients à utiliser">
          {INGREDIENTS.map((i) => (
            <button
              key={i.id}
              type="button"
              aria-pressed={choisis.includes(i.id)}
              onClick={() => basculer(i.id)}
              className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 px-3 text-sm font-medium ${
                choisis.includes(i.id) ? "border-green-600 bg-green-50 text-green-text" : "border-line bg-surface"
              }`}
            >
              <span aria-hidden>{i.emoji}</span> {i.nom}
            </button>
          ))}
        </div>
      </div>

      {recettes.length > 0 && (
        <section aria-labelledby="titre-recettes" className="space-y-2">
          <h2 id="titre-recettes" className="text-lg font-bold">
            Idées de recettes
          </h2>
          {recettes.map((r) => (
            <article key={r.id} className="panneau">
              <button
                type="button"
                className="flex w-full items-center gap-3 text-left"
                aria-expanded={ouverte === r.id}
                onClick={() => setOuverte(ouverte === r.id ? null : r.id)}
              >
                <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100 text-2xl">
                  {r.emoji}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{r.titre}</span>
                  <span className="block text-xs text-muted">
                    {r.minutes} min · avec {r.ingredients.map((i) => INGREDIENTS.find((x) => x.id === i)?.nom.toLowerCase()).join(", ")}
                  </span>
                </span>
                <span aria-hidden className="text-muted">
                  {ouverte === r.id ? "▴" : "▾"}
                </span>
              </button>
              {ouverte === r.id && (
                <div className="mt-3 space-y-3">
                  <ol className="list-decimal space-y-1 pl-5 text-sm">
                    {r.etapes.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ol>
                  <form action={action}>
                    <input type="hidden" name="type" value="recette" />
                    <input type="hidden" name="recette" value={r.id} />
                    <BoutonEnvoi enCours="Enregistrement…">👩‍🍳 Je l&apos;ai cuisiné !</BoutonEnvoi>
                  </form>
                </div>
              )}
            </article>
          ))}
          <p className="text-xs text-muted">Bientôt : des recettes sur mesure proposées par l&apos;IA à partir de votre frigo.</p>
        </section>
      )}
      {etat?.succes && (
        <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
          ✅ {etat.succes}
        </p>
      )}
      <MessageErreur message={etat?.erreur} />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Autres actions anti-gaspi
// ---------------------------------------------------------------------------
export function AutresActions() {
  const [etat, action] = useFormState(declarerAntiGaspi, undefined);
  const [celebrer, setCelebrer] = useState(true);
  useEffect(() => {
    if (etat?.succes) setCelebrer(true);
  }, [etat?.cle, etat?.succes]);

  return (
    <section className="space-y-4">
      {etat?.gain && celebrer && <Celebration gain={etat.gain} onFermer={() => setCelebrer(false)} />}
      <form action={action} className="panneau space-y-4">
        <h2 className="text-lg font-bold">Aujourd&apos;hui, j&apos;ai…</h2>
        <fieldset>
          <legend className="sr-only">Action anti-gaspi</legend>
          <div className="grid grid-cols-1 gap-2">
            {ACTIONS_ANTIGASPI.filter((a) => a.id !== "recette").map((a, i) => (
              <label key={a.id} className="cursor-pointer">
                <input type="radio" name="type" value={a.id} defaultChecked={i === 0} className="peer sr-only" />
                <span className="flex min-h-[52px] items-center gap-3 rounded-2xl border-2 border-line px-3 text-sm font-semibold peer-checked:border-green-600 peer-checked:bg-green-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-green-600">
                  <span aria-hidden className="text-xl">
                    {a.emoji}
                  </span>
                  {a.nom.replace("J'ai ", "")}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {etat?.succes && (
          <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
            ✅ {etat.succes}
          </p>
        )}
        <MessageErreur message={etat?.erreur} />
        <BoutonEnvoi enCours="Enregistrement…">Enregistrer</BoutonEnvoi>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Quiz « DLC ou DDM ? »
// ---------------------------------------------------------------------------
export function QuizDates({ dejaReussi }: { dejaReussi: boolean }) {
  const [reponses, setReponses] = useState<Record<string, number>>({});
  const [resultat, setResultat] = useState<ResultatQuiz | null>(null);
  const [enCours, demarrer] = useTransition();
  const complet = QUIZ.every((q) => reponses[q.id] !== undefined);

  function envoyer() {
    demarrer(async () => setResultat(await envoyerQuizFrigo(reponses)));
  }

  function recommencer() {
    setReponses({});
    setResultat(null);
  }

  return (
    <section className="space-y-4">
      {resultat?.gain && <Celebration gain={resultat.gain} onFermer={() => setResultat({ ...resultat, gain: null })} />}
      <div className="panneau space-y-4">
        <div>
          <h2 className="text-lg font-bold">Quiz « DLC ou DDM ? »</h2>
          <p className="text-sm text-muted">
            {dejaReussi ? "✓ Déjà réussi sans faute. Vous pouvez rejouer pour réviser." : "6 questions sur les dates. Un sans-faute pour la médaille d'argent !"}
          </p>
        </div>
        <ol className="space-y-5">
          {QUIZ.map((q, n) => {
            const corr = resultat?.corrections.find((c) => c.id === q.id);
            return (
              <li key={q.id}>
                <fieldset disabled={!!resultat}>
                  <legend className="mb-2 text-sm font-semibold">
                    {n + 1}. {q.question}
                  </legend>
                  <div className="space-y-2">
                    {q.choix.map((c, i) => {
                      const juste = corr && corr.bonne === i;
                      const faux = corr && reponses[q.id] === i && corr.bonne !== i;
                      return (
                        <label
                          key={i}
                          className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-3 text-sm ${
                            juste ? "border-green-600 bg-green-50" : faux ? "border-alert bg-alert-bg" : reponses[q.id] === i ? "border-green-600" : "border-line"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${q.id}`}
                            checked={reponses[q.id] === i}
                            onChange={() => setReponses((r) => ({ ...r, [q.id]: i }))}
                            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--green-600)]"
                          />
                          <span>
                            {c}
                            {juste && <span className="sr-only"> (bonne réponse)</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {corr && <p className="mt-2 text-sm text-muted">{corr.explication}</p>}
                </fieldset>
              </li>
            );
          })}
        </ol>
        {resultat ? (
          <div className="space-y-3">
            <p role="status" className={`rounded-2xl p-4 text-center font-semibold ${resultat.score === resultat.total ? "bg-green-50 text-green-text" : "bg-alert-bg text-alert"}`}>
              {resultat.score}/{resultat.total} {resultat.score === resultat.total ? "· Sans faute, bravo !" : "· Relisez les explications et retentez !"}
            </p>
            <button type="button" className="btn-secondaire" onClick={recommencer}>
              Recommencer le quiz
            </button>
          </div>
        ) : (
          <button type="button" className="btn-primaire" onClick={envoyer} disabled={!complet || enCours}>
            {enCours ? "Correction…" : complet ? "Voir mes résultats" : `Répondez aux ${QUIZ.length} questions`}
          </button>
        )}
      </div>
    </section>
  );
}
