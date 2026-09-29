import { CTA } from "@/components/ui/CTA";
import { CONTACT_EMAIL, INSTAGRAM } from "@/lib/links";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-encre text-ivoire">
      <div className="mx-auto max-w-page px-6 py-rythme">
        <p className="max-w-2xl font-serif text-titre">
          Vous ne cherchez pas. <span className="italic text-bronze">Vous choisissez.</span>
        </p>
        <div className="mt-10">
          <CTA ton="sombre" />
        </div>
      </div>

      <div className="border-t border-ivoire/15">
        <div className="mx-auto flex max-w-page flex-col gap-6 px-6 py-8 text-sm text-ivoire/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nom} — {site.signature}
          </p>
          <ul className="flex flex-wrap gap-6">
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
                  Contact
                </a>
              </li>
            )}
            {/* ⚠️ Mentions légales + confidentialité (obligatoires, LCEN/RGPD) : à ajouter avant la mise en ligne. */}
          </ul>
        </div>
      </div>
    </footer>
  );
}
