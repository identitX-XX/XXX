import Link from "next/link";
import { Convergences } from "@/components/ui/Convergences";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Portrait } from "@/components/ui/Portrait";
import { Section } from "@/components/ui/Section";
import { PARCE_QUE, PROMESSE } from "@/lib/positionnement";

/** Un visage derrière la marque : la confiance commence par savoir à qui l'on parle. */
export function Fondatrice() {
  return (
    <Section ton="sable">
      <div className="grid items-center gap-16 md:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Portrait
          src="/images/mai-diaw-tailleur.jpg"
          alt="Portrait de Maï Diaw, souriante, en tailleur blanc"
          focus="50% 25%"
          filet="gauche"
          className="mx-auto w-full max-w-md"
        />
        <div>
          <Eyebrow>La fondatrice</Eyebrow>
          <h2 className="mt-6 text-manifeste font-light">Maï Diaw</h2>
          <p className="mt-4 font-serif text-titre font-light italic text-bordeaux">Matchmakeuse d&apos;exception.</p>
          <p className="mt-8 max-w-lecture text-chapo text-gris">
            {PROMESSE} {PARCE_QUE}
          </p>
          <div className="mt-10">
            <Convergences compact />
          </div>
          <Link href="/mai-diaw" className="mt-10 inline-block text-xs uppercase tracking-[0.18em] text-bordeaux hover:text-encre">
            Découvrir Maï Diaw →
          </Link>
        </div>
      </div>
    </Section>
  );
}
