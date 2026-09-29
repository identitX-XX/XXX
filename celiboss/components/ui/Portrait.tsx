import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Point focal (object-position) : garde le visage dans le cadre. */
  focus?: string;
  /** Zoom léger pour resserrer le cadrage sur la personne. */
  zoom?: number;
  legende?: string;
  priority?: boolean;
  /** Filet champagne décalé derrière la photo : signature éditoriale. */
  filet?: "gauche" | "droite";
  className?: string;
};

/** Photo portrait 4:5, cadrée serré, avec un filet décalé en arrière-plan. */
export function Portrait({ src, alt, focus = "50% 30%", zoom = 1, legende, priority, filet = "droite", className = "" }: Props) {
  const decalage = filet === "droite" ? "translate-x-4 translate-y-4" : "-translate-x-4 translate-y-4";
  return (
    <figure className={`relative ${className}`}>
      <div aria-hidden className={`absolute inset-0 border border-champagne ${decalage}`} />
      <div className="relative aspect-[4/5] overflow-hidden bg-sable">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
          style={{ objectPosition: focus, transform: `scale(${zoom})`, transformOrigin: focus }}
        />
      </div>
      {legende && <figcaption className="mt-8 font-serif text-lg italic text-gris">{legende}</figcaption>}
    </figure>
  );
}
