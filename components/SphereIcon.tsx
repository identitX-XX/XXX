// Icône ligne partagée pour les trois sphères de vie (perso / pro / relationnel).
// Source unique — on ne réintroduit plus d'emoji nulle part dans l'UI.
import { Sprout, Briefcase, HeartHandshake, LucideProps } from "lucide-react";

const MAP: Record<"perso" | "pro" | "relationnel", (p: LucideProps) => JSX.Element> = {
  perso: (p) => <Sprout {...p} />,
  pro: (p) => <Briefcase {...p} />,
  relationnel: (p) => <HeartHandshake {...p} />,
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
  const Icon = MAP[sphere];
  return <Icon size={size} color={color} className={className} />;
}
