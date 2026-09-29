import type { Metadata } from "next";
import { FormulaireAppel } from "@/components/appel/FormulaireAppel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { CALCOM_LINK } from "@/lib/links";

export const metadata: Metadata = {
  title: "L'appel découverte",
  description: "Trente minutes avec Maï Diaw pour savoir si CéliBOSS™ est fait pour vous.",
};

export default function Appel() {
  return (
    <Section>
      <div className="mx-auto max-w-lecture text-center">
        <Eyebrow>L&apos;appel découverte</Eyebrow>
        <h1 className="mt-6 text-titre">Trente minutes. Sans engagement.</h1>
        <p className="mt-6 text-chapo text-gris">
          Quelques mots sur vous, puis choisissez votre créneau. Maï Diaw vous appelle,
          personnellement.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl border border-filet bg-ivoire">
        <FormulaireAppel calcomLink={CALCOM_LINK} />
      </div>
    </Section>
  );
}
