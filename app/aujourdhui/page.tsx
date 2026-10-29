"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowRight, Flame, Sparkles, Compass, Dumbbell,
  Briefcase, Users, RefreshCw, Heart, HeartPulse,
} from "lucide-react";
import { Card, PageHead, Button } from "@/components/ui";
import { AuditEnergetique } from "@/components/AuditEnergetique";
import { ConstellationVivante } from "@/components/ConstellationVivante";
import { LeChemin } from "@/components/LeChemin";
import type { Perimetre } from "@/parcours-gap/perimetres";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { exercicesDuJour } from "@/parcours-archetypes/exercices";
import { pacteAVerifier, TenuPacte } from "@/parcours-archetypes/pactes";
import { progression, momentum, radarCourant } from "@/parcours-archetypes/indicateurs";
import { contenuJour } from "@/parcours-archetypes/hydration";
import { track } from "@/lib/metrics";
import { Archetype, Objectifs } from "@/parcours-archetypes/types";
import { EspritParcours } from "@/components/bd/EspritParcours";

// Home « Aujourd'hui » : le hub quotidien, RADICALEMENT resserré. Cinq blocs,
// pas davantage — ton énergie, le geste du jour, tes exercices, tes possibles —
// et un seul repli « Aller plus loin » qui range tout le secondaire (le chemin,
// les éclats du parcours, les pages contemplatives). Fini le mur de dix modules.
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
        texte="Choisis une direction à observer par pilier — relationnel & famille, love, pro, santé. Elles te guideront et pourront évoluer."
        cta="Choisir ma direction"
      />
    );
  }

  const prog = progression(etat);
  const mo = momentum(etat);
  // Parcours sans fin : plus de terminaison. Le compteur (sessionJour) avance
  // sans plafond ; le CONTENU tourne en boucle (contenuJour) ; chaque capsule
  // est fraîche (classée sur le compteur, jamais déjà répondue).
  const sessionJour = prog.jourCourant;
  const n = contenuJour(sessionJour);
  const jour = parcours.jours.find((j) => j.n === n) ?? null;
  const arch = jour ? archetypeByKey[jour.archetype] : null;
  const dejaFait = Boolean(reponses[sessionJour]);
  const salut = salutation();

  return (
    <div>
      <PageHead
        eyebrow={salut.eyebrow}
        title={salut.titre}
        sub="Explore ta signature à ton rythme. Le reste peut attendre."
        accessory={<EspritParcours seed="accueil" size={48} />}
      />

      {/* Retour de session (intermittent) : reprendre, ou tout recommencer. */}
      {montrerReprise && (
        <Card className="mb-4 p-5 animate-fade-up sm:p-6">
          <div className="text-xs uppercase tracking-[0.18em] text-fuchsia">Bon retour</div>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            Reprendre ta quête ?
          </h2>
          <p className="mt-1 text-sm text-muted">
            Continue là où tu t'es arrêtée — ou recommence de zéro.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Button onClick={() => setMontrerReprise(false)}>
              Reprendre
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

      {/* Le fil des pactes (intermittent) : l'engagement de la veille revient. */}
      <CheckinPacte jourCourant={prog.jourCourant} />

      {/* Retour bienveillant après une absence (intermittent). */}
      {mo.absence >= 2 && prog.faits > 0 && !dejaFait && (
        <div
          className="mb-4 rounded-2xl border px-5 py-3.5 text-sm animate-fade-up"
          style={{
            borderColor: "color-mix(in srgb, var(--fuchsia) 34%, transparent)",
            background: "color-mix(in srgb, var(--fuchsia) 6%, transparent)",
          }}
        >
          <span className="text-ink">
            Tu reprends là où tu t'es arrêtée, à ton rythme. Rien ne se rattrape,
            rien ne se perd.
          </span>
        </div>
      )}

      {/* 1 — Ton énergie, aujourd'hui. La pièce maîtresse : où elle est haute ou
          basse, ce qu'elle appelle — et elle fait aussi bouger tes possibles. */}
      <AuditEnergetique />

      {/* 2 — Le geste du jour : l'unique action à porter aujourd'hui. */}
      <GesteDuJour dejaFait={dejaFait} />

      {/* 3 — Tes trois exercices du jour, teintés de ta signature du moment. */}
      {arch && <TroisExercices arch={arch} objectifs={objectifs} jour={n} />}

      {/* 4 — Mes possibles : ce que tes directions rendent possible. */}
      <PossiblesCard />

      {/* 5 — Aller plus loin : tout le secondaire rangé dans un seul repli. */}
      <AllerPlusLoin faits={prog.faits} />
    </div>
  );
}

// « Le geste du jour » : l'unique action à porter aujourd'hui — la capsule,
// taillée pour la signature du moment. Un seul bloc clair, un seul appel.
function GesteDuJour({ dejaFait }: { dejaFait: boolean }) {
  return (
    <section className="mt-4 animate-fade-up">
      <div className="mb-3 flex items-center gap-2 text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-fuchsia">
        <Flame size={13} /> Le geste du jour
      </div>
      <Link
        href="/parcours-signatures"
        className="group block overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-fuchsia"
      >
        <h3 className="font-display text-xl font-semibold leading-snug text-ink">
          {dejaFait ? "Ta capsule du jour est vécue" : "Vis ta capsule du jour"}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {dejaFait
            ? "Tu peux la revisiter, ou revenir demain pour la suivante — rien ne se force."
            : "Un seul geste à porter aujourd'hui, taillé pour ta signature du moment. Quelques minutes, à ton rythme."}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia">
          {dejaFait ? "Revisiter ma capsule" : "Vivre ma capsule"}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </section>
  );
}

// Une bascule à explorer : dès la première journée vécue, on propose d'explorer
// la signature qui MONTE dans la matrice (la 2ᵉ derrière la dominante) — une
// invitation à tester une autre facette de soi, sans attendre la mue.
function BasculeAExplorer() {
  const etat = useParcoursStore((s) => s.etat);
  const prog = progression(etat);
  if (prog.faits < 1) return null;

  const tri = [...radarCourant(etat)].sort((a, b) => b.valeur - a.valeur);
  const dom = tri[0];
  const emerg = tri[1];
  if (!dom || !emerg || emerg.key === dom.key || emerg.valeur <= 0) return null;

  return (
    <Link href="/explorer" className="block">
      <Card className="p-5 transition-colors hover:border-fuchsia/40">
        <div className="flex items-center gap-2 text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-fuchsia">
          <Compass size={13} /> Une bascule à explorer
        </div>
        <p className="mt-2 text-[15px] font-semibold text-ink">
          Ces jours-ci, <span className="text-fuchsia">{emerg.name}</span> monte en toi.
        </p>
        <p className="mt-1 text-sm text-muted">
          Et si, aujourd'hui, tu explorais cette facette — une autre manière d'être toi ?
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia">
          Explorer {emerg.name}
          <ArrowRight size={13} />
        </span>
      </Card>
    </Link>
  );
}

// Check-in du pacte : l'engagement pris un jour de Quête revient le lendemain.
// « Tenu ? » → la réponse nourrit la constance. C'est le fil qui relie les jours.
function CheckinPacte({ jourCourant }: { jourCourant: number }) {
  const pactes = useParcoursStore((s) => s.pactes);
  const repondrePacte = useParcoursStore((s) => s.repondrePacte);
  const pacte = pacteAVerifier(pactes, jourCourant);
  if (!pacte) return null;

  const opts: { t: TenuPacte; label: string }[] = [
    { t: "oui", label: "Oui, tenu" },
    { t: "partiel", label: "En partie" },
    { t: "non", label: "Pas cette fois" },
  ];
  return (
    <Card className="mb-4 p-5 animate-fade-up sm:p-6">
      <div className="text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-fuchsia">
        Ton engagement précédent
      </div>
      <p className="mt-1.5 font-display text-lg font-light leading-snug text-ink">
        « {pacte.texte} »
      </p>
      <p className="mt-1 text-xs text-muted">
        L'as-tu tenu ? Ta réponse fait grandir ta constance.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={o.t}
            onClick={() => repondrePacte(pacte.jour, o.t)}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-fuchsia hover:text-fuchsia"
          >
            {o.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

// Prochaine révélation — un seul « à venir », clair et désirable. Déblocage
// progressif (façon Headspace) + révélation d'identité (façon Co-Star).
function RevelationCard({ faits }: { faits: number }) {
  const cible =
    faits >= 5
      ? { titre: "Ton portrait se précise", href: "/synthese" }
      : { titre: "Ta révélation de motif", href: "/progression" };
  return (
    <Link href={cible.href} className="block">
      <Card className="p-5 transition-colors hover:border-fuchsia/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-fuchsia">
            <Sparkles size={13} /> À venir
          </div>
          <ArrowRight size={15} className="text-muted" />
        </div>
        <p className="mt-2 text-[15px] font-semibold text-ink">{cible.titre}</p>
        <p className="mt-1 text-sm text-muted">
          Se dévoile à mesure que tu explores — pas à une date, à ton rythme.
        </p>
      </Card>
    </Link>
  );
}

// « Ton exercice du jour » — un par périmètre (perso · pro · relationnel)
// teinté par la signature du moment. Comme la signature varie au fil
// de la quête, les consignes évoluent avec elle, selon ton avancement.
const ICONE_PERIMETRE: Record<Perimetre, React.ElementType> = {
  relationnel: Users,
  love: Heart,
  pro: Briefcase,
  perso: HeartPulse,
};

function TroisExercices({
  arch,
  objectifs,
  jour,
}: {
  arch: Archetype;
  objectifs: Objectifs | null;
  jour: number;
}) {
  // « variante » : levier de RENOUVELLEMENT à la demande. La quête n'avance
  // d'un jour qu'en fin de journée ; entre-temps, on peut vouloir un autre angle.
  const [variante, setVariante] = useState(0);
  useEffect(() => {
    try {
      const v = localStorage.getItem(`idx-exos-var-${jour}-${arch.key}`);
      if (v) setVariante(parseInt(v, 10) || 0);
    } catch {}
  }, [jour, arch.key]);
  const seed = jour + variante;
  // Exercice « modèle » affiché INSTANTANÉMENT (aucun spinner). En arrière-plan,
  // l'IA génère une version unique ; quand elle arrive, on la substitue.
  const base = exercicesDuJour(arch, objectifs, seed);
  const [ia, setIa] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    setIa(null);
    const cle = `idx-exos-v3-${seed}-${arch.key}`;
    try {
      const cache = localStorage.getItem(cle);
      if (cache) {
        setIa(JSON.parse(cache));
        return;
      }
    } catch {}
    let annule = false;
    fetch("/api/exercices", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        archName: arch.name,
        jour: seed, // graine = jour + variante (renouvellement à la demande)
        directions: {
          relationnel: objectifs?.relationnel ?? "",
          love: objectifs?.love ?? "",
          pro: objectifs?.pro ?? "",
          perso: objectifs?.perso ?? "",
        },
      }),
    })
      .then((r) => r.json())
      .then((d: { exercices?: { perimetre: string; consigne: string }[] | null }) => {
        if (annule || !d?.exercices?.length) return;
        const map: Record<string, string> = {};
        for (const e of d.exercices) map[e.perimetre] = e.consigne;
        setIa(map);
        try {
          localStorage.setItem(cle, JSON.stringify(map));
        } catch {}
      })
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, [seed, arch.key, arch.name, objectifs]);

  function renouveler() {
    const v = variante + 1;
    setVariante(v);
    setIa(null);
    try {
      localStorage.setItem(`idx-exos-var-${jour}-${arch.key}`, String(v));
    } catch {}
    track("exercices_renouveles", { jour, variante: v });
  }

  const ex = base.map((e) =>
    ia && ia[e.perimetre] ? { ...e, consigne: ia[e.perimetre] } : e
  );
  return (
    <section className="mt-4 animate-fade-up" style={{ animationDelay: "50ms" }}>
      <div className="mb-1 flex items-center gap-2 text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-fuchsia">
        <Dumbbell size={13} /> Ton exercice du jour
      </div>
      <p className="mb-3 max-w-xl text-xs leading-relaxed text-muted">
        Tes exercices du moment, teintés de ta signature
        (<b className="text-ink">{arch.name}</b>). Envie d'un autre angle tout de
        suite ? Appuie sur <b className="text-ink">« Un autre angle »</b>.
        {variante > 0 && <span className="text-fuchsia"> · angle {variante + 1}</span>}
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
                <span className="rounded-full border border-line px-2.5 py-0.5 text-[12px] text-muted">
                  {e.direction}
                </span>
              )}
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-ink">{e.consigne}</p>
          </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={renouveler}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-fuchsia hover:text-fuchsia"
        >
          <RefreshCw size={13} /> Un autre angle
        </button>
        <Link
          href="/exercices"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia"
        >
          Faire mon exercice du jour (crois · penses · fais)
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

