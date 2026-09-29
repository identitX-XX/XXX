import { NextResponse } from "next/server";
import { getArticles } from "@/lib/mdx";
import { porteDe, RUBRIQUES } from "@/lib/rubriques";

// Contrat de contenu pour l'application mobile : même source MDX que le site,
// versionné (/v1) pour pouvoir évoluer sans casser les applis déjà installées.
export const dynamic = "force-static";

export function GET() {
  const articles = getArticles().map(({ contenu, ...a }) => ({
    ...a,
    rubriqueNom: RUBRIQUES[a.rubrique].nom,
    porte: porteDe(a.rubrique),
  }));
  return NextResponse.json({ articles });
}
