import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deconnecter } from "@/app/espace/actions";
import { supabaseConfigure } from "@/lib/supabase/config";
import { utilisateurCourant } from "@/lib/supabase/serveur";

export const metadata: Metadata = { title: "Mon espace", robots: { index: false } };
export const dynamic = "force-dynamic";

const ONGLETS = [
  { href: "/espace", label: "Aujourd'hui" },
  { href: "/espace/point", label: "Point du matin" },
  { href: "/espace/profil", label: "Profil" },
];

export default async function LayoutEspace({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigure) redirect("/compagnon#acces");
  if (!(await utilisateurCourant())) redirect("/connexion?suite=/espace");

  return (
    <div className="bg-ivoire text-encre">
      <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-4 border-b border-filet px-6 py-4 md:px-10 xl:px-24">
        <nav aria-label="Mon espace" className="flex flex-wrap gap-6">
          {ONGLETS.map((o) => (
            <Link key={o.href} href={o.href} className="text-xs font-semibold uppercase tracking-[0.2em] text-gris hover:text-bordeaux">
              {o.label}
            </Link>
          ))}
        </nav>
        <form action={deconnecter}>
          <button type="submit" className="text-xs uppercase tracking-[0.2em] text-gris underline decoration-filet underline-offset-4 hover:text-bordeaux">
            Se déconnecter
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
