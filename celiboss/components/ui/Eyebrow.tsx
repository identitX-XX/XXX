type Props = { children: React.ReactNode; as?: "p" | "span"; surSombre?: boolean };

/** Surtitre en petites capitales : bordeaux sur fond clair, champagne sur fond sombre. */
export function Eyebrow({ children, as: Tag = "p", surSombre }: Props) {
  return (
    <Tag className={`text-eyebrow font-medium uppercase ${surSombre ? "text-champagne" : "text-bordeaux"}`}>
      {children}
    </Tag>
  );
}
