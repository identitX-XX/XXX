"use client";

// La Quête — pour ton archétype dominant, ce dont il faut te débarrasser, en
// deux exercices (carrefour · pacte). Fini les « mondes » neon
// pour ados : la Quête vit dans l'identité sobre de l'appli (lin & prune).

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown, Check, Repeat, MessageCircle, BookOpen } from "lucide-react";
import { PageHead } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { queteDe, futurMoiDe } from "@/parcours-archetypes/quete";
import { gesteDuJour } from "@/parcours-archetypes/variateJour";
import { constancePactes } from "@/parcours-archetypes/pactes";
import { detecterChapitres, derniereBascule, Bascule } from "@/parcours-archetypes/bascules";
import type { Monde } from "@/parcours-archetypes/mondes";
import { ArchetypeKey } from "@/parcours-archetypes/types";

// La Quête n'a plus de peaux visuelles : une seule « ambiance » sobre, câblée
// sur les tokens de thème de l'appli. Tous les anciens `m.*` (fond, encre,
// accent…) pointent donc vers la palette lin & prune — plus aucun neon.
const SOBRE: Monde = {
  key: "nature",
  nom: "",
  tagline: "",
  motif: "",
  bg: "var(--surface)",
  panel: "var(--raised)",
  line: "var(--line)",
  ink: "var(--ink)",
  muted: "var(--muted)",
  accent: "var(--fuchsia)",
  accent2: "var(--orange)",
  recompense: "étoile",
  recompensePl: "étoiles",
};

// Arc narratif de la Quête — une histoire qui AVANCE à chaque palier tenu. Le
// « niveau » = nombre de boucles complètes (+1 si la boucle courante est finie).
// Générique (tissé sur le lest + le futur moi de la signature) → marche pour les
// 20 signatures sans réécrire 20 récits, et se renouvelle palier après palier.
function narratifQuete(
  archName: string,
  lest: string,
  futurNom: string,
  niveau: number
): { titre: string; texte: string; niveau: number; total: number } {
  const chapitres = [
    {
      titre: "Chapitre 1 · La rencontre",
      texte: `Tu reconnais ${lest} — ce poids qui te suit partout. Le nommer, c'est déjà commencer à t'en défaire.`,
    },
    {
      titre: "Chapitre 2 · Le relâchement",
      texte: `Une première boucle tenue. ${lest} desserre son emprise ; « ${archName} » respire un peu plus librement.`,
    },
    {
      titre: "Chapitre 3 · L'ancrage",
      texte: `Ce n'est plus un effort : ça devient un réflexe. Chaque boucle grave un peu plus la nouvelle façon d'être.`,
    },
    {
      titre: `Chapitre final · ${futurNom}`,
      texte: `Le lest posé, tu deviens ${futurNom}. Tu peux rejouer la boucle pour ancrer encore — mais le chemin, désormais, tu le connais.`,
    },
  ];
  const i = Math.max(0, Math.min(niveau, chapitres.length - 1));
  return { ...chapitres[i], niveau: i, total: chapitres.length };
}

