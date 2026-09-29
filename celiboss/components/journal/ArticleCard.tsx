import Link from "next/link";
import { RubriqueTag } from "@/components/journal/RubriqueTag";
import { formatDate } from "@/lib/mdx";
import type { Article } from "@/types/article";

export function ArticleCard({ article }: { article: Omit<Article, "contenu"> }) {
  return (
    <article className="group border-t border-filet pt-8">
      <div className="flex items-center gap-4">
        <RubriqueTag rubrique={article.rubrique} lien={false} />
        <span className="text-sm text-gris">
          {formatDate(article.date)} · {article.lecture} min
        </span>
      </div>
      <h2 className="mt-4 text-3xl leading-tight">
        <Link href={`/journal/${article.slug}`} className="group-hover:text-encre">
          {article.titre}
        </Link>
      </h2>
      <p className="mt-3 max-w-lecture text-gris">{article.chapo}</p>
    </article>
  );
}
