"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { anonId } from "@/lib/metrics";
import { getSupabase } from "@/lib/supabaseBrowser";

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

  // Envoi effectif du lien magique à une adresse donnée. Le lien magique est le
  // SEUL chemin d'entrée : en cas d'échec, on affiche une erreur claire (on NE
  // laisse PAS entrer sans lien, et on ne feint pas un succès).
  const envoyer = async (value: string) => {
    setSuggestion("");
    setLoading(true);
    setError("");
    try {
      // 1) Relier l'e-mail à l'identité (liste des inscrites, côté admin).
      await fetch("/api/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ anon_id: anonId(), email: value }),
      }).catch(() => {});

      // 2) Envoyer le lien magique. Cliquer le lien → /auth/callback → session
      //    → reprise de la progression.
      const supabase = getSupabase();
      if (!supabase) {
        setError("Connexion indisponible pour le moment. Réessaie plus tard.");
        return;
      }
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: value,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (otpErr) {
        setError("Impossible d'envoyer le lien. Vérifie ton adresse et réessaie.");
        return;
      }
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
  // cliquer le lien depuis un e-mail, hors session déverrouillée).
  if (pathname === "/auth/callback") return <>{children}</>;
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
            <div style={{ fontSize: 30, marginBottom: 10 }}>📩</div>
            <div style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.55, fontWeight: 500 }}>
              Un lien de connexion vient de partir vers
              <br />
              <span style={{ color: "var(--fuchsia)", wordBreak: "break-all" }}>
                {email.trim()}
              </span>
            </div>
            <div style={{ marginTop: 12, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              Ouvre ta boîte mail et <b style={{ color: "var(--ink)" }}>clique sur le lien</b> pour
              entrer dans IdentitX.
              <br />
              <span style={{ opacity: 0.8 }}>Pense à vérifier tes spams.</span>
            </div>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <button
                onClick={() => envoyer(email.trim().toLowerCase())}
                disabled={loading}
                style={{
                  minHeight: 50,
                  padding: "0 26px",
                  borderRadius: 14,
                  border: "1px solid color-mix(in srgb, var(--orange) 30%, transparent)",
                  background: "transparent",
                  color: "var(--ink)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {loading ? "Envoi…" : "Je n'ai rien reçu — renvoyer le lien"}
              </button>
              <button
                onClick={() => {
                  setLinkSent(false);
                  setWelcome("");
                }}
                style={{
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
            On t'envoie un lien de connexion par email — c'est ta clé d'entrée.
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 14, fontSize: 13, color: "var(--danger)", textAlign: "center", maxWidth: 320 }}>{error}</div>
      )}

    </div>
  );
}
