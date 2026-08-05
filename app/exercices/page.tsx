"use client";

// Les exercices « longs » du jour : sur chaque périmètre, l'écart entre ce que
// tu CROIS, ce que tu PENSES et ce que tu FAIS. Une fois rempli, l'IA en tire un
// éclairage relié à ta signature du moment + une projection pour la quête.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles, RefreshCw, User, Briefcase, Users } from "lucide-react";
import { PageHead, TextArea } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { archetypeDominant, progression } from "@/parcours-archetypes/indicateurs";
import {
  useGap,
  gapJourVide,
  aDeLaMatiere,
  Eclairage,
  GapTriplet,
} from "@/parcours-gap/store";
import { PERIMETRES, directionDe, Perimetre } from "@/parcours-gap/perimetres";
import { pratiquesDuJour, promptRendu } from "@/parcours-gap/exercicesLib";

const ICONE: Record<Perimetre, React.ElementType> = {
  perso: User,
  pro: Briefcase,
  relationnel: Users,
};

const CHAMPS: { key: keyof GapTriplet; label: string; hint: string }[] = [
  { key: "crois", label: "Ce que je crois", hint: "Ta conviction profonde, même inavouée." },
  { key: "pense", label: "Ce que je pense", hint: "Ce que ta tête se dit, au quotidien." },
  { key: "fais", label: "Ce que je fais", hint: "Tes actes réels, observables." },
];

