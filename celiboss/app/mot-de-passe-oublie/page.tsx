import type { Metadata } from "next";
import Link from "next/link";
import { CadreCompte } from "@/components/compte/CadreCompte";
import { FormulaireOubli } from "@/components/compte/FormulairesMotDePasse";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false } };

export default function MotDePasseOublie() {
  return (
    <CadreCompte
      titre={
        <>
          Mot de passe <span className="font-normal italic text-bordeaux">oublié.</span>
        </>
      }
      sousTitre="Indiquez votre e-mail : nous vous envoyons un lien pour en choisir un nouveau."
      pied={
        <Link href="/connexion" className="underline decoration-filet underline-offset-4">
          Retour à la connexion
        </Link>
      }
    >
      <FormulaireOubli />
    </CadreCompte>
  );
}
