import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { getArticles } from "@/lib/mdx";
import { isRubrique, RUBRIQUE_IDS, RUBRIQUES } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Le Journal",
  description: "Relationnel, mindset, posture & image, art de vivre. Le Journal de Celiboss.",
};

export default function Journal({ searchParams }: { searchParams: { rubrique?: string } }) {
  const active = isRubrique(searchParams.rubrique) ? searchParams.rubrique : undefined;
  const articles = getArticles().filter((a) => !active || a.rubrique === active);

  const filtre = (href: string, label: string, courant: boolean) => (
    <Link
      key={href}
      href={href}
      aria-current={courant ? "page" : undefined}
      className="border-b border-transparent pb-1 text-sm uppercase tracking-[0.14em] text-gris hover:text-encre aria-[current=page]:border-bronze aria-[current=page]:text-encre"
    >
      {label}
    </Link>
  );

  return (
    <Section>
      <Eyebrow>Le Journal</Eyebrow>
      <h1 className="mt-6 text-manifeste">Lire. Penser. Choisir.</h1>

      <nav aria-label="Rubriques" className="mt-14 flex flex-wrap gap-x-8 gap-y-4">
        {filtre("/journal", "Tout", !active)}
        {RUBRIQUE_IDS.map((id) => filtre(`/journal?rubrique=${id}`, RUBRIQUES[id].nom, active === id))}
      </nav>

      <div className="mt-14 space-y-12">
        {articles.length === 0 ? (
          <p className="text-gris">Aucun article dans cette rubrique pour l&apos;instant.</p>
        ) : (
          articles.map(({ contenu, ...a }) => <ArticleCard key={a.slug} article={a} />)
        )}
      </div>
    </Section>
  );
}
