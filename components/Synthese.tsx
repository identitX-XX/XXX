"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { ConstellationBg } from "./ConstellationBg";

// ===================== Types & données =====================

type Entry = {
  date: string;
  etatInterne: number | null;
  clarte: number | null;
  actionRelationnelle: number | null;
  exposition: number | null;
  poidsJour?: number;
  gratitude?: string;
  pensees?: string;
};

type Identity = { id: string; name: string; given: number; received: number };

type DeclaredProfile = {
  name?: string;
  goal?: string;
  keyword?: string;
  blocker?: string;
  understand?: string;
  values?: string[];
  strengths?: string[];
  fear?: string;
  ambition?: string;
};

type Scenario = {
  id: string;
  eyebrow: string;
  titre: string;
  constat: string;
  priorite: string;
  direction: string;
  leviers: string[];
  vigilance: string[];
};

const WEIGHTS = {
  etatInterne: 0.15,
  clarte: 0.2,
  actionRelationnelle: 0.3,
  exposition: 0.35,
} as const;

const DIMS = Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[];
const DIM_LABELS: Record<string, string> = {
  etatInterne: "État interne",
  clarte: "Clarté cognitive",
  actionRelationnelle: "Action relationnelle",
  exposition: "Exposition à l'expansion",
};

// ===================== Scoring =====================

function dailyScore(e: Entry): number | null {
  let sum = 0;
  let wsum = 0;
  for (const d of DIMS) {
    const v = e[d];
    if (v !== null && v !== undefined) {
      sum += WEIGHTS[d] * v;
      wsum += WEIGHTS[d];
    }
  }
  if (wsum === 0) return null;
  return Math.round((sum / wsum) * 100) / 10;
}

function toTime(d: string): number {
  return new Date(d + "T00:00:00Z").getTime();
}

function windowEntries(entries: Entry[], days: number, endDate: string): Entry[] {
  const end = toTime(endDate);
  const start = end - (days - 1) * 86400000;
  return entries.filter((e) => {
    const t = toTime(e.date);
    return t >= start && t <= end;
  });
}

function rollingAverage(entries: Entry[], days: number, endDate: string): number | null {
  const win = windowEntries(entries, days, endDate);
  const minReq = days === 7 ? 4 : days === 30 ? 15 : Math.ceil(days / 2);
  const scored = win
    .map((e) => ({ s: dailyScore(e), w: e.poidsJour ?? 1 }))
    .filter((x): x is { s: number; w: number } => x.s !== null);
  if (scored.length < minReq) return null;
  const wsum = scored.reduce((a, x) => a + x.w, 0);
  const sum = scored.reduce((a, x) => a + x.w * x.s, 0);
  return Math.round((sum / wsum) * 10) / 10;
}

function dimAverage(entries: Entry[], dim: (typeof DIMS)[number], days: number, endDate: string): number | null {
  const win = windowEntries(entries, days, endDate)
    .map((e) => e[dim])
    .filter((v): v is number => v !== null && v !== undefined);
  if (win.length === 0) return null;
  return Math.round((win.reduce((a, b) => a + b, 0) / win.length) * 10) / 10;
}

function classify(g: number, r: number): string {
  const hi = 5.5;
  if (r >= hi && g < hi) return "Source";
  if (r >= hi && g >= hi) return "Moteur";
  if (r < hi && g >= hi) return "Vampire";
  return "Dormante";
}

// ===================== Moteur de scénarios =====================

