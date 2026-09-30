"use client";

import { useFormState } from "react-dom";
import { enregistrerPoint, type EtatFormulaire } from "@/app/espace/actions";
import { BoutonEnvoi, champClasse, Erreur, labelClasse, Message } from "@/components/compte/ui";
import { ESPRITS, type LignePoint } from "@/lib/compagnon/point";

function Echelle({ nom, titre, bas, haut, valeur, etat }: { nom: string; titre: string; bas: string; haut: string; valeur: number | null; etat: EtatFormulaire }) {
  return (
    <fieldset className="space-y-3" aria-describedby={`err-${nom}`}>
      <legend className="font-serif text-2xl font-medium">{titre}</legend>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input type="radio" name={nom} value={n} defaultChecked={valeur === n} className="peer sr-only" />
            <span className="flex h-12 items-center justify-center border border-filet font-serif text-xl transition-colors peer-checked:border-nuit peer-checked:bg-nuit peer-checked:text-ivoire peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-bordeaux">
              {n}
            </span>
          </label>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gris">
        <span>{bas}</span>
        <span>{haut}</span>
      </div>
      <Erreur etat={etat} nom={nom} />
    </fieldset>
  );
}

export function FormulairePoint({ jour, point, sante }: { jour: string; point: LignePoint | null; sante: boolean }) {
  const [etat, action] = useFormState<EtatFormulaire, FormData>(enregistrerPoint, {});
  const h = point?.sommeil_minutes ? Math.floor(point.sommeil_minutes / 60) : "";
  const m = point?.sommeil_minutes ? point.sommeil_minutes % 60 : "";

  return (
    <form action={action} noValidate className="space-y-14">
      <input type="hidden" name="jour" value={jour} />

      <div className="grid gap-12 md:grid-cols-3">
        <Echelle nom="humeur" titre="Humeur" bas="Basse" haut="Rayonnante" valeur={point?.humeur ?? null} etat={etat} />
        <Echelle nom="energie" titre="Énergie" bas="À plat" haut="Pleine" valeur={point?.energie ?? null} etat={etat} />
        <Echelle nom="ambition" titre="Ambition" bas="En pause" haut="En feu" valeur={point?.ambition ?? null} etat={etat} />
      </div>

      <fieldset className="space-y-4">
        <legend className="font-serif text-2xl font-medium">État d&apos;esprit</legend>
        <div className="flex flex-wrap gap-2">
          {ESPRITS.map((e) => (
            <label key={e} className="cursor-pointer">
              <input type="radio" name="esprit" value={e} defaultChecked={point?.esprit === e} className="peer sr-only" />
              <span className="inline-block border border-filet px-4 py-2 text-sm transition-colors peer-checked:border-nuit peer-checked:bg-nuit peer-checked:text-ivoire peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-bordeaux">
                {e}
              </span>
            </label>
          ))}
        </div>
        <Erreur etat={etat} nom="esprit" />
      </fieldset>

      <fieldset className="space-y-6 border-t border-filet pt-10" disabled={!sante}>
        <legend className="font-serif text-2xl font-medium">Corps</legend>
        {!sante && <p className="text-sm text-gris">Activez le consentement santé dans votre profil pour renseigner sommeil et cardio.</p>}
        <p className="text-sm text-gris">Avec une montre connectée, ces valeurs arriveront toutes seules via l&apos;application mobile.</p>
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <label htmlFor="sommeilHeures" className={labelClasse}>
              Sommeil · heures
            </label>
            <input id="sommeilHeures" name="sommeilHeures" type="number" inputMode="numeric" min={0} max={23} defaultValue={h} className={champClasse} />
          </div>
          <div>
            <label htmlFor="sommeilMin" className={labelClasse}>
              Sommeil · minutes
            </label>
            <input id="sommeilMin" name="sommeilMin" type="number" inputMode="numeric" min={0} max={59} defaultValue={m} className={champClasse} />
          </div>
          <div>
            <label htmlFor="cardioRepos" className={labelClasse}>
              Cardio au repos · bpm
            </label>
            <input id="cardioRepos" name="cardioRepos" type="number" inputMode="numeric" min={25} max={220} defaultValue={point?.cardio_repos ?? ""} className={champClasse} />
          </div>
        </div>
        <Erreur etat={etat} nom="sommeil" />
        <Erreur etat={etat} nom="cardio" />
        <Erreur etat={etat} nom="sante" />
      </fieldset>

      <div className="max-w-sm space-y-4">
        <Erreur etat={etat} nom="vide" />
        <BoutonEnvoi>Enregistrer mon point →</BoutonEnvoi>
        <Message etat={etat} />
      </div>
    </form>
  );
}
