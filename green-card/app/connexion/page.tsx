import Link from "next/link";
import { FormConnexion } from "@/components/Formulaires";
import { GabaritParcours } from "@/components/Gabarit";
import { db } from "@/lib/db";

export const metadata = { title: "Me connecter" };
export const dynamic = "force-dynamic";

export default async function PageConnexion() {
  const residences = await db.residence.findMany({
    select: { id: true, nom: true, ville: true, codePostal: true },
    orderBy: { nom: "asc" },
  });

  return (
    <GabaritParcours titre="Retrouvez votre Green Card">
      <FormConnexion residences={residences} />
      <p className="mt-6 text-center text-sm text-muted">
        Code PIN oublié ? Contactez votre agence CDC Habitat pour recevoir un nouveau code d&apos;activation.
      </p>
      <p className="mt-3 text-center text-sm text-muted">
        Pas encore de carte ?{" "}
        <Link href="/activer" className="font-semibold text-green-text underline">
          L&apos;activer
        </Link>
      </p>
    </GabaritParcours>
  );
}
