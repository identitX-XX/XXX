"use client";

import { useFormState } from "react-dom";
import { changerMotDePasse, demanderReinitialisation, type EtatFormulaire } from "@/app/espace/actions";
import { BoutonEnvoi, champClasse, ChampMotDePasse, Erreur, labelClasse, Message } from "@/components/compte/ui";

export function FormulaireOubli() {
  const [etat, action] = useFormState<EtatFormulaire, FormData>(demanderReinitialisation, {});
  if (etat.ok) return <Message etat={etat} />;
  return (
    <form action={action} noValidate className="space-y-6">
      <div>
        <label htmlFor="email" className={labelClasse}>
          E-mail du compte
        </label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.fr" className={champClasse} aria-describedby="err-email" />
        <Erreur etat={etat} nom="email" />
      </div>
      <BoutonEnvoi>Recevoir un lien →</BoutonEnvoi>
      <Message etat={etat} />
    </form>
  );
}

export function FormulaireNouveau() {
  const [etat, action] = useFormState<EtatFormulaire, FormData>(changerMotDePasse, {});
  return (
    <form action={action} noValidate className="space-y-6">
      <div>
        <label htmlFor="motdepasse" className={labelClasse}>
          Nouveau mot de passe
        </label>
        <ChampMotDePasse nouveau etat={etat} />
        <Erreur etat={etat} nom="motdepasse" />
      </div>
      <BoutonEnvoi>Enregistrer →</BoutonEnvoi>
      <Message etat={etat} />
    </form>
  );
}