function buildScenarios(entries: Entry[], identities: Identity[], date: string, profile: DeclaredProfile | null): Scenario[] {
  const out: Scenario[] = [];

  const mg7 = rollingAverage(entries, 7, date);
  const mg30 = rollingAverage(entries, 30, date);
  const win7 = windowEntries(entries, 7, date);
  const filled7 = win7.filter((e) => dailyScore(e) !== null).length;

  const dims7 = DIMS.map((d) => ({ dim: d, avg: dimAverage(entries, d, 7, date) }));
  const known = dims7.filter((x) => x.avg !== null) as { dim: (typeof DIMS)[number]; avg: number }[];
  const weakest = known.length ? known.reduce((a, b) => (b.avg < a.avg ? b : a)) : null;
  const strongest = known.length ? known.reduce((a, b) => (b.avg > a.avg ? b : a)) : null;

  const etat = dimAverage(entries, "etatInterne", 7, date);
  const clarte = dimAverage(entries, "clarte", 7, date);
  const action = dimAverage(entries, "actionRelationnelle", 7, date);
  const expo = dimAverage(entries, "exposition", 7, date);

  const vampires = identities.filter((i) => classify(i.given, i.received) === "Vampire");
  const sources = identities.filter((i) => classify(i.given, i.received) === "Source");
  const bilan = identities.length
    ? identities.reduce((s, i) => s + i.received, 0) - identities.reduce((s, i) => s + i.given, 0)
    : null;

  const momentum = mg7 !== null && mg30 !== null ? mg7 - mg30 : null;

  // --- Règle 0 : terrain inconnu ---
  if (filled7 < 3) {
    out.push({
      id: "terrain",
      eyebrow: "Lecture préliminaire",
      titre: "Terrain inconnu",
      constat:
        filled7 === 0
          ? "Aucune mesure sur les 7 derniers jours. Le système n'a pas encore de matière à lire."
          : `Seulement ${filled7} mesure${filled7 > 1 ? "s" : ""} sur 7 jours. Toute lecture serait une projection, pas une tendance.`,
      priorite: "Construire la matière première : la régularité avant l'analyse.",
      direction: "Sept jours de journal consécutifs, même rapides. La trajectoire naîtra de la densité.",
      leviers: [
        "Une entrée par jour, 60 secondes suffisent",
        "Ancrer la saisie à un rituel existant (café, coucher)",
      ],
      vigilance: ["Vouloir interpréter avant d'avoir mesuré"],
    });
    // Même sans journal, la cartographie peut parler :
    if (vampires.length > 0) {
      out.push(vampireScenario(vampires, bilan));
    }
    return out;
  }

  // --- Règle 1 : confort trompeur ---
  if (etat !== null && expo !== null && etat >= 7 && expo <= 4) {
    out.push({
      id: "confort",
      eyebrow: "Scénario dominant",
      titre: "Confort trompeur",
      constat: `État interne à ${etat}/10, exposition à ${expo}/10. Tu te sens bien — mais dans un périmètre qui ne te confronte à rien de neuf.`,
      priorite: "Réintroduire du risque avant que le confort ne devienne un plafond.",
      direction: "Faire de l'exposition la mesure directrice des 30 prochains jours.",
      leviers: [
        "Une exposition par jour, même minime (un message, une demande, une porte poussée)",
        "Programmer une situation à enjeu réel cette semaine",
      ],
      vigilance: ["Confondre bien-être et progression", "Meubler l'agenda pour éviter l'inconfort utile"],
    });
  }

  // --- Règle 2 : générosité à perte ---
  if (action !== null && action >= 7 && ((bilan !== null && bilan < 0) || vampires.length > 0)) {
    out.push({
      id: "generosite",
      eyebrow: "Scénario dominant",
      titre: "Générosité à perte",
      constat: `Action relationnelle soutenue (${action}/10) — mais ta constellation ${
        bilan !== null && bilan < 0 ? `coûte plus qu'elle ne rend (${bilan})` : "contient des rôles qui drainent"
      }${vampires.length ? ` : ${vampires.map((v) => `« ${v.name} »`).join(", ")}` : ""}.`,
      priorite: "Renégocier avant d'agir davantage — l'effort supplémentaire nourrirait la fuite.",
      direction: "Rééquilibrer la constellation : réduire ce qui draine, amplifier ce qui nourrit.",
      leviers: [
        vampires.length
          ? `Redéfinir les termes de « ${vampires[0].name} » : périmètre, fréquence, ou sortie`
          : "Identifier le rôle le plus coûteux et en redéfinir les termes",
        sources.length
          ? `Donner plus d'espace à « ${sources[0].name} », ta source la plus nette`
          : "Protéger un créneau hebdomadaire pour un rôle qui te rend de l'énergie",
      ],
      vigilance: ["L'épuisement déguisé en dévouement", "Négocier en s'excusant au lieu de poser des termes"],
    });
  }

  // --- Règle 3 : expansion aveugle ---
  if (expo !== null && clarte !== null && expo >= 7 && clarte <= 4) {
    out.push({
      id: "aveugle",
      eyebrow: "Scénario dominant",
      titre: "Expansion sans boussole",
      constat: `Exposition forte (${expo}/10) mais clarté basse (${clarte}/10). Beaucoup de mouvement, peu de cap — l'énergie part dans toutes les directions.`,
      priorite: "Restaurer la clarté avant d'accélérer encore.",
      direction: "Une phase courte de tri : moins d'initiatives, mieux choisies.",
      leviers: [
        "Chaque matin : nommer LA priorité du jour avant d'ouvrir quoi que ce soit",
        "Geler les nouvelles pistes 7 jours ; finir ou fermer ce qui est ouvert",
      ],
      vigilance: ["Le mouvement comme fuite de la décision", "Multiplier les débuts pour éviter les fins"],
    });
  }

  // --- Règle 4 : vent de face / décélération ---
  if (momentum !== null && momentum < -3) {
    out.push({
      id: "deceleration",
      eyebrow: "Signal de tendance",
      titre: "Vent de face",
      constat: `Ta semaine (${mg7}) est nettement sous ta tendance de fond (${mg30}). Quelque chose freine — fatigue, contexte, ou charge invisible.`,
      priorite: "Identifier le frein avant de forcer.",
      direction: "Une semaine de régime protégé : maintenir le minimum vital sur les 4 dimensions sans viser la performance.",
      leviers: [
        weakest ? `Soigner d'abord « ${DIM_LABELS[weakest.dim]} », ta dimension la plus basse (${weakest.avg}/10)` : "Soigner la dimension la plus basse de la semaine",
        "Réduire volontairement une exigence non essentielle",
      ],
      vigilance: ["S'auto-juger sur une semaine creuse", "Compenser par du volume ce qui demande du repos"],
    });
  }

  // --- Règle 5 : élan freiné ---
  if (momentum !== null && momentum > 3 && vampires.length > 0) {
    out.push({
      id: "elan",
      eyebrow: "Signal de tendance",
      titre: "Élan freiné",
      constat: `Accélération réelle (semaine à ${mg7} contre ${mg30} de fond) — mais ${vampires.map((v) => `« ${v.name} »`).join(", ")} continue${vampires.length > 1 ? "nt" : ""} de prélever sa part.`,
      priorite: "Profiter de l'élan pour renégocier en position de force.",
      direction: "Convertir la dynamique en marge de manœuvre durable.",
      leviers: [
        `Utiliser cette énergie pour traiter « ${vampires[0].name} » maintenant, pas au prochain creux`,
        "Verrouiller une habitude née de cette bonne semaine avant qu'elle ne s'évapore",
      ],
      vigilance: ["Croire que l'élan absorbera indéfiniment les fuites"],
    });
  }

  // --- Règle 6 : constellation à renégocier (si pas déjà couverte) ---
  if (
    bilan !== null &&
    bilan < 0 &&
    !out.some((s) => s.id === "generosite" || s.id === "elan")
  ) {
    out.push(vampireScenario(vampires, bilan));
  }

  // --- Règles « déclaré vs vécu » : le profil d'onboarding confronté aux mesures ---

  const firstValue = profile?.values?.find((v) => v && v.trim().length > 0);

  // P1 : la peur démentie par les faits
  if (profile?.fear && profile.fear.trim() && expo !== null && expo >= 6) {
    out.push({
      id: "peur-dementie",
      eyebrow: "Déclaré vs vécu",
      titre: "La peur démentie",
      constat: `À ton arrivée, tu as nommé cette peur : « ${profile.fear.trim()} ». Or ton exposition réelle tourne à ${expo}/10 sur 7 jours — tu fais déjà, régulièrement, ce que cette peur est censée interdire.`,
      priorite: "Prendre acte : les faits contredisent la peur. Elle décrit ton passé, plus ton présent.",
      direction: "Reformuler cette peur à la lumière de ce que tu fais réellement — ou la retirer de ton récit.",
      leviers: [
        "Noter trois moments récents où tu as agi malgré elle",
        "Réécrire la peur au passé : « j'avais peur de… » et observer l'effet",
      ],
      vigilance: ["Garder une peur périmée comme excuse de réserve"],
    });
  }

  // P2 : l'ambition sans carburant
  if (profile?.ambition && profile.ambition.trim() && expo !== null && expo < 5) {
    out.push({
      id: "ambition-carburant",
      eyebrow: "Déclaré vs vécu",
      titre: "L'ambition sans carburant",
      constat: `Ton ambition déclarée à 12 mois : « ${profile.ambition.trim()} ». Ton exposition réelle : ${expo}/10. Le cap existe, mais le moteur qui l'atteint — l'exposition — tourne au ralenti.`,
      priorite: "Reconnecter l'ambition aux actes : une ambition sans exposition reste une intention.",
      direction: "Chaque exposition de la semaine doit pointer vers l'ambition, même de loin.",
      leviers: [
        "Identifier LA prochaine exposition qui rapproche concrètement de cette ambition",
        "La programmer avec une date avant dimanche",
      ],
      vigilance: ["Préparer encore au lieu d'exposer déjà", "Reformuler l'ambition au lieu de l'alimenter"],
    });
  }

  // P3 : la valeur contredite par la constellation
  if (firstValue && bilan !== null && bilan < 0) {
    out.push({
      id: "valeur-contredite",
      eyebrow: "Déclaré vs vécu",
      titre: "La valeur contredite",
      constat: `Tu as déclaré « ${firstValue.trim()} » parmi tes valeurs dominantes. Or ta constellation d'identités te coûte plus qu'elle ne te rend (bilan ${bilan})${vampires.length ? ` — notamment ${vampires.map((v) => `« ${v.name} »`).join(", ")}` : ""}. Ta vie quotidienne contredit ta valeur n°1.`,
      priorite: "Réaligner les rôles sur la valeur — pas l'inverse.",
      direction: `Que chaque rôle conservé passe le test : sert-il « ${firstValue.trim()} » ?`,
      leviers: [
        vampires.length
          ? `Passer « ${vampires[0].name} » au test de la valeur : le renégocier ou le quitter`
          : "Passer chaque rôle drainant au test de la valeur",
        "Nommer un rôle qui incarnerait pleinement cette valeur — et lui ouvrir de l'espace",
      ],
      vigilance: ["Vivre ses valeurs en théorie et ses rôles en pratique"],
    });
  }

  // P4 : le blocage à réinterroger
  if (profile?.blocker && profile.blocker.trim() && clarte !== null && clarte >= 6) {
    out.push({
      id: "blocage-reinterroge",
      eyebrow: "Déclaré vs vécu",
      titre: "Le blocage à réinterroger",
      constat: `Ton blocage déclaré à l'arrivée : « ${profile.blocker.trim()} ». Ta clarté cognitive tient pourtant à ${clarte}/10 sur la semaine — l'esprit est net. Ce blocage est-il encore réel, ou est-ce un souvenir qui s'attarde ?`,
      priorite: "Vérifier si le blocage d'hier gouverne encore aujourd'hui.",
      direction: "Le tester dans le réel une fois cette semaine, plutôt que le tenir pour acquis.",
      leviers: [
        "Décrire ce que serait la première preuve que le blocage a cédé",
        "Provoquer une situation où il devrait se manifester — et observer",
      ],
      vigilance: ["Entretenir un blocage identitaire devenu simple habitude de langage"],
    });
  }

  // --- Règle 7 : expansion installée ---
  if (mg30 !== null && mg30 >= 70 && out.length === 0) {
    out.push({
      id: "installee",
      eyebrow: "Régime confirmé",
      titre: "Expansion installée",
      constat: `Tendance de fond à ${mg30} : le système tourne en régime d'expansion depuis un mois. Ce n'est plus un pic, c'est un plateau haut.`,
      priorite: "Consolider avant d'ajouter — un plateau haut se protège.",
      direction: "Transformer ce régime en infrastructure : rituels, environnement, alliances.",
      leviers: [
        strongest ? `Documenter ce qui nourrit « ${DIM_LABELS[strongest.dim]} » (${strongest.avg}/10) pour le rendre reproductible` : "Documenter ce qui fonctionne pour le rendre reproductible",
        "Choisir UNE ambition supérieure et lui donner un premier pas daté",
      ],
      vigilance: ["L'ennui du plateau qui pousse à tout remettre en jeu", "Ajouter des projets au lieu d'approfondir"],
    });
  }

  // --- Règle 8 : repli à traverser ---
  if (mg30 !== null && mg30 < 40) {
    out.push({
      id: "repli",
      eyebrow: "Régime confirmé",
      titre: "Repli à traverser",
      constat: `Tendance de fond à ${mg30} : le système est en contraction depuis plusieurs semaines. Ce n'est pas un accident, c'est une saison.`,
      priorite: "Traverser sans se juger — et réduire la voilure officiellement plutôt que la subir.",
      direction: "Un objectif unique et atteignable par semaine, le reste en maintenance assumée.",
      leviers: [
        "Choisir la victoire minimale de la semaine et la protéger",
        strongest ? `S'appuyer sur « ${DIM_LABELS[strongest.dim]} », ta dimension qui tient (${strongest.avg}/10)` : "S'appuyer sur la dimension qui tient le mieux",
      ],
      vigilance: ["L'isolement qui accompagne les phases basses", "Les décisions structurantes prises en contraction"],
    });
  }

  // --- Fallback : cap tenu ---
  if (out.length === 0) {
    out.push({
      id: "cap",
      eyebrow: "Lecture du jour",
      titre: "Cap tenu",
      constat: `Régime stable${mg7 !== null ? ` (semaine à ${mg7}` : ""}${mg30 !== null ? `, fond à ${mg30})` : mg7 !== null ? ")" : ""}. Pas de signal d'alerte, pas de bascule — le système avance.`,
      priorite: weakest ? `Faire progresser « ${DIM_LABELS[weakest.dim]} », actuellement ta dimension la plus basse (${weakest.avg}/10).` : "Maintenir la régularité des mesures.",
      direction: "Amélioration marginale continue : +1 point sur la dimension faible d'ici 14 jours.",
      leviers: [
        weakest ? `Une action ciblée « ${DIM_LABELS[weakest.dim]} » par jour` : "Une action ciblée par jour sur la dimension faible",
        "Garder le rythme de saisie — la densité des données fait la précision des lectures",
      ],
      vigilance: ["La routine qui endort l'ambition"],
    });
  }

  return out.slice(0, 3);
}

