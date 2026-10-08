import Link from "next/link";

export const metadata = {
  title: "Comment nous protégeons votre anonymat — ToxicitX",
};

const points: { titre: string; texte: string }[] = [
  {
    titre: "Aucune donnée identifiante",
    texte:
      "Nous ne collectons ni nom, ni e-mail, ni adresse IP, ni aucune donnée permettant de vous identifier. Répondre au test ne crée pas de compte.",
  },
  {
    titre: "Un identifiant de session anonyme",
    texte:
      "Vos réponses sont rattachées à un identifiant technique aléatoire, généré sur votre appareil et non relié à une personne.",
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
];

export default function ConfidentialitePage() {
  return (
    <section className="step">
      <div className="eyebrow">Confiance &amp; anonymat</div>
      <h1 style={{ fontSize: 32 }}>Comment nous protégeons votre anonymat</h1>
      <p className="lead" style={{ marginTop: 8 }}>
        ToxicitX n'a de sens que si vous répondez honnêtement. Et vous ne serez
        honnête que si vous êtes certain·e de ne jamais être identifié·e.
      </p>

      <div className="feat">
        {points.map((p) => (
          <div key={p.titre} className="card">
            <div>
              <div className="ft">{p.titre}</div>
              <div className="fd">{p.texte}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt2">
        <Link href="/onboarding" className="btn btn-primary btn-block">
          C'est clair, je fais le test →
        </Link>
      </div>
    </section>
  );
}
