import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { CONTACT_EMAIL, INSTAGRAM } from "@/lib/links";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-encre text-ivoire">
      <div>
        <div className="mx-auto grid max-w-page gap-8 px-6 pb-10 pt-16 text-sm text-ivoire/60 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Wordmark className="text-3xl text-ivoire" />
            <p className="mt-3 font-serif text-base italic text-ivoire/70">{site.devise}</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
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
            <li>
              <Link href="/mentions-legales" className="hover:text-ivoire">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-ivoire">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
        <p className="mx-auto max-w-page px-6 pb-8 text-xs text-ivoire/40">
          © {new Date().getFullYear()} CéliBOSS™ — {site.signature}. Ce site n&apos;utilise aucun cookie de mesure ni de publicité.
        </p>
      </div>
    </footer>
  );
}
