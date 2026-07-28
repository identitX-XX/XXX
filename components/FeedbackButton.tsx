"use client";

// Bouton de feedback flottant — présent sur CHAQUE écran, pour que les testeuses
// puissent laisser un commentaire d'un tap, sans le chercher dans les Réglages.
// La page en cours est capturée automatiquement (utile pour situer le retour).
// Écrit dans Supabase `feedback` via /api/feedback ; no-op gracieux sans backend.

import { useState } from "react";
import { MessageSquarePlus, Send, X } from "lucide-react";
import { anonId } from "@/lib/metrics";
import { Button, TextArea } from "./ui";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "merci">("repos");

  const envoyer = async () => {
    const texte = msg.trim();
    if (!texte || etat === "envoi") return;
    setEtat("envoi");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          anon_id: anonId(),
          message: texte,
          route: typeof window !== "undefined" ? window.location.pathname : null,
        }),
      });
    } catch {
      /* on remercie quand même : le geste compte */
    }
    setMsg("");
    setEtat("merci");
    setTimeout(() => { setOpen(false); setEtat("repos"); }, 2200);
  };

  return (
    <>
      {/* Le bouton flottant — au-dessus de la barre d'onglets, discret et doré. */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Laisser un commentaire"
        className="fixed right-4 z-40 flex items-center gap-2 rounded-full brand-gradient px-4 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.03] lg:bottom-6 lg:right-6"
        style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
      >
        <MessageSquarePlus size={18} />
        <span className="hidden sm:inline">Un mot</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="safe-bottom relative m-0 w-full max-w-md rounded-t-3xl border border-line bg-surface p-5 shadow-soft animate-fade-up sm:m-4 sm:rounded-3xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-ink">Ton mot à Marina</p>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="rounded-lg p-1 text-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            {etat === "merci" ? (
              <div className="rounded-xl border border-line bg-noir px-4 py-6 text-center">
                <p className="font-display text-lg font-light text-ink">Merci — je te lis.</p>
                <p className="mt-1 text-sm text-muted">Ton retour construit la suite.</p>
              </div>
            ) : (
              <>
                <p className="mb-3 text-xs text-muted">
                  Ce que tu aimes, ce qui coince, ce qui manque — avec tes mots, sans rien de technique.
                </p>
                <TextArea value={msg} onChange={setMsg} placeholder="Écris librement…" rows={4} />
                <div className="mt-3 flex justify-end">
                  <Button onClick={envoyer} disabled={!msg.trim() || etat === "envoi"}>
                    <Send size={16} /> {etat === "envoi" ? "Envoi…" : "Envoyer"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
