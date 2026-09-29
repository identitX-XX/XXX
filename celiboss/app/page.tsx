import { Manifeste } from "@/components/home/Manifeste";
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
      <Section>
        <Manifeste />
        <div className="mt-14">
          <CTA />
        </div>
      </Section>

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
    </>
  );
}
