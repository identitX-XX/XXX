import { FadeIn } from "../FadeIn";

// NOTE : placeholders de calibrage. À REMPLACER par de vrais témoignages avant
// mise en ligne.
const TEMOIGNAGES = [
  {
    citation:
      "Je suis arrivée avec une question de carrière. Je suis repartie en comprenant que ce n'était pas la question.",
    attribution:
      "Directrice de la transformation, ETI industrielle, 47 ans",
  },
  {
    citation:
      "Ce n'est pas agréable. C'est propre. La différence compte à mon âge, je n'ai plus le temps pour ce qui est agréable.",
    attribution: "Associée, cabinet de conseil, 53 ans",
  },
  {
    citation:
      "J'ai passé quinze ans à être celle sur qui tout repose. On ne m'avait jamais demandé si j'avais choisi ce rôle.",
    attribution: "Directrice générale adjointe, secteur santé, 51 ans",
  },
];

export function Temoignages() {
  return (
    <section className="px-6">
      <FadeIn className="mx-auto max-w-[34rem] py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[28px] leading-[1.2] tracking-[-0.01em] text-[color:var(--encre)] md:text-[36px]">
          Trois femmes.
        </h2>

        <div className="mt-10">
          {TEMOIGNAGES.map((t, i) => (
            <div
              key={i}
              className={
                i === 0
                  ? "py-8"
                  : "border-t border-[color:var(--filet)] py-8"
              }
            >
              <p className="font-[family-name:var(--font-instrument-serif)] text-[20px] leading-[1.5] text-[color:var(--encre)]">
                {t.citation}
              </p>
              <p className="mt-4 text-[14px] leading-[1.6] text-[color:var(--gris)]">
                {t.attribution}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
