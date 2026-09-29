import Link from "next/link";
import { ListeAttente } from "@/components/formulaires/ListeAttente";
import { porteDe, type RubriqueId } from "@/lib/rubriques";

/** Fin d'article : la lecture mène à la porte de sa rubrique, puis fidélise. */
export function PorteSuivante({ rubrique }: { rubrique: RubriqueId }) {
  const porte = porteDe(rubrique);
  return (
    <aside className="mx-auto mt-rythme grid max-w-[55rem] gap-6 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4 bg-sable p-10">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-bordeaux">Et maintenant</p>
        <p className="font-serif text-4xl font-medium leading-none">
          {porte.nom}, <span className="font-normal italic text-bordeaux">{porte.accroche}</span>
        </p>
        <p className="leading-relaxed text-gris">{porte.promesse}</p>
        <Link href={porte.href} className="inline-block bg-nuit px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivoire hover:bg-bordeaux">
          {porte.active ? "Découvrir" : "Être informé·e de l'ouverture"} →
        </Link>
      </div>
      <div className="space-y-4 bg-sable p-10">
        <p className="font-serif text-2xl leading-tight">
          Le prochain article, <span className="italic text-bordeaux">dans votre boîte.</span>
        </p>
        <ListeAttente liste="journal" action="Recevoir" promesse="Un e-mail par semaine avec le nouvel article du Journal." />
      </div>
    </aside>
  );
}
