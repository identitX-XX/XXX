import Link from "next/link";
import { ArrowRight } from "lucide-react";

// 404 de marque — ramène toujours l'utilisateur vers « Aujourd'hui », le seul
// point d'entrée qui compte.
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center animate-fade-up">
      <div className="brand-text font-display text-6xl font-light">404</div>
      <h1 className="mt-4 font-display text-2xl font-light text-ink">
        Cette page n'existe pas
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Le chemin que tu cherches s'est perdu. Reviens à ton rendez-vous du jour.
      </p>
      <Link
        href="/aujourdhui"
        className="mt-6 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white"
      >
        Retour à Aujourd'hui
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