// « Ce que tes directions rendent possible » — le pont vers les scénarios.
function PossiblesCard() {
  return (
    <section className="mt-4 animate-fade-up" style={{ animationDelay: "90ms" }}>
      <div className="mb-3 flex items-center gap-2 text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-fuchsia">
        <Compass size={13} /> Tes possibles
      </div>
      <Link
        href="/scenarios"
        className="group block overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-fuchsia"
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

// « Aller plus loin » — le SEUL repli du bas. Il range tout le secondaire : les
// pages contemplatives (portrait, progression, quête, rapport, ressources) ET
// les éclats du parcours (le chemin, la bascule, la révélation, la
// constellation). Replié par défaut : la home reste limpide, rien n'est perdu.
function AllerPlusLoin({ faits }: { faits: number }) {
  const liens = [
    { href: "/synthese", label: "Mon portrait" },
    { href: "/progression", label: "Ma progression" },
    { href: "/quete", label: "La Quête" },
    { href: "/exercices", label: "Mes exercices" },
    ...(faits >= 1 ? [{ href: "/rapport-analytique", label: "Rapport analytique" }] : []),
    { href: "/ressources", label: "Ressources" },
    { href: "/presentation", label: "Revoir la présentation" },
  ];
  return (
    <details className="mt-6 rounded-2xl border border-line bg-surface p-5 [&_summary]:cursor-pointer">
      <summary className="flex items-center gap-2 text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-muted">
        <Compass size={13} /> Aller plus loin
      </summary>
      <div className="mt-4 flex flex-wrap gap-2.5">
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
      {/* Les repères d'avancement et les éclats du parcours, rangés ici. */}
      <div className="mt-5 flex flex-col gap-4">
        <LeChemin />
        <BasculeAExplorer />
        <RevelationCard faits={faits} />
        <ConstellationVivante />
      </div>
    </details>
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
      {/* Le chemin complet, montré dès l'amorce : « voici la route, tu es ici ». */}
      <LeChemin mapOnly />
      <Card className="p-8 text-center animate-fade-up">
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
          className="group mt-6 inline-flex items-center gap-2 rounded-lg brand-gradient px-6 py-3 text-sm font-medium text-[color:var(--on-brand)] transition-transform"
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
