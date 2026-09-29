import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Progression } from "@/components/journal/Progression";
import { PorteSuivante } from "@/components/journal/PorteSuivante";
import { RubriqueTag } from "@/components/journal/RubriqueTag";
import { formatDate, getArticle, getArticles } from "@/lib/mdx";
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
    <article className="px-6 py-rythme">
      <Progression />
      <header className="mx-auto max-w-lecture">
        <RubriqueTag rubrique={a.rubrique} />
        <h1 className="mt-6 text-manifeste font-light">{a.titre}</h1>
        <p className="mt-6 text-chapo text-gris">{a.chapo}</p>
        <p className="mt-8 border-t border-filet pt-4 text-sm text-gris">
          Maï Diaw · {formatDate(a.date)} · {a.lecture} min de lecture
        </p>
      </header>

      <div className="prose-journal mt-14">
        <MDXRemote source={a.contenu} />
      </div>

      <PorteSuivante rubrique={a.rubrique} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  );
}
