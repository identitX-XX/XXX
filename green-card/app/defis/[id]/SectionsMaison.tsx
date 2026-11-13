import { ChasseGaspi } from "@/components/jeux/ChasseGaspi";
import { DoucheChrono } from "@/components/jeux/DoucheChrono";
import { FormEngagements, FormPointDuJour } from "@/components/jeux/Operation19";
import { AutresActions, MonFrigo, QuizDates } from "@/components/jeux/ZeroGaspiFrigo";
import { Onglets } from "@/components/Onglets";
import { db } from "@/lib/db";
import { DUREE_MAX_S, OBJECTIF_S, formaterChrono, litresEconomises } from "@/lib/jeux/douche";
import { ECONOMIE_PAR_DEGRE, JOURS_ARGENT_19, JOURS_OR_19, saisonDeChauffe } from "@/lib/jeux/chauffage";
import { EURO_PAR_ACTION, JOURS_OR_FRIGO, KG_PAR_ACTION, QUIZ } from "@/lib/jeux/frigo";
import { jourParis, serieEnCours } from "@/lib/temps";

const nombre = (n: number, max = 0) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: max }).format(n).replace(/[  ]/g, " ");

function Bilan({ cases }: { cases: { titre: string; valeur: string; accent?: boolean }[] }) {
  return (
    <dl className="panneau grid grid-cols-3 gap-2 text-center">
      {cases.map((c) => (
        <div key={c.titre} className={`rounded-xl p-3 ${c.accent ? "bg-green-50" : "bg-bg"}`}>
          <dt className="text-xs text-muted">{c.titre}</dt>
          <dd className={`text-lg font-bold ${c.accent ? "text-green-text" : ""}`}>{c.valeur}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------
export async function SectionGaspi({ carteId }: { carteId: string }) {
  const record = await db.partieGaspi.findFirst({
    where: { carteId, fin: { not: null } },
    orderBy: [{ trouves: "desc" }, { dureeMs: "asc" }],
    select: { trouves: true, dureeMs: true },
  });
  return <ChasseGaspi record={record ? { trouves: record.trouves, dureeMs: record.dureeMs ?? 0 } : null} />;
}

// ---------------------------------------------------------------------------
export async function SectionDouche({ carteId }: { carteId: string }) {
  const [douches, ouverte] = await Promise.all([
    db.douche.findMany({ where: { carteId, fin: { not: null } }, orderBy: { debut: "desc" } }),
    db.douche.findFirst({ where: { carteId, fin: null }, orderBy: { debut: "desc" } }),
  ]);
  const reussies = douches.filter((d) => d.reussie);
  const litres = reussies.reduce((s, d) => s + litresEconomises(d.dureeS ?? OBJECTIF_S), 0);
  const serie = serieEnCours(new Set(reussies.map((d) => d.jour)), jourParis());
  const ecouleS = ouverte ? (Date.now() - ouverte.debut.getTime()) / 1000 : 0;

  return (
    <>
      <DoucheChrono ouverte={ouverte && ecouleS < DUREE_MAX_S ? { id: ouverte.id, ecouleS } : null} />
      <Bilan
        cases={[
          { titre: "Eau économisée", valeur: `${nombre(litres)} L`, accent: true },
          { titre: "Douches ≤ 5 min", valeur: String(reussies.length) },
          { titre: "Série", valeur: `${serie} j` },
        ]}
      />
      {douches.length > 0 && (
        <section aria-labelledby="titre-douches" className="space-y-2">
          <h2 id="titre-douches" className="text-lg font-bold">
            Mes dernières douches
          </h2>
          <ul className="space-y-2 text-sm">
            {douches.slice(0, 7).map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-2xl border border-line bg-surface p-3">
                <span>{d.debut.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short", timeZone: "Europe/Paris" })}</span>
                <span className={`font-semibold ${d.reussie ? "text-green-text" : "text-alert"}`}>
                  {d.reussie ? "✓" : "⏰"} {formaterChrono(d.dureeS ?? 0)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-xs text-muted">Litres indicatifs : douche classique de 12 L/min, comparée à une douche de 10 minutes.</p>
    </>
  );
}

// ---------------------------------------------------------------------------
export async function SectionOperation19({ carteId }: { carteId: string }) {
  const [eng, checkIns] = await Promise.all([
    db.engagement19.findUnique({ where: { carteId } }),
    db.checkIn19.findMany({ where: { carteId }, orderBy: { jour: "desc" } }),
  ]);
  const choisis: string[] = eng ? JSON.parse(eng.engagements) : [];
  const tenues = checkIns.filter((c) => c.tenue);
  const aujourdhui = jourParis();
  const duJour = checkIns.find((c) => c.jour === aujourdhui);
  const objectif = tenues.length < JOURS_ARGENT_19 ? JOURS_ARGENT_19 : JOURS_OR_19;
  const mois = Number(aujourdhui.slice(5, 7));

  if (!eng) {
    return (
      <>
        <p className="rounded-2xl bg-green-50 p-4 text-sm text-green-text">
          💡 Chaque degré en moins, c&apos;est environ <strong>{Math.round(ECONOMIE_PAR_DEGRE * 100)} %</strong> de chauffage économisé.
        </p>
        <FormEngagements choisis={[]} modification={false} />
      </>
    );
  }

  return (
    <>
      {!saisonDeChauffe(mois) && (
        <p className="rounded-2xl bg-bg p-4 text-sm text-muted">☀️ Hors saison de chauffe : les gestes « volets » et « aérer » comptent aussi pour garder la fraîcheur !</p>
      )}
      <section className="panneau">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold">
            📅 {tenues.length} journée{tenues.length > 1 ? "s" : ""} tenue{tenues.length > 1 ? "s" : ""}
          </span>
          <span className="text-muted">{tenues.length >= JOURS_OR_19 ? "Objectif atteint !" : `objectif : ${objectif}`}</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-green-100" role="progressbar" aria-label="Journées tenues" aria-valuemin={0} aria-valuemax={objectif} aria-valuenow={Math.min(tenues.length, objectif)}>
          <div className="h-full rounded-full bg-green-600" style={{ width: `${Math.min(1, tenues.length / objectif) * 100}%` }} />
        </div>
        <p className="mt-3 text-xs text-muted">Chaque degré en moins ≈ {Math.round(ECONOMIE_PAR_DEGRE * 100)} % de chauffage économisé (ADEME).</p>
      </section>
      <FormPointDuJour choisis={choisis} dejaFaits={duJour ? JSON.parse(duJour.faits) : []} />
      <details className="panneau">
        <summary className="cursor-pointer font-semibold">Modifier mes engagements</summary>
        <div className="mt-3">
          <FormEngagements choisis={choisis} modification />
        </div>
      </details>
    </>
  );
}

// ---------------------------------------------------------------------------
export async function SectionFrigo({ carteId }: { carteId: string }) {
  const [actions, parfait] = await Promise.all([
    db.actionAntiGaspi.findMany({ where: { carteId }, select: { jour: true } }),
    db.quizFrigo.findFirst({ where: { carteId, score: QUIZ.length } }),
  ]);
  const jours = new Set(actions.map((a) => a.jour)).size;

  return (
    <>
      <Bilan
        cases={[
          { titre: "Nourriture sauvée", valeur: `${nombre(actions.length * KG_PAR_ACTION, 1)} kg`, accent: true },
          { titre: "Économisé", valeur: `${nombre(actions.length * EURO_PAR_ACTION)} €` },
          { titre: "Jours actifs", valeur: `${jours}${jours < JOURS_OR_FRIGO ? `/${JOURS_OR_FRIGO}` : ""}` },
        ]}
      />
      <Onglets
        onglets={[
          { id: "frigo", titre: "🧊 Mon frigo", contenu: <MonFrigo /> },
          {
            id: "actions",
            titre: "✅ Mes actions",
            contenu: (
              <>
                <AutresActions />
                <QuizDates dejaReussi={!!parfait} />
              </>
            ),
          },
        ]}
      />
      <p className="text-xs text-muted">Estimation indicative : 0,3 kg de nourriture et 1,50 € sauvés par action.</p>
    </>
  );
}