export default function ExercicesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const etat = useParcoursStore((s) => s.etat);

  const gaps = useGap((s) => s.gaps);
  const pratiques = useGap((s) => s.pratiques);
  const eclairages = useGap((s) => s.eclairages);
  const setChamp = useGap((s) => s.setChamp);
  const setPratique = useGap((s) => s.setPratique);
  const setEclairage = useGap((s) => s.setEclairage);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const jour = useMemo(() => Math.min(progression(etat).jourCourant, 30), [etat]);
  const sig = useMemo(() => {
    const dom = archetypeDominant(etat);
    return dom?.name ?? (diagnostic ? archetypeByKey[diagnostic.dominant].name : "");
  }, [etat, diagnostic]);

  if (!mounted) return null;

  if (!diagnostic) {
    return (
      <div>
        <PageHead
          eyebrow="Exercices du jour"
          title="Ils s'ouvrent avec ta signature"
          sub="Révèle d'abord ta signature — les exercices se calent ensuite sur elle, chaque jour."
        />
        <Link
          href="/parcours-signatures"
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Commencer ma quête <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const jourGap = gaps[jour] ?? gapJourVide();
  const jourPratiques = pratiques[jour] ?? {};
  const prats = pratiquesDuJour(jour);
  const eclairage = eclairages[jour];

  // De la matière s'il y a un champ d'écart OU un exercice rempli.
  const matiere =
    aDeLaMatiere(jourGap) || prats.some((t) => (jourPratiques[t.id] ?? "").trim());

  const demanderEclairage = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/eclairage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jour,
          signature: sig,
          directions: {
            perso: directionDe(objectifs, "perso"),
            pro: directionDe(objectifs, "pro"),
            relationnel: directionDe(objectifs, "relationnel"),
          },
          gaps: jourGap,
          pratiques: prats
            .map((t) => ({ nom: t.nom, reponse: (jourPratiques[t.id] ?? "").trim() }))
            .filter((p) => p.reponse),
        }),
      });
      const data = (await res.json()) as Eclairage & { error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "Éclairage momentanément indisponible.");
        return;
      }
      setEclairage(jour, data);
    } catch {
      setError("Éclairage momentanément injoignable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHead
        eyebrow={`Exercice du jour · Jour ${jour}`}
        title="L'écart entre ce que tu crois, penses et fais"
        sub={`Sur chaque périmètre — perso, pro, relationnel — observe l'écart. Il change selon ton avancement. Ta signature du moment — ${sig} — en éclaire le sens.`}
      />

      <div className="grid gap-5">
        {PERIMETRES.map(({ key, label }) => {
          const dir = directionDe(objectifs, key);
          const Icone = ICONE[key];
          return (
            <section key={key} className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid h-9 w-9 flex-none place-items-center rounded-xl text-fuchsia"
                    style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}
                  >
                    <Icone size={18} />
                  </span>
                  <span className="text-sm font-bold uppercase tracking-[0.1em] text-ink">{label}</span>
                </div>
                {dir && (
                  <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted">
                    {dir}
                  </span>
                )}
              </div>
              <div className="grid gap-4">
                {CHAMPS.map((c) => (
                  <div key={c.key}>
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia">
                      {c.label}
                    </div>
                    <p className="mb-1.5 text-xs text-muted">{c.hint}</p>
                    <TextArea
                      value={jourGap[key][c.key]}
                      onChange={(v) => setChamp(jour, key, c.key, v)}
                      placeholder="Quelques mots suffisent…"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Les autres exercices du jour — au-delà de l'écart, en rotation. */}
      <div className="mt-8">
        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
          <Sparkles size={13} /> Les autres exercices du jour
        </div>
        <p className="mb-4 max-w-xl text-xs leading-relaxed text-muted">
          Deux pratiques qui changent chaque jour, en plus de l'écart — pour explorer
          ton identité sous d'autres angles.
        </p>
        <div className="grid gap-4">
          {prats.map((t) => (
            <section key={t.id} className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia">
                {t.nom}
              </div>
              <p className="mt-1.5 mb-3 text-sm leading-relaxed text-ink">
                {promptRendu(t, sig)}
              </p>
              <TextArea
                value={jourPratiques[t.id] ?? ""}
                onChange={(v) => setPratique(jour, t.id, v)}
                placeholder="Quelques mots suffisent…"
                rows={2}
              />
            </section>
          ))}
        </div>
      </div>

      {/* Éclairage IA */}
      <div className="mt-8">
        {!eclairage && (
          <button
            onClick={demanderEclairage}
            disabled={loading || !matiere}
            className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full brand-gradient px-8 text-base font-semibold text-white shadow-glow transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Ton éclairage se compose…
              </>
            ) : (
              <>
                <Sparkles size={18} /> Recevoir mon éclairage du jour
              </>
            )}
          </button>
        )}
        {!eclairage && !matiere && (
          <p className="mt-2 text-center text-xs text-muted">
            Renseigne au moins un champ pour recevoir ton éclairage.
          </p>
        )}
        {error && <p className="mt-3 text-center text-sm text-danger">{error}</p>}

        {eclairage && (
          <div
            className="rounded-2xl border p-6 animate-fade-up"
            style={{
              borderColor: "color-mix(in srgb, var(--fuchsia) 34%, transparent)",
              background:
                "radial-gradient(130% 130% at 0% 0%, color-mix(in srgb, var(--fuchsia) 9%, transparent), transparent 60%)",
            }}
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">
              <Sparkles size={14} /> Ton éclairage du jour
              {eclairage._mock && (
                <span className="ml-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-normal normal-case tracking-normal text-muted">
                  maquette
                </span>
              )}
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">{eclairage.eclairage}</p>

            {eclairage.tensions?.length > 0 && (
              <div className="mt-4 grid gap-2">
                {eclairage.tensions.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-fuchsia" />
                    <span>{t.note}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 border-t border-line pt-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia">
                Projection pour ta quête
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{eclairage.projection}</p>
            </div>

            <button
              onClick={demanderEclairage}
              disabled={loading}
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia disabled:opacity-40"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Réactualiser
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs italic leading-relaxed text-muted">
        Ce que tu écris reste sur ton appareil. L'éclairage est calculé à partir de tes réponses,
        relié à ta signature du moment.
      </p>
    </div>
  );
}
