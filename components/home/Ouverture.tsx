import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LuneEtoile } from "@/components/ui/Symboles";

/** Ouverture : ciel de nuit, les affinités électives, la lune et l'étoile. */
export function Ouverture() {
  return (
    <section className="relative overflow-hidden bg-nuit text-ivoire">
      <div className="relative mx-auto grid max-w-[90rem] items-center gap-14 px-6 pb-24 pt-20 md:px-10 lg:grid-cols-[1.4fr_1fr] lg:pb-32 lg:pt-28 xl:px-24">
        <div className="space-y-9">
          <Eyebrow surSombre>Média · Réseau · Rituels</Eyebrow>
          <h1 className="font-serif text-manifeste font-medium">
            Les affinités
            <br />
            <span className="font-normal italic text-champagne">électives.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ivoire/80 md:text-xl">
            Un média et un cercle privé pour se relier aux autres, à son corps et à son intuition. Sous le regard de
            Maï Diaw, matchmakeuse d&apos;exception.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/inscription" className="bg-ivoire px-8 py-5 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-nuit transition-colors hover:bg-champagne">
              Rejoindre le Cercle
            </Link>
            <Link href="/journal" className="border border-ivoire/50 px-8 py-5 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-champagne hover:text-champagne">
              Lire le Journal
            </Link>
          </div>
        </div>
        <figure className="flex flex-col items-center gap-6">
          <div className="relative flex aspect-square w-full max-w-[28rem] items-center justify-center rounded-full border border-champagne/25 text-champagne">
            <LuneEtoile taille={220} className="w-2/5" />
          </div>
          <figcaption className="text-center">
            <p className="font-serif text-xl italic text-champagne">Osram ne Nsoromma — la lune et l&apos;étoile</p>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ivoire/60">Symbole adinkra de l&apos;amour, de la fidélité et de l&apos;harmonie.</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
