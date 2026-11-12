"use client";

import { useFormState } from "react-dom";
import { connexion, creerCarte, supprimerCarte, verifierActivation } from "@/app/actions";
import { ChoixResidence } from "./ChoixResidence";
import { BoutonEnvoi, MessageErreur, type ResidenceOption } from "./Formulaire";

export function FormActivation({ residences }: { residences: ResidenceOption[] }) {
  const [etat, action] = useFormState(verifierActivation, undefined);
  return (
    <form action={action} className="space-y-6" noValidate>
      <ChoixResidence residences={residences} invalide={etat?.champ === "residence"} />

      <div>
        <label htmlFor="ug" className="etiquette">
          Votre n° d&apos;UG (logement)
        </label>
        <input id="ug" name="ug" className="champ uppercase" placeholder="ex. TIL-A-101" autoComplete="off" autoCapitalize="characters" aria-invalid={etat?.champ === "ug" || undefined} aria-describedby="ug-aide" required />
        <p id="ug-aide" className="aide">Il figure sur votre bail et sur votre avis d&apos;échéance.</p>
      </div>

      <div>
        <label htmlFor="code" className="etiquette">
          Code d&apos;activation
        </label>
        <input id="code" name="code" className="champ font-mono uppercase tracking-[0.2em]" placeholder="XXXX-XXXX" maxLength={9} autoComplete="one-time-code" autoCapitalize="characters" aria-invalid={etat?.champ === "code" || undefined} aria-describedby="code-aide" required />
        <p id="code-aide" className="aide">8 caractères, reçus par courrier ou par SMS de CDC Habitat.</p>
      </div>

      <MessageErreur message={etat?.erreur} />
      <BoutonEnvoi enCours="Vérification…">Continuer</BoutonEnvoi>
    </form>
  );
}

export function FormCreationCarte() {
  const [etat, action] = useFormState(creerCarte, undefined);
  return (
    <form action={action} className="space-y-6" noValidate>
      <div>
        <label htmlFor="pseudo" className="etiquette">
          Le nom de votre carte
        </label>
        <input id="pseudo" name="pseudo" className="champ" placeholder="ex. Foyer Martin, Les Dupont…" maxLength={20} autoComplete="nickname" aria-invalid={etat?.champ === "pseudo" || undefined} aria-describedby="pseudo-aide" required />
        <p id="pseudo-aide" className="aide">Visible par vos voisins dans les classements. Pas besoin de votre vrai nom.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="pin" className="etiquette">
            Code PIN
          </label>
          <input id="pin" name="pin" type="password" inputMode="numeric" pattern="\d{6}" maxLength={6} className="champ tracking-[0.4em]" autoComplete="new-password" aria-invalid={etat?.champ === "pin" || undefined} aria-describedby="pin-aide" required />
        </div>
        <div>
          <label htmlFor="pin2" className="etiquette">
            Confirmez
          </label>
          <input id="pin2" name="pin2" type="password" inputMode="numeric" pattern="\d{6}" maxLength={6} className="champ tracking-[0.4em]" autoComplete="new-password" aria-invalid={etat?.champ === "pin2" || undefined} required />
        </div>
        <p id="pin-aide" className="aide col-span-2 -mt-1">6 chiffres, pour vous reconnecter ensuite. Évitez votre date de naissance.</p>
      </div>

      <fieldset className="space-y-3">
        <legend className="etiquette">Vos choix</legend>
        <label className="flex gap-3 rounded-2xl border-2 border-line bg-surface p-4">
          <input type="checkbox" name="cgu" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--green-600)]" aria-invalid={etat?.champ === "cgu" || undefined} />
          <span className="text-sm">
            J&apos;accepte les <a href="/cgu" target="_blank" className="font-semibold text-green-text underline">conditions d&apos;utilisation et la politique de confidentialité</a> de Green Card. <span className="text-muted">(obligatoire)</span>
          </span>
        </label>
        <label className="flex gap-3 rounded-2xl border-2 border-line bg-surface p-4">
          <input type="checkbox" name="conso" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--green-600)]" />
          <span className="text-sm">
            J&apos;accepte que mes relevés d&apos;eau, de gaz et d&apos;électricité soient utilisés pour calculer mes économies. <span className="text-muted">(facultatif, modifiable à tout moment)</span>
          </span>
        </label>
      </fieldset>

      <MessageErreur message={etat?.erreur} />
      <BoutonEnvoi enCours="Activation…">Activer ma Green Card</BoutonEnvoi>
    </form>
  );
}

export function FormConnexion({ residences }: { residences: ResidenceOption[] }) {
  const [etat, action] = useFormState(connexion, undefined);
  return (
    <form action={action} className="space-y-6" noValidate>
      <ChoixResidence residences={residences} invalide={etat?.champ === "residence"} />
      <div>
        <label htmlFor="ug" className="etiquette">
          Votre n° d&apos;UG
        </label>
        <input id="ug" name="ug" className="champ uppercase" placeholder="ex. TIL-A-101" autoComplete="username" autoCapitalize="characters" required />
      </div>
      <div>
        <label htmlFor="pin" className="etiquette">
          Code PIN
        </label>
        <input id="pin" name="pin" type="password" inputMode="numeric" pattern="\d{6}" maxLength={6} className="champ tracking-[0.4em]" autoComplete="current-password" required />
      </div>
      <MessageErreur message={etat?.erreur} />
      <BoutonEnvoi enCours="Connexion…">Me connecter</BoutonEnvoi>
    </form>
  );
}

export function FormSuppression() {
  const [etat, action] = useFormState(supprimerCarte, undefined);
  return (
    <form action={action} className="space-y-3">
      <label htmlFor="pin-suppr" className="etiquette">
        Confirmez avec votre code PIN
      </label>
      <input id="pin-suppr" name="pin" type="password" inputMode="numeric" maxLength={6} className="champ tracking-[0.4em]" autoComplete="current-password" required />
      <MessageErreur message={etat?.erreur} />
      <button type="submit" className="btn border-2 border-alert bg-alert-bg text-alert">
        Supprimer définitivement ma Green Card
      </button>
    </form>
  );
}
