"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Dumbbell, GraduationCap } from "lucide-react";
import { PageHead } from "@/components/ui";
import { DayStrip } from "@/components/DayStrip";
import { Dashboard } from "@/parcours-archetypes/components/Dashboard";
import { Diagnostic } from "@/parcours-archetypes/components/Diagnostic";
import { Objectifs } from "@/parcours-archetypes/components/Objectifs";
import { JourView } from "@/parcours-archetypes/components/JourView";
import { useParcoursStore } from "@/parcours-archetypes/store";

// Route du module. Tant que le dominant n'est pas déterminé, on présente le
// diagnostic (écran-miroir). Une fois fait, il ouvre le parcours 30 jours.
// Enveloppé dans <Suspense> car on lit le paramètre ?jour= (useSearchParams).
export default function ParcoursArchetypesPage() {
  return (
    <Suspense fallback={null}>
      <ParcoursContent />
    </Suspense>
  );
}

function ParcoursContent() {
  const parcours = useParcoursStore((s) => s.parcours);
  const jourCourant = useParcoursStore((s) => s.etat.jourCourant);
  const reponses = useParcoursStore((s) => s.reponses);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);

  // Jour demandé via l'URL (?jour=N), p. ex. depuis la Progression.
  const searchParams = useSearchParams();
  const jourParam = Number(searchParams.get("jour"));

  // Jour sélectionné à l'écran (suit le jour courant par défaut, mais on peut
  // revenir sur n'importe quelle journée déjà close).
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  useEffect(() => {
    setSelectedDay((d) => (d == null ? Math.min(jourCourant, 30) : d));
  }, [jourCourant]);
  // Ouvre le jour demandé par l'URL (s'il est atteint).
  useEffect(() => {
    if (jourParam >= 1 && jourParam <= 30 && jourParam <= jourCourant) {
      setSelectedDay(jourParam);
    }
  }, [jourParam, jourCourant]);

  const jourN = selectedDay ?? Math.min(jourCourant, 30);
  const jour = parcours.jours.find((j) => j.n === jourN) ?? null;
  const reponseDuJour = reponses[jourN];
  const termine = jourCourant > 30;

  return (
    <div>
      {!diagnostic ? (
        <Diagnostic />
      ) : !objectifs ? (
        <Objectifs />
      ) : (
      <>

      {/* En-tête du module — seulement une fois le parcours lancé, pour ne pas
          écraser l'écran des questions (il respire : juste « Ma quête »). */}
      <PageHead
        eyebrow="Module"
        title="Parcours des 12 archétypes"
        sub="Ton archétype n'est pas figé, il oscille dans un mouvement permanent — qui soutient ta mécanique d'expansion ou celle de tes schémas connus."
      />

      {/* Adossé au module, une fois le parcours lancé : les exercices (Quête) et
          les savoirs. Ils n'encombrent plus l'entrée du diagnostic. */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/quete"
          className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-fuchsia"
        >
          <Dumbbell size={18} className="flex-none text-fuchsia" />
          <span className="flex-1 text-sm text-ink">Les exercices de ta Quête — se délester, choisir, s'engager</span>
          <ArrowUpRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
        </Link>
        <Link
          href="/ressources"
          className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-fuchsia"
        >
          <GraduationCap size={18} className="flex-none text-fuchsia" />
          <span className="flex-1 text-sm text-ink">Les savoirs — neurosciences & psychologie de l'identité</span>
          <ArrowUpRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
        </Link>
      </div>


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
