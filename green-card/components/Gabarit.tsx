import Link from "next/link";
import { EnTete } from "./EnTete";

/** Gabarit des écrans d'activation et de connexion. */
export function GabaritParcours({
  titre,
  etape,
  retour = "/",
  children,
}: {
  titre: string;
  etape?: string;
  retour?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <EnTete />
      <main id="contenu" className="mx-auto max-w-md px-5 pb-16 pt-6">
        <Link href={retour} className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-ink">
          ← Retour
        </Link>
        {etape && <p className="mt-2 text-sm font-semibold text-green-text">{etape}</p>}
        <h1 className="mb-6 mt-1 text-2xl font-bold leading-tight">{titre}</h1>
        {children}
      </main>
    </>
  );
}
