"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHead } from "@/components/ui";
import { DayStrip } from "@/components/DayStrip";
import { Dashboard } from "@/parcours-archetypes/components/Dashboard";
import { Diagnostic } from "@/parcours-archetypes/components/Diagnostic";
import { JourView } from "@/parcours-archetypes/components/JourView";
import { useParcoursStore } from "@/parcours-archetypes/store";

// Route du module. Tant que le dominant n'est pas déterminé, on présente le
// diagnostic (écran-miroir). Une fois fait, il ouvre le parcours 30 jours.
export default function ParcoursArchetypesPage() {
  const parcours = useParcoursStore((s) => s.parcours);
  const jourCourant = useParcoursStore((s) => s.etat.jourCourant);
  const reponses = useParcoursStore((s) => s.reponses);
  const diagnostic = useParcoursStore((s) => s.diagnostic);

  // Jour sélectionné à l'écran (suit le jour courant par défaut, mais on peut
  // revenir sur n'importe quelle journée déjà close).
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  useEffect(() => {
    setSelectedDay((d) => (d == null ? Math.min(jourCourant, 30) : d));
  }, [jourCourant]);

  const jourN = selectedDay ?? Math.min(jourCourant, 30);
  const jour = parcours.jours.find((j) => j.n === jourN) ?? null;
  const reponseDuJour = reponses[jourN];
  const termine = jourCourant > 30;

  return (
    <div>
      <PageHead
        eyebrow="Module"
        title="Parcours des 12 archétypes"
        sub="30 jours, 12 archétypes, 5 sphères. Ton archétype dominant n'est jamais une étiquette : il se lit autrement selon les contextes — et il respire, jamais figé."
      />

      <Link
        href="/parcours-archetypes/objectif"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm text-fuchsia hover:underline"
      >
        Objectif &amp; place dans ton parcours
        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </Link>

      {!diagnostic ? (
        <Diagnostic />
      ) : (
      <>

      {/* Frise des 30 jours : relecture de l'historique, sans rien perdre */}
      <DayStrip
        jourCourant={jourCourant}
        selected={jourN}
        reponses={reponses}
        onSelect={setSelectedDay}
      />

      {termine && (
        <p className="mb-8 text-sm text-muted">
          Les 30 jours sont clos. Tu peux revoir chaque journée ci-dessus — ton
          radar reflète tout le chemin.
        </p>
      )}

      {jour && (
        <section style={{ marginBottom: 48 }}>
          <JourView
            key={jour.n}
            jour={jour}
            reponse={reponseDuJour}
            onClose={(r) => setSelectedDay(Math.min(r.jour + 1, 30))}
          />
        </section>
      )}

      <Dashboard />
      </>
      )}
    </div>
  );
}
