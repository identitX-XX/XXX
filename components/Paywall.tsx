"use client";

// Mur premium réutilisable : aperçu (teaser) en dégradé + carte de déblocage.
// Tant que l'offre n'est pas débloquée, le contenu complet est masqué. Le bouton
// de déblocage est POUR L'INSTANT une démo locale (le temps de brancher Stripe) ;
// quand le paiement sera en place, il redirigera vers le checkout Stripe et le
// déblocage viendra du serveur (achat vérifié). L'API du composant ne changera pas.

import { useEffect, useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Card } from "./ui";
import { estDebloque, debloquer, lireEntitlements, OffreId } from "@/lib/entitlements";

export function Paywall({
  offerId,
  prix,
  titre,
  sousTitre,
  apercu,
  children,
}: {
  offerId: OffreId;
  prix: string; // ex. "2,50 €"
  titre: string;
  sousTitre?: string;
  apercu: React.ReactNode; // le teaser (haut du contenu, tronqué en dégradé)
  children: React.ReactNode; // le contenu complet, révélé une fois débloqué
}) {
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    setMounted(true);
    setUnlocked(estDebloque(lireEntitlements(), offerId));
  }, [offerId]);

  // Retour de paiement Stripe (success_url ?session_id=…) : on VÉRIFIE la session
  // côté serveur ; si elle est bien payée et concerne cette offre, on déverrouille.
  useEffect(() => {
    let sid: string | null = null;
    try {
      sid = new URLSearchParams(window.location.search).get("session_id");
    } catch {}
    if (!sid) return;
    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sid)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.offerId === offerId) {
          debloquer(offerId);
          setUnlocked(true);
        }
      })
      .catch(() => {});
  }, [offerId]);

  // Clic « Débloquer » : ouvre le paiement Stripe si la clé est branchée ; sinon
  // (Stripe pas encore configuré) déblocage démo local, le temps du branchement.
  const acheter = async () => {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ offerId }),
      });
      const d = await r.json();
      if (d?.url) {
        window.location.href = d.url as string; // → page de paiement Stripe
        return;
      }
      if (d?.configured === false) {
        // Stripe pas encore branché : on NE débloque PAS (jamais de gratuit) —
        // on annonce simplement que le paiement arrive.
        setErr("Le paiement arrive très bientôt — merci de ta patience.");
        return;
      }
      setErr(d?.error || "Paiement indisponible pour le moment.");
    } catch {
      setErr("Connexion impossible. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  if (!mounted) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div>
      {/* Aperçu tronqué : on montre le début, estompé, pour donner envie. */}
      <div
        aria-hidden
        className="pointer-events-none relative max-h-64 overflow-hidden"
        style={{ maskImage: "linear-gradient(to bottom, black 40%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent)" }}
      >
        {apercu}
      </div>

      {/* Carte de déblocage */}
      <Card className="mt-2 p-6 text-center animate-fade-up">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full" style={{ background: "color-mix(in srgb, var(--fuchsia) 14%, transparent)", color: "var(--fuchsia)" }}>
          <Lock size={22} />
        </div>
        <h3 className="mt-3 font-display text-xl font-light text-ink">{titre}</h3>
        {sousTitre && <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">{sousTitre}</p>}
        <button
          onClick={acheter}
          disabled={busy}
          className="mt-5 inline-flex items-center gap-2 rounded-full brand-gradient px-7 py-3 text-sm font-semibold text-[color:var(--on-brand)] shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          <Sparkles size={16} />
          {busy ? "Redirection…" : `Débloquer à ${prix}`}
        </button>
        {err && <p className="mt-2 text-xs text-danger">{err}</p>}
        <p className="mt-3 text-xs text-muted">
          Paiement sécurisé par carte &amp; Apple Pay (Stripe).
        </p>
      </Card>
    </div>
  );
}
