"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { enregistrerEngagements, pointerJournee } from "@/app/jeux/actions-maison";
import { BoutonEnvoi, MessageErreur } from "@/components/Formulaire";
import { ENGAGEMENTS, ENGAGEMENTS_MIN } from "@/lib/jeux/chauffage";
import { Celebration } from "./Celebration";

export function FormEngagements({ choisis, modification }: { choisis: string[]; modification: boolean }) {
  const [etat, action] = useFormState(enregistrerEngagements, undefined);
  const [selection, setSelection] = useState<string[]>(choisis);
  const basculer = (id: string) => setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <form action={action} className="panneau space-y-4" noValidate>
      <div>
        <h2 className="text-lg font-bold">{modification ? "Modifier mes engagements" : "Mes engagements pour l'hiver"}</h2>
        <p className="text-sm text-muted">Choisissez au moins {ENGAGEMENTS_MIN} gestes que votre foyer s&apos;engage à tenir.</p>
      </div>
      <fieldset>
        <legend className="sr-only">Engagements chauffage</legend>
        <ul className="space-y-2">
          {ENGAGEMENTS.map((e) => {
            const coche = selection.includes(e.id);
            return (
              <li key={e.id}>
                <label className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-3 ${coche ? "border-green-600 bg-green-50" : "border-line"}`}>
                  <input type="checkbox" name="engagement" value={e.id} checked={coche} onChange={() => basculer(e.id)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--green-600)]" />
                  <span>
                    <span className="block text-sm font-semibold">
                      <span aria-hidden>{e.emoji} </span>
                      {e.titre}
                    </span>
                    <span className="block text-xs text-muted">{e.aide}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      <p className="text-sm font-semibold" aria-live="polite">
        {selection.length} engagement{selection.length > 1 ? "s" : ""} choisi{selection.length > 1 ? "s" : ""}
      </p>
      {etat?.succes && (
        <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
          ✅ {etat.succes}
        </p>
      )}
      <MessageErreur message={etat?.erreur} />
      <BoutonEnvoi enCours="Enregistrement…">Je m&apos;engage</BoutonEnvoi>
    </form>
  );
}

export function FormPointDuJour({ choisis, dejaFaits }: { choisis: string[]; dejaFaits: string[] }) {
  const [etat, action] = useFormState(pointerJournee, undefined);
  const [celebrer, setCelebrer] = useState(true);
  useEffect(() => {
    if (etat?.succes) setCelebrer(true);
  }, [etat?.cle, etat?.succes]);

  const engagements = ENGAGEMENTS.filter((e) => choisis.includes(e.id));

  return (
    <section className="space-y-4">
      {etat?.gain && celebrer && <Celebration gain={etat.gain} onFermer={() => setCelebrer(false)} />}
      <form action={action} className="panneau space-y-4">
        <div>
          <h2 className="text-lg font-bold">Le point du jour</h2>
          <p className="text-sm text-muted">Cochez ce que vous avez tenu. Il en faut au moins la moitié pour que la journée compte.</p>
        </div>
        <fieldset>
          <legend className="sr-only">Engagements tenus</legend>
          <ul className="space-y-2">
            {engagements.map((e) => (
              <li key={e.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-line p-3 has-[:checked]:border-green-600 has-[:checked]:bg-green-50">
                  <input type="checkbox" name="fait" value={e.id} defaultChecked={dejaFaits.includes(e.id)} className="h-6 w-6 shrink-0 accent-[var(--green-600)]" />
                  <span className="text-sm font-semibold">
                    <span aria-hidden>{e.emoji} </span>
                    {e.titre}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <fieldset>
          <legend className="etiquette">Pour quel jour ?</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "aujourdhui", nom: "Aujourd'hui" },
              { id: "hier", nom: "Hier" },
            ].map((q, i) => (
              <label key={q.id} className="cursor-pointer">
                <input type="radio" name="quand" value={q.id} defaultChecked={i === 0} className="peer sr-only" />
                <span className="flex min-h-[48px] items-center justify-center rounded-2xl border-2 border-line text-sm font-semibold peer-checked:border-green-600 peer-checked:bg-green-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-green-600">
                  {q.nom}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {etat?.succes && (
          <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
            {etat.succes}
          </p>
        )}
        <MessageErreur message={etat?.erreur} />
        <BoutonEnvoi enCours="Enregistrement…">Valider ma journée</BoutonEnvoi>
      </form>
    </section>
  );
}
