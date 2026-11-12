import { activerSuiviConso } from "@/app/jeux/actions";
import { FormReleve } from "@/components/jeux/FormReleve";
import { db } from "@/lib/db";
import {
  COMPTEURS,
  JOURS_MIN_PERIODE,
  TYPES_COMPTEUR,
  bilanCompteur,
  economieMensuelle,
  formaterIndex,
  type TypeCompteur,
} from "@/lib/jeux/compteur";

const dateCourte = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const nombre = (n: number, max = 1) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: max }).format(n).replace(/[  ]/g, " ");

export async function SectionCompteur({ carteId, consentement }: { carteId: string; consentement: boolean }) {
  if (!consentement) {
    return (
      <section className="panneau space-y-4">
        <h2 className="font-bold">Activez le suivi de vos consommations</h2>
        <p className="text-sm text-muted">
          Pour jouer, Green Card a besoin de vos relevés d&apos;eau, de gaz ou d&apos;électricité. Ils servent uniquement à calculer vos
          économies et ne sont jamais transmis nominativement. Vous pouvez arrêter à tout moment depuis votre profil.
        </p>
        <form action={activerSuiviConso}>
          <button type="submit" className="btn-primaire">
            J&apos;accepte et je commence
          </button>
        </form>
      </section>
    );
  }

  const releves = await db.releve.findMany({ where: { carteId }, orderBy: { date: "asc" } });
  const parType = Object.fromEntries(TYPES_COMPTEUR.map((t) => [t, releves.filter((r) => r.type === t)])) as Record<
    TypeCompteur,
    typeof releves
  >;
  const derniers = Object.fromEntries(
    TYPES_COMPTEUR.map((t) => {
      const r = parType[t].at(-1);
      return [t, r ? { index: r.index, date: r.date.toISOString() } : null];
    }),
  );

  return (
    <>
      <FormReleve derniers={derniers} />

      <section aria-labelledby="titre-suivi" className="space-y-3">
        <h2 id="titre-suivi" className="text-lg font-bold">
          Mon suivi
        </h2>
        {TYPES_COMPTEUR.map((t) => {
          const info = COMPTEURS[t];
          const liste = parType[t];
          const bilan = bilanCompteur(liste);
          const eco = economieMensuelle(t, bilan);
          return (
            <article key={t} className="panneau">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  <span aria-hidden>{info.emoji} </span>
                  {info.nom}
                </h3>
                <span className="text-xs text-muted">
                  {liste.length} relevé{liste.length > 1 ? "s" : ""}
                </span>
              </div>

              {liste.length === 0 && <p className="mt-2 text-sm text-muted">Pas encore de relevé.</p>}

              {liste.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                  {liste.slice(-4).map((r) => (
                    <li key={r.id} className="rounded-lg bg-bg px-2 py-1">
                      {dateCourte(r.date)} · {formaterIndex(r.index)} {info.unite}
                    </li>
                  ))}
                </ul>
              )}

              {liste.length > 0 && bilan.reference === null && (
                <p className="mt-3 text-sm text-muted">Revenez dans {JOURS_MIN_PERIODE} jours pour mesurer votre consommation.</p>
              )}

              {bilan.reference !== null && (
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-bg p-3">
                    <dt className="text-xs text-muted">Départ</dt>
                    <dd className="font-semibold">
                      {nombre(bilan.reference, 2)} {info.unite}/jour
                    </dd>
                  </div>
                  <div className="rounded-xl bg-bg p-3">
                    <dt className="text-xs text-muted">Maintenant</dt>
                    <dd className="font-semibold">
                      {bilan.actuelle === null ? "—" : `${nombre(bilan.actuelle, 2)} ${info.unite}/jour`}
                    </dd>
                  </div>
                </dl>
              )}

              {eco && bilan.variation !== null && (
                <p className={`mt-3 rounded-xl p-3 text-sm ${bilan.variation <= 0 ? "bg-green-50 text-green-text" : "bg-alert-bg text-alert"}`}>
                  {bilan.variation <= 0 ? (
                    <>
                      <strong>{nombre(-bilan.variation * 100, 0)} % de moins</strong> qu&apos;au départ : environ{" "}
                      <strong>{nombre(eco.euros, 0)} €</strong> et {nombre(eco.co2, 0)} kg de CO₂ économisés par mois.
                    </>
                  ) : (
                    <>
                      Consommation en hausse de {nombre(bilan.variation * 100, 0)} %. Pas de panique : les astuces des voisins peuvent
                      aider !
                    </>
                  )}
                </p>
              )}
            </article>
          );
        })}
        <p className="text-xs text-muted">Montants et CO₂ indicatifs, calculés avec des prix et facteurs d&apos;émission moyens.</p>
      </section>
    </>
  );
}
