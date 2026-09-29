import Link from "next/link";
import { SectionCompagnon } from "@/components/compagnon/SectionCompagnon";
import { ListeAttente } from "@/components/formulaires/ListeAttente";
import { Ouverture } from "@/components/home/Ouverture";
import { SeRelier } from "@/components/home/SeRelier";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BandeBogolan, LuneEtoile } from "@/components/ui/Symboles";
import { getArticles } from "@/lib/mdx";
import { PRECISION, PROMESSE } from "@/lib/positionnement";
import { RUBRIQUES } from "@/lib/rubriques";

export default function Accueil() {
  const [une, ...autres] = getArticles();
  return (
    <>
      <Ouverture />
      <BandeBogolan className="border-y border-champagne/35 bg-nuit text-champagne" />
      <SeRelier />
      <SectionCompagnon />

      {une && (
        <section className="border-t border-champagne/35 bg-nuit py-rythme text-ivoire">
          <div className="mx-auto max-w-[90rem] space-y-14 px-6 md:px-10 xl:px-24">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="space-y-5">
                <Eyebrow surSombre>Le Journal</Eyebrow>
                <h2 className="font-serif text-titre font-extrabold">
                  Lire. <span className="font-normal italic text-champagne">Ressentir.</span> Choisir.
                </h2>
              </div>
              <Link href="/journal" className="text-xs font-semibold uppercase tracking-[0.22em] text-champagne hover:text-ivoire">
                Tout le Journal →
              </Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
              <article className="space-y-5 border-t border-champagne pt-7">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-champagne">
                  {RUBRIQUES[une.rubrique].nom} · {une.lecture} min
                </p>
                <h3 className="font-serif text-4xl font-bold leading-tight md:text-[2.75rem]">
                  <Link href={`/journal/${une.slug}`} className="hover:text-champagne">
                    {une.titre}
                  </Link>
                </h3>
                <p className="text-lg leading-relaxed text-ivoire/75">{une.chapo}</p>
              </article>
              {autres.slice(0, 2).map((a) => (
                <article key={a.slug} className="space-y-5 border-t border-ivoire/25 pt-7">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-champagne">
                    {RUBRIQUES[a.rubrique].nom} · {a.lecture} min
                  </p>
                  <h3 className="font-serif text-3xl font-medium leading-tight">
                    <Link href={`/journal/${a.slug}`} className="hover:text-champagne">
                      {a.titre}
                    </Link>
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-bordeaux py-rythme text-ivoire">
        <div className="mx-auto grid max-w-[90rem] items-center gap-14 px-6 md:px-10 lg:grid-cols-[1fr_2fr] xl:px-24">
          <div className="relative mx-auto flex aspect-square w-56 items-center justify-center rounded-full border border-champagne/60 text-champagne lg:w-64">
            <LuneEtoile taille={200} className="w-4/5" />
          </div>
          <div className="space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-champagne">La promesse</p>
            <p className="font-serif text-titre font-black">
              {PROMESSE.avant}
              <br />
              <span className="font-normal italic text-champagne">{PROMESSE.apres}</span>
            </p>
            <p className="max-w-xl text-lg leading-relaxed text-ivoire/85 md:text-xl">{PRECISION}</p>
            <div className="flex flex-wrap items-center gap-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ivoire/70">— Maï Diaw, fondatrice</p>
              <Link href="/manifeste" className="text-xs font-semibold uppercase tracking-[0.22em] text-champagne hover:text-ivoire">
                Lire le manifeste →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BandeBogolan className="border-b border-filet bg-ivoire text-bordeaux" />

      <section className="bg-ivoire py-rythme text-encre">
        <div className="mx-auto grid max-w-[90rem] items-center gap-14 px-6 md:px-10 lg:grid-cols-2 xl:px-24">
          <h2 className="font-serif text-titre font-extrabold">
            Le Cercle ouvre
            <br />
            <span className="font-normal italic text-bordeaux">à la prochaine lune.</span>
          </h2>
          <ListeAttente liste="compagnon" action="Être invité·e" promesse="Une invitation à l'ouverture du Cercle et du Compagnon, rien d'autre." />
        </div>
      </section>
    </>
  );
}
