import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Wordmark } from "@/components/ui/Wordmark";

// Texte de marque signé Maï Diaw — reproduit tel quel. Ne pas réécrire.

/** Ouverture plein écran : la devise, sur bordeaux. */
export function ManifesteOuverture() {
  return (
    <Section ton="bordeaux" className="flex min-h-[calc(100svh-4rem)] items-center">
      <Eyebrow surSombre>Par Maï Diaw — Matchmakeuse d&apos;exception</Eyebrow>
      <h1 className="mt-10 text-manifeste">
        Choisir sa vie.
        <br />
        Choisir ses relations.
        <br />
        <span className="italic text-champagne">Choisir son cercle.</span>
      </h1>
      <div className="mt-12 h-px w-24 bg-champagne" aria-hidden />
      <p className="mt-10 max-w-lecture text-chapo text-ivoire/80">
        Les relations que nous construisons commencent toujours par la relation que nous
        entretenons avec nous-mêmes.
      </p>
      <div className="mt-12">
        <CTA ton="sombre" />
      </div>
    </Section>
  );
}

/** Le manifeste complet, composé comme une page de livre. */
export function Manifeste() {
  return (
    <>
      <Section etroit>
        <Eyebrow>Manifeste</Eyebrow>
        <div className="mt-10 space-y-8 font-serif text-chapo leading-relaxed">
          <p>
            <Wordmark className="text-[1em] text-bordeaux" /> est né d&apos;une conviction : les relations que nous
            construisons commencent toujours par la relation que nous entretenons avec nous-mêmes.
          </p>
          <p>
            Nous croyons qu&apos;une vie accomplie ne se mesure pas uniquement à ce que l&apos;on
            possède, mais à la qualité des personnes, des liens et des expériences qui la composent.
          </p>
          <p>
            CéliBOSS™ s&apos;adresse aux femmes et aux hommes qui ont grandi, construit, réussi,
            appris — et qui ne veulent plus choisir leurs relations par défaut.
          </p>
          <p className="border-l border-taupe pl-6 italic text-gris">
            À celles et ceux qui recherchent de la profondeur sans renoncer à la légèreté.
            <br />
            De l&apos;ambition sans sacrifier l&apos;humain.
            <br />
            De l&apos;élégance sans superficialité.
            <br />
            Des connexions qui ont du sens.
          </p>
          <p>Ici, nous ne parlons pas seulement d&apos;amour.</p>
          <p>
            Nous parlons d&apos;identité, de confiance, de standards, d&apos;intelligence
            émotionnelle, de rencontres et d&apos;expériences qui nous élèvent.
          </p>
        </div>
      </Section>

      <Section ton="encre" etroit>
        <p className="font-serif text-titre">
          Parce que certaines rencontres changent une soirée.
          <br />
          <span className="italic text-champagne">D&apos;autres changent une trajectoire.</span>
        </p>
      </Section>

      <Section etroit>
        <div className="space-y-8 font-serif text-chapo leading-relaxed">
          <p>
            CéliBOSS™ crée un univers où l&apos;on apprend à mieux se connaître pour mieux choisir :
            ses relations, ses environnements, ses opportunités et les personnes auxquelles on donne
            accès à sa vie.
          </p>
          <p>
            Un univers dans lequel les connexions peuvent devenir amoureuses, amicales,
            professionnelles ou simplement profondément humaines.
          </p>
        </div>
      </Section>

      <Section ton="sable">
        <Eyebrow>Nous croyons</Eyebrow>
        <ul className="mt-12 grid gap-px bg-filet md:grid-cols-3">
          {[
            ["À la sélection", "plutôt qu'à l'accumulation."],
            ["À l'intention", "plutôt qu'au hasard."],
            ["À l'alignement", "plutôt qu'à la validation."],
          ].map(([oui, non]) => (
            <li key={oui} className="bg-sable py-8 md:px-8 md:py-4">
              <p className="font-serif text-4xl">{oui}</p>
              <p className="mt-2 text-gris">{non}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section etroit className="text-center">
        <p className="font-serif text-chapo leading-relaxed">
          CéliBOSS™ n&apos;est pas une injonction à trouver quelqu&apos;un.
        </p>
        <p className="mt-8 font-serif text-titre">
          C&apos;est une invitation à devenir tellement aligné avec soi-même que l&apos;on ne
          construit plus sa vie — ni ses relations —{" "}
          <span className="italic text-bordeaux">par défaut.</span>
        </p>
        <p className="mt-12 text-eyebrow uppercase text-gris">— Maï Diaw, fondatrice</p>
      </Section>
    </>
  );
}
