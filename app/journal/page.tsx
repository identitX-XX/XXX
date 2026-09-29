import type { Metadata } from "next";
import Link from "next/link";
import { ListeAttente } from "@/components/formulaires/ListeAttente";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LuneEtoile } from "@/components/ui/Symboles";
import { formatDate, getArticles } from "@/lib/mdx";
import { isRubrique, RUBRIQUE_IDS, RUBRIQUES } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Le Journal",
  description: "Relationnel, intelligence émotionnelle, mindset, posture & image, corps, intuition. Le Journal de CéliBOSS™.",
};

export default function Journal({ searchParams }: { searchParams: { rubrique?: string } }) {
  const active = isRubrique(searchParams.rubrique) ? searchParams.rubrique : undefined;
  const articles = getArticles().filter((a) => !active || a.rubrique === active);
  const [une, ...suite] = articles;

  const filtre = (href: string, label: string, courant: boolean) => (
    <Link
      key={href}
      href={href}
      aria-current={courant ? "page" : undefined}
      className="border border-taupe px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] transition-colors hover:border-encre aria-[current=page]:border-nuit aria-[current=page]:bg-nuit aria-[current=page]:text-ivoire"
    >
      {label}
    </Link>
  );

  return (
    <div className="bg-ivoire text-encre">
      <section className="mx-auto grid max-w-[90rem] items-end gap-12 px-6 pb-12 pt-20 md:px-10 lg:grid-cols-[2fr_1fr] lg:pt-24 xl:px-24">
        <div className="space-y-6">
          <Eyebrow>Le Journal</Eyebrow>
          <h1 className="font-serif text-manifeste font-black">
            Lire.
            <br />
            <span className="font-normal italic text-bordeaux">Ressentir.</span>
            <br />
            Choisir.
          </h1>
        </div>
        <div className="space-y-4 bg-nuit p-8 text-ivoire">
          <p className="font-serif text-2xl leading-tight">
            Un article par semaine, <span className="italic text-champagne">dans votre boîte.</span>
          </p>
          <ListeAttente liste="journal" action="Recevoir" promesse="Un e-mail par semaine avec le nouvel article du Journal." surSombre />
        </div>
      </section>

      <nav aria-label="Rubriques" className="mx-auto max-w-[90rem] px-6 md:px-10 xl:px-24">
        <div className="flex flex-wrap gap-2.5 border-b border-t-2 border-b-filet border-t-encre py-5">
          {filtre("/journal", "Tout", !active)}
          {RUBRIQUE_IDS.map((id) => filtre(`/journal?rubrique=${id}`, RUBRIQUES[id].nom, active === id))}
        </div>
      </nav>

      <section className="mx-auto max-w-[90rem] px-6 pb-rythme pt-14 md:px-10 xl:px-24">
        {!une ? (
          <p className="text-gris">Aucun article dans cette rubrique pour l&apos;instant.</p>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr]">
            <article className="relative space-y-6 overflow-hidden bg-nuit p-10 text-ivoire md:p-12">
              <LuneEtoile taille={220} className="absolute -right-8 -top-8 text-champagne opacity-30" etoile="transparent" />
              <p className="relative text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-champagne">À la une · {RUBRIQUES[une.rubrique].nom}</p>
              <h2 className="relative font-serif text-5xl font-black leading-[0.95] md:text-7xl">
                <Link href={`/journal/${une.slug}`} className="hover:text-champagne">
                  {une.titre}
                </Link>
              </h2>
              <p className="relative max-w-lg text-lg leading-relaxed text-ivoire/80">{une.chapo}</p>
              <p className="relative text-sm text-ivoire/60">
                Maï Diaw · {formatDate(une.date)} · {une.lecture} min
              </p>
              <Link href={`/journal/${une.slug}`} className="relative inline-block bg-champagne px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-nuit hover:bg-ivoire">
                Lire l&apos;article →
              </Link>
            </article>
            <div>
              {suite.map(({ contenu, ...a }, i) => (
                <ArticleCard key={a.slug} article={a} epais={i === 0} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
