"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, Download, FileText, Moon, RotateCcw, Shield, Sun, Trash2, Upload } from "lucide-react";
import { PaletteKey, useStore } from "@/store/useStore";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { downloadJSON, readJSONFile } from "@/lib/exportImport";
import { anonId } from "@/lib/metrics";
import { Button, Card, PageHead } from "@/components/ui";
import { Feedback } from "@/components/Feedback";

// Aperçu (fond, surface, accent) de chaque palette, pour le sélecteur.
const PALETTES: { key: PaletteKey; nom: string; note: string; fond: string; surface: string; accent: string }[] = [
  { key: "nuit", nom: "Nuit & Or", note: "nuit · or chaud", fond: "#11121b", surface: "#191b28", accent: "#d4af6a" },
  { key: "parme", nom: "Parme", note: "sobre · feutré", fond: "#16131c", surface: "#1e1926", accent: "#bda4dd" },
  { key: "or", nom: "Or discret", note: "sobre · intime", fond: "#101319", surface: "#171b22", accent: "#c6a461" },
  { key: "aubergine", nom: "Aubergine", note: "sobre · adulte", fond: "#151218", surface: "#1c1822", accent: "#b083a9" },
  { key: "ardoise", nom: "Ardoise", note: "sobre · froid", fond: "#14171b", surface: "#1b1f25", accent: "#6f97b8" },
  { key: "origine", nom: "Origine", note: "magenta", fond: "#0a090d", surface: "#121116", accent: "#ff4fa3" },
];

