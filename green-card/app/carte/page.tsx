import Link from "next/link";
import { redirect } from "next/navigation";
import { CarteVerte, PastilleMedaille } from "@/components/CarteVerte";
import { EnTete } from "@/components/EnTete";
import { RemonterEnHaut } from "@/components/RemonterEnHaut";
import { formaterPoints } from "@/lib/carte";
import { UNIVERS_LIBELLES } from "@/lib/defis";
import { carteConnectee } from "@/lib/session";
import { chargerVueCarte } from "@/lib/vue-carte";

export const metadata = { title: "Ma carte" };
export const dynamic = "force-dynamic";

export default async function PageCarte({ searchParams }: { searchParams: { bienvenue?: string } }) {
  const carte = await carteConnectee();
  if (!carte) redirect("/connexion");
  const vue = await chargerVueCarte(carte.id);
  if (!vue) redirect("/connexion");

  const bienvenue = searchParams.bienvenue === "1";
  const jouables = vue.cases.filter((c) => c.debloque && c.disponible);
  // Priorité aux cases encore vides, puis aux médailles à améliorer.
  const prochaine = jouables.find((c) => c.niveau === 0) ?? jouables.find((c) => c.niveau < 3);
  const { suivant, ratio, reste } = vue.progression;

  return (
    <>
      <EnTete
        lienAccueil="/carte"
        droite={
          <Link href="/profil" aria-label="Mon profil" className="grid h-10 w-10 place-items-center rounded-full border border-line text-lg">
            <span aria-hidden>👤</span>
          </Link>
        }
      />
      <RemonterEnHaut />
      <main id="contenu" className="mx-auto max-w-md space-y-6 px-5 pb-16 pt-5">
        {bienvenue && (
          <div role="status" className="animate-monte rounded-2xl bg-green-50 p-4 text-sm">
            <p className="font-semibold text-green-text">🎉 Votre Green Card est activée !</p>
            <p className="mt-1 text-muted">Vous recevez 20 GreenPoints de bienvenue. Chaque défi réussi tamponne une case.</p>
          </div>
        )}

        <div>
          <p className="text-sm text-muted">Bonjour,</p>
          <h1 className="text-xl font-bold leading-tight">{vue.residence}</h1>
        </div>

        <CarteVerte vue={vue} animer={bienvenue} />

        <div className="panneau">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">
              {vue.niveau.emoji} {vue.niveau.nom}
            </span>
            <span className="text-muted">
              {suivant ? `Encore ${formaterPoints(reste)} pts pour ${suivant.emoji} ${suivant.nom}` : "Niveau maximum atteint !"}
            </span>
          </div>
          <div
            className="mt-3 h-3 overflow-hidden rounded-full bg-green-100"
            role="progressbar"
            aria-label="Progression vers le niveau suivant"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(ratio * 100)}
          >
            <div className="h-full rounded-full bg-green-600 transition-[width]" style={{ width: `${ratio * 100}%` }} />
          </div>
          <p className="mt-3 text-sm text-muted">
            {vue.casesValidees} case{vue.casesValidees > 1 ? "s" : ""} sur 10
            {vue.gold ? " · Green Card Gold 🏆" : " · Remplissez les 10 cases pour passer Gold 🏆"}
          </p>
        </div>

        {prochaine && (
          <div className="flex items-center justify-between gap-4 rounded-carte border border-line bg-surface p-4">
            <div>
              <p className="text-xs text-muted">{prochaine.niveau === 0 ? "Prochaine case" : "Médaille à améliorer"}</p>
              <p className="font-semibold">
                <span aria-hidden>{prochaine.emoji} </span>
                {prochaine.titre}
              </p>
            </div>
            <Link href={`/defis/${prochaine.id}`} className="btn-primaire w-auto shrink-0 px-6">
              Jouer
            </Link>
          </div>
        )}

        <section aria-labelledby="titre-defis">
          <h2 id="titre-defis" className="mb-3 text-lg font-bold">
            Les 10 défis
          </h2>
          <ul className="space-y-2">
            {vue.cases.map((c) => {
              const jouable = c.debloque && c.disponible;
              const contenu = (
                <>
                  <span aria-hidden className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ${c.niveau ? "bg-green-100" : "bg-bg"}`}>
                    {c.debloque ? c.emoji : "🔒"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-semibold leading-tight">
                      <span>
                        {c.ordre}. {c.titre}
                      </span>
                      <PastilleMedaille niveau={c.niveau} />
                    </p>
                    <p className="truncate text-sm text-muted">
                      {!c.debloque ? "Se débloque en tamponnant une autre case" : !c.disponible ? "Bientôt disponible" : c.accroche}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{jouable ? <span aria-hidden className="text-lg text-ink">›</span> : UNIVERS_LIBELLES[c.univers]}</span>
                </>
              );
              const classes = "flex items-center gap-3 rounded-2xl border border-line bg-surface p-3";
              return (
                <li key={c.id}>
                  {jouable ? (
                    <Link href={`/defis/${c.id}`} className={`${classes} transition-colors hover:border-green-600`}>
                      {contenu}
                    </Link>
                  ) : (
                    <div className={`${classes} opacity-60`}>{contenu}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