function vampireScenario(vampires: Identity[], bilan: number | null): Scenario {
  return {
    id: "constellation",
    eyebrow: "Cartographie",
    titre: "Constellation à renégocier",
    constat: `${
      bilan !== null ? `Bilan énergétique à ${bilan} : tes rôles te coûtent plus qu'ils ne te rendent. ` : ""
    }${vampires.length ? `En cause : ${vampires.map((v) => `« ${v.name} »`).join(", ")}.` : ""}`,
    priorite: "Traiter la fuite d'énergie à la source — aucune performance ne compense un réservoir percé.",
    direction: "Renégocier ou redimensionner les rôles drainants dans les 30 jours.",
    leviers: [
      vampires.length
        ? `Pour « ${vampires[0].name} » : décider entre renégocier, réduire, ou sortir`
        : "Identifier le rôle le plus coûteux et poser ses nouveaux termes",
      "Refaire la cartographie dans 30 jours pour mesurer le déplacement",
    ],
    vigilance: ["La loyauté qui maintient des rôles morts", "Renégocier dans sa tête au lieu de le faire dans le réel"],
  };
}


// ===================== Composant principal =====================

export function Synthese() {
  const entries = useStore((s) => s.journalFusion);
  const identities = useStore((s) => s.identities);
  const profile = useStore((s) => s.profile);
  const date = new Date().toISOString().slice(0, 10);

  const scenarios = useMemo(
    () => buildScenarios(entries, identities, date, profile),
    [entries, identities, date, profile]
  );

  const mg7 = rollingAverage(entries, 7, date);
  const mg30 = rollingAverage(entries, 30, date);
  const todayEntry = entries.find((e) => e.date === date);
  const todayScore = todayEntry ? dailyScore(todayEntry) : null;

  const strate = (label: string, color: string, children: React.ReactNode) => (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: ".28em",
          textTransform: "uppercase",
          color,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, color-mix(in srgb, ${color} 40%, transparent), transparent 70%)`,
          marginBottom: 8,
        }}
      />
      {children}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--noir)",
        color: "var(--ink)",
        fontFamily: "var(--font-inter),'Outfit',sans-serif",
        fontWeight: 300,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes idx-rise {
          from { opacity: 0; transform: translateY(22px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @media (prefers-reduced-motion: reduce) {
          .idx-rise { animation: none !important; opacity: 1 !important }
        }
      `}</style>

      <ConstellationBg />

      {/* Lueurs d'ambiance */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(60% 42% at 85% 0%, rgba(255,79,163,.10), transparent 70%), radial-gradient(50% 36% at 10% 100%, rgba(255,138,76,.08), transparent 70%)",
        }}
      />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          padding: "52px 20px 90px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <div
          className="idx-rise"
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            animation: "idx-rise .7s ease both",
          }}
        >
          Identit<span style={{ color: "var(--fuchsia)" }}>X</span>
        </div>

        <h1
          className="idx-rise"
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontWeight: 400,
            fontSize: "clamp(30px,7.5vw,50px)",
            lineHeight: 1.06,
            textAlign: "center",
            margin: "22px 0 0",
            animation: "idx-rise .7s .08s ease both",
          }}
        >
          La{" "}
          <span
            style={{
              background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            lecture
          </span>{" "}
          du jour
        </h1>

        <p
          className="idx-rise"
          style={{
            fontFamily: "var(--font-fraunces),serif",
            fontStyle: "italic",
            fontSize: 15.5,
            color: "var(--muted)",
            textAlign: "center",
            maxWidth: 430,
            margin: "16px 0 0",
            lineHeight: 1.55,
            animation: "idx-rise .7s .16s ease both",
          }}
        >
          {profile?.keyword && profile.keyword.trim()
            ? `Sous le signe de « ${profile.keyword.trim()} » — ton journal et ta constellation, croisés.`
            : "Le croisement de ton journal et de ta constellation — priorités, direction, leviers."}
        </p>

        {/* Bandeau de mesures */}
        <div
          className="idx-rise"
          style={{
            display: "flex",
            gap: 26,
            marginTop: 30,
            padding: "14px 26px",
            borderRadius: 999,
            border: "1px solid rgba(255,138,76,.18)",
            background: "rgba(38,22,41,.35)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            animation: "idx-rise .7s .24s ease both",
          }}
        >
          {[
            { v: todayScore, l: "Jour" },
            { v: mg7, l: "7 j" },
            { v: mg30, l: "30 j" },
          ].map((m) => (
            <div key={m.l} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-fraunces),serif",
                  fontSize: 22,
                  background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {m.v ?? "—"}
              </div>
              <div style={{ fontSize: 9.5, letterSpacing: ".22em", color: "rgba(244,238,234,.45)", textTransform: "uppercase" }}>
                {m.l}
              </div>
            </div>
          ))}
        </div>

        {/* Cartes de lecture */}
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            marginTop: 38,
          }}
        >
          {scenarios.map((s, i) => (
            <article
              key={s.id}
              className="idx-rise"
              style={{
                borderRadius: 22,
                padding: "24px 22px 22px",
                background: "linear-gradient(160deg, rgba(38,22,41,.62), rgba(10,9,13,.35))",
                border: "1px solid rgba(255,79,163,.16)",
                boxShadow: "0 24px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(244,238,234,.05)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                animation: `idx-rise .8s ${0.34 + i * 0.14}s ease both`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: ".3em",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                }}
              >
                {s.eyebrow}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-fraunces),serif",
                  fontWeight: 400,
                  fontSize: 27,
                  lineHeight: 1.12,
                  margin: "10px 0 0",
                  background: "linear-gradient(90deg,var(--ink) 40%,var(--fuchsia))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {s.titre}
              </h2>
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: "rgba(244,238,234,.72)",
                  margin: "12px 0 0",
                }}
              >
                {s.constat}
              </p>

              {strate("Priorité", "var(--fuchsia)", (
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: "var(--ink)" }}>{s.priorite}</p>
              ))}

              {strate("Direction", "var(--orange)", (
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: "var(--ink)" }}>{s.direction}</p>
              ))}

              {strate("Leviers", "var(--muted)", (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {s.leviers.map((l, k) => (
                    <div key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span
                        aria-hidden="true"
                        style={{
                          marginTop: 7,
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "rgba(244,238,234,.85)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              ))}

              {strate("Vigilance", "var(--danger)", (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {s.vigilance.map((v, k) => (
                    <div key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span
                        aria-hidden="true"
                        style={{
                          marginTop: 7,
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "var(--danger)",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "rgba(244,238,234,.75)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </article>
          ))}
        </div>

        <p
          className="idx-rise"
          style={{
            fontSize: 11.5,
            color: "rgba(244,238,234,.38)",
            textAlign: "center",
            maxWidth: 400,
            marginTop: 30,
            lineHeight: 1.6,
            fontStyle: "italic",
            animation: "idx-rise .8s .9s ease both",
          }}
        >
          Cette lecture se régénère à chaque visite, à partir de tes mesures réelles. Plus le journal est dense, plus elle devient précise.
        </p>
      </main>
    </div>
  );
}
