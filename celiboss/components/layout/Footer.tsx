import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { CONTACT_EMAIL, INSTAGRAM } from "@/lib/links";
import { site } from "@/lib/site";

const COLONNES = [
  {
    titre: "L'univers",
    liens: [
      { href: "/rencontrer", label: "Rencontrer" },
      { href: "/journal", label: "Le Journal" },
      { href: "/programmes", label: "Programmes" },
      { href: "/evenements", label: "Événements" },
    ],
  },
  {
    titre: "La maison",
    liens: [
      { href: "/mai-diaw", label: "Maï Diaw" },
      { href: "/appel", label: "L'appel découverte" },
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
    <footer className="bg-encre text-ivoire">
      <div className="mx-auto grid max-w-page gap-14 px-6 pb-10 pt-20 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Wordmark className="text-4xl text-ivoire" />
          <p className="mt-4 max-w-xs font-serif text-lg italic leading-snug text-ivoire/70">{site.devise}</p>
          <ul className="mt-8 flex gap-6 text-sm text-ivoire/60">
            {INSTAGRAM && (
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-ivoire">
                  Instagram
                </a>
              </li>
            )}
            {CONTACT_EMAIL && (
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ivoire">
                  {CONTACT_EMAIL}
                </a>
              </li>
            )}
          </ul>
        </div>
        {COLONNES.map((c) => (
          <nav key={c.titre} aria-label={c.titre}>
            <p className="text-eyebrow uppercase text-champagne">{c.titre}</p>
            <ul className="mt-6 space-y-3 text-sm text-ivoire/70">
              {c.liens.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-ivoire">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-page px-6">
      <div className="flex flex-col gap-2 border-t border-ivoire/10 py-6 text-xs text-ivoire/40 md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} CéliBOSS™ — {site.signature}
        </p>
        <p>Aucun cookie de mesure ni de publicité.</p>
      </div>
      </div>
    </footer>
  );
}
