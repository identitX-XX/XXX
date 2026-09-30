"use client";

import { useFormState } from "react-dom";
import { mettreAJourProfil, supprimerCompte, type EtatFormulaire } from "@/app/espace/actions";
import { BoutonEnvoi, champClasse, Erreur, labelClasse, Message } from "@/components/compte/ui";

export function FormulaireProfil({ prenom, cap }: { prenom: string; cap: string }) {
  const [etat, action] = useFormState<EtatFormulaire, FormData>(mettreAJourProfil, {});
  return (
    <form action={action} noValidate className="max-w-lg space-y-6">
      <div>
        <label htmlFor="prenom" className={labelClasse}>
          Prénom
        </label>
        <input id="prenom" name="prenom" defaultValue={prenom} autoComplete="given-name" className={champClasse} aria-describedby="err-prenom" />
        <Erreur etat={etat} nom="prenom" />
      </div>
      <div>
        <label htmlFor="cap" className={labelClasse}>
          Mon cap du mois
        </label>
        <input id="cap" name="cap" defaultValue={cap} maxLength={140} placeholder="Ce que je vise ce mois-ci" className={champClasse} />
      </div>
      <div className="max-w-xs">
        <BoutonEnvoi discret>Enregistrer →</BoutonEnvoi>
      </div>
      <Message etat={etat} />
    </form>
  );
}

export function FormulaireSuppression() {
  const [etat, action] = useFormState<EtatFormulaire, FormData>(supprimerCompte, {});
  return (
    <form action={action} noValidate className="max-w-lg space-y-5">
      <div>
        <label htmlFor="confirmation" className={labelClasse}>
          Écrivez SUPPRIMER pour confirmer
        </label>
        <input id="confirmation" name="confirmation" autoComplete="off" className={champClasse} aria-describedby="err-confirmation" />
        <Erreur etat={etat} nom="confirmation" />
      </div>
      <button type="submit" className="text-xs font-semibold uppercase tracking-[0.2em] text-bordeaux underline decoration-bordeaux underline-offset-8">
        Supprimer définitivement mon compte
      </button>
      <Message etat={etat} />
    </form>
  );
}
