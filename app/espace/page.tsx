import Link from "next/link";
import { redirect } from "next/navigation";
import { Constellation } from "@/components/compagnon/Constellation";
import { Historique } from "@/components/espace/Historique";
import { chargerEspace } from "@/lib/compagnon/donnees";
import { lectureElan } from "@/lib/compagnon/elan";
import { formatSommeil } from "@/lib/compagnon/point";

const NIVEAUX = ["", "Très bas", "Bas", "Moyen", "Haut", "Très haut"];

export default async function Aujourdhui() {
  const d = await chargerEspace();
  if (!d) redirect("/connexion?suite=/espace");
  const { profil, duJour, historique } = d;
  const date = new Date(`${d.jour}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const p = duJour?.point;

  const signaux = [
    { nom: "Sommeil", valeur: formatSommeil(p?.sommeil_minutes), source: p?.sommeil_minutes ? "montre / saisie" : "" },
    { nom: "Cardio", valeur: p?.cardio_repos ? `${p.cardio_repos} bpm` : "—", source: d.referenceCardio ? `votre normale : ${d.referenceCardio}` : "" },
    { nom: "Humeur", valeur: p?.humeur ? NIVEAUX[p.humeur] : "—", source: p?.esprit ?? "" },
    { nom: "Énergie", valeur: p?.energie ? `${p.energie} / 5` : "—", source: "" },
    { nom: "Ambition", valeur: p?.ambition ? NIVEAUX[p.ambition] : "—", source: profil?.cap_du_mois ?? "" },
  ];

  return (
    <div className="mx-auto max-w-[90rem] space-y-20 px-6 pb-rythme pt-14 md:px-10 xl:px-24">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bordeaux">{date}</p>
        <h1 className="font-serif text-titre font-medium">
          Bonjour {profil?.prenom ?? ""}. <span className="font-normal italic text-bordeaux">Votre élan du jour.</span>
        </h1>
      </header>

      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="mx-auto w-full max-w-md rounded-[2.5rem] bg-nuit p-6 text-ivoire">
          <Constellation elan={duJour?.elan.valeur ?? null} scores={duJour?.elan.detail ?? {}} className="w-full" />
        </div>
        <div className="space-y-8">
          <p className="font-serif text-3xl leading-snug">{lectureElan(duJour?.elan ?? { valeur: null, detail: {}, completude: 0 })}</p>
          <dl className="grid grid-cols-2 border-t border-filet sm:grid-cols-3">
            {signaux.map((s) => (
              <div key={s.nom} className="space-y-1 border-b border-filet py-4 pr-4">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gris">{s.nom}</dt>
                <dd className="font-serif text-2xl">{s.valeur}</dd>
                {s.source && <dd className="truncate text-xs text-gris">{s.source}</dd>}
              </div>
            ))}
          </dl>
          <Link href="/espace/point" className="inline-block bg-nuit px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivoire hover:bg-bordeaux">
            {duJour ? "Modifier mon point du jour" : "Faire mon point du matin"} →
          </Link>
          {!profil?.sante_consentie_le && (
            <p className="text-sm text-gris">
              Sommeil et cardio sont désactivés.{" "}
              <Link href="/espace/profil#sante" className="underline decoration-filet underline-offset-4 hover:text-bordeaux">
                Activer le consentement santé
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="space-y-8 border-t border-filet pt-14">
        <h2 className="font-serif text-3xl font-medium">Vos quatorze derniers jours</h2>
        <Historique jours={historique} />
      </section>

      <p className="text-xs text-gris">Le Compagnon est un outil de bien-être, pas un dispositif médical. En cas de doute sur votre santé, parlez-en à un médecin.</p>
    </div>
  );
}
