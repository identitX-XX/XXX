import Link from "next/link";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { porteDe, type RubriqueId } from "@/lib/rubriques";

/** Fin d'article : la lecture mène à la porte de sa rubrique. */
export function PorteSuivante({ rubrique }: { rubrique: RubriqueId }) {
  const porte = porteDe(rubrique);
  return (
    <aside className="mx-auto mt-rythme max-w-lecture border-t border-bordeaux pt-10">
      <Eyebrow>Et maintenant</Eyebrow>
      <h2 className="mt-4 text-3xl">{porte.nom}</h2>
      <p className="mt-3 text-gris">{porte.promesse}</p>
      <div className="mt-8">
        {porte.active && porte.id !== "journal" ? (
          <Link href={porte.href} className="text-sm uppercase tracking-[0.14em] text-bordeaux hover:text-encre">
            Découvrir {porte.nom} →
          </Link>
        ) : (
          // Porte pas encore ouverte (ou retour au Journal) → l'appel prend le relais.
          <CTA />
        )}
      </div>
    </aside>
  );
}
