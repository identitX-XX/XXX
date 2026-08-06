// Icône ligne partagée pour les trois sphères de vie (perso / pro / relationnel).
// Source unique — les glyphes maison d'Constellation (voir Glyph.tsx), jamais d'emoji.
import { Glyph, GlyphName } from "./Glyph";

const MAP: Record<"perso" | "pro" | "relationnel", GlyphName> = {
  perso: "perso",
  pro: "pro",
  relationnel: "relationnel",
};

export function SphereIcon({
  sphere,
  size = 18,
  color = "var(--fuchsia)",
  className,
}: {
  sphere: "perso" | "pro" | "relationnel";
  size?: number;
  color?: string;
  className?: string;
}) {
  // Les glyphes héritent la couleur via `currentColor` : on la pose sur un span.
  return (
    <span style={{ color, display: "inline-flex", lineHeight: 0 }} className={className}>
      <Glyph name={MAP[sphere]} size={size} />
    </span>
  );
}
