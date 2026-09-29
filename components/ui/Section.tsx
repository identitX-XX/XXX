type Props = {
  children: React.ReactNode;
  id?: string;
  /** "sable" pour alterner les fonds et marquer le changement d'idée. */
  ton?: "ivoire" | "sable" | "encre";
  etroit?: boolean;
  className?: string;
};

const TONS = {
  ivoire: "bg-ivoire text-encre",
  sable: "bg-sable text-encre",
  encre: "bg-encre text-ivoire",
};

/** Wrapper de rythme vertical : une section = une idée = un écran. */
export function Section({ children, id, ton = "ivoire", etroit, className = "" }: Props) {
  return (
    <section id={id} className={`${TONS[ton]} py-rythme ${className}`}>
      <div className={`mx-auto px-6 ${etroit ? "max-w-lecture" : "max-w-page"}`}>{children}</div>
    </section>
  );
}
