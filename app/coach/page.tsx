"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { computeScores, useStore } from "@/store/useStore";
import { coachReply, COACH_SUGGESTIONS } from "@/lib/coach";
import { PageHead } from "@/components/ui";

export default function CoachPage() {
  const profile = useStore((s) => s.profile);
  const coach = useStore((s) => s.coach);
  const addMessage = useStore((s) => s.addCoachMessage);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const scores = computeScores(profile);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coach, typing]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    addMessage({ id: `u-${Date.now()}`, role: "user", content: q });
    setInput("");
    setTyping(true);
    setTimeout(() => {
      addMessage({
        id: `c-${Date.now()}`,
        role: "coach",
        content: coachReply(q, profile, scores),
      });
      setTyping(false);
    }, 650);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col lg:h-[calc(100vh-6rem)]">
      <PageHead eyebrow="IDENTITX AI" title="Ton coach" />

      <div className="flex-1 space-y-4 overflow-y-auto pb-4 pr-1">
        {coach.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "brand-gradient text-white"
                  : "border border-line bg-surface text-ink"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-line bg-surface px-4 py-3">
              <span className="flex gap-1">
                <Dot /> <Dot delay={150} /> <Dot delay={300} />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {coach.length <= 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {COACH_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-fuchsia hover:text-fuchsia"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(input)}
          placeholder="Pose ta question…"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-ink placeholder:text-muted"
        />
        <button
          onClick={() => ask(input)}
          className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90"
          aria-label="Envoyer"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
