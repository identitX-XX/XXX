"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, Flame, Sparkles, HelpCircle, Target, BookOpen, Wind, PenLine, Lock, History,
} from "lucide-react";
import { Card, PageHead, Slider } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey, phaseDuJour, emotionByKey } from "@/parcours-archetypes/archetypes";
import { progression, momentum } from "@/parcours-archetypes/indicateurs";
import { climatIndex, climatLabel, climatPhrase } from "@/parcours-archetypes/climat";
import { premiereLecture } from "@/parcours-archetypes/premiereLecture";
import { genererRevelations } from "@/parcours-archetypes/revelations";
import {
  ressourceDuJour, TYPE_LABEL, Ressource,
} from "@/parcours-archetypes/quotidien";
import { Archetype } from "@/parcours-archetypes/types";

// Home « Aujourd'hui » : le hub quotidien. L'app s'ouvre sur la seule chose du
// jour — ta capsule identitaire, ton avancement, ton élan — au lieu d'un menu.
// C'est la surface de rétention : momentum visible, cap à viser, un seul CTA.
export default function AujourdhuiPage() {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const parcours = useParcoursStore((s) => s.parcours);
  const etat = useParcoursStore((s) => s.etat);
  const reponses = useParcoursStore((s) => s.reponses);

  // Amorce : tant que le parcours n'est pas armé, on flèche l'étape suivante
  // avec un fil de progression clair (2 étapes avant le Jour 1).
  if (!diagnostic) {
    return (
      <Amorce
        etape={1}
        titre="Commence par toi"
        texte="Douze questions pour révéler ton archétype. C'est le seuil de tes 30 jours."
        cta="Je commence ma quête"
      />
    );
  }
  if (!objectifs) {
    return (
      <Amorce
        etape={2}
        titre="Pose ton cap"
        texte="Un objectif par périmètre — perso, pro, relationnel. Trois caps qui guideront chaque journée."
        cta="Poser mon cap"
      />
    );
  }

  const prog = progression(etat);
  const mo = momentum(etat);
  const termine = prog.jourCourant > 30;
  const n = Math.min(prog.jourCourant, 30);
  const jour = parcours.jours.find((j) => j.n === n) ?? null;
  const arch = jour ? archetypeByKey[jour.archetype] : null;
  const phase = phaseDuJour(n);
  const angle = (prog.part / 100) * 360;
  const dejaFait = Boolean(reponses[n]);
  const salut = salutation();

  if (termine) {
    return (
      <div>
        <PageHead
          eyebrow="Aujourd'hui"
          title="Ta quête est accomplie"
          sub="30 jours. Il est temps de recueillir ce qui ressort."
        />
        <Card className="overflow-hidden p-0 animate-fade-up">
          <div className="relative brand-gradient px-8 py-10 text-center text-white">
            <div className="text-4xl">🎉</div>
            <h2 className="mt-2 font-display text-3xl font-light">
              Les 30 jours sont accomplis
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/90">
              Ton rapport te propose trois scénarios activables sur tes
              périmètres perso, pro et relationnel.
            </p>
            <Link
              href="/parcours-archetypes/rapport"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-noir transition-transform hover:scale-[1.02]"
            >
              Voir mon bilan
              <ArrowRight size={16} />
            </Link>
          </div>
        </Card>
        <SecondPlan prog={prog} />
      </div>
    );
  }

  return (
    <div>
      <PageHead
        eyebrow={salut.eyebrow}
        title={salut.titre}
        sub="Une seule chose compte : vivre ta journée. Le reste peut attendre."
      />

      {/* Time-to-aha : avant même d'avoir vécu un jour, une première lecture
          sourcée sur tes réponses. Disparaît dès la première journée close. */}
      {prog.faits === 0 && <PremiereLecture />}

      {/* Célébration de cap : reste affichée tant qu'on est pile sur un jalon
          (7/14/21) — la fenêtre de célébration, jusqu'à la journée suivante. */}
      {mo.jalonAtteint && mo.jalonAtteint < 30 && (
        <div
          className="mb-4 flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm animate-fade-up"
          style={{
            borderColor: "color-mix(in srgb, var(--fuchsia) 40%, transparent)",
            background: "color-mix(in srgb, var(--fuchsia) 7%, transparent)",
          }}
        >
          <span className="text-lg">✨</span>
          <span className="text-ink">
            Cap des <b>{mo.jalonAtteint} jours</b> franchi. Tu tiens ta quête —
            continue sur cette lancée.
          </span>
        </div>
      )}

      <Card className="p-6 sm:p-8 animate-fade-up">
        <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center">
          {/* Anneau d'avancement, avec aura de la teinte du jour */}
          <div className="relative flex-none">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full blur-2xl opacity-40"
              style={{
                background: arch
                  ? `radial-gradient(circle, hsl(${arch.hue} 90% 60%), transparent 70%)`
                  : "transparent",
              }}
            />
            <div
              className="relative"
              style={{
                width: 132,
                height: 132,
                borderRadius: "50%",
                background: `conic-gradient(var(--fuchsia) ${angle}deg, var(--line) ${angle}deg)`,
                display: "grid",
                placeItems: "center",
              }}
            >
              <div className="grid h-[108px] w-[108px] place-items-center rounded-full bg-surface text-center">
                <div>
                  <div className="font-display text-4xl leading-none text-ink">
                    {prog.faits}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                    / 30 jours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* La capsule du jour + CTA */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.16em] text-fuchsia sm:justify-start">
              <span>
                Jour {n} · phase {phase.label}
              </span>
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-light text-ink sm:text-[1.7rem]">
              {arch ? arch.name : "Ta capsule du jour"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {arch?.lens}
            </p>
            <Link
              href="/parcours-archetypes"
              className="group mt-5 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              {dejaFait ? "Revoir ma journée" : "Vivre ma journée"}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <div className="mt-2 text-xs text-muted">
              ≈ 4 min · le soir, idéalement
            </div>
          </div>
        </div>
      </Card>

      {/* Le fil du jour : la raison de revenir — nouveauté, révélation, ressource. */}
      <FilDuJour n={n} arch={arch} />

      {/* Momentum : série + prochain cap. Le levier « ne casse pas la chaîne ». */}
      {prog.faits > 0 && (
        <div
          className="mt-4 grid gap-4 sm:grid-cols-2 animate-fade-up"
          style={{ animationDelay: "60ms" }}
        >
          <Card className="flex items-center gap-4 p-5">
            <div
              className="grid h-11 w-11 flex-none place-items-center rounded-full"
              style={{
                background: "color-mix(in srgb, var(--orange) 14%, transparent)",
                color: "var(--orange)",
              }}
            >
              <Flame size={20} />
            </div>
            <div>
              <div className="font-display text-xl text-ink">
                {mo.serie > 0
                  ? `${mo.serie} jour${mo.serie > 1 ? "s" : ""} d'affilée`
                  : "Reprends le fil"}
              </div>
              <div className="text-xs text-muted">
                {mo.serie > 0
                  ? mo.record > mo.serie
                    ? `Ton record : ${mo.record} jours`
                    : "C'est ta meilleure série — tiens-la."
                  : "Une journée aujourd'hui relance ta série."}
              </div>
            </div>
          </Card>

          {mo.prochainJalon && (
            <Card className="flex flex-col justify-center gap-2 p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink">
                  Prochain cap · {mo.prochainJalon} jours
                </span>
                <span className="text-xs text-muted">
                  plus que {mo.resteAvantJalon}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full brand-gradient transition-all"
                  style={{
                    width: `${Math.round((prog.faits / mo.prochainJalon) * 100)}%`,
                  }}
                />
              </div>
            </Card>
          )}
        </div>
      )}

      <ClimatCard jour={n} />

      <SecondPlan prog={prog} />
    </div>
  );
}

