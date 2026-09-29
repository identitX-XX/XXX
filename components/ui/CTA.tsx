import Link from "next/link";

// Le seul bouton du site. Libellé et destination verrouillés : pas de prop
// `label`, pas de `href`. Une seule action possible partout → une seule
// conversion à mesurer.
const LIBELLE = "Réserver mon appel découverte";

export function CTA({ ton = "clair" }: { ton?: "clair" | "sombre" }) {
  const styles =
    ton === "clair"
      ? "bg-bordeaux text-ivoire hover:bg-encre"
      : "border border-champagne/60 text-ivoire hover:bg-ivoire hover:text-bordeaux";
  return (
    <Link
      href="/appel"
      className={`inline-flex items-center gap-3 px-8 py-4 text-sm font-medium uppercase tracking-[0.14em] transition-colors ${styles}`}
    >
      {LIBELLE}
      <span aria-hidden>→</span>
    </Link>
  );
}
