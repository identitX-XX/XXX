"use client";

import Link from "next/link";
import { useState } from "react";
import { DUREE_CONSERVATION, TERRAINS } from "@/lib/candidature";

type Props = { calcomLink: string };

const champ =
  "mt-2 w-full border-0 border-b border-taupe bg-transparent px-0 py-3 text-encre placeholder:text-taupe focus:border-bordeaux focus:outline-none focus:ring-0";
const label = "text-eyebrow font-medium uppercase text-gris";

export function FormulaireAppel({ calcomLink }: Props) {
  const [etat, setEtat] = useState<"saisie" | "envoi" | "envoye">("saisie");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [erreurGlobale, setErreurGlobale] = useState("");
  const [calendrier, setCalendrier] = useState(false);

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEtat("envoi");
    setErreurGlobale("");
    const donnees = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/candidature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donnees),
    }).catch(() => null);
    const json = await res?.json().catch(() => ({}));
    if (res?.ok) {
      setEtat("envoye");
      return;
    }
    setErreurs(json?.erreurs ?? {});
    setErreurGlobale(json?.erreur ?? (json?.erreurs ? "" : "Une erreur est survenue. Réessayez."));
    setEtat("saisie");
  }

  if (etat === "envoye") {
    return (
      <div className="p-8 md:p-12">
        <p className="text-eyebrow uppercase text-bordeaux">Étape 2 / 2 · Demande reçue</p>
        <h2 className="mt-4 font-serif text-4xl font-medium">Merci. <span className="font-normal italic text-bordeaux">Il ne reste qu&apos;à choisir votre créneau.</span></h2>
        {calcomLink ? (
          calendrier ? (
            <iframe
              src={`https://cal.com/${calcomLink}?embed=true&theme=light&layout=month_view`}
              title="Choisir un créneau"
              className="mt-8 h-[720px] w-full"
            />
          ) : (
            <div className="mt-8">
              <p className="text-sm text-gris">
                Le calendrier est fourni par Cal.com, qui peut déposer des cookies nécessaires à la
                réservation. Il ne se charge qu&apos;à votre demande.
              </p>
              <button
                type="button"
                onClick={() => setCalendrier(true)}
                className="mt-6 border-b border-bordeaux pb-1 text-sm uppercase tracking-[0.14em] text-bordeaux"
              >
                Afficher le calendrier
              </button>
            </div>
          )
        ) : (
          <p className="mt-4 text-gris">Maï Diaw vous recontacte personnellement sous 48 heures.</p>
        )}
      </div>
    );
  }

  const err = (k: string) =>
    erreurs[k] && (
      <p id={`err-${k}`} className="mt-2 text-sm text-bordeaux">
        {erreurs[k]}
      </p>
    );

  return (
    <form onSubmit={envoyer} noValidate className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
      <div className="flex items-center justify-between border-b border-filet pb-6 md:col-span-2">
        <p className="font-serif text-3xl font-medium">Parlez-nous de vous</p>
        <p className="text-eyebrow uppercase text-gris">Étape 1 / 2</p>
      </div>
      {/* Pot de miel : invisible et hors tabulation pour un humain. */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div>
        <label htmlFor="prenom" className={label}>Prénom *</label>
        <input id="prenom" name="prenom" autoComplete="given-name" required className={champ} aria-invalid={!!erreurs.prenom} aria-describedby="err-prenom" />
        {err("prenom")}
      </div>
      <div>
        <label htmlFor="email" className={label}>E-mail *</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={champ} aria-invalid={!!erreurs.email} aria-describedby="err-email" />
        {err("email")}
      </div>
      <div>
        <label htmlFor="telephone" className={label}>Téléphone</label>
        <input id="telephone" name="telephone" type="tel" autoComplete="tel" className={champ} aria-describedby="err-telephone" />
        {err("telephone")}
      </div>
      <div>
        <label htmlFor="ville" className={label}>Ville</label>
        <input id="ville" name="ville" autoComplete="address-level2" className={champ} />
      </div>

      <fieldset className="md:col-span-2" aria-describedby="err-terrain">
        <legend className={label}>Vous cherchez une rencontre… *</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(TERRAINS).map(([id, nom]) => (
            <label key={id} className="cursor-pointer">
              <input type="radio" name="terrain" value={id} className="peer sr-only" />
              <span className="inline-block border border-taupe px-5 py-2 text-sm transition-colors peer-checked:border-bordeaux peer-checked:bg-bordeaux peer-checked:text-ivoire peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-bordeaux">
                {nom}
              </span>
            </label>
          ))}
        </div>
        {err("terrain")}
      </fieldset>

      <div className="md:col-span-2">
        <label htmlFor="message" className={label}>En quelques mots (facultatif)</label>
        <textarea id="message" name="message" rows={3} maxLength={800} className={champ} />
        <p className="mt-2 text-xs text-gris">
          Merci de ne pas indiquer ici d&apos;informations sensibles (santé, convictions, orientation…) :
          nous en parlerons de vive voix si vous le souhaitez.
        </p>
      </div>

      <div className="space-y-4 md:col-span-2">
        <label className="flex gap-3 text-sm">
          <input type="checkbox" name="consentement" required className="mt-1 accent-bordeaux" aria-describedby="err-consentement" />
          <span>
            J&apos;accepte que CéliBOSS™ utilise ces informations pour me recontacter au sujet de ma
            demande. *
          </span>
        </label>
        {err("consentement")}
        <label className="flex gap-3 text-sm text-gris">
          <input type="checkbox" name="newsletter" className="mt-1 accent-bordeaux" />
          <span>Je souhaite aussi recevoir le Journal par e-mail (désinscription en un clic).</span>
        </label>
      </div>

      <div className="md:col-span-2">
        {erreurGlobale && <p className="mb-4 text-sm text-bordeaux" role="alert">{erreurGlobale}</p>}
        <button
          type="submit"
          disabled={etat === "envoi"}
          className="inline-flex items-center gap-3 bg-nuit px-8 py-5 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-ivoire transition-colors hover:bg-bordeaux disabled:opacity-60"
        >
          {etat === "envoi" ? "Envoi…" : "Continuer vers le calendrier"} <span aria-hidden className="text-champagne">→</span>
        </button>

        {/* Information 1er niveau (RGPD art. 13), au plus près de la collecte. */}
        <p className="mt-8 border-t border-filet pt-6 text-xs leading-relaxed text-gris">
          Responsable de traitement : CéliBOSS™ (Maï Diaw). Finalité : répondre à votre demande et
          organiser l&apos;appel découverte ; envoi du Journal si vous l&apos;avez coché. Base légale :
          votre consentement, retirable à tout moment. Données conservées {DUREE_CONSERVATION}, jamais
          vendues ni cédées. Vous pouvez y accéder, les rectifier, les effacer ou vous opposer à leur
          traitement.{" "}
          <Link href="/confidentialite" className="underline underline-offset-2 hover:text-bordeaux">
            Politique de confidentialité
          </Link>
          . * Champs obligatoires.
        </p>
      </div>
    </form>
  );
}
