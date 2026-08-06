"use client";

// « Prendre un moment avec Marina » — un point d'étape optionnel, si la testeuse
// le souhaite. Branché sur un lien Cal.com configurable (NEXT_PUBLIC_CAL_LINK).
// Tant que le lien n'est pas renseigné : la carte annonce « bientôt », sans
// bouton mort.

import { CalendarHeart } from "lucide-react";
import { Card } from "./ui";

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "";

export function RendezVous() {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <CalendarHeart size={16} className="text-fuchsia" />
        <p className="text-ink">Prendre un moment avec Marina</p>
      </div>
      <p className="mb-4 mt-1 text-xs text-muted">
        Un point d'étape, si tu le souhaites : vingt minutes pour parler de ta
        quête, de ce qui bouge, de ce qui coince. Sans obligation.
      </p>
      {CAL_LINK ? (
        <a
          href={CAL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-[color:var(--on-brand)] shadow-glow transition-transform hover:scale-[1.02]"
        >
          <CalendarHeart size={16} /> Réserver un créneau
        </a>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-5 py-2.5 text-sm text-muted">
          Bientôt disponible
        </span>
      )}
    </Card>
  );
}
