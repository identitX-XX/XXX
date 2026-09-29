import { NextResponse } from "next/server";
import { getArticle, getArticles } from "@/lib/mdx";
import { porteDe } from "@/lib/rubriques";

// Article complet (corps MDX brut) : l'appli le rend avec son propre moteur.
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) return NextResponse.json({ erreur: "introuvable" }, { status: 404 });
  return NextResponse.json({ ...a, porte: porteDe(a.rubrique) });
}
