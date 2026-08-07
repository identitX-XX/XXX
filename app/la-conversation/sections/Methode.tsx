import { FadeIn } from "../FadeIn";

const ETAPES = [
  {
    num: "01",
    titre: "Le questionnaire",
    texte:
      "Quarante minutes de questions, à remplir avant qu'on se voie. Pas cinq. Beaucoup y renoncent à la troisième question. C'est un bon filtre, et c'est déjà le début du travail.",
  },
  {
    num: "02",
    titre: "Les trois heures",
    texte:
      "En présentiel, en huis clos, sans slides et sans notes prises pour la forme. J'ai tout lu avant. La première heure sert généralement à démonter la version officielle. Les deux suivantes servent à ce qui reste.",
  },
  {
    num: "03",
    titre: "La restitution",
    texte:
      "Huit pages écrites, dix jours plus tard. Pas un compte rendu : une reformulation de ce que vous n'avez pas réussi à dire vous-même. Certaines la relisent deux ans après.",
  },
  {
    num: "04",
    titre: "La relance",
    texte:
      "Un appel à cinq semaines. Ni suivi, ni accompagnement. Juste le moment où on vérifie ce qui a tenu.",
  },
];

export function Methode() {
  return (
    <section className="px-6">
      <FadeIn className="mx-auto max-w-[34rem] py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[28px] leading-[1.2] tracking-[-0.01em] text-[color:var(--encre)] md:text-[36px]">
          Comment ça se passe.
        </h2>

        <div className="mt-10">
          {ETAPES.map((etape, i) => (
            <div
              key={etape.num}
              className={
                i === 0
                  ? "py-8"
                  : "border-t border-[color:var(--filet)] py-8"
              }
            >
              <p className="font-[family-name:var(--font-instrument-serif)] text-[20px] leading-none text-[color:var(--bronze)]">
                {etape.num}
              </p>
              <h3 className="mt-3 text-[18px] font-medium leading-[1.7] text-[color:var(--encre)]">
                {etape.titre}
              </h3>
              <p className="mt-2 text-[18px] leading-[1.7] text-[color:var(--encre)]">
                {etape.texte}
              </p>
            </div>
          ))}
        </div>

        {/* Encart tarif : pas de fond coloré, un filet 1px en haut et en bas. */}
        <div className="mt-8 border-y border-[color:var(--filet)] py-6">
          <p className="text-[18px] leading-[1.7] text-[color:var(--encre)]">
            1 600 €. Un seul format. Pas d&apos;option, pas de formule premium.
            Délai actuel : six semaines.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
