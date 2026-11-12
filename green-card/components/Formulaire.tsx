"use client";

import { useFormStatus } from "react-dom";

export function BoutonEnvoi({ children, enCours = "Un instant…" }: { children: React.ReactNode; enCours?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primaire" disabled={pending} aria-disabled={pending}>
      {pending ? enCours : children}
    </button>
  );
}

export function MessageErreur({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex gap-3 rounded-2xl bg-alert-bg p-4 text-sm font-medium text-alert">
      <span aria-hidden>⚠️</span>
      <p>{message}</p>
    </div>
  );
}

export interface ResidenceOption {
  id: string;
  nom: string;
  ville: string;
  codePostal: string;
}
