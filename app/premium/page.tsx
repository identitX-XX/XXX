"use client";

// Hub premium — les trois offres, avec leur prix et leur promesse.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Compass, HelpCircle, User, Check } from "lucide-react";
import { PageHead, Card } from "@/components/ui";
import { debloquer, CATALOGUE } from "@/lib/entitlements";

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
  // Retour de paiement Stripe : la success_url ramène ici avec ?session_id=…
  // On vérifie côté serveur puis on débloque l'offre payée (le hub est le point
  // de retour, il DOIT donc gérer le déverrouillage — pas seulement les murs).
  const [debloque, setDebloque] = useState<string | null>(null);
  useEffect(() => {
    let sid: string | null = null;
    try {
      sid = new URLSearchParams(window.location.search).get("session_id");
    } catch {}
    if (!sid) return;
    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sid)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.offerId) {
          debloquer(d.offerId);
          setDebloque(CATALOGUE[d.offerId]?.nom ?? "ton contenu premium");
        }
      })
      .catch(() => {})
      .finally(() => {
        // On nettoie l'URL pour ne pas re-vérifier au rafraîchissement.
        try {
          window.history.replaceState({}, "", "/premium");
        } catch {}
      });
  }, []);

  return (
    <div>
      <PageHead
        eyebrow="Premium"
        title="Aller plus loin"
        sub="Des lectures et des outils pour approfondir, quand tu le souhaites. Le parcours reste gratuit."
      />
      {debloque && (
        <Card className="mb-5 flex items-center gap-3 border-fuchsia p-4 animate-fade-up">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-full brand-gradient text-[color:var(--on-brand)]">
            <Check size={16} />
          </span>
          <p className="text-sm text-ink">
            Paiement confirmé — <b>{debloque}</b> est débloqué. Ouvre l'offre pour le découvrir.
          </p>
        </Card>
      )}
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
