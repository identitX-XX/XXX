"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA } from "@/components/ui/CTA";
import { Wordmark } from "@/components/ui/Wordmark";
import { NAV } from "@/lib/navigation";
import { site } from "@/lib/site";

function IconeCompte() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-champagne">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export function Header() {
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();

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
  // bloc conteneur qui piégerait un enfant `fixed` dans ses 88px de hauteur.
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-champagne/35 bg-nuit/95 text-ivoire backdrop-blur">
        <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between px-6 md:px-10 xl:h-[5.5rem] xl:px-24">
          <Link href="/" className="text-[1.7rem] xl:text-3xl" aria-label={`${site.nom}, accueil`}>
            <Wordmark />
          </Link>

          <nav aria-label="Principale" className="hidden items-center gap-9 xl:flex">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                className="border-b border-transparent py-1.5 text-xs font-medium uppercase tracking-[0.22em] transition-colors hover:text-champagne aria-[current=page]:border-champagne aria-[current=page]:text-champagne"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-7 xl:flex">
            <Link href="/connexion" className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] hover:text-champagne">
              <IconeCompte />
              Se connecter
            </Link>
            <CTA ton="or" court />
          </div>

          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-[0.2em] xl:hidden"
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
          className="fixed inset-0 top-[4.5rem] z-40 flex flex-col justify-between overflow-y-auto bg-nuit px-6 pb-10 pt-6 text-ivoire xl:hidden"
        >
          <ul className="divide-y divide-champagne/25 border-y border-champagne/25">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-4 font-serif text-4xl font-semibold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/connexion" className="flex items-center gap-3 py-4 text-sm font-medium uppercase tracking-[0.22em]">
                <IconeCompte />
                Se connecter
              </Link>
            </li>
          </ul>
          <div className="mt-10 space-y-6">
            <CTA ton="or" pleine />
            <p className="text-center font-serif text-lg italic text-champagne">{site.devise}</p>
          </div>
        </nav>
      )}
    </>
  );
}
