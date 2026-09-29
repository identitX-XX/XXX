import Link from "next/link";
import { ListeAttente } from "@/components/formulaires/ListeAttente";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { porteDe, type RubriqueId } from "@/lib/rubriques";

/** Fin d'article : la lecture mène à la porte de sa rubrique, puis fidélise. */
export function PorteSuivante({ rubrique }: { rubrique: RubriqueId }) {
  const porte = porteDe(rubrique);
  return (
    <aside className="mx-auto mt-rythme max-w-lecture space-y-16">
      <div className="border-t border-bordeaux pt-10">
        <Eyebrow>Et maintenant</Eyebrow>
        <h2 className="mt-4 text-4xl">{porte.nom}</h2>
        <p className="mt-3 text-gris">{porte.promesse}</p>
        <div className="mt-8 flex flex-col items-start gap-5">
          {porte.id === "rencontrer" ? (
            <CTA />
          ) : (
            <Link href={porte.href} className="text-xs uppercase tracking-[0.18em] text-bordeaux hover:text-encre">
              {porte.active ? `Découvrir ${porte.nom}` : "Être informé·e de l'ouverture"} →
            </Link>
          )}
        </div>
      </div>
      <div className="bg-sable p-8 md:p-10">
        <p className="font-serif text-2xl">Le prochain article, dans votre boîte.</p>
        <div className="mt-6">
          <ListeAttente liste="journal" action="Recevoir" promesse="Un e-mail par semaine avec le nouvel article du Journal." />
        </div>
      </div>
    </aside>
  );
}
