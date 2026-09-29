import Link from "next/link";
import { RubriqueTag } from "@/components/journal/RubriqueTag";
import type { Article } from "@/types/article";

export function ArticleCard({ article, epais }: { article: Omit<Article, "contenu">; epais?: boolean }) {
  return (
    <article className={`space-y-2.5 py-6 ${epais ? "border-t border-filet" : "border-t border-filet"}`}>
      <RubriqueTag rubrique={article.rubrique} suffixe={`${article.lecture} min`} />
      <h3 className="font-serif text-3xl font-semibold leading-tight">
        <Link href={`/journal/${article.slug}`} className="hover:text-bordeaux">
          {article.titre}
        </Link>
      </h3>
      <p className="leading-relaxed text-gris">{article.chapo}</p>
    </article>
  );
}
