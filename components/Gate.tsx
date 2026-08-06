"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { anonId } from "@/lib/metrics";
import { getSupabase } from "@/lib/supabaseBrowser";
import { setEmail as setEmailLocal, pullEtat } from "@/lib/etatSync";

// Clé versionnée : la bumper invalide tous les accès mémorisés → chacun doit
// ressaisir le code. À incrémenter à chaque rotation du GATE_CODE (Vercel).
const GATE_KEY = "identitx-gate-2";

// Le lien magique est le SEUL chemin d'entrée : une coquille de domaine bloque
// l'accès tant qu'on ne la voit pas. On propose donc une correction douce des
// fautes de frappe les plus courantes avant d'envoyer.
const DOMAINES_CORRIGES: Record<string, string> = {
  "fmail.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gnail.com": "gmail.com",
  "gmail.fr": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "yahou.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "iclod.com": "icloud.com",
  "icloud.co": "icloud.com",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = "code" | "email";

export function Gate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState<Mode>("code");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [welcome, setWelcome] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(GATE_KEY) === "ok") setUnlocked(true);
    } catch {}
    // Le Gate s'affiche AVANT ClientShell : il doit appliquer lui-même la
    // palette (Nuit & Or par défaut) et le thème sur <html>, sinon l'écran
    // d'accès retombe sur le rose du :root. Même logique que ClientShell.
    try {
      const raw = localStorage.getItem("identitx");
      const st = raw ? JSON.parse(raw)?.state : null;
      const palette = st?.palette ?? "nuit";
      const theme = st?.theme ?? "dark";
      const root = document.documentElement;
      root.classList.toggle("light", theme === "light");
      ["pal-nuit", "pal-ardoise", "pal-or", "pal-aubergine", "pal-parme"].forEach(
        (c) => root.classList.remove(c)
      );
      if (palette && palette !== "origine") root.classList.add(`pal-${palette}`);
    } catch {}
    setChecked(true);
  }, []);

  const enter = () => {
    try {
      localStorage.setItem(GATE_KEY, "ok");
    } catch {}
    setUnlocked(true);
  };

  const submitCode = async () => {
    const value = code.trim();
    if (!value || loading) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/gate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      if (r.ok) enter();
      else setError("Code incorrect — réessaie.");
    } catch {
      setError("Code incorrect — réessaie.");
    } finally {
      setLoading(false);
    }
  };

  // Accès robuste : on COLLECTE l'email (c'est ce qu'on garde), puis on entre
  // TOUT DE SUITE — l'accès ne dépend jamais de la réception d'un email. Le lien
  // magique part en arrière-plan (bonus, pour reprendre plus tard multi-appareils),
  // sans bloquer. Fonctionne à l'échelle (30+) sans SMTP dédié ni domaine.
  const envoyer = async (value: string) => {
    setSuggestion("");
    setLoading(true);
    setError("");
    try {
      // 1) Collecte de l'e-mail (liste des inscrites — visible dans /admin).
      await fetch("/api/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ anon_id: anonId(), email: value }),
      }).catch(() => {});

      // 1 bis) Durabilité : on mémorise l'e-mail et on RESTAURE la progression
      // serveur si elle existe (nouvel appareil / cache vidé). L'e-mail est la
      // clé de reprise — pas besoin de cliquer un lien.
      setEmailLocal(value);
      try {
        await pullEtat(value);
      } catch {}

      // 2) Lien magique en arrière-plan (best-effort, non bloquant).
      try {
        getSupabase()?.auth.signInWithOtp({
          email: value,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
      } catch {}

      // 3) On ouvre l'espace : rien ne dépend de l'email.
      setLinkSent(true);
      setWelcome("link");
    } catch {
      setError("Un souci réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = () => {
    const value = email.trim().toLowerCase();
    if (!value || loading) return;
    if (!EMAIL_RE.test(value)) {
      setError("Adresse email invalide.");
      return;
    }
    // Garde-fou : coquille de domaine fréquente → on propose la correction
    // AVANT d'envoyer (sinon le lien part dans le vide et personne n'entre).
    const dom = value.split("@")[1];
    if (dom && DOMAINES_CORRIGES[dom]) {
      setSuggestion(value.replace(`@${dom}`, `@${DOMAINES_CORRIGES[dom]}`));
      return;
    }
    envoyer(value);
  };

  // Le retour du lien magique doit s'exécuter SANS portail (l'utilisatrice peut
  // cliquer le lien depuis un e-mail, hors session déverrouillée). La vitrine
  // publique « Marina#constellations » est également hors portail : c'est une
  // page ouverte (portfolio + contact), sans accès mémorisé requis.
  if (pathname === "/auth/callback" || pathname === "/marina-constellations")
    return <>{children}</>;
  if (!checked) return null;
  if (unlocked) return <>{children}</>;

  const submit = mode === "code" ? submitCode : submitEmail;

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
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(55% 38% at 85% 0%, color-mix(in srgb, var(--fuchsia) 12%, transparent), transparent 70%), radial-gradient(45% 32% at 10% 100%, color-mix(in srgb, var(--orange) 10%, transparent), transparent 70%)",
        }}
      />

      {/* Bandeau de marque en tête : le nom s'impose d'abord, en héros. */}
      <div
        style={{
          fontFamily: "var(--font-fraunces),serif",
          fontWeight: 500,
          fontSize: "clamp(34px, 11vw, 52px)",
          lineHeight: 1,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          marginBottom: 18,
          textIndent: ".14em",
        }}
      >
        Identit<span style={{ color: "var(--fuchsia)" }}>X</span>
      </div>

      {/* Le visage dense, héros juste sous le nom, fondu dans le noir. */}
      <img
        src="/visage-dense.png"
        alt=""
        aria-hidden="true"
        className="visage-dense"
        style={{ width: 230, maxWidth: "68vw", height: "auto" }}
      />

      <p
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.5,
          color: "var(--muted)",
          textAlign: "center",
          maxWidth: 300,
          margin: "16px 0 0",
        }}
      >
        Il est possible de tolérer l'incertitude lorsqu'on a une direction.
      </p>

      <div style={{ height: 24 }} />

      {welcome ? (
        linkSent ? (
          <div style={{ textAlign: "center", maxWidth: 340 }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>✨</div>
            <div style={{ fontSize: 17, color: "var(--ink)", lineHeight: 1.5, fontWeight: 600 }}>
              Bienvenue — ton espace est prêt.
            </div>
            <div style={{ marginTop: 12, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              On envoie aussi un lien à{" "}
              <span style={{ color: "var(--fuchsia)", wordBreak: "break-all" }}>{email.trim()}</span>{" "}
              pour reprendre plus tard sur un autre appareil (pense à vérifier tes spams). Mais tu
              peux entrer <b style={{ color: "var(--ink)" }}>tout de suite</b>.
            </div>
            <button
              onClick={enter}
              style={{
                marginTop: 22,
                minHeight: 52,
                width: "100%",
                maxWidth: 300,
                padding: "0 26px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(90deg,var(--fuchsia),var(--orange))",
                color: "var(--noir)",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Entrer dans IdentitX →
            </button>
            <button
              onClick={() => {
                setLinkSent(false);
                setWelcome("");
              }}
              style={{
                display: "block",
                margin: "12px auto 0",
                background: "none",
                border: "none",
                color: "var(--muted)",
                fontSize: 13,
                textDecoration: "underline",
                textUnderlineOffset: 3,
                cursor: "pointer",
              }}
            >
              Changer d'adresse
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "var(--fuchsia)", textAlign: "center", maxWidth: 320, lineHeight: 1.5 }}>
            {welcome}
          </div>
        )
      ) : (
        <div style={{ width: "100%", maxWidth: 340 }}>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuggestion("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submitEmail()}
              placeholder="ton@email.com"
              autoComplete="email"
              style={{
                flex: 1,
                background: "color-mix(in srgb, var(--orange) 6%, transparent)",
                border: error
                  ? "1px solid color-mix(in srgb, var(--danger) 60%, transparent)"
                  : "1px solid color-mix(in srgb, var(--orange) 25%, transparent)",
                borderRadius: 14,
                color: "var(--ink)",
                fontSize: 16,
                padding: "15px 16px",
                outline: "none",
                fontFamily: "var(--font-inter),sans-serif",
                textAlign: "left",
              }}
            />
            <button
              onClick={() => submitEmail()}
              disabled={loading || !email.trim()}
              aria-label="Recevoir mon lien"
              style={{
                background:
                  loading || !email.trim()
                    ? "color-mix(in srgb, var(--fuchsia) 25%, transparent)"
                    : "linear-gradient(90deg,var(--fuchsia),var(--orange))",
                color: "var(--noir)",
                border: "none",
                borderRadius: 14,
                padding: "0 18px",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "…" : "Commencer →"}
            </button>
          </div>

          {/* Correction douce d'un domaine visiblement mal tapé */}
          {suggestion && (
            <div
              style={{
                marginTop: 12,
                fontSize: 13.5,
                color: "var(--ink)",
                lineHeight: 1.5,
                textAlign: "center",
              }}
            >
              Tu voulais dire{" "}
              <button
                onClick={() => {
                  setEmail(suggestion);
                  envoyer(suggestion);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--fuchsia)",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 13.5,
                }}
              >
                {suggestion}
              </button>{" "}
              ?
              <br />
              <button
                onClick={() => envoyer(email.trim().toLowerCase())}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: 12.5,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                Non, envoyer à l'adresse saisie
              </button>
            </div>
          )}

          <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)", opacity: 0.8, textAlign: "center", lineHeight: 1.5 }}>
            Tu entres tout de suite. On envoie aussi un lien pour reprendre plus tard, ailleurs.
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 14, fontSize: 13, color: "var(--danger)", textAlign: "center", maxWidth: 320 }}>{error}</div>
      )}

    </div>
  );
}
