"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, ChevronDown, Dumbbell, GraduationCap } from "lucide-react";
import { PageHead } from "@/components/ui";
import { ApprofondirUnivers } from "@/components/ApprofondirUnivers";
import { ExercicesVolets } from "@/components/ExercicesVolets";
import { QuizAuto } from "@/components/QuizAuto";
import { Dashboard } from "@/parcours-archetypes/components/Dashboard";
import { Diagnostic } from "@/parcours-archetypes/components/Diagnostic";
import { Objectifs } from "@/parcours-archetypes/components/Objectifs";
import { JourView } from "@/parcours-archetypes/components/JourView";
import { AjusterParcours } from "@/parcours-archetypes/components/AjusterParcours";
import { EspritParcours } from "@/components/bd/EspritParcours";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { contenuJour } from "@/parcours-archetypes/hydration";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { archetypeDominant, progression } from "@/parcours-archetypes/indicateurs";
import { auditDepuisEtat } from "@/parcours-archetypes/auditEnergetique";
import { detecterChapitres, derniereBascule } from "@/parcours-archetypes/bascules";
import type { Diagnostic as Diag, Objectifs as ObjectifsT, EtatEvolution } from "@/parcours-archetypes/types";

// Route du module. Tant que le dominant n'est pas déterminé, on présente le
// diagnostic (écran-miroir). Une fois fait, il ouvre le parcours 30 jours.
// Enveloppé dans <Suspense> car on lit le paramètre ?jour= (useSearchParams).
export default function ParcoursArchetypesPage() {
  return (
    <Suspense fallback={<ParcoursSkeleton />}>
      <ParcoursContent />
    </Suspense>
  );
}

// Squelette d'attente — remplace l'écran blanc le temps que la page s'arme.
function ParcoursSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="idx-skeleton mb-3 h-3 w-28" />
      <div className="idx-skeleton mb-6 h-8 w-3/4" />
      <div className="idx-skeleton mb-3 h-24 w-full" />
      <div className="idx-skeleton mb-3 h-40 w-full" />
      <div className="idx-skeleton h-40 w-full" />
    </div>
  );
}

