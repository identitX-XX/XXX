import Link from "next/link";

// Le seul bouton du site. Libellé et destination verrouillés : pas de prop
// `label`, pas de `href`. Une seule action possible partout → une seule
// conversion à mesurer.
const LIBELLE = "Réserver mon appel découverte";

type Props = { ton?: "clair" | "sombre"; pleine?: boolean };

export function CTA({ ton = "clair", pleine }: Props) {
  const styles =
    ton === "clair"
      ? "bg-bordeaux text-ivoire hover:bg-encre"
      : "border border-champagne/60 text-ivoire hover:border-ivoire hover:bg-ivoire hover:text-bordeaux";
  const taille = pleine ? "w-full justify-center px-4 py-4 tracking-[0.12em]" : "px-8 py-4 tracking-[0.16em]";
  return (
    <Link
      href="/appel"
      className={`group inline-flex items-center gap-3 text-[0.8125rem] font-medium uppercase transition-colors duration-300 ${taille} ${styles}`}
    >
      {LIBELLE}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