// « Le fil du jour » : les raisons de revenir aujourd'hui.
//   · deux matières à réflexion — la question ET le micro-défi de l'archétype ;
//   · la révélation — l'insight le plus fort du moteur sourcé (se débloque) ;
//   · la ressource — une pratique / lecture / réflexion courte.
const RESSOURCE_ICON: Record<Ressource["type"], React.ReactNode> = {
  pratique: <Wind size={16} />,
  lecture: <BookOpen size={16} />,
  reflexion: <PenLine size={16} />,
};

function FilDuJour({ n, arch }: { n: number; arch: Archetype | null }) {
  const etat = useParcoursStore((s) => s.etat);
  const reponses = useParcoursStore((s) => s.reponses);
  const climat = useParcoursStore((s) => s.climat);
  const marquerFilVu = useParcoursStore((s) => s.marquerFilVu);

  // Voir la home = voir le fil → on éteint le badge « nouveau » du menu.
  useEffect(() => {
    marquerFilVu(n);
  }, [n, marquerFilVu]);

  if (!arch) return null;

  const turbulence = climat[n] ? climatIndex(climat[n]) : undefined;
  const ress = ressourceDuJour(n, arch.key, turbulence);
  const rev = genererRevelations(etat, reponses, climat)[0] ?? null;

  // Retour d'hier : le dernier jour vécu, pour tisser la continuité.
  const hier = [...etat.historique].sort((a, b) => b.jour - a.jour)[0] ?? null;
  const hierEmo = hier?.emotions?.[0];

  return (
    <section className="mt-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-fuchsia">
        <Sparkles size={13} /> Le fil du jour
      </div>

      <div className="grid gap-4">
        {/* Retour d'hier */}
        {hier && (
          <Card className="flex items-start gap-3 p-5">
            <div
              className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-full"
              style={{ background: "color-mix(in srgb, var(--orange) 12%, transparent)", color: "var(--orange)" }}
            >
              <History size={15} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-muted">Retour d'hier</div>
              <p className="mt-1 text-sm leading-relaxed text-ink">
                Jour {hier.jour} : ta clarté était à <b>{Math.round(hier.coherence)}</b>
                {hierEmo ? (
                  <>, portée par « {emotionByKey[hierEmo].label.toLowerCase()} »</>
                ) : null}
                . Aujourd'hui reprend le fil.
              </p>
            </div>
          </Card>
        )}

        {/* Deux matières à réflexion — la question ET le micro-défi du jour */}
        <div className="text-xs uppercase tracking-[0.14em] text-muted">
          Deux matières à travailler aujourd'hui
        </div>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <HelpCircle size={13} /> La question à porter
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">{arch.question}</p>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <Target size={13} /> Le micro-défi
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">{arch.defi}</p>
        </Card>

        {/* Révélation — sourcée, ou teaser tant qu'il manque de matière */}
        {rev ? (
          <div
            className="rounded-2xl border p-5 sm:p-6"
            style={{
              borderColor: "color-mix(in srgb, var(--fuchsia) 34%, transparent)",
              background:
                "radial-gradient(130% 130% at 0% 0%, color-mix(in srgb, var(--fuchsia) 8%, transparent), transparent 60%)",
            }}
          >
            <div className="text-xs uppercase tracking-[0.14em] text-fuchsia">
              La révélation du jour
            </div>
            <h3 className="mt-1.5 font-display text-lg font-light leading-snug text-ink">
              {rev.titre}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">{rev.preuve}</p>
          </div>
        ) : (
          <Card className="flex items-center gap-3 p-5 text-sm text-muted">
            <Lock size={15} className="flex-none opacity-70" />
            <span>
              Ta première révélation apparaîtra ici après quelques jours vécus —
              elle se lit dans tes propres données.
            </span>
          </Card>
        )}

        {/* Ressource — cliquable vers la bibliothèque */}
        <Link
          href="/ressources"
          className="group block rounded-2xl border border-line bg-surface p-5 shadow-soft transition-colors hover:border-fuchsia sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div
              className="grid h-9 w-9 flex-none place-items-center rounded-full"
              style={{
                background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)",
                color: "var(--fuchsia)",
              }}
            >
              {RESSOURCE_ICON[ress.type]}
            </div>
            <div className="text-xs uppercase tracking-[0.14em] text-muted">
              {TYPE_LABEL[ress.type]} · {ress.duree}
            </div>
          </div>
          <h3 className="mt-3 font-display text-lg font-light text-ink">{ress.titre}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{ress.corps}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-fuchsia">
            Toute la bibliothèque
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}

