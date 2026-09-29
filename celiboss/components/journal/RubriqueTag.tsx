import Link from "next/link";
import { RUBRIQUES, type RubriqueId } from "@/lib/rubriques";

export function RubriqueTag({ rubrique, lien = true }: { rubrique: RubriqueId; lien?: boolean }) {
  const classes = "text-eyebrow font-medium uppercase text-bronze";
  const nom = RUBRIQUES[rubrique].nom;
  return lien ? (
    <Link href={`/journal?rubrique=${rubrique}`} className={`${classes} hover:text-bronze-fonce`}>
      {nom}
    </Link>
  ) : (
    <span className={classes}>{nom}</span>
  );
}
