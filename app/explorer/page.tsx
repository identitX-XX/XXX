"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card, PageHead, Slider, Tag, TextArea } from "@/components/ui";

export default function ExplorerPage() {
  const cards = useStore((s) => s.cards);
  const updateCard = useStore((s) => s.updateCard);
  const [openId, setOpenId] = useState<string | null>(null);
  const [tagDraft, setTagDraft] = useState("");

  return (
    <div>
      <PageHead
        eyebrow="Explorer"
        title="Explore ton identité"
        sub="Quatorze territoires, préremplis à partir de ton profil. Ouvre une carte pour l'ajuster."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c) => {
          const open = openId === c.id;
          return (
            <Card key={c.id} className="p-5">
              <button
                onClick={() => setOpenId(open ? null : c.id)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-display text-lg text-ink">{c.category}</span>
                <span className="font-display text-sm text-fuchsia">{c.level}</span>
              </button>

              {!open && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {c.text || "À compléter."}
                </p>
              )}

              {open && (
                <div className="mt-4 space-y-4 animate-fade-up">
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

              {!open && c.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.tags.map((t, i) => (
                    <Tag key={i}>{t}</Tag>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
