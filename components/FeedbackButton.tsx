"use client";

// Bouton de feedback flottant — présent sur CHAQUE écran, pour que les testeuses
// puissent laisser un commentaire d'un tap, sans le chercher dans les Réglages.
// La page en cours est capturée automatiquement (utile pour situer le retour).
// Écrit dans Supabase `feedback` via /api/feedback ; no-op gracieux sans backend.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, Send, X } from "lucide-react";
import { anonId } from "@/lib/metrics";
import { Button, TextArea } from "./ui";

// Nom lisible de l'écran courant, pour situer l'avis.
const NOM_PAGE: Record<string, string> = {
  "/aujourdhui": "Aujourd'hui", "/parcours-signatures": "Ma quête", "/scenarios": "Scénarios",
  "/coach": "Coach", "/explorer": "Explorer", "/synthese": "Ton portrait", "/quete": "La Quête",
  "/progression": "Progression", "/ressources": "Ressources", "/settings": "Réglages",
};
const nomPage = (p: string) => NOM_PAGE[p] ?? "cette page";

export function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Sur le Coach, la zone de saisie occupe déjà le bas : on masque le bouton
  // flottant pour éviter qu'il recouvre le bouton « envoyer » du chat.
  const masque = pathname === "/coach";
  const [msg, setMsg] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "merci" | "erreur">("repos");

  // Anti-recouvrement : le bouton doré ne doit jamais masquer le texte qu'on
  // lit. On l'escamote pendant qu'on défile vers le bas (lecture en cours) et on
  // le fait revenir dès qu'on remonte ou qu'on s'arrête (intention d'agir).
  const [caché, setCaché] = useState(false);
  const lastY = useRef(0);
  const idle = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current + 6 && y > 140) setCaché(true); // on descend : on s'efface
      else if (y < lastY.current - 6) setCaché(false); // on remonte : on réapparaît
      lastY.current = y;
      clearTimeout(idle.current);
      idle.current = setTimeout(() => setCaché(false), 700); // arrêt = on revient
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idle.current);
    };
  }, []);
  // Quand le panneau est ouvert, le bouton reste hors-champ de toute façon.
  const escamote = caché && !open;

  const envoyer = async () => {
    const texte = msg.trim();
    if (!texte || etat === "envoi") return;
    setEtat("envoi");
    let stored = false;
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          anon_id: anonId(),
          message: texte,
          route: typeof window !== "undefined" ? window.location.pathname : null,
        }),
      });
      const d = await r.json().catch(() => ({ stored: false }));
      stored = Boolean(r.ok && d.stored);
    } catch {
      stored = false;
    }
    // On ne remercie QUE si c'est réellement enregistré — sinon on le dit et on
    // garde le texte pour réessayer (fini l'échec silencieux).
    if (stored) {
      setMsg("");
      setEtat("merci");
      setTimeout(() => { setOpen(false); setEtat("repos"); }, 2200);
    } else {
      setEtat("erreur");
    }
  };

  return (
    <>
      {/* Le bouton flottant — au-dessus de la barre d'onglets, discret et doré. */}
      {!masque && (
      <button
        onClick={() => setOpen(true)}
        aria-label="Laisser un commentaire"
        className={`fixed right-4 z-40 flex items-center gap-2 rounded-full brand-gradient px-4 py-3 text-sm font-medium text-[color:var(--on-brand)] shadow-glow transition-all duration-300 hover:scale-[1.03] lg:bottom-6 lg:right-6 ${
          escamote ? "pointer-events-none translate-y-24 opacity-0" : ""
        }`}
        style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
      >
        <MessageSquarePlus size={18} />
        <span className="hidden sm:inline">Ton avis</span>
      </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="safe-bottom relative m-0 w-full max-w-md rounded-t-3xl border border-line bg-surface p-5 shadow-soft animate-fade-up sm:m-4 sm:rounded-3xl">
            <div className="mb-1 flex items-start justify-between">
              <div>
                <p className="text-ink">Ton avis sur cette page</p>
                <p className="text-[12px] uppercase tracking-[0.12em] text-fuchsia">{nomPage(pathname)}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="-m-2 grid h-11 w-11 flex-none place-items-center rounded-lg text-muted hover:text-ink">
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
                <p className="mb-3 mt-2 text-xs text-muted">
                  Qu'est-ce qui marche, qu'est-ce qui coince sur cet écran ? Avec tes
                  mots, sans rien de technique.
                </p>
                {etat === "erreur" && (
                  <p className="mb-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
                    Oups — ton avis n'a pas pu être enregistré. Réessaie dans un instant.
                  </p>
                )}
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
