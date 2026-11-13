import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EnTete } from "@/components/EnTete";
import { RemonterEnHaut } from "@/components/RemonterEnHaut";
import { MEDAILLES } from "@/lib/carte";
import { carteConnectee } from "@/lib/session";
import { chargerVueCarte } from "@/lib/vue-carte";
import { REGLES_MEDAILLES } from "@/lib/jeux/regles";
import { SectionCompteur } from "./SectionCompteur";
import { SectionTri } from "./SectionTri";
import { SectionAstuces } from "./SectionAstuces";
import { SectionTrajets } from "./SectionTrajets";
import { SectionSecondeVie } from "./SectionSecondeVie";

export const dynamic = "force-dynamic";

const EMOJI_MEDAILLE = ["", "🥉", "🥈", "🥇"];

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { defiParId } = await import("@/lib/defis");
  return { title: defiParId(params.id)?.titre ?? "Défi" };
}

export default async function PageDefi({ params }: { params: { id: string } }) {
  const carte = await carteConnectee();
  if (!carte) redirect("/connexion");
  const vue = await chargerVueCarte(carte.id);
  if (!vue) redirect("/connexion");

  const defi = vue.cases.find((c) => c.id === params.id);
  if (!defi) notFound();
  if (!defi.debloque || !defi.disponible) redirect("/carte");

  const regles = REGLES_MEDAILLES[defi.id];
  const points = [defi.pointsBronze, defi.pointsArgent, defi.pointsOr];

  return (
    <>
      <EnTete lienAccueil="/carte" />
      <RemonterEnHaut />
      <main id="contenu" className="mx-auto max-w-md space-y-6 px-5 pb-16 pt-4">
        <Link href="/carte" className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-ink">
          ← Ma carte
        </Link>

        <div className="flex items-center gap-4">
          <span aria-hidden className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-green-100 text-4xl">
            {defi.emoji}
          </span>
          <div>
            <p className="text-sm font-semibold text-green-text">Case {defi.ordre} sur 10</p>
            <h1 className="text-2xl font-bold leading-tight">{defi.titre}</h1>
            <p className="text-sm text-muted">{defi.accroche}</p>
          </div>
        </div>

        <section aria-labelledby="titre-medailles" className="panneau">
          <h2 id="titre-medailles" className="mb-3 font-bold">
            Les médailles
          </h2>
          <ol className="space-y-2">
            {regles.map((regle, i) => {
              const obtenue = defi.niveau >= i + 1;
              return (
                <li key={i} className={`flex items-center gap-3 rounded-xl p-2 ${obtenue ? "bg-green-50" : ""}`}>
                  <span aria-hidden className={`text-2xl ${obtenue ? "" : "opacity-40 grayscale"}`}>
                    {EMOJI_MEDAILLE[i + 1]}
                  </span>
                  <span className="flex-1 text-sm">
                    <span className="font-semibold">{MEDAILLES[i + 1]}</span> · {regle}
                    <span className="sr-only">{obtenue ? " (obtenue)" : " (à obtenir)"}</span>
                  </span>
                  <span className={`shrink-0 text-xs font-semibold ${obtenue ? "text-green-text" : "text-muted"}`}>
                    {obtenue ? "✓ " : ""}
                    {points[i]} pts
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {defi.id === "compteur-malin" && <SectionCompteur carteId={carte.id} consentement={!!carte.consentConsommation} />}
        {defi.id === "tri-master" && <SectionTri carteId={carte.id} />}
        {defi.id === "trajets-verts" && <SectionTrajets carteId={carte.id} />}
        {defi.id === "seconde-vie" && <SectionSecondeVie carteId={carte.id} residenceId={carte.logement.residenceId} />}
        {defi.id === "boite-a-astuces" && <SectionAstuces carteId={carte.id} residenceId={carte.logement.residenceId} />}
      </main>
    </>
  );
}
