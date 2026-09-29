import { Manifeste, ManifesteOuverture } from "@/components/home/Manifeste";
import { QuatrePortes } from "@/components/home/QuatrePortes";
import { ArticleCard } from "@/components/journal/ArticleCard";
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

      <Section ton="sable">
        <QuatrePortes />
      </Section>

      {derniers.length > 0 && (
        <Section>
          <Eyebrow>Le Journal</Eyebrow>
          <div className="mt-10 space-y-12">
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
