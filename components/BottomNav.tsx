"use client";

// Barre d'onglets persistante (mobile) — le geste « classe mondiale » qui règle
// la découvrabilité : les destinations qui comptent, toujours visibles, jamais
// cachées dans le menu burger. Le 5e onglet ouvre le menu complet pour le reste.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, MessageCircle, Menu } from "lucide-react";

const TABS = [
  { href: "/aujourdhui", label: "Aujourd'hui", icon: Home },
  { href: "/parcours-archetypes", label: "Ma quête", icon: Compass },
  { href: "/scenarios", label: "Scénarios", icon: Sparkles },
  { href: "/coach", label: "Coach", icon: MessageCircle },
];

export function BottomNav({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/aujourdhui" ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 backdrop-blur lg:hidden"
      aria-label="Navigation principale"
    >
      {TABS.map((t) => {
        const active = isActive(t.href);
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors"
            style={{ color: active ? "var(--fuchsia)" : "var(--muted)" }}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
            <span className="text-[10px] font-medium tracking-tight">{t.label}</span>
          </Link>
        );
      })}
      <button
        onClick={onMenu}
        aria-label="Ouvrir le menu"
        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-muted transition-colors"
      >
        <Menu size={20} strokeWidth={1.8} />
        <span className="text-[10px] font-medium tracking-tight">Menu</span>
      </button>
    </nav>
  );
}
