"use client";

// « Aller plus loin » — des explorations plus profondes, en accès libre. Ce
// n'est pas une boutique : c'est une invitation à découvrir davantage.

import Link from "next/link";
import { ArrowRight, Sparkles, Compass, HelpCircle } from "lucide-react";
import { PageHead, Card } from "@/components/ui";

const EXPLORATIONS = [
  {
    href: "/premium/signature",
    icone: Sparkles,
    titre: "Ta signature en profondeur",
    sous: "Ta signature principale, ta secondaire et celle qui émerge — reliées, décortiquées.",
  },
  {
    href: "/premium/perimetre",
    icone: Compass,
    titre: "Approfondir un périmètre",
    sous: "Une lecture + des pistes concrètes sur ton perso, ton pro ou ton relationnel.",
  },
  {
    href: "/premium/questions",
    icone: HelpCircle,
    titre: "Tes panels de questions",
    sous: "Dix questions ciblées par périmètre — perso, pro, identitaire, relationnel.",
  },
];

export default function AllerPlusLoinPage() {
  return (
    <div>
      <PageHead
        eyebrow="Aller plus loin"
        title="Explore davantage"
        sub="Quand tu as envie de creuser, voici des lectures et des outils pour aller plus profond. En accès libre."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {EXPLORATIONS.map((o) => {
          const Icone = o.icone;
          return (
            <Link key={o.href} href={o.href} className="block">
              <Card className="flex h-full flex-col p-6 transition-colors hover:border-fuchsia/50">
                <div className="grid h-10 w-10 place-items-center rounded-xl text-fuchsia" style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}>
                  <Icone size={18} />
                </div>
                <h2 className="mt-3 font-display text-lg font-light text-ink">{o.titre}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{o.sous}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia">
                  Découvrir <ArrowRight size={13} />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
