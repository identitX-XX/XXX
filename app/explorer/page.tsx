"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, ChevronRight, Plus, Sparkles, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card, PageHead, Slider, Tag, TextArea } from "@/components/ui";

export default function ExplorerPage() {
  const cards = useStore((s) => s.cards);
  const updateCard = useStore((s) => s.updateCard);
  const [openId, setOpenId] = useState<string | null>(null);
  const [tagDraft, setTagDraft] = useState("");

  const total = cards.length;
  const faits = useMemo(() => cards.filter((c) => c.rempli).length, [cards]);
  const reste = total - faits;
  const pct = total ? Math.round((faits / total) * 100) : 0;
  // Premier territoire encore à compléter — sert au bouton « Continuer ».
  const prochain = useMemo(() => cards.find((c) => !c.rempli), [cards]);

  return (
    <div>
      <PageHead
        eyebrow="Approfondir · optionnel"
        title="Les territoires de ton récit"
        sub="Quatorze territoires qui nourrissent ta quête — perso, pro, relationnel. À explorer à ton rythme : rien ne se joue au chronomètre."
      />

      {/* Barre de progression — l'utilisatrice sait exactement où elle en est. */}
      <div className="mb-8 rounded-2xl border border-line bg-surface p-5 shadow-soft">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-lg text-ink">
            {faits} <span className="text-muted">/ {total} territoires nourris</span>
          </span>
          <span className="font-display text-sm text-muted">{pct}%</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: "color-mix(in srgb, var(--fuchsia) 40%, var(--line))",
            }}
          />
        </div>
        {total === 0 ? (
          <p className="mt-4 text-sm text-muted">
            Tes territoires apparaîtront ici une fois ta signature révélée.
          </p>
        ) : reste > 0 ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {reste === 1
                ? "Un territoire encore à nourrir, quand tu veux."
                : `${reste} territoires à nourrir, quand tu veux.`}{" "}
              Chacun nourrit ta quête, à ton rythme — sans chronomètre.
            </p>
            {prochain && (
              <button
                onClick={() => setOpenId(prochain.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-full brand-gradient px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-glow"
              >
                Compléter : {prochain.category}
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        ) : (
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-ink">
            <Sparkles size={15} className="text-fuchsia" />
            Ta carte d'identité est complète. Tu peux la relire et l'affiner quand tu veux.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c) => {
          const open = openId === c.id;
          const aCompleter = !c.rempli;
          const Header = (
            <span className="flex flex-1 flex-wrap items-center gap-2">
              <span className="font-display text-lg text-ink">{c.category}</span>
              {aCompleter ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia/40 bg-fuchsia/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fuchsia">
                  À compléter
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                  <Check size={10} /> Complété
                </span>
              )}
            </span>
          );
          return (
            <Card
              key={c.id}
              className={`p-5 transition-colors ${
                aCompleter && !open ? "border-dashed border-fuchsia/40" : ""
              } ${!open ? "cursor-pointer hover:border-fuchsia" : ""}`}
            >
              {!open ? (
                // Carte repliée : TOUTE la carte est cliquable (affordance chevron).
                <button
                  onClick={() => setOpenId(c.id)}
                  className="flex w-full flex-col gap-2 text-left"
                >
                  <span className="flex w-full items-start justify-between gap-3">
                    {Header}
                    <span className="flex flex-none items-center gap-2">
                      <span className="font-display text-sm text-fuchsia">{c.level}</span>
                      <ChevronRight size={16} className="text-muted" />
                    </span>
                  </span>
                  <span
                    className={`line-clamp-2 text-sm leading-relaxed ${
                      aCompleter ? "italic text-muted/70" : "text-muted"
                    }`}
                  >
                    {c.text || "Touche pour compléter ce territoire."}
                  </span>
                  {c.tags.length > 0 && (
                    <span className="mt-1 flex flex-wrap gap-2">
                      {c.tags.map((t, i) => (
                        <Tag key={i}>{t}</Tag>
                      ))}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setOpenId(null)}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  {Header}
                  <span className="flex flex-none items-center gap-2">
                    <span className="font-display text-sm text-fuchsia">{c.level}</span>
                    <ChevronDown size={16} className="text-fuchsia" />
                  </span>
                </button>
              )}

              {open && (
                <div className="mt-4 space-y-4 animate-fade-up">
                  {aCompleter && (
                    <p className="text-xs leading-relaxed text-fuchsia/80">
                      Cette amorce est une invitation, pas ta réponse. Écris la tienne
                      pour valider ce territoire.
                    </p>
                  )}
                  <TextArea
                    value={c.text}
                    onChange={(v) => updateCard(c.id, { text: v })}
                    rows={4}
                  />
                  <Slider
                    label="Niveau ressenti"
                    value={c.level}
                    onChange={(v) => updateCard(c.id, { level: v })}
                  />
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {c.tags.map((t, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs text-muted"
                        >
                          {t}
                          <button
                            onClick={() =>
                              updateCard(c.id, {
                                tags: c.tags.filter((_, j) => j !== i),
                              })
                            }
                            aria-label="Retirer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={openId === c.id ? tagDraft : ""}
                        onChange={(e) => setTagDraft(e.target.value)}
                        placeholder="Ajouter un tag"
                        className="flex-1 rounded-lg border border-line bg-noir px-3 py-2 text-xs text-ink placeholder:text-muted focus:border-fuchsia"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && tagDraft.trim()) {
                            updateCard(c.id, { tags: [...c.tags, tagDraft.trim()] });
                            setTagDraft("");
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (tagDraft.trim()) {
                            updateCard(c.id, { tags: [...c.tags, tagDraft.trim()] });
                            setTagDraft("");
                          }
                        }}
                        className="rounded-lg border border-line px-3 text-muted hover:text-fuchsia"
                        aria-label="Ajouter"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenId(null)}
                    className="inline-flex items-center gap-2 text-sm text-fuchsia"
                  >
                    <Check size={15} /> Terminé
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