function ParcoursContent() {
  const parcours = useParcoursStore((s) => s.parcours);
  const jourCourant = useParcoursStore((s) => s.etat.jourCourant);
  const reponses = useParcoursStore((s) => s.reponses);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const etat = useParcoursStore((s) => s.etat);

  // Jour demandé via l'URL (?jour=N), p. ex. depuis la Progression.
  const searchParams = useSearchParams();
  const jourParam = Number(searchParams.get("jour"));

  // Jour sélectionné à l'écran (suit le jour courant par défaut, mais on peut
  // revenir sur n'importe quelle journée déjà close).
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  useEffect(() => {
    setSelectedDay((d) => (d == null ? jourCourant : d));
  }, [jourCourant]);
  // Ouvre le jour demandé par l'URL (s'il est atteint).
  useEffect(() => {
    if (jourParam >= 1 && jourParam <= jourCourant) {
      setSelectedDay(jourParam);
    }
  }, [jourParam, jourCourant]);

  // Les grandes bascules du module (diagnostic → objectifs → parcours) ne sont
  // PAS des changements de route : le ScrollTop global ne s'y déclenche pas. On
  // remet donc en haut à chaque bascule, sinon on hérite du scroll de l'écran
  // précédent (ex. arriver sur « Perso » avec le titre coupé sous le header).
  const phase = !diagnostic ? "diag" : !objectifs ? "obj" : "parcours";
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [phase]);

  // Parcours sans fin : index de SESSION (compteur, non plafonné) vs CONTENU
  // (tourne en boucle sur 30 capsules). La réponse est classée sur la session.
  const sessionJour = selectedDay ?? jourCourant;
  const jour = parcours.jours.find((j) => j.n === contenuJour(sessionJour)) ?? null;
  const reponseDuJour = reponses[sessionJour];
  const termine = false;

  return (
    <div>
      {!diagnostic ? (
        <Diagnostic />
      ) : !objectifs ? (
        <Objectifs />
      ) : (
      <>

      {/* En-tête du module — seulement une fois le parcours lancé, pour ne pas
          écraser l'écran des questions (il respire : juste « Ma quête »). */}
      {/* J1 : en-tête complet (contexte utile). J2+ : version compacte, le
          paragraphe se replie derrière « En savoir plus » pour rendre l'écran
          au quotidien (il occupait ~40 % de la hauteur, répété chaque jour). */}
      {jourCourant <= 1 ? (
        <PageHead
          eyebrow="Module"
          title="Parcours des 20 signatures"
          sub="Ta signature n'est pas figée, elle oscille dans un mouvement permanent — qui soutient ta mécanique d'expansion ou celle de tes schémas connus."
          accessory={<EspritParcours seed="ma-quete" size={38} />}
        />
      ) : (
        <div className="mb-8 animate-fade-up">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.25em] text-fuchsia">Module</div>
              <h1 className="font-display text-xl font-light leading-tight text-ink">
                Parcours des 20 signatures
              </h1>
            </div>
            <EspritParcours seed="ma-quete" size={34} />
          </div>
          <details className="group mt-1">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs text-fuchsia [&::-webkit-details-marker]:hidden">
              En savoir plus
              <ChevronDown size={13} className="transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Ta signature n'est pas figée, elle oscille dans un mouvement permanent — qui soutient ta mécanique d'expansion ou celle de tes schémas connus.
            </p>
          </details>
        </div>
      )}

      {/* « Ma quête » : la vue qui relie ce qui l'anime, ce qu'elle construit,
          ce qu'elle explore et ce qui évolue — les quatre fils du parcours. */}
      {diagnostic && (
        <MaQueteApercu diagnostic={diagnostic} objectifs={objectifs} etat={etat} />
      )}

      {/* Poste de pilotage toujours accessible : curseurs qui déplacent la
          cartographie en direct + modification non destructive de la signature. */}
      {diagnostic && <AjusterParcours />}

      {/* Trois exercices du jour adossés à chaque volet (capsule · explore ·
          construis), cochables et renouvelés chaque jour. */}
      {diagnostic && (
        <ExercicesVolets
          signature={archetypeByKey[diagnostic.dominant].name}
          emergente={archetypeByKey[diagnostic.secondaire].name}
          direction={
            objectifs
              ? [objectifs.relationnel, objectifs.love, objectifs.pro, objectifs.perso].find(
                  (d) => d && d.trim()
                ) ?? ""
              : ""
          }
          jour={contenuJour(jourCourant)}
        />
      )}

      {/* Quiz d'auto-évaluation : où en es-tu sur un pilier, quand tu veux. */}
      {diagnostic && <QuizAuto />}

      {/* Les 4 univers, revenus comme ENTRÉES pour approfondir la signature
          (et non plus comme peaux de jeu de la Quête). */}
      {diagnostic && (
        <ApprofondirUnivers archName={archetypeByKey[diagnostic.dominant].name} />
      )}

      {/* Adossé au module, une fois le parcours lancé : les exercices (Quête) et
          les savoirs. Ils n'encombrent plus l'entrée du diagnostic. */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/quete"
          className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-fuchsia"
        >
          <Dumbbell size={18} className="flex-none text-fuchsia" />
          <span className="flex-1 text-sm text-ink">Les exercices de ta Quête — se délester, choisir, s'engager</span>
          <ArrowUpRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
        </Link>
        <Link
          href="/ressources"
          className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-fuchsia"
        >
          <GraduationCap size={18} className="flex-none text-fuchsia" />
          <span className="flex-1 text-sm text-ink">Les savoirs — neurosciences & psychologie de l'identité</span>
          <ArrowUpRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
        </Link>
      </div>


      {jour && (
        <section style={{ marginBottom: 48 }}>
          <JourView
            key={sessionJour}
            jour={jour}
            reponse={reponseDuJour}
            sessionJour={sessionJour}
            onClose={(r) => setSelectedDay(r.jour + 1)}
          />
        </section>
      )}

      <Dashboard />
      </>
      )}
    </div>
  );
}

