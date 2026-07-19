"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/store/useStore";
import { ChatMsg, FusionEntry, Identity, Profile } from "@/types";
import { Emblem } from "./Emblem";

// ===================== Contexte : les trois couches =====================

function classify(g: number, r: number): string {
  const hi = 5.5;
  if (r >= hi && g < hi) return "Source";
  if (r >= hi && g >= hi) return "Moteur";
  if (r < hi && g >= hi) return "Vampire";
  return "Dormante";
}

function buildContext(
  profile: Profile,
  journalFusion: FusionEntry[],
  identities: Identity[]
): string {
  const parts: string[] = [];

  // Couche 1 — profil déclaré (onboarding)
  const hasProfile =
    profile.name ||
    profile.keyword ||
    profile.fear ||
    profile.ambition ||
    profile.values.some(Boolean);
  if (hasProfile) {
    parts.push(
      "PROFIL DÉCLARÉ À L'ARRIVÉE : " +
        JSON.stringify({
          prenom: profile.name,
          objectif: profile.goal,
          motCle: profile.keyword,
          blocage: profile.blocker,
          comprendre: profile.understand,
          valeurs: profile.values,
          forces: profile.strengths,
          peur: profile.fear,
          ambition: profile.ambition,
        })
    );
  }

  // Couche 2 — journal d'expansion (14 dernières entrées)
  const entries = [...journalFusion]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 14);
  if (entries.length) {
    parts.push(
      "JOURNAL D'EXPANSION (entrées récentes, dimensions notées /10 — étatInterne, clarté, actionRelationnelle, exposition) : " +
        JSON.stringify(entries)
    );
  }

  // Couche 3 — cartographie des identités
  if (identities.length) {
    parts.push(
      "CARTOGRAPHIE DES IDENTITÉS (énergie donnée / reçue /10, et classification) : " +
        JSON.stringify(
          identities.map((i) => ({
            role: i.name,
            donnee: i.given,
            recue: i.received,
            type: classify(i.given, i.received),
          }))
        )
    );
  }

  return parts.join("\n\n");
}

// ===================== Composant principal =====================

export function CoachIA() {
  const messages = useStore((s) => s.coachChat);
  const setCoachChat = useStore((s) => s.setCoachChat);
  const profile = useStore((s) => s.profile);
  const journalFusion = useStore((s) => s.journalFusion);
  const identities = useStore((s) => s.identities);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const context = useMemo(
    () => buildContext(profile, journalFusion, identities),
    [profile, journalFusion, identities]
  );

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setCoachChat(next.slice(-40));
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
        setCoachChat(
          [...next, { role: "assistant" as const, content: data.reply as string }].slice(-40)
        );
      }
    } catch {
      setError("Connexion impossible. Vérifie le réseau et réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setCoachChat([]);

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

      <Emblem size={54} dual={false} />

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
