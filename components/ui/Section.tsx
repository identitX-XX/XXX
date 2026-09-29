type Props = {
  children: React.ReactNode;
  id?: string;
  /** Alterner les fonds marque le changement d'idée. */
  ton?: "ivoire" | "sable" | "nuit" | "bordeaux";
  etroit?: boolean;
  className?: string;
};

// Esprit minimaliste : un seul fond, l'ivoire. Les « tons » ne sont plus que
// des séparations par filet ; la hiérarchie vient du blanc et de la typographie.
const TONS = {
  ivoire: "bg-ivoire text-encre",
  sable: "bg-ivoire text-encre border-t border-filet",
  nuit: "bg-ivoire text-encre border-t border-filet",
  bordeaux: "bg-ivoire text-encre border-t border-filet",
};

/** Wrapper de rythme vertical : une section = une idée = un écran. */
export function Section({ children, id, ton = "ivoire", etroit, className = "" }: Props) {
  return (
    <section id={id} className={`relative ${TONS[ton]} py-rythme ${className}`}>
      <div className={`relative mx-auto px-6 md:px-10 ${etroit ? "max-w-lecture" : "max-w-page"}`}>{children}</div>
    </section>
  );
}
