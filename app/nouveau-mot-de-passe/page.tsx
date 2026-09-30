import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CadreCompte } from "@/components/compte/CadreCompte";
import { FormulaireNouveau } from "@/components/compte/FormulairesMotDePasse";
import { supabaseConfigure } from "@/lib/supabase/config";
import { utilisateurCourant } from "@/lib/supabase/serveur";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false } };
export const dynamic = "force-dynamic";

// On arrive ici depuis le lien reçu par e-mail : la session de récupération
// est déjà ouverte par /auth/confirmer.
export default async function NouveauMotDePasse() {
  if (!supabaseConfigure || !(await utilisateurCourant())) redirect("/mot-de-passe-oublie");
  return (
    <CadreCompte
      titre={
        <>
          Nouveau <span className="font-normal italic text-bordeaux">mot de passe.</span>
        </>
      }
      sousTitre="12 caractères minimum, dont un chiffre."
      pied={null}
    >
      <FormulaireNouveau />
    </CadreCompte>
  );
}
