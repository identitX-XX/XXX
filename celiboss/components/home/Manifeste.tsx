import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { LuneEtoile } from "@/components/ui/Symboles";

// Texte de marque signé Maï Diaw, reproduit tel quel. Ne pas réécrire.
export function Manifeste() {
  return (
    <>
      <Section ton="nuit" className="overflow-hidden">
        <Eyebrow surSombre>Le manifeste</Eyebrow>
        <h1 className="mt-8 font-serif text-manifeste font-extrabold">
          Choisir sa vie.
          <br />
          Choisir ses relations.
          <br />
          <span className="font-normal italic text-champagne">Choisir son cercle.</span>
        </h1>
      </Section>

      <Section etroit>
        <div className="space-y-8 font-serif text-lecture">
          <p>
            <span className="font-bold text-bordeaux">CéliBOSS™</span> est né d&apos;une conviction : les relations que nous construisons commencent
            toujours par la relation que nous entretenons avec nous-mêmes.
          </p>
          <p>
            Nous croyons qu&apos;une vie accomplie ne se mesure pas uniquement à ce que l&apos;on possède, mais à la qualité des personnes, des liens et
            des expériences qui la composent.
          </p>
          <p>
            CéliBOSS™ s&apos;adresse aux femmes et aux hommes qui ont grandi, construit, réussi, appris — et qui ne veulent plus choisir leurs relations
            par défaut.
          </p>
          <p className="border-l-2 border-champagne py-1 pl-8 italic text-bordeaux">
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
            Nous parlons d&apos;identité, de confiance, de standards, d&apos;intelligence émotionnelle, de rencontres et d&apos;expériences qui nous
            élèvent.
          </p>
        </div>
      </Section>

      <Section ton="nuit" etroit className="text-center">
        <LuneEtoile taille={72} className="mx-auto text-champagne" />
        <p className="mt-10 font-serif text-titre font-extrabold">
          Parce que certaines rencontres changent une soirée.
          <br />
          <span className="font-normal italic text-champagne">D&apos;autres changent une trajectoire.</span>
        </p>
      </Section>

      <Section etroit>
        <div className="space-y-8 font-serif text-lecture">
          <p>
            CéliBOSS™ crée un univers où l&apos;on apprend à mieux se connaître pour mieux choisir : ses relations, ses environnements, ses opportunités
            et les personnes auxquelles on donne accès à sa vie.
          </p>
          <p>
            Un univers dans lequel les connexions peuvent devenir amoureuses, amicales, professionnelles ou simplement profondément humaines.
          </p>
        </div>
      </Section>

      <Section ton="sable">
        <Eyebrow>Nous croyons</Eyebrow>
        <ul className="mt-12 grid border-t-2 border-encre md:grid-cols-3">
          {[
            ["À la sélection", "plutôt qu'à l'accumulation."],
            ["À l'intention", "plutôt qu'au hasard."],
            ["À l'alignement", "plutôt qu'à la validation."],
          ].map(([oui, non], i) => (
            <li key={oui} className={`py-8 md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i < 2 ? "md:border-r md:border-filet" : ""}`}>
              <p className="font-serif text-4xl font-extrabold md:text-5xl">{oui}</p>
              <p className="mt-2 text-gris">{non}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section etroit className="text-center">
        <p className="font-serif text-lecture">CéliBOSS™ n&apos;est pas une injonction à trouver quelqu&apos;un.</p>
        <p className="mt-8 font-serif text-titre font-extrabold">
          C&apos;est une invitation à devenir tellement aligné avec soi-même que l&apos;on ne construit plus sa vie — ni ses relations —{" "}
          <span className="font-normal italic text-bordeaux">par défaut.</span>
        </p>
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.26em] text-gris">— Maï Diaw, fondatrice</p>
      </Section>
    </>
  );
}