// « Ma quête » — les quatre fils reliés : ce qui l'anime (sa signature), ce
// qu'elle construit (ses directions), ce qu'elle explore (sa secondaire) et ce
// qui évolue (ses mues). Chaque section pointe vers une donnée réelle du
// parcours, jamais un texte creux.
function MaQueteApercu({
  diagnostic,
  objectifs,
  etat,
}: {
  diagnostic: Diag;
  objectifs: ObjectifsT | null;
  etat: EtatEvolution;
}) {
  const climat = useParcoursStore((s) => s.climat);
  // Focus ÉVOLUTIF : lu dans l'audit énergétique (automatique, robuste). Le pilier
  // le plus bas devient le focus du moment — il change à mesure que l'énergie et
  // les directions bougent. C'est ce qui fait « évoluer » la quête au fil du vécu.
  const audit = auditDepuisEtat(etat, objectifs, climat, diagnostic);
  const dom = archetypeByKey[diagnostic.dominant];
  const sec = archetypeByKey[diagnostic.secondaire];
  const caps = objectifs
    ? [objectifs.relationnel, objectifs.love, objectifs.pro, objectifs.perso].filter((v) => v && v.trim())
    : [];
  // Vue VIVANTE (pas un instantané figé du diagnostic) : le jour courant, la
  // signature du moment (qui bouge au fil du vécu) et la direction mise en
  // chantier aujourd'hui (rotation par jour) → la carte « Ma quête » évolue.
  const jourCourantVue = contenuJour(progression(etat).jourCourant);
  const sigMoment = archetypeDominant(etat);
  const capDuJour = caps.length ? caps[(jourCourantVue - 1) % caps.length] : "";
  // Détection de mue : blindée (un historique d'ancienne version peut avoir une
  // autre forme et faire planter la segmentation → on tombe alors sur « pas de
  // mue » au lieu de casser toute la page).
  let mue: ReturnType<typeof derniereBascule> = null;
  try {
    mue = derniereBascule(detecterChapitres(etat.historique));
  } catch {
    mue = null;
  }

  const sections = [
    {
      titre: "Ce qui m'anime",
      hint: "Ce qui me donne naturellement de l'énergie.",
      valeur: dom.name,
      href: "/synthese",
      cta: "Voir ton portrait",
      aCompleter: false,
    },
    {
      titre: "Ce que je construis",
      hint: caps.length
        ? `Ta direction en chantier aujourd'hui${caps.length > 1 ? ` · ${caps.length} en tout` : ""}.`
        : "Choisis une direction par périmètre — c'est ce qui guide ton exploration.",
      valeur: caps.length ? capDuJour : "À toi d'ajouter ta direction",
      href: caps.length ? "/scenarios" : "/progression",
      cta: caps.length ? "Voir ce que ça ouvre" : "＋ Ajouter une direction",
      // Tant qu'aucune direction n'est posée, on met la carte EN AVANT (accent +
      // badge) pour que l'utilisatrice comprenne qu'il y a une action à faire.
      aCompleter: !caps.length,
    },
    {
      titre: "Ce que j'explore",
      hint: "La signature active en ce moment — elle bouge au fil des jours.",
      valeur: sigMoment?.name ?? sec.name,
      href: "/explorer",
      cta: "Explorer",
      aCompleter: false,
    },
    {
      titre: "Ce qui évolue",
      hint: "Les changements que je commence à percevoir.",
      valeur: mue
        ? `De ${archetypeByKey[mue.depuis].name} à ${archetypeByKey[mue.vers].name}`
        : "Tes premières observations se dessinent",
      href: "/progression",
      cta: "Suivre l'évolution",
      aCompleter: false,
    },
  ];

  return (
    <section className="mb-8 rounded-2xl border border-line bg-surface p-6 animate-fade-up">
      <div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia">Ma quête</div>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Ta quête relie ce que tu observes, ce que tu veux faire émerger et les
        directions que tu choisis d'explorer. Chaque fil est cliquable.
      </p>

      {/* Focus évolutif — piloté par l'audit énergétique : le pilier le plus bas
          devient le focus du moment. Il change au fil du vécu → la quête évolue. */}
      <div
        className="mt-5 rounded-xl border border-line p-4"
        style={{ background: "color-mix(in srgb, var(--ink) 5%, transparent)" }}
      >
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia">
          Ton focus qui évolue
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">
          En ce moment, ton énergie <b>{audit.aRecharger.label}</b> est au plus bas
          ({audit.aRecharger.credit}/100).{" "}
          {audit.aRecharger.direction
            ? `Ta direction « ${audit.aRecharger.direction} » est le levier du jour.`
            : "Pose-lui une direction pour commencer à la recharger."}
        </p>
        <p className="mt-1 text-xs text-muted">
          Ta ressource : {audit.ressource.label}. Ce focus se déplace à mesure que
          tu avances — ta quête n'est jamais deux fois la même.
        </p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.titre}
            href={s.href}
            className={`group flex flex-col rounded-xl border p-4 transition-colors ${
              s.aCompleter
                ? "border-fuchsia bg-fuchsia/[0.06] ring-1 ring-fuchsia/30"
                : "border-line hover:border-fuchsia"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">{s.titre}</div>
                {s.aCompleter && (
                  <span className="rounded-lg bg-fuchsia px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[color:var(--on-brand)]">
                    À compléter
                  </span>
                )}
              </div>
              <ArrowUpRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
            </div>
            <div className="mt-0.5 text-xs text-muted">{s.hint}</div>
            <div className={`mt-2 font-display text-base font-semibold leading-snug ${s.aCompleter ? "text-fuchsia" : "text-ink"}`}>
              {s.valeur}
            </div>
            {s.aCompleter ? (
              <span className="mt-3 inline-flex items-center gap-1.5 self-start rounded-lg brand-gradient px-4 py-2 text-xs font-semibold text-[color:var(--on-brand)]">
                {s.cta}
              </span>
            ) : (
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia">
                {s.cta} →
              </span>
            )}
          </Link>
        ))}
      </div>
      {/* Revoir sa signature — NON destructif : l'ajustement vit dans le panneau
          « Ajuster » (ci-dessus), qui conserve capsules et cartographie. Pour
          tout recommencer de zéro, c'est dans les Réglages (destructif, assumé). */}
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-sm text-muted">
          Envie de revoir ta signature ? Ouvre{" "}
          <span className="text-ink">« Ajuster → Ajuster ma signature »</span> ci-dessus : tu
          modifies tes réponses <span className="text-ink">sans perdre tes capsules ni ta carte</span>.
          Pour tout recommencer de zéro, c'est dans les{" "}
          <Link href="/settings" className="text-fuchsia hover:underline">
            Réglages
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
