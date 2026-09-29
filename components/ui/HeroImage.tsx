import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Texte superposé, optionnel. */
  children?: React.ReactNode;
};

/** Photo pleine largeur, chargée en priorité (LCP). */
export function HeroImage({ src, alt, children }: Props) {
  return (
    <div className="relative h-[70svh] min-h-[28rem] w-full overflow-hidden bg-sable">
      <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
      {children && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-encre/70 via-encre/10 to-transparent">
          <div className="mx-auto w-full max-w-page px-6 pb-12 text-ivoire">{children}</div>
        </div>
      )}
    </div>
  );
}
