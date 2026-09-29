import { RUBRIQUES, type RubriqueId } from "@/lib/rubriques";

export function RubriqueTag({ rubrique, suffixe, surSombre }: { rubrique: RubriqueId; suffixe?: string; surSombre?: boolean }) {
  return (
    <p className={`text-[0.6875rem] font-semibold uppercase tracking-[0.26em] ${surSombre ? "text-champagne" : "text-bordeaux"}`}>
      {RUBRIQUES[rubrique].nom}
      {suffixe && ` · ${suffixe}`}
    </p>
  );
}
