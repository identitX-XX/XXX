"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JOURNEY } from "@/data/constants";
import { Card } from "./ui";

// Vue d'ensemble du parcours : les 8 blocs, dans l'ordre, chacun avec son
// numéro d'étape, son titre, sa phrase et un lien vers la page.
// Un seul composant, affiché à deux endroits (dernière étape de l'onboarding
// et page dédiée /parcours), alimenté par la source unique JOURNEY.
export function ParcoursOverview({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {JOURNEY.map((step, i) => (
        <Link
          key={step.href}
          href={step.href}
          onClick={onNavigate}
          className="group block focus-visible:outline-none"
        >
          <Card className="flex h-full items-start gap-4 p-5 transition-all group-hover:border-fuchsia group-hover:shadow-glow group-focus-visible:border-fuchsia">
            <span className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm text-white">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-lg font-light text-ink">
                  {step.title}
                </h3>
                <ArrowUpRight
                  size={15}
                  className="text-muted transition-colors group-hover:text-fuchsia"
                />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {step.phrase}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
