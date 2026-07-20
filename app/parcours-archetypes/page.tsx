"use client";

import { useEffect } from "react";
import { PageHead } from "@/components/ui";
import { Dashboard } from "@/parcours-archetypes/components/Dashboard";
import { JourView } from "@/parcours-archetypes/components/JourView";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { DIAGNOSTIC_DEFAUT } from "@/parcours-archetypes/generateParcours";

// Route de démonstration du module drop-in `parcours-archetypes/`.
// À l'usage réel, `initialiserParcours` reçoit le diagnostic de l'écran-miroir
// amont ; ici on amorce avec un diagnostic par défaut (explorateur/sage) pour
// rendre le module visible en preview.
export default function ParcoursArchetypesPage() {
  const parcours = useParcoursStore((s) => s.parcours);
  const jourCourant = useParcoursStore((s) => s.etat.jourCourant);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const initialiserParcours = useParcoursStore((s) => s.initialiserParcours);

  useEffect(() => {
    if (!diagnostic) initialiserParcours(DIAGNOSTIC_DEFAUT);
  }, [diagnostic, initialiserParcours]);

  const jour = parcours.jours.find((j) => j.n === jourCourant) ?? null;

  return (
    <div>
      <PageHead
        eyebrow="Module"
        title="Parcours des 12 archétypes"
        sub="30 jours, 12 lentilles, 5 sphères. Un archétype n'est jamais une étiquette : c'est une lentille qui se lit autrement selon les contextes — et qui respire, jamais figée."
      />

      {jour ? (
        <section style={{ marginBottom: 48 }}>
          <JourView jour={jour} />
        </section>
      ) : (
        <p className="mb-12 text-sm text-muted">
          Parcours terminé — les 30 jours sont clos. Ton radar reflète tout le
          chemin.
        </p>
      )}

      <Dashboard />
    </div>
  );
}
