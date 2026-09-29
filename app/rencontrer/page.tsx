import type { Metadata } from "next";
import { Formules } from "@/components/rencontrer/Formules";
import { Methode } from "@/components/rencontrer/Methode";
import { Seuil } from "@/components/rencontrer/Seuil";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Rencontrer",
  description: "Un matchmaking sélectif, sur entretien, mené personnellement par Maï Diaw.",
};

export default function Rencontrer() {
  return (
    <>
      <Section>
        <Eyebrow>Matchmaking</Eyebrow>
        <h1 className="mt-8 max-w-4xl text-manifeste">
          Rencontrer, <span className="italic text-bronze">sans se brader.</span>
        </h1>
        <p className="mt-10 max-w-lecture text-chapo text-gris">
          Pas d&apos;application, pas de swipe. Une sélection faite à la main, pour des femmes qui
          savent ce qu&apos;elles valent.
        </p>
      </Section>
      <Section ton="sable">
        <Seuil />
      </Section>
      <Section>
        <Methode />
      </Section>
      <Section ton="sable">
        <Formules />
      </Section>
      <Section etroit>
        <h2 className="text-titre">Tout commence par un appel.</h2>
        <div className="mt-10">
          <CTA />
        </div>
      </Section>
    </>
  );
}
