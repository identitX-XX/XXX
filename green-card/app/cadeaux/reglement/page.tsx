import { GabaritParcours } from "@/components/Gabarit";
import { CATALOGUE, TIRAGE_SAISON } from "@/lib/cadeaux";

export const metadata = { title: "Règlement des cadeaux" };

/** Texte provisoire : à faire valider par le service juridique de CDC Habitat avant le lancement. */
export default function PageReglement() {
  const cloture = new Date(TIRAGE_SAISON.clotureLe).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <GabaritParcours titre="Règlement des cadeaux et du grand tirage" retour="/cadeaux">
      <div className="space-y-5 text-sm leading-relaxed">
        <p className="rounded-2xl bg-alert-bg p-4 font-medium text-alert">Version provisoire, en attente de validation par le service juridique de CDC Habitat.</p>
        <section>
          <h2 className="mb-1 text-base font-bold">1. Organisateur et participants</h2>
          <p>
            Le programme Green Card est organisé par CDC Habitat. Il est ouvert gratuitement, sans obligation d&apos;achat, aux foyers locataires ayant
            activé leur Green Card. Une seule carte par logement.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-bold">2. La boutique</h2>
          <ul className="list-disc space-y-1 pl-5">
            {CATALOGUE.filter((c) => c.type === "boutique").map((c) => (
              <li key={c.id}>
                {c.nom} : {c.prix} GreenPoints{c.stock ? ` (${c.stock} exemplaires au lancement)` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-2">
            Un exemplaire de chaque cadeau par foyer, dans la limite des stocks. Les GreenPoints échangés sont déduits du solde disponible ; le niveau de la
            carte et les médailles ne sont pas modifiés. Une commande peut être annulée tant qu&apos;elle n&apos;est pas en préparation. Les cadeaux se
            retirent au bureau du gardien ou à l&apos;agence, sur présentation du code de retrait. Ils ne sont ni échangeables ni convertibles en argent.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-bold">3. Le grand tirage</h2>
          <p>
            Lot : une semaine de séjour pour le foyer gagnant dans un appartement CDC Habitat (dates et lieu selon les disponibilités, à convenir avec
            l&apos;agence ; le transport n&apos;est pas compris). Participation : foyers dont la Green Card est Gold (les 10 défis réussis au moins en
            bronze), inscrits avant le {cloture}. Chaque foyer inscrit a la même chance de gagner, quel que soit son nombre de GreenPoints. Le tirage au sort
            a lieu à la clôture, sous contrôle à définir (témoin ou commissaire de justice). L&apos;éligibilité est vérifiée au moment du tirage. Le gagnant
            est prévenu par son agence et son pseudo est affiché dans l&apos;application.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-bold">4. Loyauté</h2>
          <p>
            Toute déclaration manifestement fausse ou tentative de triche peut entraîner l&apos;annulation des points et l&apos;exclusion du tirage. Le
            programme n&apos;a aucun effet sur le bail ni sur les charges.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-bold">5. Données personnelles</h2>
          <p>
            Aucune adresse postale n&apos;est collectée pour les cadeaux : ils sont remis sur place. Les données du programme sont traitées selon la
            politique de confidentialité de Green Card.
          </p>
        </section>
      </div>
    </GabaritParcours>
  );
}
