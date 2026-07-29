"use client";

// La bibliothèque de ressources — toutes les pratiques, lectures et réflexions,
// consultables à tout moment. Chaque fiche est ADOSSÉE À UNE SOURCE (auteur,
// référence) : rien ne flotte, tout nomme son mécanisme. La « ressource du
// jour » de la home en met une en avant ; ici, on peut toutes les parcourir.

import { Wind, PenLine, GraduationCap } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { RESSOURCES, Ressource } from "@/parcours-archetypes/quotidien";

// On classe par TYPE, pas par présence de source (toutes en ont désormais une).
// Les « lectures » forment « Les savoirs » ; pratiques et réflexions gardent
// leur section, chacune portant sa référence.
const SECTIONS: {
  type: Ressource["type"];
  titre: string;
  intro?: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "pratique",
    titre: "Les pratiques",
    intro:
      "Des gestes courts, chacun adossé à un mécanisme connu — respiration, ancrage sensoriel, affirmation de soi. À faire, pas seulement à lire.",
    icon: <Wind size={16} />,
  },
  {
    type: "reflexion",
    titre: "Les réflexions",
    intro:
      "Des questions à porter, tirées de cadres établis — thérapie cognitive, communication non violente, autodétermination.",
    icon: <PenLine size={16} />,
  },
  {
    type: "lecture",
    titre: "Les savoirs",
    intro:
      "Ce que la recherche dit du changement profond — neurosciences, psychologie de l'identité, multipotentialité. Des appuis sourcés, pas des dogmes.",
    icon: <GraduationCap size={16} />,
  },
];

export default function RessourcesPage() {
  return (
    <div>
      <PageHead
        eyebrow="Ressources"
        title="Ta bibliothèque"
        sub="Des pratiques, des réflexions et des savoirs — chacun adossé à une source. À reprendre quand tu veux, dans l'ordre que tu veux."
      />

      <div className="flex flex-col gap-8">
        {SECTIONS.map(({ type, titre, intro, icon }) => {
          const liste = RESSOURCES.filter((r) => r.type === type);
          if (liste.length === 0) return null;
          return (
            <section key={type} className="animate-fade-up">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-fuchsia">
                {icon} {titre}
              </div>
              {intro && (
                <p className="mb-4 max-w-xl text-sm text-muted">{intro}</p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {liste.map((r) => (
                  <Card key={r.id} className="flex flex-col p-5 sm:p-6">
                    <div className="text-xs uppercase tracking-[0.14em] text-muted">
                      {r.duree}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-light text-ink">{r.titre}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.corps}</p>
                    {r.source && (
                      <p className="mt-3 border-t border-line pt-3 text-xs italic text-muted">
                        {r.source}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
