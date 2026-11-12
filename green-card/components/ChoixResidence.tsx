"use client";

import { useId, useMemo, useState } from "react";
import type { ResidenceOption } from "./Formulaire";

function sansAccents(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Recherche de la résidence par nom, ville ou code postal, puis choix dans la liste. */
export function ChoixResidence({ residences, invalide }: { residences: ResidenceOption[]; invalide?: boolean }) {
  const [recherche, setRecherche] = useState("");
  const [choix, setChoix] = useState<string>("");
  const id = useId();

  const filtrees = useMemo(() => {
    const q = sansAccents(recherche.trim());
    if (!q) return residences;
    return residences.filter((r) => sansAccents(`${r.nom} ${r.ville} ${r.codePostal}`).includes(q));
  }, [recherche, residences]);

  return (
    <fieldset>
      <legend className="etiquette">Votre résidence</legend>
      <input type="hidden" name="residenceId" value={choix} />
      <label htmlFor={`${id}-q`} className="sr-only">
        Rechercher une résidence
      </label>
      <input
        id={`${id}-q`}
        type="search"
        className="champ"
        placeholder="Nom, ville ou code postal"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        aria-invalid={invalide || undefined}
        autoComplete="off"
      />
      <div className="mt-2 max-h-60 space-y-2 overflow-y-auto" role="radiogroup" aria-label="Résidences">
        {filtrees.length === 0 && <p className="aide">Aucune résidence trouvée. Essayez le nom de votre ville.</p>}
        {filtrees.map((r) => (
          <label
            key={r.id}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition-colors ${
              choix === r.id ? "border-green-600 bg-green-50" : "border-line bg-surface"
            }`}
          >
            <input
              type="radio"
              name={`${id}-residence`}
              value={r.id}
              checked={choix === r.id}
              onChange={() => setChoix(r.id)}
              className="h-5 w-5 accent-[var(--green-600)]"
            />
            <span>
              <span className="block font-semibold">{r.nom}</span>
              <span className="block text-sm text-muted">
                {r.codePostal} {r.ville}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
