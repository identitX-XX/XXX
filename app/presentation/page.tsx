"use client";

// « La présentation d'IdentitX » — rejouable à tout moment (le manifeste + la
// présentation du parcours), sans refaire l'onboarding. Utile pour revoir
// l'objet de l'app, ou le montrer. Réutilise les écrans de l'onboarding.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  StepAccueil,
  StepTerritoires,
  StepChemin,
  StepRythme,
  StepMouvement,
} from "@/components/Onboarding";

export default function PresentationPage() {
  const ecrans = [
    <StepAccueil key="accueil" />,
    <StepTerritoires key="territoires" />,
    <StepChemin key="chemin" />,
    <StepRythme key="rythme" />,
    <StepMouvement key="mouvement" />,
  ];

  return (
    <div>
      {ecrans.map((e, i) => (
        <section
          key={i}
          className="flex min-h-[78vh] flex-col justify-center border-b border-line py-10 last:border-b-0"
        >
          <div className="mx-auto w-full max-w-lg animate-fade-up">{e}</div>
        </section>
      ))}

      <div className="flex flex-col items-center gap-2 py-10">
        <Link
          href="/aujourdhui"
          className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-full brand-gradient px-8 text-base font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
        >
          Reprendre ma quête <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
