import Link from "next/link";
import { EcranElan } from "@/components/compagnon/EcranElan";
import { Montres } from "@/components/compagnon/Montres";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CONNEXIONS_COMPAGNON, SIGNAUX_COMPAGNON } from "@/lib/compagnon";

/** Le Compagnon, cœur du projet : les six signaux, le téléphone, la montre. */
export function SectionCompagnon({ titreNiveau = "h2", lien = true }: { titreNiveau?: "h1" | "h2"; lien?: boolean }) {
  const Titre = titreNiveau;
  return (
    <section id="compagnon" className="border-t border-champagne/35 bg-nuit py-rythme text-ivoire">
      <div className="mx-auto grid max-w-[90rem] grid-cols-[minmax(0,1fr)] items-start gap-16 px-6 md:px-10 lg:grid-cols-[1.35fr_1fr] xl:px-24">
        <div className="space-y-9">
          <Eyebrow surSombre>Le Compagnon · le cœur du projet</Eyebrow>
          <Titre className="font-serif text-titre font-extrabold">
            Votre corps sait.
            <br />
            <span className="font-normal italic text-champagne">Le Compagnon écoute.</span>
          </Titre>
          <p className="max-w-xl text-lg leading-relaxed text-ivoire/80">
            Chaque jour, il réunit ce que dit votre corps et ce que vous ressentez, puis le traduit en un seul signal : votre élan.
          </p>
          <dl className="grid border-t border-champagne/40 sm:grid-cols-2">
            {SIGNAUX_COMPAGNON.map((s, i) => (
              <div key={s.nom} className={`flex items-baseline gap-4 border-b border-champagne/20 py-4 ${i % 2 === 0 ? "sm:pr-5" : "sm:pl-5"}`}>
                <dt className={`min-w-[8.5rem] font-serif text-2xl ${"synthese" in s ? "italic text-champagne" : "font-extrabold"}`}>{s.nom}</dt>
                <dd className="text-sm text-ivoire/65">{s.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-champagne">{CONNEXIONS_COMPAGNON}</p>
          <Montres className="justify-start" />
          {lien && (
            <div className="flex flex-wrap gap-4">
              <Link href="/compagnon" className="bg-champagne px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-nuit transition-colors hover:bg-ivoire">
                Découvrir le Compagnon
              </Link>
              <Link href="/connexion" className="border border-ivoire/50 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-champagne hover:text-champagne">
                Se connecter
              </Link>
            </div>
          )}
        </div>
        <EcranElan className="mx-auto lg:ml-auto lg:mr-0" />
      </div>
    </section>
  );
}
