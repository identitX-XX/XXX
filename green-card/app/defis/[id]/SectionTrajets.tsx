import { FormTrajet, ListeTrajets, type TrajetVue } from "@/components/jeux/Trajets";
import { db } from "@/lib/db";
import { JOURS_ARGENT, JOURS_OR, VOITURE_CO2_PAR_KM, euroEconomise, estMode } from "@/lib/jeux/trajets";
import { jourParis, serieEnCours, veille } from "@/lib/temps";

const nombre = (n: number, max = 1) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: max }).format(n).replace(/[  ]/g, " ");

export async function SectionTrajets({ carteId }: { carteId: string }) {
  const trajets = await db.trajet.findMany({ where: { carteId }, orderBy: [{ jour: "desc" }, { createdAt: "desc" }] });

  const aujourdhui = jourParis();
  const jours = new Set(trajets.map((t) => t.jour));
  const km = trajets.reduce((s, t) => s + t.km, 0);
  const co2 = trajets.reduce((s, t) => s + t.co2Evite, 0);
  const euros = trajets.reduce((s, t) => s + (estMode(t.mode) ? euroEconomise(t.mode, t.km) : 0), 0);
  const serie = serieEnCours(jours, aujourdhui);
  const objectif = jours.size < JOURS_ARGENT ? JOURS_ARGENT : JOURS_OR;
  const modifiables = new Set([aujourdhui, veille(aujourdhui)]);

  const vues: TrajetVue[] = trajets.slice(0, 10).map((t) => ({
    id: t.id,
    mode: t.mode,
    km: t.km,
    motif: t.motif,
    jour: t.jour,
    co2: t.co2Evite,
    modifiable: modifiables.has(t.jour),
  }));

  return (
    <>
      <section aria-labelledby="titre-bilan" className="panneau">
        <h2 id="titre-bilan" className="sr-only">
          Mon bilan mobilité
        </h2>
        <dl className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-green-50 p-3">
            <dt className="text-xs text-muted">CO₂ évité</dt>
            <dd className="text-lg font-bold text-green-text">{nombre(co2)} kg</dd>
          </div>
          <div className="rounded-xl bg-bg p-3">
            <dt className="text-xs text-muted">Distance</dt>
            <dd className="text-lg font-bold">{nombre(km)} km</dd>
          </div>
          <div className="rounded-xl bg-bg p-3">
            <dt className="text-xs text-muted">Carburant</dt>
            <dd className="text-lg font-bold">{nombre(euros, 0)} €</dd>
          </div>
        </dl>
        <div className="mt-4 flex items-baseline justify-between text-sm">
          <span className="font-semibold">
            📅 {jours.size} jour{jours.size > 1 ? "s" : ""} actif{jours.size > 1 ? "s" : ""}
          </span>
          <span className="text-muted">{jours.size >= JOURS_OR ? "Objectif atteint !" : `objectif : ${objectif} jours`}</span>
        </div>
        <div
          className="mt-2 h-3 overflow-hidden rounded-full bg-green-100"
          role="progressbar"
          aria-label="Jours actifs"
          aria-valuemin={0}
          aria-valuemax={objectif}
          aria-valuenow={Math.min(jours.size, objectif)}
        >
          <div className="h-full rounded-full bg-green-600" style={{ width: `${Math.min(1, jours.size / objectif) * 100}%` }} />
        </div>
        {serie >= 2 && <p className="mt-3 text-sm font-semibold text-green-text">🔥 {serie} jours d&apos;affilée, continuez !</p>}
        {co2 >= 1 && (
          <p className="mt-2 text-xs text-muted">
            C&apos;est autant de CO₂ qu&apos;une voiture sur {nombre(co2 / VOITURE_CO2_PAR_KM, 0)} km.
          </p>
        )}
      </section>

      <FormTrajet />
      <ListeTrajets trajets={vues} aujourdhui={aujourdhui} />
      <p className="text-xs text-muted">CO₂ et carburant indicatifs, comparés au même trajet seul dans une voiture thermique moyenne.</p>
    </>
  );
}
