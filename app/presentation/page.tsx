"use client";

// « La présentation d'IdentitX » — rejouable à tout moment (le manifeste + la
// présentation du parcours), sans refaire l'onboarding. Utile pour revoir
// l'objet de l'app, ou le montrer. Réutilise les écrans de l'onboarding.

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  StepAccueil,
  StepSignature,
  StepTerritoires,
  StepExercices,
  StepCoach,
  StepScenarios,
  StepQuete,
  StepMenu,
} from "@/components/Onboarding";

export default function PresentationPage() {
  const ecrans = [
    <StepAccueil key="accueil" />,
    <StepSignature key="signature" />,
    <StepTerritoires key="territoires" />,
    <StepExercices key="exercices" />,
    <StepCoach key="coach" />,
    <StepScenarios key="scenarios" />,
    <StepQuete key="quete" />,
    <StepMenu key="menu" />,
  ];
  const refs = useRef<(HTMLElement | null)[]>([]);
  const scrollTo = (i: number) =>
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="relative h-[100dvh] snap-y snap-mandatory overflow-y-auto scroll-smooth">
      {/* Champ bleuté très discret, sous le ton doré : il fait « ressortir » les
          blocs de verre, comme s'ils glissaient sur une profondeur. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 75% at 50% 12%, rgba(84,112,205,0.12), transparent 58%)",
        }}
      />

      {ecrans.map((e, i) => (
        <section
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="flex min-h-[100dvh] snap-start flex-col justify-center px-4 py-8"
        >
          <div className="mx-auto w-full max-w-lg animate-fade-up rounded-[1.75rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(90,118,208,0.10),rgba(90,118,208,0.03))] px-5 py-9 shadow-[0_24px_70px_-34px_rgba(72,102,200,0.55)]">
            {e}
          </div>

          {/* Flèche « continuer » entre chaque bloc : elle invite à glisser vers
              le suivant (défilement fluide). */}
          {i < ecrans.length - 1 && (
            <button
              onClick={() => scrollTo(i + 1)}
              className="mx-auto mt-9 flex flex-col items-center gap-1 text-[12px] font-bold uppercase tracking-[0.18em] text-fuchsia/85 transition-colors hover:text-fuchsia"
              aria-label="Continuer"
            >
              {i === 0 && <span>Fais défiler</span>}
              <ChevronDown size={i === 0 ? 20 : 24} className="animate-bounce" />
            </button>
          )}
        </section>
      ))}

      <div className="flex flex-col items-center gap-2 py-10">
        <Link
          href="/aujourdhui"
          className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-full brand-gradient px-8 text-base font-semibold text-[color:var(--on-brand)] shadow-glow transition-transform hover:scale-[1.02]"
        >
          Reprendre ma quête <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
