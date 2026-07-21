import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { JOURNEY } from "@/data/constants";
import { ARCHETYPES, PHASES, SPHERES } from "@/parcours-archetypes/archetypes";

// Page de présentation : l'objectif du module et sa place dans le parcours,
// aux côtés des autres modules (les 8 blocs de la Quête IdentitX).

const PONTS = [
  {
    amont: "Explorer · ADN personnel",
    role: "alimentent le diagnostic",
    detail:
      "Ce que la Quête révèle de toi ouvre le parcours : dominant + secondaire donnent le premier dominant (J1) et la charnière (J15).",
  },
  {
    amont: "Journal · Coach IdentitX",
    role: "prolongent chaque journée",
    detail:
      "Ce que tu notes et ce que tu explores en dialogue nourrissent l'observation quotidienne, jour après jour.",
  },
  {
    amont: "Synthèse · Rapports",
    role: "recueillent ce qui ressort",
    detail:
      "Le radar vivant et le climat émotionnel des 30 jours reviennent nourrir ta synthèse et tes rapports.",
  },
];

export default function ObjectifPage() {
  return (
    <div>
      <PageHead
        eyebrow="Objectif"
        title="Pourquoi les 12 archétypes"
        sub="Un dominant n'est jamais une étiquette (« tu es… ») : c'est ce qui te met le plus en mouvement, qui se lit autrement selon les contextes de vie et qui respire dans le temps."
      />

      <Link
        href="/parcours-archetypes"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm text-fuchsia hover:underline"
      >
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
        Revenir au parcours
      </Link>

      {/* L'intention */}
      <Card className="mb-8 p-6">
        <h2 className="font-display text-xl font-light text-ink">L'intention</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Les 8 étapes de ta <strong className="text-ink">Quête IdentitX</strong> révèlent qui
          tu es — traits, valeurs, motifs. Le <strong className="text-ink">Parcours des 12
          archétypes</strong> les met en mouvement : 30 jours pour observer, à travers 12
          dominants, comment ces facettes s'activent selon tes contextes. Chaque
          soir, la matrice « respire » — ce que tu n'as pas réactivé retombe —
          pour qu'aucune identité ne se fige.
        </p>
      </Card>

      {/* Place dans le parcours */}
      <h2 className="mb-3 font-display text-xl font-light text-ink">
        Où ça s'insère
      </h2>

      {/* Flux : les 8 blocs de la Quête → le module 30 jours */}
      <Card className="mb-4 p-6">
        <div className="mb-2 text-xs uppercase tracking-wider text-muted">
          La Quête IdentitX — 8 étapes
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {JOURNEY.map((b, i) => (
            <span
              key={b.href}
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted"
            >
              <span className="font-display text-fuchsia">{i + 1}</span>
              {b.title}
            </span>
          ))}
        </div>
        <div className="my-4 flex items-center gap-2 text-muted">
          <ArrowRight size={16} className="text-fuchsia" />
          <span className="text-xs uppercase tracking-wider">met en mouvement</span>
        </div>
        <div className="brand-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white">
          Parcours des 12 archétypes · 30 jours
        </div>
      </Card>

      {/* Les ponts avec les autres modules */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {PONTS.map((p) => (
          <Card key={p.amont} className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-fuchsia">
              {p.amont}
            </div>
            <div className="mt-1 font-display text-lg font-light text-ink">
              {p.role}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.detail}</p>
          </Card>
        ))}
      </div>

      {/* Les 4 phases */}
      <h2 className="mb-3 font-display text-xl font-light text-ink">
        Les 30 jours, en 4 phases
      </h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PHASES.map((ph) => (
          <Card key={ph.key} className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted">
              J{ph.jours[0]}–{ph.jours[1]}
            </div>
            <div className="mt-1 font-display text-lg font-light text-ink">
              {ph.label}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {ph.intention}
            </p>
          </Card>
        ))}
      </div>

      {/* Les 12 lentilles + les 5 sphères */}
      <h2 className="mb-3 font-display text-xl font-light text-ink">
        Les 12 dominants
      </h2>
      <p className="mb-4 text-sm text-muted">
        Lues à travers 5 sphères — {SPHERES.map((s) => s.label).join(" · ")}.
      </p>
      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        {ARCHETYPES.map((a, i) => (
          <Card key={a.key} className="flex items-start gap-3 p-4">
            <span className="mt-0.5 font-display text-sm text-muted">{i + 1}</span>
            <div>
              <div className="font-display text-base font-light text-ink">
                {a.name}
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{a.lens}</p>
            </div>
          </Card>
        ))}
      </div>

      <Link
        href="/parcours-archetypes"
        className="group inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Commencer le parcours
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
