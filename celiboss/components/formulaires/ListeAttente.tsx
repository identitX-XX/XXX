"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Liste } from "@/lib/candidature";

type Props = {
  liste: Liste;
  /** Libellé du bouton — un verbe, pas « Envoyer ». */
  action: string;
  /** Ce que la personne recevra, en clair (information RGPD de 1er niveau). */
  promesse: string;
  surSombre?: boolean;
};

export function ListeAttente({ liste, action, promesse, surSombre }: Props) {
  const id = useId();
  const [etat, setEtat] = useState<"saisie" | "envoi" | "ok">("saisie");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEtat("envoi");
    setErreur("");
    const donnees = { ...Object.fromEntries(new FormData(e.currentTarget)), liste };
    const res = await fetch("/api/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donnees),
    }).catch(() => null);
    if (res?.ok) return setEtat("ok");
    const json = await res?.json().catch(() => null);
    setErreur(json?.erreur ?? "Une erreur est survenue. Réessayez.");
    setEtat("saisie");
  }

  const texte = surSombre ? "text-ivoire" : "text-encre";
  const discret = surSombre ? "text-ivoire/60" : "text-gris";
  const trait = surSombre ? "border-ivoire/40 focus:border-champagne" : "border-taupe focus:border-bordeaux";

  if (etat === "ok") {
    return (
      <p role="status" className={`font-serif text-2xl italic ${surSombre ? "text-champagne" : "text-bordeaux"}`}>
        C&apos;est noté. Vous serez parmi les premiers informés.
      </p>
    );
  }

  return (
    <form onSubmit={envoyer} noValidate className="max-w-lg">
      <input type="text" name="site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label htmlFor={id} className={`text-eyebrow uppercase ${discret}`}>
        Votre e-mail
      </label>
      <div className={`mt-2 flex border-b ${trait}`}>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="prenom@exemple.fr"
          aria-invalid={!!erreur}
          aria-describedby={`${id}-info`}
          className={`min-w-0 flex-1 border-0 bg-transparent px-0 py-3 ${texte} placeholder:text-taupe focus:outline-none focus:ring-0`}
        />
        <button
          type="submit"
          disabled={etat === "envoi"}
          className={`shrink-0 pl-4 text-xs font-medium uppercase tracking-[0.18em] ${surSombre ? "text-champagne" : "text-bordeaux"} disabled:opacity-50`}
        >
          {etat === "envoi" ? "…" : action} →
        </button>
      </div>
      {erreur && (
        <p role="alert" className={`mt-2 text-sm ${surSombre ? "text-champagne" : "text-bordeaux"}`}>
          {erreur}
        </p>
      )}
      <p id={`${id}-info`} className={`mt-3 text-xs leading-relaxed ${discret}`}>
        {promesse} Votre e-mail ne sert qu&apos;à cela ; désinscription en un clic.{" "}
        <Link href="/confidentialite" className="underline underline-offset-2">
          Confidentialité
        </Link>
      </p>
    </form>
  );
}
