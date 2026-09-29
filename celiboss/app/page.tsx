import { Manifeste, ManifesteOuverture } from "@/components/home/Manifeste";
import { Parcours } from "@/components/home/Parcours";
import { QuatrePortes } from "@/components/home/QuatrePortes";
import { ArticleCard } from "@/components/journal/ArticleCard";
import Link from "next/link";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { getArticles } from "@/lib/mdx";

export default function Accueil() {
  const derniers = getArticles().slice(0, 3);
  return (
    <>
      <ManifesteOuverture />
      <Manifeste />

      <Section>
        <Parcours />
      </Section>

      <Section ton="sable">
        <QuatrePortes />
      </Section>

      {derniers.length > 0 && (
        <Section>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Le Journal</Eyebrow>
              <h2 className="mt-6 text-titre">À lire cette semaine.</h2>
            </div>
            <Link href="/journal" className="hidden text-xs uppercase tracking-[0.18em] text-bordeaux hover:text-encre md:block">
              Tout le Journal →
            </Link>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {derniers.map(({ contenu, ...a }) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Section>
      )}

      <Section ton="bordeaux" etroit>
        <h2 className="text-titre">
          Choisir son cercle commence <span className="italic text-champagne">par une conversation.</span>
        </h2>
        <div className="mt-10">
          <CTA ton="sombre" />
        </div>
      </Section>
    </>
  );
}
