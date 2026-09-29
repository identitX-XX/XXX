import Link from "next/link";

// Le bouton de conversion. Destination verrouillée (/appel), libellé verrouillé
// (une version courte pour l'en-tête). Une seule action à mesurer.
const LIBELLE = "Réserver mon appel découverte";
const LIBELLE_COURT = "Réserver mon appel";

type Props = {
  /** clair : fond nuit ; or : fond or (sur nuit/bordeaux) ; ivoire : fond ivoire (sur bordeaux). */
  ton?: "clair" | "or" | "ivoire";
  court?: boolean;
  pleine?: boolean;
};

const TONS = {
  clair: "bg-nuit text-ivoire hover:bg-bordeaux",
  or: "bg-champagne text-nuit hover:bg-ivoire",
  ivoire: "bg-ivoire text-nuit hover:bg-champagne",
};

export function CTA({ ton = "clair", court, pleine }: Props) {
  const taille = court
    ? "px-5 py-3.5 text-xs tracking-[0.2em]"
    : pleine
      ? "w-full justify-center px-4 py-4 text-[0.8125rem] tracking-[0.14em]"
      : "px-8 py-5 text-[0.8125rem] tracking-[0.2em]";
  return (
    <Link
      href="/appel"
      className={`group inline-flex items-center gap-3 font-semibold uppercase transition-colors duration-300 ${taille} ${TONS[ton]}`}
    >
      {court ? LIBELLE_COURT : LIBELLE}
      <span aria-hidden className={`transition-transform duration-300 group-hover:translate-x-1 ${ton === "clair" ? "text-champagne" : ""}`}>
        →
      </span>
    </Link>
  );
}
