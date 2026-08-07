import { FadeIn } from "../FadeIn";
import { CtaButton } from "../CtaButton";

export function Accroche() {
  return (
    <section className="px-6">
      <FadeIn className="mx-auto max-w-[34rem] py-20 md:py-28">
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[color:var(--gris)]">
          Trois heures. Une seule conversation.
        </p>

        <h1 className="mt-6 font-[family-name:var(--font-instrument-serif)] text-[34px] leading-[1.15] tracking-[-0.02em] text-[color:var(--encre)] md:text-[46px]">
          Il arrive un moment où on exécute très bien une vie qu&apos;on ne
          signe plus.
        </h1>

        <p className="mt-8 text-[18px] leading-[1.7] text-[color:var(--encre)]">
          Rien ne s&apos;est effondré. C&apos;est bien ça le problème. Le poste
          tient, l&apos;équipe tient, l&apos;agenda tient. Et pourtant quelque
          chose ne se laisse plus raconter. Cette page ne s&apos;adresse pas aux
          femmes qui vont mal. Elle s&apos;adresse à celles qui vont bien et qui
          le savent de moins en moins.
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
