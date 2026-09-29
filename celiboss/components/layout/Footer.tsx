import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { CONTACT_EMAIL, INSTAGRAM } from "@/lib/links";
import { site } from "@/lib/site";

const COLONNES = [
  {
    titre: "L'univers",
    liens: [
      { href: "/journal", label: "Le Journal" },
      { href: "/compagnon", label: "Le Compagnon" },
      { href: "/rencontrer", label: "Rencontrer" },
      { href: "/programmes", label: "Programmes & événements" },
    ],
  },
  {
    titre: "La maison",
    liens: [
      { href: "/mai-diaw", label: "Maï Diaw" },
      { href: "/manifeste", label: "Le manifeste" },
      { href: "/appel", label: "L'appel découverte" },
      { href: "/connexion", label: "Se connecter" },
    ],
  },
  {
    titre: "Informations",
    liens: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-filet bg-ivoire text-gris">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-6 pb-10 pt-16 md:px-10 lg:grid-cols-[1.6fr_repeat(3,1fr)] xl:px-24">
        <div className="space-y-3">
          <Wordmark className="text-4xl text-encre" />
          <p className="font-serif text-lg italic text-bordeaux">{site.devise}</p>
          <ul className="flex flex-wrap gap-6 pt-4 text-sm">
            {INSTAGRAM && (
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-encre">
                  Instagram
                </a>
              </li>
            )}
            {CONTACT_EMAIL && (
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-encre">
                  {CONTACT_EMAIL}
                </a>
              </li>
            )}
          </ul>
        </div>
        {COLONNES.map((c) => (
          <nav key={c.titre} aria-label={c.titre} className="flex flex-col gap-2.5 text-sm">
            <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-bordeaux">{c.titre}</p>
            {c.liens.map((l) => (
              <Link key={l.href} href={l.href} className="text-gris transition-colors hover:text-encre">
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-[90rem] px-6 md:px-10 xl:px-24">
        <div className="flex flex-col gap-2 border-t border-filet py-6 text-xs text-gris md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} CéliBOSS™ · {site.signature}</p>
          <p>Aucun cookie de mesure ni de publicité.</p>
        </div>
      </div>
    </footer>
  );
}
