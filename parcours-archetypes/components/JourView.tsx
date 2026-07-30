"use client";
// parcours-archetypes/components/JourView.tsx
// L'écran-laboratoire d'une journée : les 10 sections + la saisie (curseurs par
// sphère, émotions, micro-défi, note). À la clôture → store.repondreJour, qui
// fait avancer le moteur d'évolution.
//
// Relecture : si une réponse existe déjà pour ce jour (`reponse`), l'écran est
// en LECTURE SEULE et réaffiche les choix enregistrés. L'historique n'est
// jamais perdu ni écrasé (repondreJour est idempotent).

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EMOTIONS, SPHERES, archetypeByKey, phaseDuJour } from "../archetypes";
import { EmotionKey, EtatEvolution, Jour, ReponseJour, SphereKey } from "../types";
import { useParcoursStore } from "../store";
import {
  archetypeDominant,
  coherenceCourante,
  equilibreSpheres,
  heatmapEmotions,
  radarCourant,
} from "../indicateurs";
import { useStore } from "@/store/useStore";
import { track } from "@/lib/metrics";

const FUCHSIA = "var(--fuchsia)";
const ORANGE = "var(--orange)";
const LINE = "var(--line)";
const MUTED = "var(--muted)";
const INK = "var(--ink)";
const NOIR = "#0a090d";
const SURFACE = "var(--surface)";

const serif = "var(--font-fraunces), Georgia, serif";
const sans = "var(--font-inter), system-ui, sans-serif";

