"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { declarerTrajet, supprimerTrajet } from "@/app/jeux/actions-trajets";
import { BoutonEnvoi, MessageErreur } from "@/components/Formulaire";
import { MODES, MOTIFS, infoMode, type Mode } from "@/lib/jeux/trajets";
import { Celebration } from "./Celebration";

const DISTANCES_RAPIDES = [1, 2, 5, 10];

export function FormTrajet() {
  const [etat, action] = useFormState(declarerTrajet, undefined);
  const [mode, setMode] = useState<Mode>("velo");
  const [km, setKm] = useState("");
  const [celebrer, setCelebrer] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat?.succes) {
      setKm("");
      setCelebrer(true);
    }
  }, [etat?.cle, etat?.succes]);

  return (
    <section aria-labelledby="titre-trajet" className="space-y-4">
      {etat?.gain && celebrer && <Celebration gain={etat.gain} onFermer={() => setCelebrer(false)} />}

      <form ref={formRef} action={action} className="panneau space-y-5" noValidate>
        <h2 id="titre-trajet" className="text-lg font-bold">
          Nouveau trajet vert
        </h2>

        <fieldset>
          <legend className="etiquette">Comment ?</legend>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 p-2 text-center text-xs font-semibold leading-tight ${
                  mode === m.id ? "border-green-600 bg-green-50" : "border-line"
                }`}
              >
                <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} className="sr-only" />
                <span aria-hidden className="text-2xl">
                  {m.emoji}
                </span>
                {m.nom}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="km" className="etiquette">
            Distance (km)
          </label>
          <input
            id="km"
            name="km"
            inputMode="decimal"
            className="champ text-xl"
            placeholder="ex. 2,5"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            autoComplete="off"
            aria-describedby="km-aide"
          />
          <div className="mt-2 flex gap-2" role="group" aria-label="Distances rapides">
            {DISTANCES_RAPIDES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setKm(String(d))}
                className="min-h-[40px] flex-1 rounded-full border-2 border-line text-sm font-semibold hover:border-green-600"
              >
                {d} km
              </button>
            ))}
          </div>
          <p id="km-aide" className="aide">
            Un aller-retour compte comme deux trajets, ou un seul avec la distance totale.
          </p>
        </div>

        <fieldset>
          <legend className="etiquette">Pour aller où ?</legend>
          <div className="flex flex-wrap gap-2">
            {MOTIFS.map((m, i) => (
              <label key={m.id} className="cursor-pointer">
                <input type="radio" name="motif" value={m.id} defaultChecked={i === 0} className="peer sr-only" />
                <span className="inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-line px-3 text-sm font-medium peer-checked:border-green-600 peer-checked:bg-green-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-green-600">
                  <span aria-hidden>{m.emoji}</span> {m.nom}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="etiquette">Quand ?</legend>
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
        <BoutonEnvoi enCours="Enregistrement…">Enregistrer le trajet</BoutonEnvoi>
      </form>
    </section>
  );
}

export interface TrajetVue {
  id: string;
  mode: string;
  km: number;
  motif: string;
  jour: string;
  co2: number;
  modifiable: boolean;
}

const nombre = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n).replace(/[  ]/g, " ");

function libelleJour(jour: string, aujourdhui: string) {
  if (jour === aujourdhui) return "Aujourd'hui";
  const d = new Date(`${jour}T12:00:00Z`);
  const hier = new Date(`${aujourdhui}T12:00:00Z`);
  hier.setUTCDate(hier.getUTCDate() - 1);
  if (d.getTime() === hier.getTime()) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

export function ListeTrajets({ trajets, aujourdhui }: { trajets: TrajetVue[]; aujourdhui: string }) {
  const [enCours, demarrer] = useTransition();
  const [message, setMessage] = useState<string>();
  if (trajets.length === 0) return null;

  return (
    <section aria-labelledby="titre-mes-trajets" className="space-y-2">
      <h2 id="titre-mes-trajets" className="text-lg font-bold">
        Mes derniers trajets
      </h2>
      {message && <MessageErreur message={message} />}
      <ul className="space-y-2">
        {trajets.map((t) => {
          const m = infoMode(t.mode);
          const motif = MOTIFS.find((x) => x.id === t.motif);
          return (
            <li key={t.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-100 text-xl">
                {m?.emoji}
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">
                  {nombre(t.km)} km · {m?.nom}
                </p>
                <p className="text-muted">
                  {libelleJour(t.jour, aujourdhui)} · {motif?.nom} · {nombre(t.co2)} kg CO₂ évité
                </p>
              </div>
              {t.modifiable && (
                <button
                  type="button"
                  disabled={enCours}
                  onClick={() =>
                    demarrer(async () => {
                      const r = await supprimerTrajet(t.id);
                      setMessage(r.erreur);
                    })
                  }
                  className="min-h-[44px] shrink-0 px-2 text-xs text-muted underline"
                  aria-label={`Supprimer le trajet de ${nombre(t.km)} km ${m?.nom ?? ""}`}
                >
                  Supprimer
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
