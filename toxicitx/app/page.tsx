import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-acid text-sm font-semibold tracking-widest uppercase">
        ToxicitX
      </p>
      <h1 className="mt-4 font-display text-4xl sm:text-5xl font-black leading-tight">
        Votre organisation est-elle{" "}
        <span className="text-tox-6">carrément toxique</span>, ou juste
        stressée&nbsp;?
      </h1>
      <p className="mt-6 text-lg text-muted">
        En 5–7 minutes, un diagnostic sérieux (et un peu drôle) de la toxicité
        de votre boîte : vers le haut, vers le bas, entre collègues. Score,
        niveau de 1 à 6, profils dominants — et une ordonnance concrète pour
        vous en sortir.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/onboarding"
          className="rounded-full bg-acid px-8 py-4 font-semibold text-ink hover:brightness-110 transition"
        >
          Faire le test →
        </Link>
        <Link
          href="/confidentialite"
          className="rounded-full border border-line px-8 py-4 font-semibold text-muted hover:text-white transition"
        >
          Comment on protège votre anonymat
        </Link>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {[
          { t: "100 % anonyme", d: "Aucun nom, email, ni IP. On ne peut pas vous identifier." },
          { t: "3 axes de toxicité", d: "Vers le N+1, vers l'équipe, entre collègues." },
          { t: "Une ordonnance", d: "Des remèdes drôles mais pertinents, à emporter." },
        ].map((f) => (
          <div key={f.t} className="card p-5">
            <div className="font-semibold">{f.t}</div>
            <div className="mt-1 text-sm text-muted">{f.d}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
