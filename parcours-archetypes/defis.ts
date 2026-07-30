// parcours-archetypes/defis.ts
// La banque de micro-défis, désormais dérivée des 20 Signatures : un micro-défi
// par signature (provisoire — voir signatures.ts). La rotation combine ce défi
// au défi d'origine du jour ; tant qu'une banque plus riche par signature n'est
// pas rédigée, elle dégénère proprement sur ce défi unique. Registre : une
// micro-action concrète (≈ 2 min) suivie d'une observation, jamais une injonction.

import { ArchetypeKey } from "./types";
import { SIGNATURES } from "./signatures";

export const DEFIS_BANQUE: Record<ArchetypeKey, string[]> = Object.fromEntries(
  SIGNATURES.map((s) => [s.key, [s.defi]])
) as Record<ArchetypeKey, string[]>;

// La rotation : à un jour donné, le défi de cette signature est puisé dans le
// pool [défi d'origine, …banque]. L'index dépend du jour → il tourne, sans
// jamais répéter deux fois de suite le même quand la signature revient.
export function defiDuJour(n: number, archKey: ArchetypeKey, defiOrigine: string): string {
  const pool = [defiOrigine, ...(DEFIS_BANQUE[archKey] ?? [])];
  if (pool.length === 0) return defiOrigine;
  const idx = Math.floor((n - 1) / 2) % pool.length; // le défi paraît ~1 jour/2
  return pool[idx];
}
