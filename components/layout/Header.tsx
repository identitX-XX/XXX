"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA } from "@/components/ui/CTA";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/lib/site";

const NAV = [
  { href: "/rencontrer", label: "Rencontrer" },
  { href: "/journal", label: "Journal" },
  { href: "/programmes", label: "Programmes" },
  { href: "/evenements", label: "Événements" },
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
        <Link href="/" className="text-2xl text-encre" aria-label={`${site.nom}, accueil`}>
          <Wordmark />
        </Link>

        <nav aria-label="Principale" className="hidden items-center gap-8 lg:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
              className="relative py-2 text-xs uppercase tracking-[0.18em] text-gris transition-colors hover:text-encre aria-[current=page]:text-encre after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-bordeaux after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/appel"
            className="border border-bordeaux px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-bordeaux transition-colors hover:bg-bordeaux hover:text-ivoire"
          >
            L&apos;appel découverte
          </Link>
        </nav>

        <button
          type="button"
          className="text-xs uppercase tracking-[0.18em] lg:hidden"
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
          className="fixed inset-0 top-16 z-40 flex flex-col justify-between overflow-y-auto bg-ivoire px-6 pb-10 pt-8 lg:hidden"
        >
          <ul className="divide-y divide-filet border-y border-filet">
            {NAV.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} className="flex items-baseline gap-4 py-4 font-serif text-4xl">
                  <span className="font-sans text-xs text-taupe">0{i + 1}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-6">
            <CTA pleine />
            <p className="text-center font-serif text-lg italic text-gris">{site.devise}</p>
          </div>
        </nav>
      )}
    </>
  );
}
