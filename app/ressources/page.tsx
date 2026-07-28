"use client";

// La bibliothèque de ressources — toutes les pratiques, lectures et réflexions,
// consultables à tout moment. La « ressource du jour » de la home en met une en
// avant ; ici, on peut toutes les parcourir. « Les savoirs » regroupe à part
// les lectures adossées à la recherche (elles portent une source).

import { Wind, BookOpen, PenLine, GraduationCap } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { RESSOURCES, TYPE_LABEL, Ressource } from "@/parcours-archetypes/quotidien";

const ICON: Record<Ressource["type"], React.ReactNode> = {
  pratique: <Wind size={16} />,
  lecture: <BookOpen size={16} />,
  reflexion: <PenLine size={16} />,
};
const ORDRE: Ressource["type"][] = ["pratique", "reflexion", "lecture"];

// « Les savoirs » = les ressources adossées à la recherche (avec source).
const SAVOIRS = RESSOURCES.filter((r) => r.source);

export default function RessourcesPage() {
  return (
    <div>
      <PageHead
        eyebrow="Ressources"
        title="Ta bibliothèque"
        sub="Des pratiques, des lectures et des réflexions courtes. À reprendre quand tu veux, dans l'ordre que tu veux."
      />

      <div className="flex flex-col gap-8">
        {ORDRE.map((type) => {
          // Les lectures adossées à la recherche vivent dans « Les savoirs ».
          const liste = RESSOURCES.filter(
            (r) => r.type === type && !r.source
          );
          if (liste.length === 0) return null;
          return (
            <section key={type} className="animate-fade-up">
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-fuchsia">
                {ICON[type]} {TYPE_LABEL[type]}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {liste.map((r) => (
                  <Card key={r.id} className="p-5 sm:p-6">
                    <div className="text-xs uppercase tracking-[0.14em] text-muted">
                      {TYPE_LABEL[r.type]} · {r.duree}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-light text-ink">{r.titre}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.corps}</p>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        {SAVOIRS.length > 0 && (
          <section className="animate-fade-up">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-fuchsia">
              <GraduationCap size={16} /> Les savoirs
            </div>
            <p className="mb-4 max-w-xl text-sm text-muted">
              Ce que la recherche dit du changement profond — neurosciences,
              psychologie de l'identité, multipotentialité. Des appuis, pas des
              dogmes.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SAVOIRS.map((r) => (
                <Card key={r.id} className="p-5 sm:p-6">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted">
                    Savoir · {r.duree}
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
        )}
      </div>
    </div>
  );
}