export default function QuetePage() {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const etat = useParcoursStore((s) => s.etat);

  if (!diagnostic) {
    return (
      <div>
        <PageHead
          eyebrow="La Quête"
          title="Révèle d'abord ta signature"
          sub="La Quête est taillée pour ta signature dominante. Réponds aux douze questions, et elle s'ouvrira."
        />
        <Link
          href="/parcours-signatures"
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-[color:var(--on-brand)] shadow-glow"
        >
          Révéler ma signature
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // La Quête suit la MUE : elle se cale sur l'archétype dominant COURANT (le
  // dernier chapitre tenu), pas sur celui figé au diagnostic. Quand une mue a
  // eu lieu, on la nomme — et les exercices se renouvellent d'eux-mêmes.
  let mue: Bascule | null = null;
  try {
    mue = derniereBascule(detecterChapitres(etat.historique));
  } catch {
    mue = null;
  }
  const archKeyActuel = mue?.vers ?? diagnostic.dominant;
  const jour = Math.min(Math.max(etat.jourCourant, 1), 30);

  return <QueteMonde archKey={archKeyActuel} monde={SOBRE} mue={mue} jour={jour} />;
}

function QueteMonde({
  archKey,
  monde: m,
  mue,
  jour,
}: {
  archKey: ArchetypeKey;
  monde: Monde;
  mue: Bascule | null;
  jour: number;
}) {
  const arch = archetypeByKey[archKey];
  const quete = queteDe(archKey);
  const futur = futurMoiDe(archKey);
  const done = useParcoursStore((s) => s.queteExercices);
  const paliers = useParcoursStore((s) => s.quetePaliers);
  const pactes = useParcoursStore((s) => s.pactes);
  const constance = constancePactes(pactes);
  const rejouer = useParcoursStore((s) => s.rejouerQuete);
  const [tour, setTour] = useState(0);

  // Progression mesurable : paliers de maîtrise de CET archétype, et maîtrise
  // totale cumulée à travers tous les archétypes traversés (au fil des mues).
  const palier = paliers[archKey] ?? 0;
  const maitriseTotale = Object.values(paliers).reduce((s, n) => s + n, 0);
  const archTraverses = Object.values(paliers).filter((n) => n > 0).length;

  const ids = {
    carrefour: `${archKey}:carrefour`,
    pacte: `${archKey}:pacte`,
  };
  const etapes = [
    { label: "Choisir", done: Boolean(done[ids.carrefour]) },
    { label: "S'engager", done: Boolean(done[ids.pacte]) },
  ];
  const faits = etapes.filter((e) => e.done).length;
  const accompli = faits === 2;

  const reparcourir = () => {
    rejouer(archKey);
    setTour((t) => t + 1);
  };

  // Toutes les signatures n'ont pas encore leur Quête dédiée (contenu hérité,
  // remappé sur 12/20). Dégradation propre : on invite plutôt que de casser.
  if (!quete || !futur) {
    return (
      <div>
        <PageHead
          eyebrow="La Quête"
          title={`La Quête de ${arch.name} arrive bientôt`}
          sub="Les exercices dédiés à cette signature sont en cours d'écriture. En attendant, ta capsule du jour continue de te faire avancer."
        />
        <Link
          href="/parcours-signatures"
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-[color:var(--on-brand)] shadow-glow"
        >
          Retour à ma quête <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Niveau narratif = boucles complètes tenues (+1 si la boucle courante est finie).
  const narr = narratifQuete(arch.name, quete.lest, futur.nom, palier + (accompli ? 1 : 0));

  return (
    <div
      className="rounded-3xl border p-6 sm:p-9"
      style={{ background: m.bg, borderColor: m.line, color: m.ink }}
    >
      <style>{`
        @keyframes idx-envol { from { transform: translateY(0) scale(1); opacity: 1; } to { transform: translateY(-22px) scale(.86); opacity: .28; } }
        @keyframes idx-sceau { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes idx-monte { from { width: 0; } }
      `}</style>

      {/* En-tête */}
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: m.accent }}>
          La Quête
        </div>
        <h1 className="mt-2 break-words font-display text-3xl font-semibold leading-tight" style={{ color: m.ink }}>
          {arch.name}
        </h1>
      </div>

      {/* La mue a fait évoluer la quête — on la nomme, et on rassure : ce qui a
          été acquis sur l'archétype précédent reste acquis. */}
      {mue && (
        <div
          className="mt-5 rounded-2xl border p-4"
          style={{ borderColor: m.accent, background: `color-mix(in srgb, ${m.accent} 8%, transparent)` }}
        >
          <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: m.accent }}>
            Ton vortex a fait évoluer ta quête
          </div>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: m.ink }}>
            De <b>{archetypeByKey[mue.depuis].name}</b> à <b>{archetypeByKey[mue.vers].name}</b>.
            Nouveau lest, nouveaux exercices — ta maîtrise de{" "}
            {archetypeByKey[mue.depuis].name} reste acquise.
          </p>
        </div>
      )}

      {/* Clarté jour après jour : ce qui est ton fil, ce qui change chaque jour. */}
      {!mue && (
        <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: m.line, background: m.panel }}>
          <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: m.accent }}>
            Ton fil
          </div>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: m.muted }}>
            Le <b style={{ color: m.ink }}>lest</b> de <b style={{ color: m.ink }}>{arch.name}</b> est
            ton fil : il te travaille sur la durée. Mais chaque passage t'apporte du neuf —
            ton <b style={{ color: m.ink }}>pacte du jour</b> change, et l'ordre de tes
            poids à relâcher aussi. Le jour où tu <b style={{ color: m.ink }}>mues</b>, tout se renouvelle.
          </p>
        </div>
      )}

      {/* Progression NARRATIVE — un chapitre qui avance à chaque palier tenu.
          On revient pour connaître la suite, pas pour refaire la même chose. */}
      <div
        className="mt-5 overflow-hidden rounded-2xl border p-5"
        style={{ borderColor: m.accent, background: `color-mix(in srgb, ${m.accent} 8%, transparent)` }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: m.accent }}>
            {narr.titre}
          </div>
          <span className="text-[12px] font-semibold" style={{ color: m.muted }}>
            {narr.niveau + 1} / {narr.total}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: m.ink }}>{narr.texte}</p>
        {/* Frise des chapitres — la barre d'histoire qui se remplit. */}
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: narr.total }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{ background: i <= narr.niveau ? m.accent : m.line }}
            />
          ))}
        </div>
        {/* Jauge de constance — les engagements tenus, jour après jour. */}
        {constance.serie > 0 && (
          <p className="mt-2.5 text-[12px] font-medium" style={{ color: m.accent }}>
            🔥 {constance.serie} engagement{constance.serie > 1 ? "s" : ""} tenu
            {constance.serie > 1 ? "s" : ""} d'affilée
            {constance.tenus > constance.serie ? ` · ${constance.tenus} au total` : ""}
          </p>
        )}
      </div>

      {/* Le lest */}
      <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: m.line, background: m.panel }}>
        <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: m.muted }}>
          Ce dont tu dois te débarrasser
        </div>
        <div className="mt-1.5 font-display text-2xl font-light" style={{ color: m.accent }}>
          {quete.lest}
        </div>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: m.muted }}>{quete.pourquoi}</p>
      </div>

      {/* La boucle heuristique — visible du début à la fin, s'allume à mesure. */}
      <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: m.line, background: m.panel }}>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: m.muted }}>
            La boucle
          </div>
          {/* Palier de maîtrise mesurable — combien de boucles complètes tenues. */}
          <span
            className="rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em]"
            style={{ background: `color-mix(in srgb, ${m.accent} 14%, transparent)`, color: m.accent }}
          >
            Palier {palier + (accompli ? 1 : 0)}
          </span>
        </div>
        <div className="mt-3 flex items-start gap-1">
          {etapes.map((e, i) => (
            <div key={e.label} className="flex flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
                <span
                  className="grid h-7 w-7 flex-none place-items-center rounded-full text-[12px] font-semibold"
                  style={e.done ? { background: m.accent, color: "#0a0a0a" } : { border: `1px solid ${m.line}`, color: m.muted }}
                >
                  {e.done ? <Check size={13} /> : i + 1}
                </span>
                <span className="text-[12px] leading-tight" style={{ color: e.done ? m.ink : m.muted }}>
                  {e.label}
                </span>
              </div>
              {i < etapes.length - 1 && (
                <ArrowRight size={14} className="mt-2 flex-none" style={{ color: e.done ? m.accent : m.line }} />
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed" style={{ color: m.muted }}>
          L'énergie heuristique : tu essaies, tu observes, tu ajustes — puis tu recommences, un cran plus haut.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: m.line }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(faits / 3) * 100}%`, background: `linear-gradient(90deg, ${m.accent}, ${m.accent2})` }}
            />
          </div>
          <span className="text-xs" style={{ color: m.muted }}>
            {faits}/3 · {faits} {faits > 1 ? m.recompensePl : m.recompense}
          </span>
        </div>
        {/* Maîtrise mesurable, cumulée à travers les mues — elle ne remet jamais
            le compteur à zéro : chaque archétype traversé ajoute ses paliers. */}
        {maitriseTotale > 0 && (
          <p className="mt-3 text-[12px]" style={{ color: m.muted }}>
            Maîtrise totale · <b style={{ color: m.ink }}>{maitriseTotale}</b> palier
            {maitriseTotale > 1 ? "s" : ""} sur {archTraverses} signature
            {archTraverses > 1 ? "s" : ""} traversée{archTraverses > 1 ? "s" : ""}.
          </p>
        )}
      </div>

      {/* La boucle mène au Futur Moi — la connexion, fléchée. */}
      {accompli && (
        <div className="mt-4 flex flex-col items-center gap-1" style={{ color: m.accent }}>
          <ArrowDown size={18} />
          <span className="text-[12px] uppercase tracking-[0.18em]">La boucle t'a mené ici</span>
        </div>
      )}

      {/* Le Futur Moi — là où l'on atterrit au bout de la quête. */}
      {accompli && (
        <div
          className="mt-6 overflow-hidden rounded-2xl border"
          style={{ borderColor: m.accent, background: m.panel }}
        >
          <div
            className="px-6 py-5 text-center"
            style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${m.accent} 16%, transparent), transparent)` }}
          >
            <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: m.accent }}>
              Ton futur moi · le lest posé
            </div>
            <div className="mt-1.5 font-display text-2xl font-light" style={{ color: m.ink }}>
              {futur.nom}
            </div>
          </div>
          <div className="flex flex-col gap-4 px-6 py-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: m.muted }}>Pourquoi tu y es à ton meilleur</div>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: m.ink }}>{futur.pourquoi}</p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: m.muted }}>Ta multipotentialité, devenue force</div>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: m.ink }}>{futur.multipotentiel}</p>
            </div>
            <button
              onClick={reparcourir}
              className="mt-1 inline-flex items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-medium"
              style={{ background: `linear-gradient(90deg, ${m.accent}, ${m.accent2})`, color: "#0a0a0a" }}
            >
              <Repeat size={15} />
              Reparcourir la boucle, un cran plus haut
            </button>
          </div>
        </div>
      )}

      {/* Les exercices de la Quête */}
      <div className="mt-6 flex flex-col gap-4">
        <Carrefour key={`car-${tour}`} m={m} carrefour={quete.carrefour} id={ids.carrefour} />
        <Pacte key={`pac-${tour}`} m={m} geste={gesteDuJour(arch, jour)} id={ids.pacte} jour={jour} archKey={archKey} />
      </div>

      {/* Fléchage Coach & Ressources — présent jusque dans le monde immersif :
          on n'est jamais seul·e ni en cul-de-sac, même au cœur de la Quête. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/coach"
          className="group flex items-center gap-3 rounded-2xl border p-4 transition-colors"
          style={{ borderColor: m.line, background: m.panel, color: m.ink }}
        >
          <MessageCircle size={18} style={{ color: m.accent, flex: "none" }} />
          <span className="flex-1 text-sm">Bloquée sur un exercice ? Parle-en à IdentitX</span>
          <ArrowRight size={15} style={{ color: m.accent }} className="flex-none transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/ressources"
          className="group flex items-center gap-3 rounded-2xl border p-4 transition-colors"
          style={{ borderColor: m.line, background: m.panel, color: m.ink }}
        >
          <BookOpen size={18} style={{ color: m.accent, flex: "none" }} />
          <span className="flex-1 text-sm">Un appui pour tenir ton pacte ? Les ressources</span>
          <ArrowRight size={15} style={{ color: m.accent }} className="flex-none transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

// Emblèmes au trait des exercices (même langage ligne claire) : carrefour
// (chemin qui bifurque), pacte (sceau + ruban).
type ExKind = "carrefour" | "pacte";
function ExerciceEmbleme({ kind, color, size = 38 }: { kind: ExKind; color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {kind === "carrefour" && (
        <>
          <path d="M20 36 V22 M20 22 C20 16 12 15 8 9 M20 22 C20 16 28 15 32 9" />
          <circle cx="8" cy="8" r="2" fill={color} stroke="none" />
          <circle cx="32" cy="8" r="2" fill={color} stroke="none" />
        </>
      )}
      {kind === "pacte" && (
        <>
          <circle cx="20" cy="17" r="9" />
          <path
            d="M20 11 l1.4 3.6 3.9 .3 -3 2.6 .9 3.8 -3.2 -2 -3.2 2 .9 -3.8 -3 -2.6 3.9 -.3 Z"
            fill={color}
            stroke="none"
          />
          <path d="M15 25 L13 36 L17 32 L20 36 L23 32 L27 36 L25 25" />
        </>
      )}
    </svg>
  );
}

function Cadre({
  m,
  num,
  titre,
  done,
  kind,
  children,
}: {
  m: Monde;
  num: number;
  titre: string;
  done: boolean;
  kind?: ExKind;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
      style={{ borderColor: done ? m.accent : m.line, background: m.panel }}
    >
      {/* filet interne : la « case » de BD */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-1.5 rounded-xl"
        style={{ border: `1px solid color-mix(in srgb, ${m.accent} 16%, transparent)` }}
      />
      <div className="relative flex items-center gap-3">
        <div
          className="grid h-7 w-7 flex-none place-items-center rounded-full text-xs font-semibold"
          style={done
            ? { background: m.accent, color: "#0a0a0a" }
            : { border: `1px solid ${m.line}`, color: m.muted }}
        >
          {done ? <Check size={14} /> : num}
        </div>
        <div className="flex-1 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: done ? m.accent : m.ink }}>
          {titre}
        </div>
        {kind && <ExerciceEmbleme kind={kind} color={done ? m.accent : m.muted} />}
      </div>
      <div className="relative mt-4">{children}</div>
    </div>
  );
}

// Exercice 2 — choisir la réponse qui fait grandir.
function Carrefour({ m, carrefour, id }: { m: Monde; carrefour: NonNullable<ReturnType<typeof queteDe>>["carrefour"]; id: string }) {
  const done = useParcoursStore((s) => s.queteExercices[id]);
  const marquer = useParcoursStore((s) => s.marquerExercice);
  const [choisi, setChoisi] = useState<number | null>(null);

  const pick = (i: number) => {
    setChoisi(i);
    if (carrefour.choix[i].bon) marquer(id);
  };
  const c = choisi != null ? carrefour.choix[choisi] : null;

  return (
    <Cadre m={m} num={1} titre="Le carrefour" done={Boolean(done)} kind="carrefour">
      <p className="text-sm leading-relaxed" style={{ color: m.ink }}>{carrefour.situation}</p>
      <div className="mt-4 flex flex-col gap-2.5">
        {carrefour.choix.map((ch, i) => {
          const actif = choisi === i;
          const bon = actif && ch.bon;
          const mauvais = actif && !ch.bon;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className="rounded-xl border px-4 py-3 text-left text-sm transition-all"
              style={{
                borderColor: bon ? m.accent : mauvais ? m.muted : m.line,
                color: m.ink,
                background: actif ? `color-mix(in srgb, ${bon ? m.accent : m.muted} 12%, transparent)` : "transparent",
              }}
            >
              {ch.texte}
            </button>
          );
        })}
      </div>
      {c && (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: c.bon ? m.accent : m.muted }}>
          {c.retour}{!c.bon && " — réessaie."}
        </p>
      )}
    </Cadre>
  );
}

// Exercice 3 — s'engager sur un geste.
function Pacte({ m, geste, id, jour, archKey }: { m: Monde; geste: string; id: string; jour: number; archKey: string }) {
  const done = useParcoursStore((s) => s.queteExercices[id]);
  const marquer = useParcoursStore((s) => s.marquerExercice);
  const prendrePacte = useParcoursStore((s) => s.prendrePacte);
  const sengager = () => {
    marquer(id); // valide l'étape de la boucle
    prendrePacte(jour, geste, archKey); // ...et inscrit l'engagement dans le fil (check-in demain)
  };
  return (
    <Cadre m={m} num={2} titre="Le pacte" done={Boolean(done)} kind="pacte">
      <p className="text-sm leading-relaxed" style={{ color: m.ink }}>{geste}</p>
      {done ? (
        <div className="mt-3 flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 flex-none place-items-center rounded-full text-sm font-bold"
            style={{ background: m.accent, color: "#0a0a0a", animation: "idx-sceau .5s ease forwards" }}
          >
            ✓
          </span>
          <p className="text-sm" style={{ color: m.accent }}>Engagement pris. À toi de le tenir.</p>
        </div>
      ) : (
        <button
          onClick={sengager}
          className="mt-4 rounded-full px-6 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03]"
          style={{ background: `linear-gradient(90deg, ${m.accent}, ${m.accent2})`, color: "#0a0a0a" }}
        >
          Je m'engage
        </button>
      )}
    </Cadre>
  );
}
