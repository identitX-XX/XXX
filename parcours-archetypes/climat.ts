// parcours-archetypes/climat.ts
// Couche climat & corps (dimension COR du twin). Pure, locale, jamais médicale.
// On infère un « climat probable » à partir de signaux ressentis — son rôle
// n'est pas de prédire, mais de RÉ-ATTRIBUER : donner du contexte à un creux,
// pour déplacer « qu'est-ce qui ne va pas chez moi » vers « c'est le climat ».

import { ClimatJour } from "./types";

// Index de turbulence 0..100 : haut = ressources basses / climat agité.
// Sommeil bas et énergie basse pèsent, les vagues aussi.
export function climatIndex(c: ClimatJour): number {
  return Math.round(
    (100 - c.sommeil) * 0.35 + (100 - c.energie) * 0.35 + c.vagues * 0.3
  );
}

export function climatLabel(index: number): string {
  if (index < 34) return "apaisé";
  if (index < 60) return "changeant";
  return "sous tension";
}

// Une phrase de ré-attribution, chaleureuse, jamais prescriptive.
export function climatPhrase(index: number): string {
  const l = climatLabel(index);
  if (l === "apaisé") return "Terrain plutôt favorable aujourd'hui — profites-en pour ce qui compte.";
  if (l === "changeant") return "Climat changeant : accueille les variations sans t'en vouloir.";
  return "Climat sous tension : si la journée pèse plus, c'est le contexte — pas toi.";
}

export interface ClimatInfere {
  index: number;
  label: string;
  confiance: number; // 0..1, selon la taille d'échantillon
  echantillon: number;
}

// Moyenne des N derniers jours climatiques enregistrés.
export function infererClimat(
  climat: Record<number, ClimatJour>,
  n = 5
): ClimatInfere | null {
  const jours = Object.values(climat)
    .sort((a, b) => a.jour - b.jour)
    .slice(-n);
  if (jours.length === 0) return null;
  const index = Math.round(
    jours.reduce((s, c) => s + climatIndex(c), 0) / jours.length
  );
  return {
    index,
    label: climatLabel(index),
    confiance: Math.min(1, jours.length / n),
    echantillon: jours.length,
  };
}
