import type { Metadata } from "next";
import Link from "next/link";
import { CadreCompte } from "@/components/compte/CadreCompte";
import { FormulaireCompte } from "@/components/compte/FormulaireCompte";

export const metadata: Metadata = { title: "Se connecter", description: "Accédez au Compagnon avec votre e-mail et votre mot de passe.", robots: { index: false } };

export default function Connexion() {
  return (
    <CadreCompte
      titre={
        <>
          Le <span className="font-normal italic text-bordeaux">Compagnon</span>
        </>
      }
      sousTitre="Retrouvez votre élan là où vous l'avez laissé."
      pied={
        <>
          <p>
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-semibold text-encre underline decoration-bordeaux underline-offset-4">
              Créer mon compte
            </Link>
          </p>
          <p className="text-xs text-gris">Connexion sécurisée. Vos données de santé restent chiffrées et privées.</p>
        </>
      }
    >
      <FormulaireCompte mode="connexion" />
    </CadreCompte>
  );
}
