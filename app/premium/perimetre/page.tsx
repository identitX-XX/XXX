"use client";

// Offre premium n°1 — approfondir un périmètre (perso / pro / relationnel) — 4,50 €.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead, Card } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import {
  approfondissementPerimetre,
  LABEL_PERIMETRE,
  PerimetreA,
  Approfondissement,
} from "@/parcours-archetypes/premiumContenu";

const ORDRE: PerimetreA[] = ["perso", "pro", "relationnel"];

export default function PerimetrePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);

  if (!mounted) return null;

  if (!diagnostic) {
    return (
      <div>
        <PageHead
          eyebrow="Approfondir un périmètre"
          title="Révèle d'abord ta signature"
          sub="Cette lecture se compose à partir de ta signature et de tes directions."
        />
        <Link href="/parcours-signatures" className="inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-semibold text-[color:var(--on-brand)] shadow-glow">
          Révéler ma signature <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const sig = archetypeByKey[diagnostic.dominant];

  return (
    <div>
      <PageHead
        eyebrow="Aller plus loin"
        title="Ton périmètre, en profondeur"
        sub="Une lecture reliée à ta signature et à ton cap, puis des pistes concrètes à tenter."
      />
      <div className="space-y-6">
        {ORDRE.map((p) => {
          const direction = objectifs?.[p] ?? "";
          const contenu = approfondissementPerimetre(p, direction, sig.name, sig.force, sig.ombre);
          return <ApprofondissementView key={p} contenu={contenu} />;
        })}
      </div>
    </div>
  );
}

function ApprofondissementView({ contenu, apercu }: { contenu: Approfondissement; apercu?: boolean }) {
  return (
    <Card className="p-6">
      <h2 className="font-display text-xl font-light text-ink">{contenu.titre}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink">{contenu.lecture}</p>
      {!apercu && (
        <div className="mt-4 border-t border-line pt-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-fuchsia">
            Tes pistes à tenter
          </div>
          <div className="mt-2 flex flex-col gap-2.5">
            {contenu.pistes.map((piste, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-sm" style={{ background: "linear-gradient(180deg,var(--fuchsia),var(--orange))" }} />
                <span className="leading-relaxed">{piste}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
