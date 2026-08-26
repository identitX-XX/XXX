"use client";

// Hub premium — les trois offres, avec leur prix et leur promesse.

import Link from "next/link";
import { ArrowRight, Sparkles, Compass, HelpCircle, User } from "lucide-react";
import { PageHead, Card } from "@/components/ui";

const OFFRES = [
  {
    href: "/premium/signature",
    icone: Sparkles,
    titre: "Lecture approfondie de ta signature",
    prix: "2,50 €",
    sous: "Ta signature principale, ta secondaire et celle qui émerge — reliées, décortiquées.",
  },
  {
    href: "/premium/perimetre",
    icone: Compass,
    titre: "Approfondir un périmètre",
    prix: "4,50 €",
    sous: "Une lecture + des pistes concrètes sur ton perso, ton pro ou ton relationnel.",
  },
  {
    href: "/premium/questions",
    icone: HelpCircle,
    titre: "Panel de 10 questions",
    prix: "2,50 €",
    sous: "Dix questions ciblées par périmètre — perso, pro, identitaire, relationnel.",
  },
];

export default function PremiumPage() {
  return (
    <div>
      <PageHead
        eyebrow="Premium"
        title="Aller plus loin"
        sub="Des lectures et des outils pour approfondir, quand tu le souhaites. Le parcours reste gratuit."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {OFFRES.map((o) => {
          const Icone = o.icone;
          return (
            <Link key={o.href} href={o.href} className="block">
              <Card className="flex h-full flex-col p-6 transition-colors hover:border-fuchsia/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-xl text-fuchsia" style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}>
                    <Icone size={18} />
                  </div>
                  <span className="rounded-full border border-fuchsia/40 px-3 py-1 text-xs font-semibold text-fuchsia">
                    {o.prix}
                  </span>
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
      <p className="mt-6 flex items-center gap-2 text-xs text-muted">
        <User size={13} /> Tes achats seront liés à ton compte — paiement sécurisé par carte &amp; Apple Pay (bientôt).
      </p>
    </div>
  );
}
