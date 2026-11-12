import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoCDC, LogoGreenCard } from "@/components/Logo";
import { carteConnectee } from "@/lib/session";

export default async function Accueil({ searchParams }: { searchParams: { supprime?: string } }) {
  if (await carteConnectee()) redirect("/carte");

  return (
    <main id="contenu" className="mx-auto flex min-h-dvh max-w-md flex-col bg-gradient-to-b from-surface to-green-100 px-6 pb-8 pt-16">
      {searchParams.supprime && (
        <p role="status" className="mb-6 rounded-2xl bg-surface p-4 text-center text-sm">
          Votre Green Card et vos données ont été supprimées.
        </p>
      )}

      <div className="flex flex-1 flex-col items-center justify-center animate-monte">
        <h1 className="sr-only">Green Card</h1>
        <LogoGreenCard taille="lg" signature />
        <p className="mt-8 max-w-xs text-center text-base text-muted">
          Relevez les <strong className="text-ink">10 défis</strong> éco-gestes, gagnez des <strong className="text-green-text">GreenPoints</strong> et
          faites gagner votre immeuble.
        </p>
      </div>

      <div className="space-y-3">
        <Link href="/activer" className="btn-primaire">
          Activer ma Green Card
        </Link>
        <Link href="/connexion" className="btn-secondaire">
          J&apos;ai déjà ma carte
        </Link>
      </div>

      <footer className="mt-10 flex flex-col items-center gap-2 text-xs text-muted">
        une initiative
        <LogoCDC variante="complet" hauteur={40} />
      </footer>
    </main>
  );
}
