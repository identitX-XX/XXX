type Props = { children: React.ReactNode; as?: "p" | "span"; surSombre?: boolean };

/** Surtitre : capitales très espacées. Bordeaux sur clair, or sur sombre. */
export function Eyebrow({ children, as: Tag = "p", surSombre }: Props) {
  return (
    <Tag
      className={`text-xs font-semibold uppercase tracking-[0.3em] ${surSombre ? "text-champagne" : "text-bordeaux"}`}
    >
      {children}
    </Tag>
  );
}
