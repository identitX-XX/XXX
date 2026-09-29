import Image from "next/image";
import { LuneEtoile } from "@/components/ui/Symboles";

type Props = {
  src: string;
  alt: string;
  focus?: string;
  priority?: boolean;
  /** Filet or décalé derrière la photo. */
  filet?: "gauche" | "droite";
  /** Médaillon lune-étoile posé sur le coin. */
  embleme?: boolean;
  legende?: React.ReactNode;
  className?: string;
};

/** Photo 4:5 cadrée serré, filet or décalé, médaillon optionnel. */
export function Portrait({ src, alt, focus = "50% 25%", priority, filet = "droite", embleme, legende, className = "" }: Props) {
  const decalage = filet === "droite" ? "left-[18px] -right-[18px]" : "-left-[18px] right-[18px]";
  return (
    <figure className={`relative ${className}`}>
      <div className="relative">
        <div aria-hidden className={`absolute top-[18px] -bottom-[18px] border border-champagne ${decalage}`} />
        <div className="relative aspect-[4/5] overflow-hidden bg-sable">
          <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" style={{ objectPosition: focus }} />
        </div>
        {embleme && (
          <div className="absolute -left-6 bottom-12 flex h-24 w-24 items-center justify-center rounded-full border border-filet bg-ivoire text-bordeaux md:-left-11 md:h-[6.5rem] md:w-[6.5rem]">
            <LuneEtoile taille={64} />
          </div>
        )}
      </div>
      {legende && <figcaption className="mt-10 flex items-baseline justify-between border-t border-encre pt-3.5">{legende}</figcaption>}
    </figure>
  );
}
