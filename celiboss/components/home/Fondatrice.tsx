import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Portrait } from "@/components/ui/Portrait";
import { Section } from "@/components/ui/Section";

/** Un visage derrière la marque : la confiance commence par savoir à qui l'on parle. */
export function Fondatrice() {
  return (
    <Section ton="sable">
      <div className="grid items-center gap-16 md:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Portrait
          src="/images/mai-diaw-accueil.jpg"
          alt="Maï Diaw, en robe blanche, salue d'un geste de la main sur une terrasse ensoleillée"
          focus="52% 28%"
          zoom={1.12}
          filet="gauche"
          className="mx-auto w-full max-w-md"
        />
        <div>
          <Eyebrow>La fondatrice</Eyebrow>
          <h2 className="mt-6 text-manifeste font-light">Maï Diaw</h2>
          <p className="mt-4 font-serif text-titre font-light italic text-bordeaux">Matchmakeuse d&apos;exception.</p>
          <p className="mt-8 max-w-lecture text-chapo text-gris">
            Elle met en relation celles et ceux qui ont construit — en amour, en amitié comme en
            affaires — et les accompagne pour qu&apos;ils ne choisissent plus rien par défaut.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {["Pro", "Relationnel", "Sentimental"].map((t) => (
              <li key={t} className="border border-taupe/70 px-3 py-1.5 text-eyebrow uppercase text-gris">
                {t}
              </li>
            ))}
          </ul>
          <Link href="/mai-diaw" className="mt-10 inline-block text-xs uppercase tracking-[0.18em] text-bordeaux hover:text-encre">
            Découvrir Maï Diaw →
          </Link>
        </div>
      </div>
    </Section>
  );
}
