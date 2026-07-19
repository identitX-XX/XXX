"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ===================== Types =====================

type ChatMessage = { role: "user" | "assistant"; content: string };

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

const CHAT_KEY = "identitx-coach-chat";
const JOURNAL_KEY = "identitx-journal-fusion";
const MAP_KEY = "identitx-cognitive-map";

// ===================== Contexte : les trois couches =====================

function classify(g: number, r: number): string {
  const hi = 5.5;
  if (r >= hi && g < hi) return "Source";
  if (r >= hi && g >= hi) return "Moteur";
  if (r < hi && g >= hi) return "Vampire";
  return "Dormante";
}

function buildContext(): string {
  const parts: string[] = [];
  try {
    // Couche 1 — profil déclaré (onboarding, clé inconnue → scan)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const raw = localStorage.getItem(key);
      if (!raw || raw[0] !== "{") continue;
      let obj: unknown;
      try {
        obj = JSON.parse(raw);
      } catch {
        continue;
      }
      const o = obj as Record<string, unknown>;
      const state = (o.state ?? o) as Record<string, unknown>;
      const p = (state.profile ?? o.profile) as Record<string, unknown> | undefined;
      if (p && typeof p === "object" && ("fear" in p || "ambition" in p || "values" in p)) {
        parts.push(
          "PROFIL DÉCLARÉ À L'ARRIVÉE : " +
            JSON.stringify({
              prenom: p.name,
              objectif: p.goal,
              motCle: p.keyword,
              blocage: p.blocker,
              comprendre: p.understand,
              valeurs: p.values,
              forces: p.strengths,
              peur: p.fear,
              ambition: p.ambition,
            })
        );
        break;
      }
    }
  } catch {}

  try {
    // Couche 2 — journal (14 dernières entrées)
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (raw) {
      const entries = (JSON.parse(raw) as Entry[])
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 14);
      if (entries.length) {
        parts.push(
          "JOURNAL D'EXPANSION (entrées récentes, dimensions notées /10 — étatInterne, clarté, actionRelationnelle, exposition) : " +
            JSON.stringify(entries)
        );
      }
    }
  } catch {}

  try {
    // Couche 3 — cartographie des identités
    const raw = localStorage.getItem(MAP_KEY);
    if (raw) {
      const ids = JSON.parse(raw) as Identity[];
      if (ids.length) {
        parts.push(
          "CARTOGRAPHIE DES IDENTITÉS (énergie donnée / reçue /10, et classification) : " +
            JSON.stringify(
              ids.map((i) => ({
                role: i.name,
                donnee: i.given,
                recue: i.received,
                type: classify(i.given, i.received),
              }))
            )
        );
      }
    }
  } catch {}

  return parts.join("\n\n");
}

// ===================== Emblème =====================

function Emblem({ size = 54 }: { size?: number }) {
  return (
    <div aria-hidden="true" style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", inset: 0, animation: "idx-spin 9s linear infinite" }}>
        <span
          style={{
            position: "absolute",
            top: -3,
            left: "calc(50% - 3px)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--fuchsia)",
            boxShadow: "0 0 10px rgba(255,79,163,.8)",
          }}
        />
      </div>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "absolute", inset: size * 0.24, width: size * 0.52, height: size * 0.52, color: "var(--fuchsia)" }}
      >
        <circle cx="12" cy="12" r="9.2" />
        <path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5 5-2.2Z" />
      </svg>
    </div>
  );
}

// ===================== Composant principal =====================

