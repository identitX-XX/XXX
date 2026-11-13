import { RejoindreDefi } from "@/components/jeux/DefiImmeuble";
import { db } from "@/lib/db";
import { etatDefiImmeuble } from "@/lib/immeuble-serveur";
import { CONTRIBUTION_MIN, OBJECTIF_GESTES_PAR_LOGEMENT } from "@/lib/jeux/immeuble";

const nombre = (n: number, max = 1) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: max }).format(n).replace(/[  ]/g, " ");
const nomMois = (mois: string) => new Date(`${mois}-15T12:00:00Z`).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

export async function SectionImmeuble({ carteId, residenceId }: { carteId: string; residenceId: string }) {
  const etat = await etatDefiImmeuble(carteId, residenceId);
  const r = etat.maResidence;
  const objectifTotal = OBJECTIF_GESTES_PAR_LOGEMENT * r.logements;
  const ratio = Math.min(1, r.gestes / Math.max(1, objectifTotal));

  // Les foyers les plus actifs de la résidence ce mois-ci (pseudos seulement).
  const cartes = await db.carte.findMany({ where: { logement: { residenceId } }, select: { id: true, pseudo: true } });
  const top = cartes
    .map((c) => ({ ...c, gestes: etat.gestesParCarte.get(c.id) ?? 0 }))
    .filter((c) => c.gestes > 0)
    .sort((a, b) => b.gestes - a.gestes)
    .slice(0, 5);

  return (
    <>
      <section className="panneau space-y-3">
        <p className="text-sm font-semibold text-green-text">Défi de {nomMois(etat.mois)}</p>
        <h2 className="text-lg font-bold leading-snug">
          {r.nom} : {OBJECTIF_GESTES_PAR_LOGEMENT} éco-gestes par logement ce mois-ci
        </h2>
        <p className="text-sm text-muted">
          Chaque trajet vert, relevé, douche de 5 minutes, journée à 19 °C, action seconde vie ou anti-gaspi et chaque astuce compte !
        </p>
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">
              {r.gestes} geste{r.gestes > 1 ? "s" : ""} sur {objectifTotal}
            </span>
            <span className="text-muted">{ratio >= 1 ? "Objectif atteint ! 🎉" : `${Math.round(ratio * 100)} %`}</span>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-green-100" role="progressbar" aria-label="Objectif collectif" aria-valuemin={0} aria-valuemax={objectifTotal} aria-valuenow={r.gestes}>
            <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-700" style={{ width: `${ratio * 100}%` }} />
          </div>
        </div>
        <p className="rounded-xl bg-bg p-3 text-sm">
          {etat.inscrit ? "✅ Vous faites partie de l'équipe." : "Vous n'avez pas encore rejoint l'équipe."} Vos gestes ce mois-ci : <strong>{etat.mesGestes}</strong>
          {etat.mesGestes < CONTRIBUTION_MIN ? ` (${CONTRIBUTION_MIN} pour l'argent et l'or)` : ""}
        </p>
        <RejoindreDefi inscrit={etat.inscrit} />
      </section>

      <section aria-labelledby="titre-classement" className="panneau">
        <h2 id="titre-classement" className="mb-3 font-bold">
          🏆 Classement des résidences
        </h2>
        <ol className="space-y-2">
          {etat.classement.map((c) => (
            <li
              key={c.residenceId}
              className={`flex items-center gap-3 rounded-xl p-3 text-sm ${c.residenceId === residenceId ? "border-2 border-green-600 bg-green-50" : "bg-bg"}`}
            >
              <span aria-hidden className="w-8 text-center text-lg font-bold">
                {c.rang === 1 ? "🥇" : c.rang === 2 ? "🥈" : c.rang === 3 ? "🥉" : c.rang}
              </span>
              <span className="flex-1">
                <span className="block font-semibold">
                  <span className="sr-only">{c.rang}ᵉ : </span>
                  {c.nom}
                  {c.residenceId === residenceId && " (vous)"}
                </span>
                <span className="block text-xs text-muted">
                  {c.gestes} gestes · {c.logements} logements
                </span>
              </span>
              <span className="font-bold">{nombre(c.parLogement)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-muted">Score = gestes par logement : petites et grandes résidences jouent à égalité.</p>
        {etat.maResidenceAvant && etat.maResidenceAvant.gestes > 0 && (
          <p className="mt-2 text-sm">
            Le mois dernier : <strong>{etat.maResidenceAvant.rang === 1 ? "1ʳᵉ place 🥇" : `${etat.maResidenceAvant.rang}ᵉ place`}</strong>
          </p>
        )}
      </section>

      {top.length > 0 && (
        <section aria-labelledby="titre-top" className="panneau">
          <h2 id="titre-top" className="mb-3 font-bold">
            Les plus actifs de la résidence
          </h2>
          <ol className="space-y-1 text-sm">
            {top.map((c, i) => (
              <li key={c.id} className="flex justify-between">
                <span>
                  {i + 1}. {c.id === carteId ? <strong>{c.pseudo} (vous)</strong> : c.pseudo}
                </span>
                <span className="text-muted">{c.gestes} gestes</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
