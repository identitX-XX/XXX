"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { releverCompteur } from "@/app/jeux/actions";
import { BoutonEnvoi, MessageErreur } from "@/components/Formulaire";
import { COMPTEURS, TYPES_COMPTEUR, formaterIndex, type TypeCompteur } from "@/lib/jeux/compteur";
import { Celebration } from "./Celebration";

type Derniers = Record<string, { index: number; date: string } | null>;

export function FormReleve({ derniers }: { derniers: Derniers }) {
  const [etat, action] = useFormState(releverCompteur, undefined);
  const [type, setType] = useState<TypeCompteur>("elec");
  const [celebrer, setCelebrer] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat?.succes) {
      formRef.current?.reset();
      setCelebrer(true);
    }
  }, [etat?.cle, etat?.succes]);

  const info = COMPTEURS[type];
  const dernier = derniers[type];

  return (
    <section aria-labelledby="titre-releve" className="space-y-4">
      {etat?.gain && celebrer && <Celebration gain={etat.gain} onFermer={() => setCelebrer(false)} />}

      <form ref={formRef} action={action} className="panneau space-y-5" noValidate>
        <h2 id="titre-releve" className="text-lg font-bold">
          Nouveau relevé
        </h2>

        <fieldset>
          <legend className="etiquette">Quel compteur ?</legend>
          <div className="grid grid-cols-3 gap-2">
            {TYPES_COMPTEUR.map((t) => (
              <label
                key={t}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 p-3 text-sm font-semibold ${
                  type === t ? "border-green-600 bg-green-50" : "border-line"
                }`}
              >
                <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
                <span aria-hidden className="text-2xl">
                  {COMPTEURS[t].emoji}
                </span>
                {COMPTEURS[t].nom}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="index" className="etiquette">
            Index du compteur ({info.unite})
          </label>
          <input id="index" name="index" inputMode="decimal" className="champ text-xl tracking-wider" placeholder="ex. 12 345" autoComplete="off" aria-describedby="index-aide" />
          <p id="index-aide" className="aide">
            {dernier
              ? `Dernier relevé : ${formaterIndex(dernier.index)} ${info.unite}, le ${new Date(dernier.date).toLocaleDateString("fr-FR")}.`
              : "Recopiez les chiffres noirs du compteur, sans les chiffres rouges."}
          </p>
        </div>

        <details className="rounded-xl bg-bg p-3 text-sm">
          <summary className="cursor-pointer font-semibold">Où trouver mon compteur ?</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>Électricité : compteur Linky, souvent dans l&apos;entrée ou la gaine technique du palier. Appuyez sur « + » pour afficher l&apos;index.</li>
            <li>Gaz : compteur Gazpar ou classique, dans la cuisine ou sur le palier.</li>
            <li>Eau : sous l&apos;évier, dans la salle de bains ou la gaine du palier. Le gardien peut vous aider.</li>
          </ul>
          <p className="mt-2 text-muted">Bientôt : prenez simplement le compteur en photo, l&apos;IA lira l&apos;index pour vous.</p>
        </details>

        {etat?.succes && (
          <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
            ✅ {etat.succes}
          </p>
        )}
        <MessageErreur message={etat?.erreur} />
        <BoutonEnvoi enCours="Enregistrement…">Enregistrer le relevé</BoutonEnvoi>
      </form>
    </section>
  );
}