export function CoachIA() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-40)));
    } catch {}
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loaded]);

  const context = useMemo(() => (loaded ? buildContext() : ""), [loaded]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-20), context }),
      });
      const data = await r.json();
      if (!r.ok || !data.reply) {
        setError(data.error ?? "Réponse indisponible. Réessaie.");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("Connexion impossible. Vérifie le réseau et réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    try {
      localStorage.removeItem(CHAT_KEY);
    } catch {}
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--noir)",
        color: "var(--ink)",
        fontFamily: "var(--font-inter),'Outfit',sans-serif",
        fontWeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 16px 120px",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes idx-spin { to { transform: rotate(360deg) } }
        @keyframes idx-pulse { 0%,100%{opacity:.35} 50%{opacity:1} }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(55% 38% at 85% 0%, rgba(255,79,163,.09), transparent 70%), radial-gradient(45% 32% at 10% 100%, rgba(255,138,76,.07), transparent 70%)",
        }}
      />

      <Emblem />

      <h1
        style={{
          fontFamily: "var(--font-fraunces),serif",
          fontWeight: 400,
          fontSize: "clamp(26px,6.4vw,40px)",
          margin: "14px 0 0",
          textAlign: "center",
        }}
      >
        Parle avec{" "}
        <span
          style={{
            background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          IdentitX
        </span>
      </h1>

      <p
        style={{
          fontFamily: "var(--font-fraunces),serif",
          fontStyle: "italic",
          fontSize: 14.5,
          color: "var(--muted)",
          margin: "10px 0 0",
          textAlign: "center",
          maxWidth: 400,
          lineHeight: 1.5,
        }}
      >
        Je connais ton journal, ta constellation et ton profil. Demande-moi une lecture, un scénario, ou aide-moi à trancher avec toi.
      </p>

      {/* Fil de conversation */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 26,
          flex: 1,
        }}
      >
        {/* Puces scénarios par domaine */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {[
            { label: "Scénario identitaire", prompt: "Génère mon scénario identitaire : une lecture développée (8 à 20 lignes) de ma trajectoire identitaire à 90 jours, à partir de ma cartographie, de mon journal et de mon profil." },
            { label: "Scénario pro", prompt: "Génère mon scénario professionnel : une projection développée (8 à 20 lignes) de mon évolution professionnelle à 90 jours, appuyée sur mes données réelles." },
            { label: "Scénario perso", prompt: "Génère mon scénario personnel : une lecture développée (8 à 20 lignes) de mon équilibre et de mon énergie personnelle à 90 jours, appuyée sur mes données." },
            { label: "Scénario familial", prompt: "Génère mon scénario familial et relationnel : une lecture développée (8 à 20 lignes) de mes rôles relationnels à 90 jours, appuyée sur ma cartographie et mon journal." },
          ].map((c) => (
            <button
              key={c.label}
              onClick={() => {
                if (loading) return;
                setInput(c.prompt);
              }}
              style={{
                background: "rgba(255,79,163,.08)",
                border: "1px solid rgba(255,79,163,.28)",
                borderRadius: 999,
                color: "var(--ink)",
                fontSize: 11.5,
                letterSpacing: ".08em",
                padding: "9px 14px",
                cursor: "pointer",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "rgba(244,238,234,.4)",
              fontStyle: "italic",
              marginTop: 20,
              lineHeight: 1.6,
            }}
          >
            Ou écris librement : « Que dit ma semaine ? » · « Aide-moi à trancher sur… »
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "86%",
              padding: "12px 15px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background:
                m.role === "user"
                  ? "linear-gradient(120deg, rgba(255,79,163,.22), rgba(255,138,76,.18))"
                  : "rgba(38,22,41,.55)",
              border:
                m.role === "user"
                  ? "1px solid rgba(255,79,163,.3)"
                  : "1px solid rgba(255,138,76,.14)",
              fontSize: 14.5,
              lineHeight: 1.55,
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "12px 16px",
              fontSize: 13,
              color: "var(--orange)",
              animation: "idx-pulse 1.4s ease infinite",
            }}
          >
            IdentitX lit tes données…
          </div>
        )}

        {error && (
          <div
            style={{
              alignSelf: "center",
              fontSize: 12.5,
              color: "var(--danger)",
              textAlign: "center",
              padding: "8px 14px",
              border: "1px solid rgba(255,90,90,.3)",
              borderRadius: 12,
            }}
          >
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Zone de saisie */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px calc(14px + env(safe-area-inset-bottom))",
          background: "linear-gradient(180deg, rgba(10,9,13,0), rgba(10,9,13,.92) 30%)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 480 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Écris à IdentitX…"
            style={{
              flex: 1,
              background: "rgba(38,22,41,.7)",
              border: "1px solid rgba(255,138,76,.25)",
              borderRadius: 14,
              color: "var(--ink)",
              fontSize: 15,
              padding: "14px 15px",
              outline: "none",
              fontFamily: "var(--font-inter),sans-serif",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            aria-label="Envoyer"
            style={{
              background:
                loading || !input.trim()
                  ? "rgba(255,79,163,.25)"
                  : "linear-gradient(90deg,var(--fuchsia),var(--orange))",
              color: "var(--noir)",
              border: "none",
              borderRadius: 14,
              padding: "0 20px",
              fontSize: 18,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            →
          </button>
        </div>
      </div>

      {messages.length > 0 && (
        <button
          onClick={reset}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "1px solid rgba(244,238,234,.15)",
            borderRadius: 10,
            color: "rgba(244,238,234,.45)",
            fontSize: 11,
            padding: "6px 10px",
            cursor: "pointer",
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Nouveau
        </button>
      )}
    </div>
  );
}
