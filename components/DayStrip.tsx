"use client";

// Frise des 30 jours, partagée par le module et la page Progression.
// Reflète l'avancement : jours clos, jour courant, jours à venir.
export function DayStrip({
  jourCourant,
  selected,
  reponses,
  onSelect,
  legende = "Tes 30 jours · clique pour revoir une journée",
}: {
  jourCourant: number;
  selected: number;
  reponses: Record<number, unknown>;
  onSelect: (n: number) => void;
  legende?: string;
}) {
  return (
    <div className="mb-8">
      <div className="mb-2 text-xs uppercase tracking-wider text-muted">{legende}</div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 30 }).map((_, i) => {
          const n = i + 1;
          const done = Boolean(reponses[n]);
          const current = n === jourCourant;
          const locked = n > jourCourant;
          const isSel = n === selected;
          return (
            <button
              key={n}
              onClick={() => !locked && onSelect(n)}
              disabled={locked}
              aria-current={isSel}
              title={
                locked
                  ? `Jour ${n} — à venir`
                  : done
                  ? `Jour ${n} — revoir`
                  : `Jour ${n} — aujourd'hui`
              }
              className={[
                "h-8 w-8 rounded-lg text-xs font-medium transition-all",
                isSel ? "ring-2 ring-fuchsia ring-offset-2 ring-offset-noir" : "",
                done
                  ? "brand-gradient text-white"
                  : current
                  ? "border border-fuchsia text-fuchsia"
                  : locked
                  ? "border border-line text-muted opacity-40"
                  : "border border-line text-muted hover:border-fuchsia hover:text-fuchsia",
              ].join(" ")}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
