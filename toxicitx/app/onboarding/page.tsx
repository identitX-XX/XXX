"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GENRES,
  SECTEURS,
  TAILLES,
  NIVEAUX_POSTE,
  ANCIENNETES,
} from "@/content/onboarding";
import { useToxStore } from "@/store/useToxStore";
import { useMounted } from "@/lib/useMounted";

export default function OnboardingPage() {
  const router = useRouter();
  const mounted = useMounted();
  const ctx = useToxStore((s) => s.context);
  const setContext = useToxStore((s) => s.setContext);

  return (
    <section className="step">
      <div className="eyebrow">Étape 1 · Votre terrain de chasse</div>
      <h2 style={{ marginTop: 4 }}>D'abord, deux-trois repères</h2>
      <p className="lead" style={{ fontSize: 15, marginTop: 6 }}>
        Rien d'identifiant — juste de quoi situer votre environnement. Vous
        pouvez sauter.
      </p>

      <div className="field">
        <label>Vous êtes…</label>
        <div className="opts">
          {GENRES.map((g) => (
            <button
              key={g.value}
              className="chip"
              aria-pressed={mounted && ctx.genre === g.value}
              onClick={() => setContext({ genre: g.value })}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <Field
        label="Votre secteur"
        opts={SECTEURS}
        value={mounted ? ctx.secteur : null}
        onPick={(v) => setContext({ secteur: v })}
      />
      <Field
        label="Taille de l'organisation"
        opts={TAILLES}
        value={mounted ? ctx.tailleEntreprise : null}
        onPick={(v) => setContext({ tailleEntreprise: v })}
      />
      <Field
        label="Votre niveau de poste"
        opts={NIVEAUX_POSTE}
        value={mounted ? ctx.niveauPoste : null}
        onPick={(v) => setContext({ niveauPoste: v })}
      />
      <Field
        label="Votre ancienneté"
        opts={ANCIENNETES}
        value={mounted ? ctx.anciennete : null}
        onPick={(v) => setContext({ anciennete: v })}
      />

      <div className="field">
        <label>Encadrez-vous une équipe ?</label>
        <div className="opts">
          {[
            ["Oui", true],
            ["Non", false],
          ].map(([lab, val]) => (
            <button
              key={String(val)}
              className="chip"
              aria-pressed={mounted && ctx.encadrement === val}
              onClick={() => setContext({ encadrement: val as boolean })}
            >
              {lab as string}
            </button>
          ))}
        </div>
      </div>

      <div className="row mt2">
        <button
          className="btn btn-primary btn-block"
          onClick={() => router.push("/quiz")}
        >
          Commencer la traque →
        </button>
      </div>
      <div className="row mt center" style={{ justifyContent: "center" }}>
        <Link href="/" className="btn">
          ← Retour
        </Link>
      </div>
    </section>
  );
}

function Field({
  label,
  opts,
  value,
  onPick,
}: {
  label: string;
  opts: string[];
  value: string | null;
  onPick: (v: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="opts">
        {opts.map((o) => (
          <button
            key={o}
            className="chip"
            aria-pressed={value === o}
            onClick={() => onPick(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
