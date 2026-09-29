import type { Metadata } from "next";
import Link from "next/link";
import { CadreCompte } from "@/components/compte/CadreCompte";
import { FormulaireCompte } from "@/components/compte/FormulaireCompte";

export const metadata: Metadata = { title: "Créer un compte", description: "Créez votre compte Compagnon : e-mail et mot de passe.", robots: { index: false } };

export default function Inscription() {
  return (
    <CadreCompte
      titre={
        <>
          Créer votre <span className="font-normal italic text-bordeaux">compte.</span>
        </>
      }
      sousTitre="Le Compagnon, le Cercle et les rituels, dans un seul espace."
      pied={
        <p>
          Déjà membre ?{" "}
          <Link href="/connexion" className="font-semibold text-encre underline decoration-bordeaux underline-offset-4">
            Se connecter
          </Link>
        </p>
      }
    >
      <FormulaireCompte mode="inscription" />
    </CadreCompte>
  );
}
