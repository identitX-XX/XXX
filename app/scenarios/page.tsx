"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Loader2, Plus, RefreshCw, Sparkles, X } from "lucide-react";
import { PageHead } from "@/components/ui";
import { useStore } from "@/store/useStore";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { TurbineDirection, TurbineInput, TurbineOutput } from "@/lib/turbine/types";
import { basculeDepuisHistorique } from "@/lib/turbine/fromParcours";
import { useCarteTurbine } from "@/lib/turbine/carteStore";
import { track } from "@/lib/metrics";

const ENERGIES: TurbineDirection["energie"][] = ["haute", "moyenne", "basse"];
const ETATS: TurbineDirection["etat"][] = ["actif", "émergent", "en veille"];

export default function TurbinePage() {
  const profile = useStore((s) => s.profile);
  const historique = useParcoursStore((s) => s.etat.historique);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const { directions, tensions, ajouterDirection, retirerDirection, setTensions } =
    useCarteTurbine();

  // Amorce automatique : si aucune direction n'a encore été posée ICI mais que
  // l'utilisatrice a déjà défini ses directions (objectifs perso / pro /
  // relationnel), on les injecte pour que les scénarios surgissent SANS
  // re-saisie manuelle. Seuls les exercices restent à remplir à la main.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    if (directions.length > 0) { seeded.current = true; return; }
    if (!objectifs) return;
    const items = [objectifs.perso, objectifs.pro, objectifs.relationnel]
      .map((v) => v?.trim())
      .filter((v): v is string => Boolean(v));
    if (items.length === 0) return;
    seeded.current = true;
    items.forEach((nom) => ajouterDirection({ nom, energie: "moyenne", etat: "actif" }));
  }, [objectifs, directions.length, ajouterDirection]);

  const [output, setOutput] = useState<TurbineOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Construit l'entrée à partir des données de L'UTILISATRICE. Les scénarios se
  // génèrent dès qu'elle a posé au moins UNE direction (un métier, un projet,
  // une envie) — sans exiger une mue formelle ni des valeurs de profil. Le
  // contexte d'archétype vient de la mue réelle si elle existe, sinon du
  // dominant courant, sinon d'un cadre d'exploration neutre. Tant qu'aucune
  // direction n'est posée, on ne fabrique RIEN : on invite à en poser une.
  const { input, reel } = useMemo<{ input: TurbineInput | null; reel: boolean }>(() => {
    if (directions.length === 0) return { input: null, reel: false };
    const bascule = basculeDepuisHistorique(historique);
    const valeurs = (profile.values ?? []).filter(Boolean);
    const forces = (profile.strengths ?? []).filter(Boolean);
    const intention = profile.goal?.trim() || "Une exploration en cours entre plusieurs directions.";
    const archetype =
      bascule ??
      (diagnostic
        ? {
            actuel: archetypeByKey[diagnostic.dominant].name,
            precedent: diagnostic.secondaire ? archetypeByKey[diagnostic.secondaire].name : "",
            bascule: intention,
          }
        : { actuel: "Exploratrice", precedent: "", bascule: intention });
    return {
      input: {
        archetype,
        valeurs,
        forces,
        directions,
        tensions,
        signalRecent: bascule
          ? [`Bascule récente vers ${bascule.actuel}`]
          : [`Directions en dialogue : ${directions.map((d) => d.nom).join(", ")}`],
        scenariosPrecedents: [],
      } satisfies TurbineInput,
      reel: Boolean(bascule),
    };
  }, [historique, profile, directions, tensions, diagnostic]);

  // Clé de cache dérivée des directions posées : on génère UNE fois, puis on
  // ressert instantanément (fini le « ça tourne » à chaque visite + on épargne
  // des appels IA). On ne régénère que sur demande explicite (« d'autres
  // possibles ») ou si les directions changent.
  const cacheKey = useMemo(
    () =>
      input
        ? "idx-scenarios-" + input.directions.map((d) => d.nom).join("|") + "::" + input.tensions.join("|")
        : null,
    [input]
  );

  const generer = useCallback(
    async (force = false) => {
      if (!input || !cacheKey) return;
      // Anti-répétition : sur une relance, on donne au générateur les titres
      // déjà vus pour qu'il en propose de NOUVEAUX.
      const precedents =
        force && output?.scenarios?.length ? output.scenarios.map((s) => s.titre) : [];
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/turbine", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...input, scenariosPrecedents: precedents }),
        });
        const data = (await res.json()) as TurbineOutput & { error?: string };
        if (!res.ok || data.error) {
          setError(data.error ?? "Aucun scénario n'a pu être généré.");
          return;
        }
        setOutput(data);
        try {
          if (data.scenarios?.length) localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {}
        track("scenario_generated", {
          reel,
          count: data.scenarios?.length ?? 0,
          mock: Boolean(data._mock),
        });
      } catch {
        setError("Génération momentanément injoignable.");
      } finally {
        setLoading(false);
      }
    },
    [input, cacheKey, output, reel]
  );

  // Au montage / changement de directions : on charge le cache s'il existe,
  // sinon on génère une seule fois. Plus de régénération à chaque visite.
  useEffect(() => {
    if (!cacheKey) return;
    let cached: TurbineOutput | null = null;
    try {
      const c = localStorage.getItem(cacheKey);
      if (c) cached = JSON.parse(c) as TurbineOutput;
    } catch {}
    if (cached?.scenarios?.length) {
      setOutput(cached);
      return;
    }
    void generer(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return (
    <div>
      <PageHead
        eyebrow="Tes possibles"
        title="Ce que tes directions rendent possible"
        sub="Des expériences à tenter, nées de ce que tu explores — ce qui construit ta réalité, pas un portrait à contempler."
      />

      {/* La mue en cours — seulement quand une entrée réelle existe */}
      {input && (
        <div className="mb-6 rounded-2xl border border-line bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-fuchsia">
              {reel ? "Ton vortex" : "Ton point de départ"}
            </div>
            <span
              className={`rounded-full border px-2 py-0.5 text-[12px] font-medium uppercase tracking-wider ${
                reel
                  ? "border-fuchsia/40 bg-fuchsia/10 text-fuchsia"
                  : "border-line text-muted"
              }`}
            >
              {reel ? "Vortex confirmé" : "En cours"}
            </span>
          </div>
          <p className="mt-2 text-sm text-ink">
            {input.archetype.precedent && (
              <>
                <span className="text-muted">De </span>
                <span className="text-muted">{input.archetype.precedent}</span>
                <span className="text-muted"> à </span>
              </>
            )}
            <span className="font-display text-base">{input.archetype.actuel}</span>
          </p>
          <p className="mt-1 text-sm text-muted">{input.archetype.bascule}</p>
        </div>
      )}

      {/* Éditeur des directions (les multiples à faire dialoguer) */}
      <CarteEditor
        directions={directions}
        tensions={tensions}
        onAdd={ajouterDirection}
        onRemove={retirerDirection}
        onTensions={setTensions}
        openByDefault={directions.length === 0}
      />

      {/* Aucune direction posée : on invite, on ne fabrique pas de faux scénario */}
      {!input && (
        <div className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center">
          <p className="font-display text-lg text-ink">Pose tes directions</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Ajoute au moins une direction ci-dessus — un métier, un projet, une
            envie (ex.&nbsp;«&nbsp;Pâtisserie&nbsp;», «&nbsp;Soin&nbsp;»). Tes
            scénarios surgiront de <span className="text-ink">ce que tu explores</span>,
            jamais d'un exemple tout fait.
          </p>
        </div>
      )}

      {/* Spinner PLEIN écran seulement à la 1re génération (aucun scénario
          encore). Sur une relance, on garde les scénarios visibles (voir plus
          bas) — plus jamais l'impression que « ça bloque ». */}
      {loading && !output && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-muted">
          <Loader2 size={18} className="animate-spin text-fuchsia" />
          <span>
            L'IA compose 3 scénarios sur mesure… <span className="text-faint">≈ 15 s</span>
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
          <p className="text-sm text-ink">{error}</p>
          <button
            onClick={() => generer(true)}
            className="mt-3 inline-flex items-center gap-2 text-sm text-fuchsia"
          >
            <RefreshCw size={14} /> Réessayer
          </button>
        </div>
      )}

      {/* On garde les scénarios affichés même pendant une relance : un petit
          indicateur « en cours » suffit — l'écran ne se vide plus. */}
      {!error && output && (
        <div className="mt-6">
          {loading && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[12px] text-muted">
              <Loader2 size={12} className="animate-spin text-fuchsia" />
              Je cherche d'autres possibles…
            </div>
          )}
          {output._mock && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[12px] text-muted">
              <Sparkles size={12} className="text-fuchsia" />
              Aperçu généré à partir de tes directions — la lecture approfondie revient bientôt.
            </div>
          )}

          {output.scenarios.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center">
              <p className="font-display text-lg text-ink">Ajoute un peu de matière</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Écris au moins une direction ci-dessus — un projet, une envie,
                une casquette — puis relance. Tes scénarios naîtront de ce que tu
                explores.
              </p>
              <button
                onClick={() => generer(true)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-fuchsia"
              >
                <RefreshCw size={14} /> Relancer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {output.scenarios.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-surface p-6 shadow-soft"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {s.multiples_en_dialogue.map((m, j) => (
                      <span
                        key={j}
                        className="rounded-full border border-fuchsia/40 bg-fuchsia/10 px-2.5 py-0.5 text-[12px] font-medium text-fuchsia"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-3 font-display text-xl font-light leading-snug text-ink">
                    {s.titre}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.mouvement}</p>

                  <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                    <p>
                      <span className="text-fuchsia">Pourquoi maintenant · </span>
                      <span className="text-muted">{s.pourquoi_maintenant}</span>
                    </p>
                    <p className="flex items-start gap-2 text-ink">
                      <ArrowRight size={15} className="mt-0.5 flex-none text-fuchsia" />
                      <span>
                        <span className="font-medium">Premier pas · </span>
                        {s.premier_pas}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted">Lâche · </span>
                      <span className="text-muted">{s.risque_ou_lest}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {output.note_de_bascule && (
            <p className="mt-5 text-sm italic text-muted">{output.note_de_bascule}</p>
          )}

          <button
            onClick={() => generer(true)}
            disabled={loading}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-fuchsia hover:text-fuchsia disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            {loading ? "Recherche…" : "Faire surgir d'autres possibles"}
          </button>
        </div>
      )}
    </div>
  );
}

function CarteEditor({
  directions,
  tensions,
  onAdd,
  onRemove,
  onTensions,
  openByDefault = false,
}: {
  directions: TurbineDirection[];
  tensions: string[];
  onAdd: (d: TurbineDirection) => void;
  onRemove: (i: number) => void;
  onTensions: (t: string[]) => void;
  openByDefault?: boolean;
}) {
  const [nom, setNom] = useState("");
  const [energie, setEnergie] = useState<TurbineDirection["energie"]>("haute");
  const [etat, setEtat] = useState<TurbineDirection["etat"]>("actif");
  const [tension, setTension] = useState("");
  // Ouvert par défaut si demandé, mais on n'IMPOSE pas l'état ensuite : ajouter
  // une direction ne doit pas refermer l'éditeur au nez de l'utilisatrice.
  const [open, setOpen] = useState(openByDefault);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="mb-6 rounded-2xl border border-line bg-surface p-5 [&_summary]:cursor-pointer"
    >
      <summary className="text-sm font-medium text-ink">
        Mes directions{" "}
        <span className="text-muted">
          — les multiples à faire dialoguer ({directions.length})
        </span>
      </summary>

      <div className="mt-4 space-y-2">
        {directions.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm"
          >
            <span className="text-ink">
              {d.nom}{" "}
              <span className="text-muted">
                · {d.energie} · {d.etat}
              </span>
            </span>
            <button onClick={() => onRemove(i)} aria-label="Retirer" className="text-muted hover:text-fuchsia">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Une direction (projet, casquette…)"
          className="min-w-[12rem] flex-1 rounded-lg border border-line bg-noir px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-fuchsia"
        />
        <select
          value={energie}
          onChange={(e) => setEnergie(e.target.value as TurbineDirection["energie"])}
          className="rounded-lg border border-line bg-noir px-2 py-2 text-sm text-ink focus:border-fuchsia"
        >
          {ENERGIES.map((x) => (
            <option key={x} value={x}>
              énergie {x}
            </option>
          ))}
        </select>
        <select
          value={etat}
          onChange={(e) => setEtat(e.target.value as TurbineDirection["etat"])}
          className="rounded-lg border border-line bg-noir px-2 py-2 text-sm text-ink focus:border-fuchsia"
        >
          {ETATS.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (nom.trim()) {
              onAdd({ nom: nom.trim(), energie, etat });
              setNom("");
            }
          }}
          className="inline-flex items-center gap-1 rounded-lg border border-line px-3 text-muted hover:border-fuchsia hover:text-fuchsia"
          aria-label="Ajouter"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.18em] text-muted">Tensions</div>
        <div className="mb-2 flex flex-wrap gap-2">
          {tensions.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs text-muted"
            >
              {t}
              <button
                onClick={() => onTensions(tensions.filter((_, j) => j !== i))}
                aria-label="Retirer"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <input
          value={tension}
          onChange={(e) => setTension(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && tension.trim()) {
              onTensions([...tensions, tension.trim()]);
              setTension("");
            }
          }}
          placeholder="Une tension (Entrée pour ajouter)"
          className="w-full rounded-lg border border-line bg-noir px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-fuchsia"
        />
      </div>
    </details>
  );
}
