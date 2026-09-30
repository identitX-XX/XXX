import type { JourElan } from "@/lib/compagnon/donnees";

const jourCourt = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }).replace(".", "");

/** Les 14 derniers jours : une barre par jour, hauteur = élan. */
export function Historique({ jours }: { jours: JourElan[] }) {
  const quatorze = [...jours].slice(0, 14).reverse();
  if (quatorze.length < 2) {
    return <p className="text-gris">Votre historique apparaîtra ici après quelques points du matin.</p>;
  }
  const moyenne = Math.round(
    quatorze.filter((j) => j.elan.valeur != null).reduce((t, j) => t + (j.elan.valeur as number), 0) /
      Math.max(1, quatorze.filter((j) => j.elan.valeur != null).length),
  );
  return (
    <figure>
      <div className="flex h-40 items-end gap-2" role="img" aria-label={`Élan des ${quatorze.length} derniers points, moyenne ${moyenne}.`}>
        {quatorze.map((j) => (
          <div key={j.jour} className="flex h-full flex-1 flex-col justify-end gap-2">
            <div
              className="w-full bg-bordeaux/80 transition-colors hover:bg-bordeaux"
              style={{ height: `${Math.max(4, j.elan.valeur ?? 0)}%` }}
              title={`${jourCourt(j.jour)} : élan ${j.elan.valeur ?? "—"}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-[0.625rem] uppercase tracking-[0.1em] text-gris">
        {quatorze.map((j) => (
          <span key={j.jour} className="flex-1 truncate text-center">
            {jourCourt(j.jour)}
          </span>
        ))}
      </div>
      <figcaption className="mt-4 text-sm text-gris">
        Moyenne sur la période : <span className="font-semibold text-encre">{moyenne}</span>
      </figcaption>
    </figure>
  );
}
