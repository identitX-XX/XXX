import { FadeIn } from "../FadeIn";

export function Promesse() {
  return (
    <section className="px-6">
      <FadeIn className="mx-auto max-w-[34rem] py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[28px] leading-[1.2] tracking-[-0.01em] text-[color:var(--encre)] md:text-[36px]">
          Ce que je promets, et ce que je ne promets pas.
        </h2>

        <div className="mt-10">
          <h3 className="text-[18px] font-medium leading-[1.7] text-[color:var(--encre)]">
            Je ne promets pas
          </h3>
          <p className="mt-3 text-[18px] leading-[1.7] text-[color:var(--encre)]">
            De plan à 90 jours. De méthode en cinq piliers. De vous aider à
            aller plus vite. Vous allez déjà très vite, c&apos;est précisément ce
            qu&apos;on va regarder.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-[18px] font-medium leading-[1.7] text-[color:var(--encre)]">
            Je promets
          </h3>
          <p className="mt-3 text-[18px] leading-[1.7] text-[color:var(--encre)]">
            Qu&apos;à la fin des trois heures, vous saurez nommer ce que vous
            portez par choix et ce que vous portez par habitude. C&apos;est tout.
            C&apos;est énorme. Presque personne ne peut faire cette distinction
            seule, parce que la personne la mieux placée pour vous mentir,
            c&apos;est vous.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
