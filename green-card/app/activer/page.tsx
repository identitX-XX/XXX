import Link from "next/link";
import { FormActivation } from "@/components/Formulaires";
import { GabaritParcours } from "@/components/Gabarit";
import { db } from "@/lib/db";

export const metadata = { title: "Activer ma carte" };
export const dynamic = "force-dynamic";

export default async function PageActivation() {
  const residences = await db.residence.findMany({
    select: { id: true, nom: true, ville: true, codePostal: true },
    orderBy: { nom: "asc" },
  });

  return (
    <GabaritParcours titre="Activez votre Green Card" etape="Étape 1 sur 2 · Votre logement">
      <p className="mb-6 text-muted">Munissez-vous du courrier « Green Card » envoyé par CDC Habitat.</p>
      <FormActivation residences={residences} />
      <p className="mt-6 text-center text-sm text-muted">
        Déjà activée ?{" "}
        <Link href="/connexion" className="font-semibold text-green-text underline">
          Me connecter
        </Link>
      </p>
    </GabaritParcours>
  );
}
