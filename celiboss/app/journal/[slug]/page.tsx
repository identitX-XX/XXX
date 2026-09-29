import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Progression } from "@/components/journal/Progression";
import { PorteSuivante } from "@/components/journal/PorteSuivante";
import { formatDate, getArticle, getArticles } from "@/lib/mdx";
import { RUBRIQUES } from "@/lib/rubriques";
import { site } from "@/lib/site";

type Props = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const a = getArticle(params.slug);
  if (!a) return {};
  return {
    title: a.titre,
    description: a.chapo,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.titre,
      description: a.chapo,
      publishedTime: a.date,
      authors: ["Maï Diaw"],
      ...(a.couverture && { images: [a.couverture] }),
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const a = getArticle(params.slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.titre,
    description: a.chapo,
    datePublished: a.date,
    author: { "@type": "Person", name: "Maï Diaw" },
    publisher: { "@type": "Organization", name: site.nom },
  };

  return (
    <article className="bg-ivoire px-6 pb-rythme pt-20 text-encre lg:pt-24">
      <Progression />
      <header className="mx-auto max-w-[55rem] space-y-7">
        <Link href={`/journal?rubrique=${a.rubrique}`} className="text-xs font-semibold uppercase tracking-[0.28em] text-bordeaux hover:text-encre">
          ← {RUBRIQUES[a.rubrique].nom}
        </Link>
        <h1 className="font-serif text-manifeste font-medium">{a.titre}</h1>
        <p className="font-serif text-2xl leading-snug text-gris md:text-3xl">{a.chapo}</p>
        <p className="border-t border-filet pt-4 text-sm text-gris">
          Maï Diaw · {formatDate(a.date)} · {a.lecture} min de lecture
        </p>
      </header>

      <div className="prose-journal mt-16 text-lg leading-[1.8]">
        <MDXRemote source={a.contenu} />
      </div>

      <PorteSuivante rubrique={a.rubrique} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  );
}
