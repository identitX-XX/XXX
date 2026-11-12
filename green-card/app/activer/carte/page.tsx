import { redirect } from "next/navigation";
import { FormCreationCarte } from "@/components/Formulaires";
import { GabaritParcours } from "@/components/Gabarit";
import { db } from "@/lib/db";
import { verifierSignature } from "@/lib/securite";
import { lireCookieActivation } from "@/lib/session";

export const metadata = { title: "Créer ma carte" };

export default async function PageCreationCarte() {
  const ticket = verifierSignature<{ logementId: string }>(lireCookieActivation());
  if (!ticket) redirect("/activer");

  const logement = await db.logement.findUnique({ where: { id: ticket.logementId }, include: { residence: true } });
  if (!logement) redirect("/activer");

  return (
    <GabaritParcours titre="Personnalisez votre carte" etape="Étape 2 sur 2 · Votre carte" retour="/activer">
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-sm">
        <span aria-hidden className="text-2xl">✅</span>
        <p>
          Logement vérifié : <strong>{logement.residence.nom}</strong>, UG <strong>{logement.ug}</strong>
        </p>
      </div>
      <FormCreationCarte />
    </GabaritParcours>
  );
}
