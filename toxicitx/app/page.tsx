"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Monster from "@/components/Monster";
import { QUESTIONS } from "@/content";
import { useToxStore } from "@/store/useToxStore";
import type { ScaleValue } from "@/types";

const FEATURES: [string, string, string][] = [
  ["🔒", "100 % anonyme", "Aucune donnée identifiante : ni nom, ni e-mail, ni adresse IP."],
  ["🧭", "Trois axes", "Toxicité ascendante, descendante et latérale — pour situer l'origine."],
  ["📋", "Un plan d'action", "Des pistes pour vous, et des leviers pour l'organisation."],
];

export default function LandingPage() {
  const router = useRouter();
  const setAnswer = useToxStore((s) => s.setAnswer);
  const setContext = useToxStore((s) => s.setContext);

  function demoFill() {
    const bias: Record<string, [number, number]> = {
      ascendante: [3, 4],
      descendante: [2, 4],
      laterale: [1, 3],
    };
    for (const q of QUESTIONS) {
      const [a, b] = bias[q.axis];
      let v = a + Math.floor(Math.random() * (b - a + 1));
      if (q.reverse) v = 4 - v;
      setAnswer(q.id, Math.max(0, Math.min(4, v)) as ScaleValue);
    }
    setContext({
      genre: "NSP",
      secteur: "Tech / Numérique",
      tailleEntreprise: "50 à 249",
      niveauPoste: "Opérationnel / Exécution",
      anciennete: "1 à 3 ans",
      encadrement: false,
    });
    router.push("/resultats");
  }

  return (
    <section className="step">
      <div className="trio">
        <div className="mon"><Monster id="cour-recre" /></div>
        <div className="mon"><Monster id="volcan" /></div>
        <div className="mon"><Monster id="petit-chef" /></div>
      </div>
      <div className="eyebrow center" style={{ marginTop: 14, display: "block" }}>
        Diagnostic de toxicité organisationnelle
      </div>
      <h1 style={{ textAlign: "center" }}>
        Quel climat règne vraiment dans votre organisation&nbsp;?
      </h1>
      <p className="lead center">
        En 5 à 7 minutes, un diagnostic sur trois axes — vers la direction, vers
        votre manager, entre collègues — un niveau de 1 à 6, un profil dominant,
        et des pistes d'action concrètes.
      </p>

      <div className="feat">
        {FEATURES.map((f) => (
          <div key={f[1]} className="card">
            <div className="fe">{f[0]}</div>
            <div>
              <div className="ft">{f[1]}</div>
              <div className="fd">{f[2]}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt2">
        <Link href="/onboarding" className="btn btn-primary btn-block">
          Commencer le test
        </Link>
      </div>
      <p className="note">
        <button className="link" onClick={demoFill}>
          Aperçu rapide : remplir automatiquement et voir un résultat
        </button>
      </p>
    </section>
  );
}
