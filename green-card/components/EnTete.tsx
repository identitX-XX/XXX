import Link from "next/link";
import { LogoCDC, LogoGreenCard } from "./Logo";

/** En-tête de l'appli : liseré rouge CDC, Green Card à gauche, CDC Habitat à droite. */
export function EnTete({ lienAccueil = "/", droite }: { lienAccueil?: string; droite?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="h-1 bg-cdc-red" aria-hidden />
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Link href={lienAccueil} aria-label="Green Card, accueil">
          <LogoGreenCard taille="sm" />
        </Link>
        <div className="flex items-center gap-3">
          {droite}
          <LogoCDC hauteur={20} />
        </div>
      </div>
    </header>
  );
}
