"use client";

// « Ton mot à Marina » — le feedback libre, sans technique, avec ses propres
// mots. Un seul champ, un envoi, un merci. Rattaché à l'identité anonyme ;
// aucune donnée nominative. Fire-and-forget côté réseau : ne casse jamais.

import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { anonId } from "@/lib/metrics";
import { Button, Card, TextArea } from "./ui";

export function Feedback() {
  const [message, setMessage] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "merci" | "erreur">("repos");

  const envoyer = async () => {
    const texte = message.trim();
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
    // On ne remercie que si c'est réellement enregistré (fini l'échec silencieux).
    if (stored) {
      setMessage("");
      setEtat("merci");
      setTimeout(() => setEtat("repos"), 4000);
    } else {
      setEtat("erreur");
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Heart size={16} className="text-fuchsia" />
        <p className="text-ink">Ton avis, en général</p>
      </div>
      <p className="mb-4 mt-1 text-xs text-muted">
        Comment rendre IdentitX plus juste pour toi — avec tes propres mots, sans
        rien de technique. (Pour un écran précis, utilise « Ton avis » en bas de
        chaque page.)
      </p>

      {etat === "merci" ? (
        <div className="rounded-xl border border-line bg-noir px-4 py-6 text-center animate-fade-in">
          <p className="font-display text-lg font-light text-ink">Merci — je te lis.</p>
          <p className="mt-1 text-sm text-muted">Ton retour construit la suite.</p>
        </div>
      ) : (
        <>
          {etat === "erreur" && (
            <p className="mb-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
              Oups — ton avis n'a pas pu être enregistré. Réessaie dans un instant.
            </p>
          )}
          <TextArea
            value={message}
            onChange={setMessage}
            placeholder="Écris librement…"
            rows={4}
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={envoyer} disabled={!message.trim() || etat === "envoi"}>
              <Send size={16} /> {etat === "envoi" ? "Envoi…" : "Envoyer"}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
