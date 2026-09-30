import { redirect } from "next/navigation";
import { basculerConsentementSante } from "@/app/espace/actions";
import { FormulaireProfil, FormulaireSuppression } from "@/components/espace/FormulairesProfil";
import { chargerEspace } from "@/lib/compagnon/donnees";

export const metadata = { title: "Profil" };

const dateLongue = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function Profil() {
  const d = await chargerEspace();
  if (!d) redirect("/connexion?suite=/espace/profil");
  const consentie = d.profil?.sante_consentie_le;

  return (
    <div className="mx-auto max-w-[90rem] space-y-20 px-6 pb-rythme pt-14 md:px-10 xl:px-24">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bordeaux">Profil</p>
        <h1 className="font-serif text-titre font-medium">
          Vos informations, <span className="font-normal italic text-bordeaux">sous votre garde.</span>
        </h1>
        <p className="text-gris">Connecté·e avec {d.user.email}.</p>
      </header>

      <section className="space-y-8">
        <h2 className="font-serif text-3xl font-medium">Vous</h2>
        <FormulaireProfil prenom={d.profil?.prenom ?? ""} cap={d.profil?.cap_du_mois ?? ""} />
      </section>

      <section id="sante" className="max-w-2xl space-y-6 border-t border-filet pt-14">
        <h2 className="font-serif text-3xl font-medium">Données de santé</h2>
        <p className="leading-relaxed text-gris">
          Sommeil et cardio sont des données de santé : le Compagnon ne les lit qu&apos;avec votre accord explicite. Elles ne sont jamais visibles
          par le Cercle ni partagées.
        </p>
        {consentie ? (
          <form action={basculerConsentementSante.bind(null, false)} className="space-y-4">
            <p>
              Consentement donné le <span className="font-semibold">{dateLongue(consentie)}</span>.
            </p>
            <button type="submit" className="text-xs font-semibold uppercase tracking-[0.2em] underline decoration-filet underline-offset-8 hover:decoration-bordeaux">
              Retirer mon consentement et effacer ces données
            </button>
          </form>
        ) : (
          <form action={basculerConsentementSante.bind(null, true)} className="space-y-4">
            <p>Consentement non donné : sommeil et cardio sont désactivés.</p>
            <button type="submit" className="bg-nuit px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivoire hover:bg-bordeaux">
              J&apos;autorise le Compagnon à utiliser mes données de santé
            </button>
          </form>
        )}
      </section>

      <section className="max-w-2xl space-y-6 border-t border-filet pt-14">
        <h2 className="font-serif text-3xl font-medium">Vos droits</h2>
        <p className="leading-relaxed text-gris">Récupérez toutes vos données dans un fichier, ou supprimez votre compte et tout ce qu&apos;il contient.</p>
        <a href="/espace/export" className="inline-block text-xs font-semibold uppercase tracking-[0.2em] underline decoration-filet underline-offset-8 hover:decoration-bordeaux">
          Télécharger mes données (JSON) →
        </a>
        <div className="pt-6">
          <FormulaireSuppression />
        </div>
      </section>
    </div>
  );
}
