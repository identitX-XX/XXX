"use client";

import { useFormStatus } from "react-dom";
import type { EtatFormulaire } from "@/app/espace/actions";

export const champClasse =
  "h-12 w-full border-0 border-b border-filet bg-transparent px-0 text-[1.0625rem] text-encre placeholder:text-taupe focus:border-bordeaux focus:outline-none focus:ring-0 disabled:opacity-50";
export const labelClasse = "text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gris";

export function Erreur({ etat, nom }: { etat: EtatFormulaire; nom: string }) {
  const m = etat.erreurs?.[nom];
  return m ? (
    <p id={`err-${nom}`} className="mt-2 text-sm text-bordeaux">
      {m}
    </p>
  ) : null;
}

export function Message({ etat }: { etat: EtatFormulaire }) {
  if (!etat.message) return null;
  return (
    <p role={etat.ok ? "status" : "alert"} className={`border-l-2 p-4 text-sm leading-relaxed ${etat.ok ? "border-bordeaux bg-sable" : "border-bordeaux bg-sable text-bordeaux"}`}>
      {etat.message}
    </p>
  );
}

export function BoutonEnvoi({ children, discret }: { children: React.ReactNode; discret?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        discret
          ? "text-xs font-semibold uppercase tracking-[0.2em] underline decoration-filet underline-offset-8 hover:decoration-bordeaux disabled:opacity-50"
          : "flex h-14 w-full items-center justify-center gap-2.5 bg-nuit text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-ivoire transition-colors hover:bg-bordeaux disabled:opacity-60"
      }
    >
      {pending ? "Un instant…" : children}
    </button>
  );
}

export function ChampMotDePasse({ id = "motdepasse", nouveau, etat }: { id?: string; nouveau?: boolean; etat: EtatFormulaire }) {
  return (
    <input
      id={id}
      name="motdepasse"
      type="password"
      autoComplete={nouveau ? "new-password" : "current-password"}
      placeholder={nouveau ? "12 caractères minimum" : ""}
      className={champClasse}
      aria-invalid={!!etat.erreurs?.motdepasse}
      aria-describedby="err-motdepasse"
    />
  );
}
