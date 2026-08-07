import { FadeIn } from "../FadeIn";
import { CtaButton } from "../CtaButton";

export function CtaFinal() {
  return (
    <section className="px-6">
      <FadeIn className="mx-auto max-w-[34rem] py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[28px] leading-[1.2] tracking-[-0.01em] text-[color:var(--encre)] md:text-[36px]">
          L&apos;appel découverte.
        </h2>

        <p className="mt-8 text-[18px] leading-[1.7] text-[color:var(--encre)]">
          Vingt minutes. Je pose trois questions, vous en posez autant. À la
          fin, l&apos;un de nous deux dit non ou on cale une date. Il n&apos;y a
          pas de troisième issue et rien à préparer.
        </p>

        <div className="mt-10">
          <CtaButton label="Réserver un appel découverte" />
          <p className="mt-3 text-[14px] leading-[1.6] text-[color:var(--gris)]">
            20 minutes, sans engagement.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
