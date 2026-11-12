import { GabaritParcours } from "@/components/Gabarit";

export const metadata = { title: "Conditions et confidentialité" };

/** Texte provisoire : à faire valider par le service juridique et le DPO de CDC Habitat. */
export default function PageCGU() {
  return (
    <GabaritParcours titre="Conditions d'utilisation et confidentialité">
      <div className="space-y-5 text-sm leading-relaxed">
        <p className="rounded-2xl bg-alert-bg p-4 font-medium text-alert">
          Version provisoire, en attente de validation par le service juridique et le DPO de CDC Habitat.
        </p>
        <section>
          <h2 className="mb-1 text-base font-bold">Le service</h2>
          <p>
            Green Card est un programme gratuit proposé par CDC Habitat à ses locataires pour encourager les éco-gestes. La participation est
            libre et n&apos;a aucun effet sur votre bail ou vos charges.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-bold">Les données que nous utilisons</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Votre résidence et votre n° d&apos;UG, pour vérifier que vous êtes locataire.</li>
            <li>Le pseudo de votre carte, visible dans les classements.</li>
            <li>Votre progression dans les défis et vos GreenPoints.</li>
            <li>Vos relevés de consommation, seulement si vous l&apos;acceptez.</li>
          </ul>
          <p className="mt-2">Nous ne vendons ni ne cédons aucune donnée. Les bilans transmis à CDC Habitat sont agrégés et anonymes.</p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-bold">Vos droits</h2>
          <p>
            Depuis votre profil, vous pouvez télécharger vos données, retirer votre consentement et supprimer votre carte à tout moment.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-bold">Cadeaux</h2>
          <p>Les cadeaux sont attribués selon un règlement de jeu publié séparément.</p>
        </section>
      </div>
    </GabaritParcours>
  );
}
