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
  const [etat, setEtat] = useState<"repos" | "envoi" | "merci">("repos");

  const envoyer = async () => {
    const texte = message.trim();
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
      /* silencieux : on remercie quand même, le geste compte */
    }
    setMessage("");
    setEtat("merci");
    setTimeout(() => setEtat("repos"), 4000);
  };

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Heart size={16} className="text-fuchsia" />
        <p className="text-ink">Ton mot à Marina</p>
      </div>
      <p className="mb-4 mt-1 text-xs text-muted">
        Dis-moi comment rendre IdentitX plus juste pour toi — avec tes propres
        mots, sans rien de technique. Ce que tu aimes, ce qui coince, ce qui te
        manque.
      </p>

      {etat === "merci" ? (
        <div className="rounded-xl border border-line bg-noir px-4 py-6 text-center animate-fade-in">
          <p className="font-display text-lg font-light text-ink">Merci — je te lis.</p>
          <p className="mt-1 text-sm text-muted">Ton retour construit la suite.</p>
        </div>
      ) : (
        <>
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
