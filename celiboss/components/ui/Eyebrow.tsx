type Props = { children: React.ReactNode; as?: "p" | "span"; surSombre?: boolean };

/** Surtitre : filet + capitales très espacées. Bordeaux sur clair, or sur sombre. */
export function Eyebrow({ children, as: Tag = "p", surSombre }: Props) {
  return (
    <Tag
      className={`flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] ${surSombre ? "text-champagne" : "text-bordeaux"}`}
    >
      <span aria-hidden className="h-px w-12 bg-current" />
      {children}
    </Tag>
  );
}
