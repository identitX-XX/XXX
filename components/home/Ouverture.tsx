import Link from "next/link";
import { LuneEtoile } from "@/components/ui/Symboles";

/** Ouverture : une phrase, une promesse, deux chemins. Rien d'autre. */
export function Ouverture() {
  return (
    <section className="bg-ivoire text-encre">
      <div className="mx-auto max-w-[90rem] px-6 pb-32 pt-24 md:px-10 lg:pb-44 lg:pt-36 xl:px-24">
        <LuneEtoile taille={40} className="text-bordeaux" />
        <h1 className="mt-10 max-w-4xl font-serif text-manifeste font-medium">
          Les affinités <span className="font-normal italic text-bordeaux">électives.</span>
        </h1>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-gris">
          Un média et un cercle privé pour se relier aux autres, à son corps et à son intuition. Par Maï Diaw, matchmakeuse d&apos;exception.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Link href="/inscription" className="bg-nuit px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivoire transition-colors hover:bg-bordeaux">
            Rejoindre le Cercle
          </Link>
          <Link href="/journal" className="text-xs font-semibold uppercase tracking-[0.2em] underline decoration-filet underline-offset-8 hover:decoration-bordeaux">
            Lire le Journal
          </Link>
        </div>
      </div>
    </section>
  );
}
