import Link from "next/link";
import { EcranElan } from "@/components/compagnon/EcranElan";
import { Montres } from "@/components/compagnon/Montres";
import { CONNEXIONS_COMPAGNON, SIGNAUX_COMPAGNON } from "@/lib/compagnon";

/** Le Compagnon, cœur du projet : une phrase, les signaux, l'écran. */
export function SectionCompagnon({ titreNiveau = "h2", lien = true, montres = false }: { titreNiveau?: "h1" | "h2"; lien?: boolean; montres?: boolean }) {
  const Titre = titreNiveau;
  const captes = SIGNAUX_COMPAGNON.filter((s) => !("synthese" in s)).map((s) => s.nom);
  return (
    <section id="compagnon" className="border-t border-filet bg-ivoire py-rythme text-encre">
      <div className="mx-auto grid max-w-[90rem] grid-cols-[minmax(0,1fr)] items-center gap-20 px-6 md:px-10 lg:grid-cols-[1.2fr_1fr] xl:px-24">
        <div className="space-y-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bordeaux">Le Compagnon</p>
          <Titre className="font-serif text-titre font-medium">
            Votre corps sait. <span className="font-normal italic text-bordeaux">Le Compagnon écoute.</span>
          </Titre>
          <p className="max-w-lg text-lg leading-relaxed text-gris">
            {captes.join(", ")} : chaque jour, il réunit ce que dit votre corps et ce que vous ressentez, puis le traduit en un seul signal,
            votre <span className="italic text-encre">élan</span>.
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-gris">{CONNEXIONS_COMPAGNON}</p>
          {montres && <Montres className="justify-start pt-4" />}
          {lien && (
            <Link href="/compagnon" className="inline-block text-xs font-semibold uppercase tracking-[0.2em] underline decoration-filet underline-offset-8 hover:decoration-bordeaux">
              Découvrir le Compagnon →
            </Link>
          )}
        </div>
        <EcranElan className="mx-auto lg:ml-auto lg:mr-0" />
      </div>
    </section>
  );
}
