import { FadeIn } from "../FadeIn";

export function PourQui() {
  return (
    <section className="px-6">
      <FadeIn className="mx-auto max-w-[34rem] py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[28px] leading-[1.2] tracking-[-0.01em] text-[color:var(--encre)] md:text-[36px]">
          À qui ça ne s&apos;adresse pas.
        </h2>

        <p className="mt-8 text-[18px] leading-[1.7] text-[color:var(--encre)]">
          Aux femmes en urgence. Si quelque chose brûle en ce moment, une
          conversation n&apos;est pas le bon outil et je le dirai à l&apos;appel.
          À celles qui cherchent une validation : elles la trouveront ailleurs,
          moins cher. Et à celles qui veulent qu&apos;on leur dise quoi faire. Je
          ne le sais pas. Vous non plus, pas encore, et c&apos;est exactement le
          point de départ.
        </p>
      </FadeIn>
    </section>
  );
}
