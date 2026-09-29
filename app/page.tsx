import Link from "next/link";
import { SectionCompagnon } from "@/components/compagnon/SectionCompagnon";
import { Ouverture } from "@/components/home/Ouverture";
import { SeRelier } from "@/components/home/SeRelier";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getArticles } from "@/lib/mdx";
import { PRECISION, PROMESSE } from "@/lib/positionnement";
import { RUBRIQUES } from "@/lib/rubriques";

export default function Accueil() {
  const [une, ...autres] = getArticles();
  return (
    <>
      <Ouverture />
      <SeRelier />
      <SectionCompagnon />

      {une && (
        <section className="border-t border-filet bg-ivoire py-rythme text-encre">
          <div className="mx-auto max-w-[90rem] space-y-14 px-6 md:px-10 xl:px-24">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="space-y-5">
                <Eyebrow>Le Journal</Eyebrow>
                <h2 className="font-serif text-titre font-medium">
                  Lire. <span className="font-normal italic text-bordeaux">Ressentir.</span> Choisir.
                </h2>
              </div>
              <Link href="/journal" className="text-xs font-semibold uppercase tracking-[0.22em] text-bordeaux hover:text-encre">
                Tout le Journal →
              </Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
              <article className="space-y-5 border-t border-filet pt-7">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-bordeaux">
                  {RUBRIQUES[une.rubrique].nom} · {une.lecture} min
                </p>
                <h3 className="font-serif text-4xl font-semibold leading-tight md:text-[2.75rem]">
                  <Link href={`/journal/${une.slug}`} className="hover:text-bordeaux">
                    {une.titre}
                  </Link>
                </h3>
                <p className="text-lg leading-relaxed text-gris">{une.chapo}</p>
              </article>
              {autres.slice(0, 2).map((a) => (
                <article key={a.slug} className="space-y-5 border-t border-filet pt-7">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-bordeaux">
                    {RUBRIQUES[a.rubrique].nom} · {a.lecture} min
                  </p>
                  <h3 className="font-serif text-3xl font-medium leading-tight">
                    <Link href={`/journal/${a.slug}`} className="hover:text-bordeaux">
                      {a.titre}
                    </Link>
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-filet bg-ivoire py-rythme text-encre">
        <div className="mx-auto max-w-[90rem] px-6 md:px-10 xl:px-24">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bordeaux">La promesse</p>
            <p className="font-serif text-titre font-medium">
              {PROMESSE.avant}
              <br />
              <span className="font-normal italic text-bordeaux">{PROMESSE.apres}</span>
            </p>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-gris md:text-xl">{PRECISION}</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gris">— Maï Diaw, fondatrice</p>
              <Link href="/manifeste" className="text-xs font-semibold uppercase tracking-[0.22em] text-bordeaux hover:text-encre">
                Lire le manifeste →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
