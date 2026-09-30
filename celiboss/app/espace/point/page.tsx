import { redirect } from "next/navigation";
import { FormulairePoint } from "@/components/espace/FormulairePoint";
import { chargerEspace } from "@/lib/compagnon/donnees";

export const metadata = { title: "Point du matin" };

export default async function PointDuMatin() {
  const d = await chargerEspace();
  if (!d) redirect("/connexion?suite=/espace/point");
  return (
    <div className="mx-auto max-w-[90rem] space-y-14 px-6 pb-rythme pt-14 md:px-10 xl:px-24">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bordeaux">Point du matin</p>
        <h1 className="font-serif text-titre font-medium">
          Comment allez-vous, <span className="font-normal italic text-bordeaux">vraiment ?</span>
        </h1>
        <p className="text-gris">Une minute. Répondez à ce qui vous parle : chaque signal compte, aucun n&apos;est obligatoire.</p>
      </header>
      <FormulairePoint jour={d.jour} point={d.duJour?.point ?? null} sante={Boolean(d.profil?.sante_consentie_le)} />
    </div>
  );
}