export default function SettingsPage() {
  const state = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  // Champs de données du parcours (les 30 jours de matière) — hors fonctions.
  const PARCOURS_FIELDS = [
    "parcours", "diagnostic", "objectifs", "reponses", "etat",
    "revelationsFeedback", "climat", "filVu", "mondeChoisi",
    "queteExercices", "quetePaliers",
  ] as const;

  const exportAll = () => {
    // Sauvegarde COMPLÈTE : profil principal ET parcours (diagnostic, réponses,
    // état, climat…) — sinon on perdrait les jours vécus, le cœur de la traversée.
    const p = useParcoursStore.getState() as unknown as Record<string, unknown>;
    downloadJSON("identitx-traversee.json", {
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      identitx: {
        profile: state.profile,
        cards: state.cards,
        timeline: state.timeline,
        journal: state.journal,
        radar: state.radar,
        coach: state.coach,
        journalFusion: state.journalFusion,
        identities: state.identities,
        coachChat: state.coachChat,
        onboarded: state.onboarded,
      },
      parcours: Object.fromEntries(PARCOURS_FIELDS.map((k) => [k, p[k]])),
    });
    flash("Traversée sauvegardée.");
  };

  const onImport = async (file?: File) => {
    if (!file) return;
    try {
      const data = await readJSONFile(file);
      // Nouveau format (identitx + parcours) ; sinon on retombe sur l'ancien
      // format à plat (profil principal seul) pour ne rien casser.
      if (data && (data.identitx || data.parcours)) {
        if (data.identitx) state.importAll(data.identitx);
        if (data.parcours) {
          const p = data.parcours as Record<string, unknown>;
          useParcoursStore.setState(
            Object.fromEntries(
              PARCOURS_FIELDS.filter((k) => k in p).map((k) => [k, p[k]])
            )
          );
        }
      } else {
        state.importAll(data);
      }
      flash("Traversée restaurée.");
    } catch {
      flash("Fichier illisible. Vérifie le format JSON.");
    }
  };

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  };

  const refaireQuete = useParcoursStore((s) => s.reinitialiser);
  const confirmRefaire = () => {
    if (
      window.confirm(
        "Refaire ta quête efface ta signature et toute ta progression des 30 jours. Continuer ?"
      )
    ) {
      refaireQuete();
      flash("Ta quête est réinitialisée — repars des 12 questions.");
    }
  };

  const confirmReset = () => {
    if (window.confirm("Réinitialiser efface ton profil et tes données. Continuer ?")) {
      state.reset();
    }
  };

  // Droit à l'effacement (RGPD) : efface le serveur (rattaché à l'identifiant
  // anonyme) PUIS le local. On tente le serveur d'abord, puis on nettoie tout.
  const confirmEffacer = async () => {
    if (
      !window.confirm(
        "Supprimer efface tes données locales ET tout ce qui est rattaché à ton identifiant côté serveur. Cette action est définitive. Continuer ?"
      )
    )
      return;
    try {
      await fetch("/api/rgpd", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ anon_id: anonId(), action: "delete" }),
      });
    } catch {
      /* on efface le local quoi qu'il arrive */
    }
    try {
      localStorage.removeItem("idx-anon");
      localStorage.removeItem("idx-consent");
    } catch {}
    state.reset();
    flash("Tes données ont été supprimées.");
  };

  return (
    <div>
      <PageHead eyebrow="Paramètres" title="Réglages" sub="L'essentiel, rien de plus." />

      <div className="space-y-4">
        <Feedback />

        <Card className="flex items-center justify-between p-5">
          <div>
            <p className="text-ink">Apparence</p>
            <p className="text-xs text-muted">Sombre par défaut, à ton image.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => state.setTheme(state.theme === "dark" ? "light" : "dark")}
          >
            {state.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {state.theme === "dark" ? "Clair" : "Sombre"}
          </Button>
        </Card>

        <Card className="p-5">
          <p className="text-ink">Palette</p>
          <p className="mb-4 text-xs text-muted">
            Un seul accent, à plat. Choisis-en une — tout l'app suit aussitôt.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PALETTES.map((p) => {
              const actif = state.palette === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => state.setPalette(p.key)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    actif ? "border-fuchsia" : "border-line hover:border-muted"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-6 w-6 rounded-md"
                      style={{ background: p.fond, boxShadow: `inset 0 0 0 1px ${p.surface}` }}
                    />
                    <span className="h-6 w-6 rounded-md" style={{ background: p.accent }} />
                    {actif && <Check size={14} className="ml-auto text-fuchsia" />}
                  </div>
                  <p className="mt-2 text-sm text-ink">{p.nom}</p>
                  <p className="text-[11px] text-muted">{p.note}</p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-ink">Données</p>
          <p className="mb-4 text-xs text-muted">
            Local-first : tout reste sur ton appareil. Sauvegarde ta traversée
            complète (profil + tes 30 jours) et restaure-la sur un autre appareil.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={exportAll}>
              <Download size={16} /> Sauvegarder ma traversée
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <FileText size={16} /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Restaurer
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => onImport(e.target.files?.[0])}
            />
          </div>
        </Card>

        <Card className="flex items-center justify-between gap-3 p-5">
          <div>
            <p className="text-ink">Ma quête</p>
            <p className="text-xs text-muted">
              Repasser les 12 questions et redéfinir ta signature.
            </p>
          </div>
          <Button variant="outline" onClick={confirmRefaire}>
            <RotateCcw size={16} /> Refaire ma quête
          </Button>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-fuchsia" />
            <p className="text-ink">Confidentialité &amp; données (RGPD)</p>
          </div>
          <p className="mb-4 mt-1 text-xs text-muted">
            Local-first, hébergement UE. Tu peux repartir de zéro, ou effacer
            définitivement tes données — ici comme sur le serveur.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/confidentialite"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-fuchsia hover:text-fuchsia"
            >
              <Shield size={15} /> Politique de confidentialité
            </Link>
            <Link
              href="/cgu"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-fuchsia hover:text-fuchsia"
            >
              <FileText size={15} /> Conditions d'utilisation
            </Link>
            <Button variant="ghost" onClick={confirmReset}>
              <RotateCcw size={16} /> Réinitialiser
            </Button>
            <Button variant="ghost" onClick={confirmEffacer} className="text-orange">
              <Trash2 size={16} /> Supprimer mes données
            </Button>
          </div>
        </Card>

        {msg && (
          <p className="text-sm text-fuchsia animate-fade-in">{msg}</p>
        )}
      </div>
    </div>
  );
}
