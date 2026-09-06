import Link from "next/link";

export const metadata = {
  title: "Comment nous protégeons votre anonymat — ToxicitX",
};

const points: { titre: string; texte: string }[] = [
  {
    titre: "Aucune donnée identifiante",
    texte:
      "Nous ne collectons ni nom, ni email, ni adresse IP, ni aucune donnée permettant de vous identifier. Répondre au test ne crée pas de compte.",
  },
  {
    titre: "Un identifiant de session anonyme",
    texte:
      "Vos réponses sont rattachées à un identifiant technique aléatoire, généré sur votre appareil et non relié à une personne. Il sert uniquement à regrouper vos réponses entre elles.",
  },
  {
    titre: "Seuil de 5 réponses minimum",
    texte:
      "Aucun résultat agrégé n'est affiché pour un groupe de moins de 5 réponses. En dessous, il serait trop facile de deviner qui a répondu quoi.",
  },
  {
    titre: "Seuil de 10 réponses pour les équipes",
    texte:
      "Pour toute restitution au niveau d'une équipe ou d'un manager, le seuil est renforcé à 10 réponses minimum.",
  },
  {
    titre: "Toujours agrégé, jamais individuel",
    texte:
      "Les managers et RH n'ont accès qu'à des résultats agrégés. Personne ne peut consulter la réponse individuelle d'une personne précise.",
  },
  {
    titre: "Vous gardez la main",
    texte:
      "Tant que vous n'envoyez pas vos réponses, elles restent uniquement sur votre appareil. Vous pouvez tout réinitialiser à tout moment.",
  },
];

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-white">
        ← Retour
      </Link>
      <h1 className="mt-6 font-display text-3xl sm:text-4xl font-black">
        Comment nous protégeons votre anonymat
      </h1>
      <p className="mt-4 text-muted">
        ToxicitX n'a de sens que si vous répondez honnêtement. Et vous ne serez
        honnête que si vous êtes certain·e de ne jamais être identifié·e. Voici
        nos garanties, en clair.
      </p>

      <div className="mt-10 space-y-4">
        {points.map((p) => (
          <div key={p.titre} className="card p-5">
            <div className="font-semibold">{p.titre}</div>
            <div className="mt-1 text-sm text-muted">{p.texte}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/onboarding"
          className="rounded-full bg-acid px-8 py-4 font-semibold text-ink hover:brightness-110 transition"
        >
          C'est clair, je fais le test →
        </Link>
      </div>
    </main>
  );
}
