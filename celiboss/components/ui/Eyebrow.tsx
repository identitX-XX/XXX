type Props = { children: React.ReactNode; as?: "p" | "span"; surSombre?: boolean };

/** Surtitre : filet + petites capitales. Bordeaux sur clair, champagne sur sombre. */
export function Eyebrow({ children, as: Tag = "p", surSombre }: Props) {
  return (
    <Tag
      className={`flex items-center gap-4 text-eyebrow font-medium uppercase ${surSombre ? "text-champagne" : "text-bordeaux"}`}
    >
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      {children}
    </Tag>
  );
}
