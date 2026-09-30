"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { connecter, inscrire, type EtatFormulaire } from "@/app/espace/actions";
import { BoutonEnvoi, champClasse, Erreur, labelClasse, Message } from "@/components/compte/ui";

type Mode = "connexion" | "inscription";

/** Accès au Compagnon par e-mail et mot de passe (Supabase Auth). */
export function FormulaireCompte({ mode, suite }: { mode: Mode; suite?: string }) {
  const [etat, action] = useFormState<EtatFormulaire, FormData>(mode === "inscription" ? inscrire : connecter, {});
  const [voir, setVoir] = useState(false);

  if (mode === "inscription" && etat.ok) return <Message etat={etat} />;

  return (
    <form action={action} noValidate className="space-y-6">
      {suite && <input type="hidden" name="suite" value={suite} />}
      {mode === "inscription" && (
        <div>
          <label htmlFor="prenom" className={labelClasse}>
            Prénom
          </label>
          <input id="prenom" name="prenom" autoComplete="given-name" placeholder="Votre prénom" className={champClasse} aria-invalid={!!etat.erreurs?.prenom} aria-describedby="err-prenom" />
          <Erreur etat={etat} nom="prenom" />
        </div>
      )}
      <div>
        <label htmlFor="email" className={labelClasse}>
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.fr" className={champClasse} aria-invalid={!!etat.erreurs?.email} aria-describedby="err-email" />
        <Erreur etat={etat} nom="email" />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="motdepasse" className={labelClasse}>
            Mot de passe
          </label>
          {mode === "connexion" && (
            <Link href="/mot-de-passe-oublie" className="text-xs text-bordeaux hover:text-encre">
              Mot de passe oublié ?
            </Link>
          )}
        </div>
        <div className="flex items-center border-b border-filet focus-within:border-bordeaux">
          <input
            id="motdepasse"
            name="motdepasse"
            type={voir ? "text" : "password"}
            autoComplete={mode === "inscription" ? "new-password" : "current-password"}
            placeholder={mode === "inscription" ? "12 caractères minimum" : ""}
            className="h-12 min-w-0 flex-1 border-0 bg-transparent px-0 text-[1.0625rem] text-encre placeholder:text-taupe focus:outline-none focus:ring-0"
            aria-invalid={!!etat.erreurs?.motdepasse}
            aria-describedby="err-motdepasse"
          />
          <button
            type="button"
            onClick={() => setVoir((v) => !v)}
            aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={voir}
            className="flex h-11 w-11 items-center justify-center text-gris hover:text-bordeaux"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
        <Erreur etat={etat} nom="motdepasse" />
      </div>

      {mode === "inscription" && (
        <div className="space-y-3 pt-1 text-sm">
          <label className="flex items-start gap-3">
            <input type="checkbox" name="cgu" className="mt-1 accent-bordeaux" aria-describedby="err-cgu" />
            <span>
              J&apos;accepte les conditions d&apos;utilisation et la{" "}
              <Link href="/confidentialite" className="underline decoration-filet underline-offset-4">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          <Erreur etat={etat} nom="cgu" />
          <label className="flex items-start gap-3 border border-filet p-3 text-[0.8125rem] leading-relaxed text-gris">
            <input type="checkbox" name="sante" className="mt-1 accent-bordeaux" />
            <span>
              J&apos;autorise le Compagnon à utiliser mes données de santé (sommeil, cardio) pour calculer mon élan. Facultatif, modifiable à tout
              moment dans mon profil ; le retrait efface ces données.
            </span>
          </label>
        </div>
      )}

      <BoutonEnvoi>
        {mode === "inscription" ? "Créer mon compte" : "Se connecter"} <span aria-hidden>→</span>
      </BoutonEnvoi>
      <Message etat={etat} />
    </form>
  );
}