// « Ta première lecture » : l'aha du jour 1, sourcé sur ses vraies réponses.
function PremiereLecture() {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  if (!diagnostic) return null;

  const pl = premiereLecture(diagnostic, objectifs);
  return (
    <div
      className="mb-4 rounded-2xl border p-6 animate-fade-up"
      style={{
        borderColor: "color-mix(in srgb, var(--fuchsia) 32%, transparent)",
        background:
          "radial-gradient(130% 130% at 0% 0%, color-mix(in srgb, var(--fuchsia) 9%, transparent), transparent 60%)",
      }}
    >
      <div className="text-xs uppercase tracking-[0.16em] text-fuchsia">
        Ta première lecture · à vérifier sur 30 jours
      </div>
      <h2 className="mt-1 font-display text-xl font-light text-ink">{pl.titre}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{pl.corps}</p>
      <div className="mt-4 flex flex-col gap-2.5">
        {pl.points.map((p, i) => (
          <div key={i} className="flex gap-2.5 text-sm text-ink">
            <span
              className="mt-1.5 h-1.5 w-1.5 flex-none rounded-sm"
              style={{ background: "linear-gradient(180deg,var(--fuchsia),var(--orange))" }}
            />
            <span className="leading-relaxed">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Couche « climat & corps » (optionnelle, locale) : un relevé rapide qui, une
// fois quelques jours notés, nourrit la ré-attribution (« c'est le contexte,
// pas un échec »). Trois curseurs, aucune injonction, rien de médical.
function ClimatCard({ jour }: { jour: number }) {
  const climat = useParcoursStore((s) => s.climat);
  const noter = useParcoursStore((s) => s.noterClimat);
  const existing = climat[jour];

  const [edit, setEdit] = useState(false);
  const [sommeil, setSommeil] = useState(existing?.sommeil ?? 60);
  const [energie, setEnergie] = useState(existing?.energie ?? 55);
  const [vagues, setVagues] = useState(existing?.vagues ?? 20);

  const save = () => {
    noter({ jour, date: new Date().toISOString(), sommeil, energie, vagues });
    setEdit(false);
  };

  if (existing && !edit) {
    const idx = climatIndex(existing);
    return (
      <div className="mt-4 animate-fade-up">
        <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-fuchsia">
              Climat du jour · {climatLabel(idx)}
            </div>
            <p className="mt-1 max-w-md text-sm text-muted">{climatPhrase(idx)}</p>
          </div>
          <button
            onClick={() => setEdit(true)}
            className="flex-none self-start rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-fuchsia hover:text-fuchsia sm:self-auto"
          >
            Réajuster
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-4 animate-fade-up">
      <Card className="p-5 sm:p-6">
        <div className="text-xs uppercase tracking-[0.16em] text-fuchsia">
          Climat &amp; corps · optionnel
        </div>
        <p className="mt-1 text-sm text-muted">
          Un relevé rapide de ton terrain du jour. Il reste sur ton appareil et
          sert à remettre tes journées en contexte — jamais un diagnostic.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Slider label="Sommeil" value={sommeil} onChange={setSommeil} />
          <Slider label="Énergie" value={energie} onChange={setEnergie} />
          <Slider label="Vagues / bouffées" value={vagues} onChange={setVagues} />
        </div>
        <button
          onClick={save}
          className="mt-5 inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-white"
        >
          Enregistrer mon climat
        </button>
      </Card>
    </div>
  );
}

// Le reste des modules, volontairement en second plan (un tiroir, pas un menu).
function SecondPlan({ prog }: { prog: { faits: number } }) {
  const liens = [
    { href: "/progression", label: "Ma progression" },
    ...(prog.faits >= 5
      ? [{ href: "/parcours-archetypes/rapport", label: "Mon rapport" }]
      : []),
    { href: "/parcours", label: "Ma quête (les modules)" },
    { href: "/dashboard", label: "Tableau de bord" },
  ];
  return (
    <div className="mt-8 animate-fade-up" style={{ animationDelay: "120ms" }}>
      <div className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">
        Explorer
      </div>
      <div className="flex flex-wrap gap-3">
        {liens.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-fuchsia hover:text-fuchsia"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Salutation selon l'heure — chaleureuse, jamais bavarde.
function salutation(): { eyebrow: string; titre: string } {
  const h = new Date().getHours();
  if (h < 6) return { eyebrow: "Aujourd'hui", titre: "Encore debout ?" };
  if (h < 12) return { eyebrow: "Ce matin", titre: "Prends un instant pour toi" };
  if (h < 18)
    return { eyebrow: "Cet après-midi", titre: "Ton rendez-vous du jour" };
  return { eyebrow: "Ce soir", titre: "Ton rendez-vous du soir" };
}

function Amorce({
  etape,
  titre,
  texte,
  cta,
}: {
  etape: 1 | 2;
  titre: string;
  texte: string;
  cta: string;
}) {
  return (
    <div>
      <PageHead
        eyebrow="Bienvenue"
        title="Deux étapes avant ton Jour 1"
        sub="Arme ta quête — ça prend quelques minutes, une seule fois."
      />
      <Card className="p-8 text-center animate-fade-up">
        {/* Fil de progression de l'amorce */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2].map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === etape ? "w-8 brand-gradient" : "w-4 bg-line"
              }`}
            />
          ))}
        </div>
        <div className="text-xs uppercase tracking-[0.16em] text-fuchsia">
          Étape {etape} sur 2
        </div>
        <h2 className="mt-2 font-display text-2xl font-light text-ink">
          {titre}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{texte}</p>
        <Link
          href="/parcours-archetypes"
          className="group mt-6 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
        >
          {cta}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </Card>
    </div>
  );
}
