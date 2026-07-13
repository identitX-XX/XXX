"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { TimelineEvent } from "@/types";
import { Button, Card, Label, PageHead, Slider, TextInput } from "@/components/ui";

export default function TimelinePage() {
  const timeline = useStore((s) => s.timeline);
  const add = useStore((s) => s.addTimelineEvent);
  const remove = useStore((s) => s.removeTimelineEvent);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Omit<TimelineEvent, "id">>({
    date: "",
    title: "",
    importance: 60,
    emotion: "",
    lesson: "",
    impact: "",
  });

  const sorted = [...timeline].sort((a, b) => a.date.localeCompare(b.date));

  const save = () => {
    if (!draft.title.trim()) return;
    add({ ...draft, id: `tl-${Date.now()}` });
    setDraft({ date: "", title: "", importance: 60, emotion: "", lesson: "", impact: "" });
    setAdding(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHead
          eyebrow="Ligne de vie"
          title="Ta frise chronologique"
          sub="Les moments qui ont façonné ta trajectoire, reliés entre eux."
        />
        <Button onClick={() => setAdding((v) => !v)} variant="outline">
          <Plus size={16} /> Événement
        </Button>
      </div>

      {adding && (
        <Card className="mb-8 space-y-4 p-6 animate-fade-up">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Date</Label>
              <TextInput value={draft.date} onChange={(v) => setDraft({ ...draft, date: v })} placeholder="ex. 2019" />
            </div>
            <div>
              <Label>Événement</Label>
              <TextInput value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} placeholder="Ce qui s'est passé" />
            </div>
            <div>
              <Label>Émotion</Label>
              <TextInput value={draft.emotion} onChange={(v) => setDraft({ ...draft, emotion: v })} />
            </div>
            <div>
              <Label>Apprentissage</Label>
              <TextInput value={draft.lesson} onChange={(v) => setDraft({ ...draft, lesson: v })} />
            </div>
            <div className="md:col-span-2">
              <Label>Impact</Label>
              <TextInput value={draft.impact} onChange={(v) => setDraft({ ...draft, impact: v })} />
            </div>
            <div className="md:col-span-2">
              <Slider label="Importance" value={draft.importance} onChange={(v) => setDraft({ ...draft, importance: v })} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={save}>Ajouter</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Annuler</Button>
          </div>
        </Card>
      )}

      <div className="relative pl-6">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
        <div className="space-y-6">
          {sorted.map((e) => (
            <div key={e.id} className="relative animate-fade-up">
              <span className="brand-gradient absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-noir" />
              <Card className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-sm text-fuchsia">{e.date}</div>
                    <h3 className="mt-0.5 font-display text-lg text-ink">{e.title}</h3>
                  </div>
                  <button
                    onClick={() => remove(e.id)}
                    className="text-muted transition-colors hover:text-fuchsia"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-muted md:grid-cols-3">
                  {e.emotion && <p><span className="text-ink">Émotion : </span>{e.emotion}</p>}
                  {e.lesson && <p><span className="text-ink">Apprentissage : </span>{e.lesson}</p>}
                  {e.impact && <p><span className="text-ink">Impact : </span>{e.impact}</p>}
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
                  <div className="brand-gradient h-full rounded-full" style={{ width: `${e.importance}%` }} />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
