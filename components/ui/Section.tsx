type Props = {
  children: React.ReactNode;
  id?: string;
  /** Alterner les fonds marque le changement d'idée. */
  ton?: "ivoire" | "sable" | "nuit" | "bordeaux";
  etroit?: boolean;
  className?: string;
};

const TONS = {
  ivoire: "bg-ivoire text-encre",
  sable: "bg-sable text-encre",
  nuit: "bg-nuit text-ivoire",
  bordeaux: "bg-bordeaux text-ivoire",
};

/** Wrapper de rythme vertical : une section = une idée = un écran. */
export function Section({ children, id, ton = "ivoire", etroit, className = "" }: Props) {
  return (
    <section id={id} className={`relative ${TONS[ton]} py-rythme ${className}`}>
      <div className={`relative mx-auto px-6 md:px-10 ${etroit ? "max-w-lecture" : "max-w-page"}`}>{children}</div>
    </section>
  );
}
