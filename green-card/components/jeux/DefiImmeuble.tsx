"use client";

import { useEffect, useState, useTransition } from "react";
import { actualiserDefiImmeuble, rejoindreDefiImmeuble } from "@/app/jeux/actions-immeuble";
import type { Gain } from "@/lib/points";
import { Celebration } from "./Celebration";

/** Bouton « Je rejoins » et récupération de la médaille à l'ouverture de la page. */
export function RejoindreDefi({ inscrit }: { inscrit: boolean }) {
  const [gain, setGain] = useState<Gain | null>(null);
  const [enCours, demarrer] = useTransition();

  // À l'ouverture, on vérifie si une médaille est à récupérer (objectif atteint, mois gagné…).
  useEffect(() => {
    demarrer(async () => {
      const r = await actualiserDefiImmeuble();
      if (r.gain) setGain(r.gain);
    });
  }, []);

  return (
    <div className="space-y-4">
      {gain && <Celebration gain={gain} onFermer={() => setGain(null)} />}
      {!inscrit && (
        <button
          type="button"
          className="btn-primaire"
          disabled={enCours}
          onClick={() =>
            demarrer(async () => {
              const r = await rejoindreDefiImmeuble();
              if (r.gain) setGain(r.gain);
            })
          }
        >
          🏢 Je rejoins l&apos;équipe de ma résidence
        </button>
      )}
    </div>
  );
}
