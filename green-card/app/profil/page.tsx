import Link from "next/link";
import { redirect } from "next/navigation";
import { deconnexion, majConsentementConso } from "@/app/actions";
import { EnTete } from "@/components/EnTete";
import { FormSuppression } from "@/components/Formulaires";
import { carteConnectee } from "@/lib/session";

export const metadata = { title: "Mon profil" };
export const dynamic = "force-dynamic";

const dateFr = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function PageProfil({ searchParams }: { searchParams: { maj?: string } }) {
  const carte = await carteConnectee();
  if (!carte) redirect("/connexion");

  return (
    <>
      <EnTete lienAccueil="/carte" />
      <main id="contenu" className="mx-auto max-w-md space-y-5 px-5 pb-16 pt-5">
        <Link href="/carte" className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-ink">
          ← Ma carte
        </Link>
        <h1 className="text-2xl font-bold">Mon profil</h1>

        {searchParams.maj && (
          <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
            Vos préférences sont enregistrées.
          </p>
        )}

        <section className="panneau space-y-1 text-sm">
          <p className="text-lg font-semibold">{carte.pseudo}</p>
          <p className="text-muted">
            {carte.logement.residence.nom} · UG {carte.logement.ug}
          </p>
          <p className="text-muted">Carte activée le {dateFr(carte.activeeLe)}</p>
        </section>

        <section className="panneau space-y-4" aria-labelledby="titre-donnees">
          <h2 id="titre-donnees" className="font-bold">
            Mes données
          </h2>
          <form action={majConsentementConso} className="space-y-3">
            <label className="flex gap-3 text-sm">
              <input type="checkbox" name="conso" defaultChecked={!!carte.consentConsommation} className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--green-600)]" />
              <span>Utiliser mes relevés d&apos;eau, de gaz et d&apos;électricité pour calculer mes économies.</span>
            </label>
            <button type="submit" className="btn-secondaire">
              Enregistrer
            </button>
          </form>
          <a href="/api/mes-donnees" className="btn-secondaire" download>
            Télécharger mes données
          </a>
          <Link href="/cgu" className="block text-center text-sm font-semibold text-green-text underline">
            Politique de confidentialité
          </Link>
        </section>

        <form action={deconnexion}>
          <button type="submit" className="btn-secondaire">
            Me déconnecter
          </button>
        </form>

        <details className="panneau">
          <summary className="cursor-pointer font-semibold">Supprimer ma Green Card</summary>
          <p className="my-3 text-sm text-muted">
            Vos GreenPoints, votre progression et vos données seront effacés définitivement. Pour recréer une carte, il faudra demander un
            nouveau code d&apos;activation à votre agence.
          </p>
          <FormSuppression />
        </details>
      </main>
    </>
  );
}
