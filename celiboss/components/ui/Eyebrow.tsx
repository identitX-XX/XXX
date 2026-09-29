export function Eyebrow({ children, as: Tag = "p" }: { children: React.ReactNode; as?: "p" | "span" }) {
  return <Tag className="text-eyebrow font-medium uppercase text-bronze">{children}</Tag>;
}