export function JourView({
  jour,
  reponse,
  onClose,
}: {
  jour: Jour;
  reponse?: ReponseJour;
  onClose?: (r: ReponseJour) => void;
}) {
  const repondreJour = useParcoursStore((s) => s.repondreJour);
  const readOnly = Boolean(reponse);
  const a = archetypeByKey[jour.archetype];
  const phase = phaseDuJour(jour.n);

  const [curseurs, setCurseurs] = useState<Record<SphereKey, number>>(() => {
    if (reponse) return reponse.curseurs;
    const init = {} as Record<SphereKey, number>;
    for (const s of SPHERES) init[s.key] = s.key === jour.sphereFocus ? 55 : 25;
    return init;
  });
  const [emotions, setEmotions] = useState<EmotionKey[]>(
    reponse ? reponse.emotions : []
  );
  // L'intensité du défi n'a plus de curseur dédié (bilan resserré à 2 curseurs) :
  // on conserve la valeur enregistrée en relecture, sinon une valeur neutre.
  const [intensiteDefi] = useState(reponse ? reponse.intensiteDefi : 40);
  const [note, setNote] = useState(reponse ? reponse.note : "");
  // À la clôture on garde l'état AVANT et APRÈS pour montrer ce que la journée
  // a fait bouger (réaction visible, pas un simple ✓).
  const [closed, setClosed] = useState<{
    r: ReponseJour;
    avant: EtatEvolution;
    apres: EtatEvolution;
  } | null>(null);

  const sectionsByKind = useMemo(
    () => Object.fromEntries(jour.sections.map((s) => [s.kind, s])),
    [jour]
  );

  const toggleEmotion = (k: EmotionKey) => {
    if (readOnly) return;
    setEmotions((prev) =>
      prev.includes(k) ? prev.filter((e) => e !== k) : [...prev, k]
    );
  };

  const cloturer = () => {
    if (readOnly) return;
    const r: ReponseJour = {
      jour: jour.n,
      archetype: jour.archetype,
      sphereFocus: jour.sphereFocus,
      curseurs,
      emotions,
      intensiteDefi,
      note,
      date: new Date().toISOString(),
    };
    const avant = useParcoursStore.getState().etat;
    repondreJour(r); // historise la journée (reponses + snapshot d'évolution)
    const apres = useParcoursStore.getState().etat;
    track("day_completed", { day_number: jour.n }); // rétention (métrique clé)
    setClosed({ r, avant, apres }); // → écran de réaction avant d'avancer
  };

  // Réaction de clôture : la journée vient d'être enregistrée — on MONTRE ce
  // qu'elle a fait bouger dans la matrice, animé, plutôt qu'un simple accusé.
  if (closed) {
    return (
      <ReactionClotature
        r={closed.r}
        avant={closed.avant}
        apres={closed.apres}
        archName={a.name}
        onNext={() => onClose?.(closed.r)}
      />
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: sans, color: INK }}>
      {/* En-tête */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: FUCHSIA }}>
          La capsule du jour
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
          Jour {jour.n} / 30 · {phase.label}
        </div>
        <h1 className="fr-title" style={{ fontFamily: serif, fontWeight: 600, fontSize: 34, margin: "8px 0 4px", color: INK }}>
          {a.name}
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: MUTED, margin: 0 }}>{a.lens}</p>
        {!readOnly && (
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: MUTED, margin: "10px 0 0" }}>
            Choisis une situation que tu rencontres régulièrement. Pendant
            quelques minutes, observe ce qui s'y joue.
          </p>
        )}
      </div>

      {/* Bandeau relecture */}
      {readOnly && (
        <div
          style={{
            marginBottom: 18,
            borderRadius: 12,
            border: `1px solid ${LINE}`,
            background: "color-mix(in srgb, var(--fuchsia) 6%, transparent)",
            padding: "10px 14px",
            fontSize: 12.5,
            color: MUTED,
          }}
        >
          Tu revois une journée déjà close — tes choix sont conservés, rien
          n'est modifiable ici.
        </div>
      )}

      {/* Écran resserré : on garde la colonne « agir → réagir ». La question du
          jour devient le héros ; le cadre (intention) tient en une ligne ; les
          narratifs qui retardaient la récompense (observation, écho, clôture)
          sont retirés — la clôture, désormais, c'est l'écran de réaction. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Separateur label="Ton geste du jour" sous="À porter et vivre dans ta journée." />
        {/* La question à porter — le cœur réflexif de la journée, mis en avant */}
        <div
          style={{
            borderRadius: 16,
            border: `1px solid color-mix(in srgb, ${FUCHSIA} 30%, transparent)`,
            background: `radial-gradient(130% 130% at 0% 0%, color-mix(in srgb, ${FUCHSIA} 7%, transparent), transparent 60%)`,
            padding: "18px 18px",
          }}
        >
          {sectionsByKind["intention"]?.texte && (
            <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: MUTED, marginBottom: 10 }}>
              {sectionsByKind["intention"]?.texte}
            </div>
          )}
          <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: FUCHSIA, marginBottom: 8 }}>
            {sectionsByKind["question"]?.titre ?? "La question à porter"}
          </div>
          <div style={{ fontFamily: serif, fontWeight: 300, fontSize: 18, lineHeight: 1.45, color: INK }}>
            {sectionsByKind["question"]?.texte}
          </div>
        </div>

        {/* Le geste concret à poser dans la journée (texte seul ; son intensité
            se note le soir, dans le bilan). */}
        {sectionsByKind["defi"]?.texte && (
          <Bloc titre={sectionsByKind["defi"]?.titre ?? "Le micro-défi"}>
            {sectionsByKind["defi"]?.texte}
          </Bloc>
        )}

        <Separateur label="Ton bilan du soir" sous="Une fois la journée terminée, observe ce qui s'est exprimé." />

        {/* Deux curseurs, pas cinq : on garde l'essentiel du bilan du soir —
            l'intensité de la dimension du jour et son effet sur les relations.
            Les deux alimentent la matrice (sphère focus + sphère « relations ») ;
            les autres sphères conservent leur valeur de départ. */}
        <Bloc titre="Ton bilan du soir">
          <div style={{ fontSize: 13.5, color: INK, marginBottom: 16, lineHeight: 1.5, fontFamily: serif }}>
            Dans cette situation, quelle dimension de toi était la plus présente ?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                <span style={{ color: INK }}>Intensité</span>
                <span style={{ fontFamily: serif, color: INK }}>{curseurs[jour.sphereFocus]}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>
                À quel point cette dimension s'est-elle exprimée ?
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={curseurs[jour.sphereFocus]}
                disabled={readOnly}
                onChange={(e) =>
                  setCurseurs((prev) => ({ ...prev, [jour.sphereFocus]: Number(e.target.value) }))
                }
                style={{ width: "100%", accentColor: FUCHSIA, cursor: readOnly ? "default" : "pointer", opacity: readOnly ? 0.7 : 1 }}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                <span style={{ color: INK }}>Relations</span>
                <span style={{ fontFamily: serif, color: INK }}>{curseurs["relations"]}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>
                Comment cette expérience a-t-elle influencé ta relation aux autres ?
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={curseurs["relations"]}
                disabled={readOnly}
                onChange={(e) =>
                  setCurseurs((prev) => ({ ...prev, relations: Number(e.target.value) }))
                }
                style={{ width: "100%", accentColor: ORANGE, cursor: readOnly ? "default" : "pointer", opacity: readOnly ? 0.7 : 1 }}
              />
            </div>
          </div>
        </Bloc>

        {/* Émotions */}
        <Bloc titre={sectionsByKind["emotions"]?.titre ?? "Émotions du jour"}>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
            {sectionsByKind["emotions"]?.texte}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EMOTIONS.map((e) => {
              const on = emotions.includes(e.key);
              return (
                <button
                  key={e.key}
                  onClick={() => toggleEmotion(e.key)}
                  disabled={readOnly && !on}
                  style={{
                    borderRadius: 999,
                    padding: "7px 14px",
                    fontSize: 12,
                    cursor: readOnly ? "default" : "pointer",
                    border: `1px solid ${on ? "transparent" : LINE}`,
                    background: on ? `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})` : "transparent",
                    color: on ? "#fff" : MUTED,
                    opacity: readOnly && !on ? 0.35 : 1,
                  }}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
        </Bloc>

        {/* Note */}
        <Bloc titre={sectionsByKind["note"]?.titre ?? "Note libre"}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            readOnly={readOnly}
            placeholder={sectionsByKind["note"]?.texte}
            style={{
              width: "100%",
              resize: "none",
              borderRadius: 12,
              border: `1px solid ${LINE}`,
              background: NOIR,
              color: INK,
              fontFamily: sans,
              fontSize: 14,
              padding: "12px 14px",
              lineHeight: 1.5,
              opacity: readOnly ? 0.85 : 1,
            }}
          />
        </Bloc>

      </div>

      {/* Action */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={cloturer}
          disabled={readOnly}
          style={{
            borderRadius: 999,
            padding: "13px 26px",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.04em",
            cursor: readOnly ? "default" : "pointer",
            border: "none",
            color: "#fff",
            opacity: readOnly ? 0.4 : 1,
            background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
          }}
        >
          {readOnly ? "Observation enregistrée ✓" : "Enregistrer mon observation →"}
        </button>
      </div>
    </div>
  );
}

// Séparateur de section — sépare visuellement « le geste du jour » (à vivre) du
// « bilan du soir » (à noter une fois la journée passée).
function Separateur({ label, sous }: { label: string; sous?: string }) {
  return (
    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: FUCHSIA }}>
          {label}
        </div>
        {sous && <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{sous}</div>}
      </div>
      <div style={{ flex: 1, height: 1, background: LINE }} />
    </div>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${LINE}`,
        background: SURFACE,
        padding: "16px 18px",
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>
        {titre}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: INK }}>{children}</div>
    </div>
  );
}

// Décélération douce pour les animations de comptage / remplissage.
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

// Compteur animé de `from` vers `to` (rAF, respecte prefers-reduced-motion).
function useCountUp(from: number, to: number, ms = 950): number {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(from + (to - from) * easeOut(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, ms]);
  return v;
}

// Une jauge : libellé, valeur animée, barre qui se remplit + éventuel delta.
function Jauge({
  label,
  from,
  to,
  delta,
  accent = FUCHSIA,
  delay = 0,
}: {
  label: string;
  from: number;
  to: number;
  delta?: number;
  accent?: string;
  delay?: number;
}) {
  const val = useCountUp(from, to);
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(to), 60 + delay);
    return () => clearTimeout(id);
  }, [to, delay]);
  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, color: MUTED }}>{label}</span>
        <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: serif, fontSize: 18, color: INK, fontVariantNumeric: "tabular-nums lining-nums" }}>{val}</span>
          {typeof delta === "number" && delta !== 0 && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: delta > 0 ? accent : MUTED,
                fontVariantNumeric: "tabular-nums lining-nums",
              }}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </span>
          )}
        </span>
      </div>
      <div style={{ height: 7, borderRadius: 999, background: LINE, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${w}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
            transition: "width 1s cubic-bezier(.22,1,.36,1)",
          }}
        />
      </div>
    </div>
  );
}

// L'écran de réaction : ce que la journée vient de faire bouger, montré et
// animé, plus une porte vers le Coach qui embraie tout seul sur ce vécu.
function ReactionClotature({
  r,
  avant,
  apres,
  archName,
  onNext,
}: {
  r: ReponseJour;
  avant: EtatEvolution;
  apres: EtatEvolution;
  archName: string;
  onNext: () => void;
}) {
  const router = useRouter();
  const setCoachSeed = useStore((s) => s.setCoachSeed);

  // Ce qui a bougé, dérivé de l'état avant → après.
  const domA = archetypeDominant(avant);
  const domB = archetypeDominant(apres);
  const radarA = radarCourant(avant);
  const domFrom = domB ? radarA.find((p) => p.key === domB.key)?.valeur ?? 0 : 0;
  const deltaDom = domB ? domB.valeur - domFrom : 0;
  const bascule = Boolean(domA && domB && domA.key !== domB.key);

  const cohA = coherenceCourante(avant);
  const cohB = coherenceCourante(apres);
  const deltaCoh = cohB - cohA;

  // Avant J3, aucun référentiel fiable : on masque les deltas (un « +44 » contre
  // zéro ou un « −8 » à J1 décrédibilise le scoring) et le titre ne peut pas
  // annoncer de hausse. On n'affiche que les valeurs absolues.
  const deltasVisibles = r.jour >= 3;

  const focus = equilibreSpheres(apres).find((s) => s.key === r.sphereFocus);
  const emoLabels = EMOTIONS.filter((e) => r.emotions.includes(e.key)).map((e) => e.label);
  const heatA = heatmapEmotions(avant);
  const nouvelleEmo = EMOTIONS.find(
    (e) => r.emotions.includes(e.key) && (heatA.find((h) => h.key === e.key)?.compte ?? 0) === 0
  );

  // Le message s'adapte à CE qui s'est passé (variété / surprise).
  const entete = (() => {
    if (bascule && domA && domB)
      return {
        eyebrow: "Ta mue",
        titre: `Tu passes de ${domA.name} à ${domB.name}`,
        sous: "Ta matrice a changé de centre de gravité — ta mue s'accomplit.",
      };
    if (!domA && domB)
      return {
        eyebrow: "Premier relevé",
        titre: `${domB.name} émerge`,
        sous: "Voici ton point de départ. Dès demain, chaque journée le fera bouger.",
      };
    if (deltasVisibles && deltaCoh >= 6)
      return {
        eyebrow: "Élan",
        titre: "Ta cohérence bondit",
        sous: "Tes choix du jour tirent dans le même sens — et ça se lit.",
      };
    if (nouvelleEmo)
      return {
        eyebrow: "Nouvelle nuance",
        titre: `« ${nouvelleEmo.label} » entre dans ta carte`,
        sous: "Une émotion inédite : ta lecture de toi s'affine.",
      };
    // Le titre ne prétend une « hausse » que si le delta principal est réellement
    // positif ET visible (≥ J3) ; sinon on reste sur une formulation neutre.
    const monte = deltasVisibles && (deltaDom > 0 || deltaCoh > 0);
    const pool = [
      { eyebrow: "Inscrit", titre: "Ta journée entre dans la matrice", sous: "Un trait de plus à ton portrait." },
      monte
        ? { eyebrow: "Ça tient", titre: `${domB?.name ?? "Ta signature"} se renforce`, sous: "C'est la régularité qui sculpte, jamais l'intensité." }
        : { eyebrow: "Ça se précise", titre: `${domB?.name ?? "Ta signature"} se précise`, sous: "C'est la régularité qui sculpte, jamais l'intensité." },
      { eyebrow: "Ça infuse", titre: "Ce jour rejoint les autres", sous: "Rien ne se perd — tout fait matière." },
    ];
    return pool[r.jour % pool.length];
  })();

  const goCoach = () => {
    const emo = emoLabels.length ? `, traversée par ${emoLabels.join(", ").toLowerCase()}` : "";
    const noteStr = r.note.trim() ? ` J'ai noté : « ${r.note.trim()} ».` : "";
    setCoachSeed(
      `Je viens de clore mon Jour ${r.jour}. Aujourd'hui j'étais sur ${archName}${emo}.${noteStr} Aide-moi à en tirer une lecture concrète pour demain.`
    );
    router.push("/coach");
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", fontFamily: sans, color: INK, textAlign: "center", paddingTop: 20 }}>
      <div
        style={{
          width: 54, height: 54, borderRadius: "50%", margin: "0 auto 16px",
          display: "grid", placeItems: "center", color: "#fff", fontSize: 24,
          background: `linear-gradient(135deg, ${FUCHSIA}, ${ORANGE})`,
        }}
      >
        {bascule ? "⇄" : "✓"}
      </div>
      <div style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: FUCHSIA }}>
        Jour {r.jour} · {entete.eyebrow}
      </div>
      <h1 className="fr-title" style={{ fontFamily: serif, fontWeight: 600, fontSize: 28, margin: "8px 0 8px", color: INK, lineHeight: 1.15 }}>
        {entete.titre}
      </h1>
      <p style={{ color: MUTED, fontSize: 14.5, lineHeight: 1.6, margin: "0 auto 22px", maxWidth: 400 }}>
        {entete.sous}
      </p>

      {/* Ce que la journée a fait bouger — jauges animées */}
      <div
        style={{
          textAlign: "left",
          borderRadius: 18,
          border: `1px solid ${LINE}`,
          background: SURFACE,
          padding: "18px 18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: MUTED }}>
          Ce que ta journée a fait bouger
        </div>
        {domB && (
          <Jauge
            label={`${domB.name} · ta signature dominante`}
            from={domFrom}
            to={domB.valeur}
            delta={deltasVisibles ? deltaDom : undefined}
            delay={0}
          />
        )}
        <Jauge label="Cohérence de ta trajectoire" from={cohA} to={cohB} delta={deltasVisibles ? deltaCoh : undefined} delay={120} />
        {focus && (
          <Jauge
            label={`${focus.label} · la sphère que tu as poussée`}
            from={0}
            to={focus.part}
            delay={240}
          />
        )}
        {emoLabels.length > 0 && (
          <div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 7 }}>Émotions inscrites</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {emoLabels.map((l) => (
                <span
                  key={l}
                  style={{
                    fontSize: 12,
                    padding: "5px 11px",
                    borderRadius: 999,
                    color: "#fff",
                    background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Le Coach embraie tout seul sur cette journée */}
      <button
        onClick={goCoach}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "14px 20px",
          borderRadius: 16,
          border: `1px solid color-mix(in srgb, ${FUCHSIA} 34%, transparent)`,
          background: "color-mix(in srgb, var(--fuchsia) 8%, transparent)",
          color: INK,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        En parler à IdentitX — il rebondit sur ta journée →
      </button>

      <button
        onClick={onNext}
        style={{
          marginTop: 12,
          padding: "14px 28px",
          borderRadius: 999,
          border: "none",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          background: `linear-gradient(90deg, ${FUCHSIA}, ${ORANGE})`,
        }}
      >
        {r.jour < 30 ? "Continuer vers demain →" : "Voir mon bilan →"}
      </button>
    </div>
  );
}
