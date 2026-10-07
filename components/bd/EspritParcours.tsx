"use client";

// « Un esprit t'accompagne » — place UN personnage de la troupe (ligne claire)
// comme accent discret, à un endroit du parcours. Déterministe : une même graine
// → toujours le même esprit (cohérence), des graines différentes → des esprits
// différents, pour que la troupe se DISSÉMINE de façon équilibrée sur le parcours
// sans jamais s'entasser. Volontairement silencieux (visuel seul, pas de texte) :
// un clin d'œil, pas un gadget bavard.

import { PERSONNAGES, PERSONNAGE_NOM, Personnage } from "./Personnages";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function EspritParcours({
  seed,
  size = 34,
  className = "",
  halo = false,
}: {
  seed: string;
  size?: number;
  className?: string;
  // Léger halo derrière l'esprit (pour les fonds chargés). Sobre par défaut.
  halo?: boolean;
}) {
  const who = PERSONNAGES[hash(seed) % PERSONNAGES.length];
  return (
    <span
      className={className}
      title={`${PERSONNAGE_NOM[who]} t'accompagne`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
        width: size + 10,
        height: size + 10,
        borderRadius: 999,
        background: halo
          ? "radial-gradient(closest-side, color-mix(in srgb, var(--prune) 10%, transparent), transparent)"
          : "transparent",
      }}
    >
      <Personnage who={who} size={size} />
    </span>
  );
}
