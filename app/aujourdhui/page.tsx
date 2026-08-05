"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowRight, Flame, Sparkles, HelpCircle, BookOpen, Wind, PenLine, Lock, History,
  MessageCircle, Sunrise, Moon, Compass, Check, Route, Dumbbell,
  User, Briefcase, Home, Heart,
} from "lucide-react";
import { Card, PageHead, Slider, Button } from "@/components/ui";
import { LeChemin } from "@/components/LeChemin";
import type { Perimetre } from "@/parcours-gap/perimetres";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey, phaseDuJour, emotionByKey } from "@/parcours-archetypes/archetypes";
import { exercicesDuJour } from "@/parcours-archetypes/exercices";
import { progression, momentum } from "@/parcours-archetypes/indicateurs";
import { track } from "@/lib/metrics";
import { climatIndex, climatLabel, climatPhrase } from "@/parcours-archetypes/climat";
import { premiereLecture } from "@/parcours-archetypes/premiereLecture";
import { genererRevelations } from "@/parcours-archetypes/revelations";
import {
  ressourceDuJour, TYPE_LABEL, Ressource,
} from "@/parcours-archetypes/quotidien";
import { Archetype, Objectifs } from "@/parcours-archetypes/types";

// Home « Aujourd'hui » : le hub quotidien. L'app s'ouvre sur la seule chose du
// jour — ta capsule identitaire, ton avancement, ton élan — au lieu d'un menu.
// C'est la surface de rétention : momentum visible, cap à viser, un seul CTA.
export default function AujourdhuiPage() {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const parcours = useParcoursStore((s) => s.parcours);
  const etat = useParcoursStore((s) => s.etat);
  const reponses = useParcoursStore((s) => s.reponses);
  const reinitialiser = useParcoursStore((s) => s.reinitialiser);
  const router = useRouter();

  // Rétention J7 (métrique clé) : une seule fois, quand on atteint le Jour 7.
  useEffect(() => {
    try {
      if (progression(etat).jourCourant >= 7 && !localStorage.getItem("idx-m7")) {
        track("day_7_reached");
        localStorage.setItem("idx-m7", "1");
      }
    } catch {}
  }, [etat]);

  // Retour de session : si une quête est déjà en cours (au moins un jour vécu),
  // on propose UNE FOIS par session de la reprendre ou de la recommencer — le
  // choix quand on revient / se reconnecte, jamais imposé.
  const [montrerReprise, setMontrerReprise] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    try {
      if (diagnostic && progression(etat).faits >= 1 && !sessionStorage.getItem("idx-reprise")) {
        setMontrerReprise(true);
        sessionStorage.setItem("idx-reprise", "1");
      }
    } catch {}
  }, [diagnostic, etat]);

  const recommencer = () => {
    reinitialiser();
    setMontrerReprise(false);
    try {
      sessionStorage.setItem("idx-reprise", "1");
    } catch {}
    router.push("/parcours-signatures");
  };

  // Amorce : tant que le parcours n'est pas armé, on flèche l'étape suivante
  // avec un fil de progression clair (2 étapes avant le Jour 1).
  if (!diagnostic) {
    return (
      <Amorce
        titre="Qui es-tu aujourd'hui ?"
        texte="Ta signature"
        cta="Commencer l'exploration"
      />
    );
  }
  if (!objectifs) {
    return (
      <Amorce
        titre="Ce que je veux faire émerger"
        texte="Choisis une direction à observer par périmètre — perso, pro, relationnel. Elles guideront chaque journée et pourront évoluer."
        cta="Choisir ma direction"
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
          title="Ta traversée est accomplie"
          sub="Le temps de recueillir ce qui a surgi."
        />
        <Card className="overflow-hidden p-0 animate-fade-up">
          <div className="relative brand-gradient px-8 py-10 text-center text-white">
            <Sparkles size={40} className="mx-auto text-white" />
            <h2 className="mt-2 font-display text-3xl font-light">
              Les 30 jours sont accomplis
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/90">
              Ton rapport te propose trois scénarios activables sur tes
              périmètres perso, pro et relationnel.
            </p>
            <Link
              href="/parcours-signatures/rapport"
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

      {/* Retour de session : reprendre là où on en était, ou tout recommencer. */}
      {montrerReprise && (
        <Card className="mb-4 p-5 animate-fade-up sm:p-6">
          <div className="text-xs uppercase tracking-[0.18em] text-fuchsia">Bon retour</div>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            Reprendre ta quête ?
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tu en étais au <b className="text-ink">Jour {n}</b>. Continue là où tu
            t'es arrêtée — ou recommence de zéro.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => setMontrerReprise(false)}>
              Reprendre · Jour {n}
            </Button>
            {!confirmReset ? (
              <Button variant="outline" onClick={() => setConfirmReset(true)}>
                Recommencer
              </Button>
            ) : (
              <Button variant="outline" onClick={recommencer}>
                Confirmer — tout effacer
              </Button>
            )}
          </div>
          {confirmReset && (
            <p className="mt-2 text-xs text-muted">
              Cela efface ta progression actuelle et relance le diagnostic.
            </p>
          )}
        </Card>
      )}

      {/* La colonne vertébrale : où tu en es sur le chemin Archétype → Mue → Choix. */}
      <LeChemin />

      {/* Retour bienveillant après une absence : pas de rattrapage, pas de
          pénalité — le parcours suit les jours vécus, jamais le calendrier. */}
      {mo.absence >= 2 && prog.faits > 0 && !dejaFait && (
        <div
          className="mb-4 rounded-2xl border px-5 py-3.5 text-sm animate-fade-up"
          style={{
            borderColor: "color-mix(in srgb, var(--fuchsia) 34%, transparent)",
            background: "color-mix(in srgb, var(--fuchsia) 6%, transparent)",
          }}
        >
          <span className="text-ink">
            Tu reprends là où tu t'es arrêtée — le <b>Jour {n}</b> t'attend, à ton
            rythme. Rien ne se rattrape, rien ne se perd.
          </span>
        </div>
      )}

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
          <Sparkles size={18} className="flex-none text-fuchsia" />
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
                  <div className="tnum font-display text-4xl leading-none text-ink">
                    {prog.faits}
                  </div>
                  <div className="mt-1 text-[12px] uppercase tracking-[0.18em] text-muted">
                    / 30 jours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* La capsule du jour + CTA */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia sm:justify-start">
              <span>
                La capsule · Jour {n} · {phase.label}
              </span>
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-semibold text-ink sm:text-[1.7rem]">
              {arch ? arch.name : "Ta capsule du jour"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {arch?.lens}
            </p>

            {/* Les deux moments de la capsule, nommés — pour qu'ils cessent
                d'être invisibles derrière un simple « Vivre ma journée ». */}
            {arch && (
              <div className="mt-4 grid gap-2 text-left">
                <div className="flex items-start gap-2.5 rounded-xl border border-line bg-noir/20 px-3.5 py-2.5">
                  <Sunrise size={16} className="mt-0.5 flex-none text-fuchsia" />
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia">
                      Le geste · en journée
                    </div>
                    <p className="mt-0.5 text-sm leading-snug text-ink">{arch.defi}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-line bg-noir/20 px-3.5 py-2.5">
                  <Moon size={16} className="mt-0.5 flex-none text-fuchsia" />
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia">
                      Le bilan · le soir ≈ 5 min
                    </div>
                    <p className="mt-0.5 text-sm leading-snug text-ink">
                      Note ce que tu as observé — deux curseurs, quelques mots.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/parcours-signatures"
              className="group mt-5 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              {dejaFait ? "Revoir ma journée" : "Vivre ma capsule du jour"}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Card>

      {/* Les 3 exercices du jour — un par périmètre, pilotés par la signature du
          moment (qui varie) : la quête « évolue », les exercices avec elle. */}
      {arch && <TroisExercices arch={arch} objectifs={objectifs} />}

      {/* L'itinéraire du jour : le fil conducteur qui fait passer, dans l'ordre,
          par toutes les pages de la quête — plus aucun écran orphelin. */}
      <ItineraireDuJour diagnostic={Boolean(diagnostic)} objectifs={Boolean(objectifs)} dejaFait={dejaFait} />

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

      {/* « Ce que tes directions rendent possible » : les scénarios, jusque-là
          enterrés derrière une station du chemin — surfacés en bloc conscient. */}
      <PossiblesCard />

      <ClimatCard jour={n} />

      <SecondPlan prog={prog} />
    </div>
  );
}

// « Ton exercice du jour » — un par périmètre (perso · pro · familial ·
// amoureux), teinté par la signature du moment. Comme la signature varie au fil
// de la quête, les consignes évoluent avec elle, selon ton avancement.
const ICONE_PERIMETRE: Record<Perimetre, React.ElementType> = {
  perso: User,
  pro: Briefcase,
  familial: Home,
  amoureux: Heart,
};

function TroisExercices({
  arch,
  objectifs,
}: {
  arch: Archetype;
  objectifs: Objectifs | null;
}) {
  const ex = exercicesDuJour(arch, objectifs);
  return (
    <section className="mt-4 animate-fade-up" style={{ animationDelay: "50ms" }}>
      <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
        <Dumbbell size={13} /> Ton exercice du jour
      </div>
      <p className="mb-3 max-w-xl text-xs leading-relaxed text-muted">
        Un par périmètre — perso, pro, familial, amoureux — adapté à ta signature du
        moment (<b className="text-ink">{arch.name}</b>). Il change selon ton avancement.
      </p>
      <div className="grid gap-3">
        {ex.map((e) => {
          const Icone = ICONE_PERIMETRE[e.perimetre];
          return (
          <div key={e.perimetre} className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="grid h-8 w-8 flex-none place-items-center rounded-xl text-fuchsia"
                  style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}
                >
                  <Icone size={16} />
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">
                  {e.label}
                </span>
              </div>
              {e.direction && (
                <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted">
                  {e.direction}
                </span>
              )}
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-ink">{e.consigne}</p>
          </div>
          );
        })}
      </div>
      <Link
        href="/exercices"
        className="group mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia"
      >
        Faire mon exercice du jour (crois · penses · fais)
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}

// « Ton itinéraire du jour » : la journée de quête déroulée en étapes ordonnées,
// chacune reliée à SA page. Le fil conducteur qui fluidifie l'enchaînement et
// fait traverser toutes les pages — du matin (le geste) au soir (le bilan), puis
// la relecture (progression) et l'ouverture (possibles). Chaque ligne est un lien.
function ItineraireDuJour({
  diagnostic,
  objectifs,
  dejaFait,
}: {
  diagnostic: boolean;
  objectifs: boolean;
  dejaFait: boolean;
}) {
  const etapes: { label: string; hint: string; href: string; done: boolean }[] = [
    { label: "Ta signature", hint: "Ton point de départ, ton portrait.", href: "/synthese", done: diagnostic },
    { label: "Tes directions", hint: "Ce que tu veux faire émerger.", href: "/progression", done: objectifs },
    { label: "Le geste du jour", hint: "Une action à porter dans ta journée.", href: "/parcours-signatures", done: dejaFait },
    { label: "La question", hint: "À déposer dans ton journal.", href: "/journal", done: false },
    { label: "Une ressource", hint: "Un appui court, à faire pas qu'à lire.", href: "/ressources", done: false },
    { label: "Le bilan du soir", hint: "≈ 5 min pour observer ta journée.", href: "/parcours-signatures", done: dejaFait },
    { label: "Ta progression", hint: "Relis le chemin parcouru.", href: "/progression", done: false },
    { label: "Tes possibles", hint: "Ce que tes directions rendent possible.", href: "/scenarios", done: false },
  ];

  return (
    <section className="mt-4 animate-fade-up" style={{ animationDelay: "70ms" }}>
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
        <Route size={13} /> Ton itinéraire du jour
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
        {etapes.map((e, i) => (
          <Link
            key={e.label}
            href={e.href}
            className="group flex items-center gap-3.5 border-b border-line px-4 py-3.5 transition-colors last:border-b-0 hover:bg-noir/20"
          >
            <span
              className={`grid h-7 w-7 flex-none place-items-center rounded-full text-[12px] font-bold ${
                e.done ? "text-white" : "border border-line text-muted"
              }`}
              style={e.done ? { background: "linear-gradient(120deg,var(--fuchsia),var(--orange))" } : undefined}
            >
              {e.done ? <Check size={14} /> : i + 1}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold uppercase tracking-[0.06em] text-ink">
                {e.label}
              </span>
              <span className="block text-xs text-muted">{e.hint}</span>
            </span>
            <ArrowRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
          </Link>
        ))}
      </div>
    </section>
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
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
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

        {/* La question à porter — le micro-défi vit désormais dans la capsule
            (« le geste »), on ne le répète donc plus ici. */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <HelpCircle size={13} /> La question du jour
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">{arch.question}</p>
          <Link
            href="/journal"
            className="group mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia"
          >
            L'écrire dans mon journal
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
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
            <Link
              href="/synthese"
              className="group mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia"
            >
              Voir ce que ça révèle
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
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
          {ress.source && (
            <p className="mt-2 text-xs italic text-muted">{ress.source}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-fuchsia">
            Toute la bibliothèque
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* Fléchage vers le Coach : une porte contextuelle au moment où l'on
            veut en parler — pas seulement un onglet dans la barre. */}
        <Link
          href="/coach"
          className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-5 shadow-soft transition-colors hover:border-fuchsia"
        >
          <div
            className="grid h-9 w-9 flex-none place-items-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)", color: "var(--fuchsia)" }}
          >
            <MessageCircle size={16} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-ink">Une question sur ta journée ?</div>
            <div className="text-xs text-muted">Parle-en à IdentitX — il connaît ton parcours.</div>
          </div>
          <ArrowRight size={15} className="flex-none text-fuchsia transition-transform group-hover:translate-x-0.5" />
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
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
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

// « Ce que tes directions rendent possible » — le pont vers les scénarios. Il
// vivait caché derrière la 3ᵉ station du chemin ; ici c'est un bloc à part
// entière, toujours visible une fois la quête lancée : on voit qu'un ailleurs
// se construit à partir de ce qu'on explore.
function PossiblesCard() {
  return (
    <section className="mt-4 animate-fade-up" style={{ animationDelay: "90ms" }}>
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
        <Compass size={13} /> Tes possibles
      </div>
      <Link
        href="/scenarios"
        className="group block overflow-hidden rounded-2xl border border-line p-6 shadow-soft transition-colors hover:border-fuchsia"
        style={{
          background:
            "radial-gradient(130% 130% at 100% 0%, color-mix(in srgb, var(--fuchsia) 9%, transparent), transparent 55%)",
        }}
      >
        <h3 className="font-display text-xl font-semibold leading-snug text-ink">
          Ce que tes directions rendent possible
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Des expériences concrètes à tenter, nées de ce que tu explores — pas un
          portrait à contempler, mais ce qui construit ta réalité.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia">
          Faire surgir mes possibles
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </section>
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
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
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
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
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
  // Modules hérités fusionnés dans « Ton portrait » (/synthese) : une seule
  // entrée au lieu de cinq. Le reste (progression, rapport) reste accessible.
  const liens = [
    { href: "/presentation", label: "La présentation d'IdentitX" },
    { href: "/synthese", label: "Ton portrait" },
    { href: "/progression", label: "Ma progression" },
    ...(prog.faits >= 1
      ? [{ href: "/rapport-analytique", label: "Rapport analytique" }]
      : []),
    ...(prog.faits >= 5
      ? [{ href: "/parcours-signatures/rapport", label: "Mon rapport" }]
      : []),
    { href: "/ressources", label: "Ressources" },
  ];
  return (
    <div className="mt-8 animate-fade-up" style={{ animationDelay: "120ms" }}>
      <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
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
  titre,
  texte,
  cta,
  note,
}: {
  titre: string;
  texte: string;
  cta: string;
  note?: string;
}) {
  return (
    <div>
      <PageHead
        eyebrow="Bienvenue dans ta quête"
        title=""
        sub="Poser ton intention, révéler ton schéma dominant — quelques minutes, une seule fois."
      />
      {/* Le chemin complet, montré dès l'amorce : « voici la route, tu es ici ».
          Carte seule ici — la carte d'étape ci-dessous porte déjà le message + l'action. */}
      <LeChemin mapOnly />
      <Card className="p-8 text-center animate-fade-up">
        {/* Indicateur de progression unique : « Ton chemin » (LeChemin) au-dessus
            porte déjà le repère — on ne double pas avec « Étape X sur 2 ». */}
        <h2 className="mt-2 font-display text-2xl font-light text-ink">
          {titre}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{texte}</p>
        {note && (
          <p className="mx-auto mt-3 max-w-md text-xs italic leading-relaxed text-muted">
            {note}
          </p>
        )}
        <Link
          href="/parcours-signatures"
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
