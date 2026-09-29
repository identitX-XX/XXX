"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const NAV = [
  { href: "/journal", label: "Journal" },
  { href: "/rencontrer", label: "Rencontrer" },
  { href: "/mai-diaw", label: "Maï Diaw" },
];

export function Header() {
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();

  // Referme le menu à chaque navigation, bloque le scroll quand il est ouvert.
  useEffect(() => setOuvert(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = ouvert ? "hidden" : "";
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", echap);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", echap);
    };
  }, [ouvert]);

  // L'overlay est rendu HORS du <header> : le backdrop-blur du header crée un
  // bloc conteneur qui piégerait un enfant `fixed` dans ses 64px de hauteur.
  return (
    <>
    <header className="sticky top-0 z-40 border-b border-filet bg-ivoire/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-6">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          {site.nom}
          <span className="text-bronze">.</span>
        </Link>

        <nav aria-label="Principale" className="hidden items-center gap-10 md:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
              className="text-sm uppercase tracking-[0.14em] text-gris transition-colors hover:text-encre aria-[current=page]:text-encre"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/appel" className="text-sm uppercase tracking-[0.14em] text-bronze hover:text-bronze-fonce">
            L&apos;appel
          </Link>
        </nav>

        <button
          type="button"
          className="text-sm uppercase tracking-[0.14em] md:hidden"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          onClick={() => setOuvert((o) => !o)}
        >
          {ouvert ? "Fermer" : "Menu"}
        </button>
      </div>
    </header>

      {ouvert && (
        <nav
          id="menu-mobile"
          aria-label="Principale"
          className="fixed inset-0 top-16 z-40 flex flex-col justify-between bg-ivoire px-6 pb-12 pt-10 md:hidden"
        >
          <ul className="space-y-6">
            {[...NAV, { href: "/appel", label: "L'appel" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-serif text-5xl">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gris">{site.signature}</p>
        </nav>
      )}
    </>
  );
}
