"use client";

import Link from "next/link";
import { useState } from "react";

// Accès au Compagnon par e-mail et mot de passe.
// L'authentification n'est pas encore branchée : le formulaire valide la
// saisie, puis dit clairement que l'accès ouvre bientôt. Jamais de faux succès.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Mode = "connexion" | "inscription";

const champ =
  "h-12 w-full border-0 border-b border-ivoire/45 bg-transparent px-0 text-[1.0625rem] text-ivoire placeholder:text-ivoire/40 focus:border-champagne focus:outline-none focus:ring-0";
const label = "text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-ivoire/70";

export function FormulaireCompte({ mode }: { mode: Mode }) {
  const [voir, setVoir] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [envoye, setEnvoye] = useState(false);

  function valider(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const err: Record<string, string> = {};
    const email = String(d.get("email") ?? "").trim();
    const mdp = String(d.get("motdepasse") ?? "");
    if (!EMAIL.test(email)) err.email = "Indiquez une adresse e-mail valide.";
    if (mode === "inscription") {
      if (!String(d.get("prenom") ?? "").trim()) err.prenom = "Indiquez votre prénom.";
      if (mdp.length < 12 || !/\d/.test(mdp)) err.motdepasse = "12 caractères minimum, dont un chiffre.";
      if (d.get("cgu") !== "on") err.cgu = "Votre accord est nécessaire pour créer un compte.";
    } else if (!mdp) {
      err.motdepasse = "Indiquez votre mot de passe.";
    }
    setErreurs(err);
    setEnvoye(Object.keys(err).length === 0);
  }

  const err = (k: string) =>
    erreurs[k] && (
      <p id={`err-${k}`} className="mt-2 text-sm text-champagne">
        {erreurs[k]}
      </p>
    );

  return (
    <form onSubmit={valider} noValidate className="space-y-6">
      {mode === "inscription" && (
        <div>
          <label htmlFor="prenom" className={label}>
            Prénom
          </label>
          <input id="prenom" name="prenom" autoComplete="given-name" placeholder="Votre prénom" className={champ} aria-invalid={!!erreurs.prenom} aria-describedby="err-prenom" />
          {err("prenom")}
        </div>
      )}
      <div>
        <label htmlFor="email" className={label}>
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="prenom@exemple.fr" className={champ} aria-invalid={!!erreurs.email} aria-describedby="err-email" />
        {err("email")}
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="motdepasse" className={label}>
            Mot de passe
          </label>
          {mode === "connexion" && (
            <Link href="/compagnon#acces" className="text-xs text-champagne hover:text-ivoire">
              Mot de passe oublié ?
            </Link>
          )}
        </div>
        <div className="flex items-center border-b border-ivoire/45 focus-within:border-champagne">
          <input
            id="motdepasse"
            name="motdepasse"
            type={voir ? "text" : "password"}
            autoComplete={mode === "inscription" ? "new-password" : "current-password"}
            placeholder={mode === "inscription" ? "12 caractères minimum" : ""}
            className="h-12 min-w-0 flex-1 border-0 bg-transparent px-0 text-[1.0625rem] text-ivoire placeholder:text-ivoire/40 focus:outline-none focus:ring-0"
            aria-invalid={!!erreurs.motdepasse}
            aria-describedby="err-motdepasse"
          />
          <button
            type="button"
            onClick={() => setVoir((v) => !v)}
            aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={voir}
            className="flex h-11 w-11 items-center justify-center text-ivoire/70 hover:text-champagne"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
        {err("motdepasse")}
      </div>

      {mode === "inscription" && (
        <div className="space-y-3 pt-1 text-sm">
          <label className="flex items-start gap-3">
            <input type="checkbox" name="cgu" className="mt-1 accent-champagne" aria-describedby="err-cgu" />
            <span>J&apos;accepte les conditions d&apos;utilisation.</span>
          </label>
          {err("cgu")}
          <label className="flex items-start gap-3 border border-champagne/45 p-3 text-[0.8125rem] leading-relaxed text-ivoire/85">
            <input type="checkbox" name="sante" className="mt-1 accent-champagne" />
            <span>
              J&apos;autorise le Compagnon à utiliser mes données de santé (sommeil, cardio, humeur) pour calculer mon élan. Facultatif, modifiable à tout
              moment.
            </span>
          </label>
        </div>
      )}

      <button
        type="submit"
        className="flex h-14 w-full items-center justify-center gap-2.5 bg-champagne text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-nuit transition-colors hover:bg-ivoire"
      >
        {mode === "inscription" ? "Créer mon compte" : "Se connecter"} <span aria-hidden>→</span>
      </button>

      {envoye && (
        <p role="status" className="border-l-2 border-champagne bg-ivoire/5 p-4 text-sm leading-relaxed">
          Le Compagnon ouvre à la prochaine lune : les comptes ne sont pas encore actifs. Votre saisie n&apos;a pas été enregistrée.{" "}
          <Link href="/compagnon#acces" className="font-semibold text-champagne underline underline-offset-2">
            Être invité·e à l&apos;ouverture
          </Link>
        </p>
      )}
    </form>
  );
}
