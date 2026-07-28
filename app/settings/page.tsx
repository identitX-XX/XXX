"use client";

import { useRef, useState } from "react";
import { Check, Download, FileText, Moon, RotateCcw, Sun, Upload } from "lucide-react";
import { PaletteKey, useStore } from "@/store/useStore";
import { downloadJSON, readJSONFile } from "@/lib/exportImport";
import { Button, Card, PageHead } from "@/components/ui";

// Aperçu (fond, surface, accent) de chaque palette, pour le sélecteur.
const PALETTES: { key: PaletteKey; nom: string; note: string; fond: string; surface: string; accent: string }[] = [
  { key: "nuit", nom: "Nuit & Or", note: "nuit · or chaud", fond: "#11121b", surface: "#191b28", accent: "#d7b56f" },
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

  const exportAll = () => {
    downloadJSON("identitx-profil.json", {
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
    });
    flash("Export généré.");
  };

  const onImport = async (file?: File) => {
    if (!file) return;
    try {
      const data = await readJSONFile(file);
      state.importAll(data);
      flash("Profil importé.");
    } catch {
      flash("Fichier illisible. Vérifie le format JSON.");
    }
  };

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  };

  const confirmReset = () => {
    if (window.confirm("Réinitialiser efface ton profil et tes données. Continuer ?")) {
      state.reset();
    }
  };

  return (
    <div>
      <PageHead eyebrow="Paramètres" title="Réglages" sub="L'essentiel, rien de plus." />

      <div className="space-y-4">
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
          <p className="mb-4 text-xs text-muted">Local-first : tout reste sur ton appareil.</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={exportAll}>
              <Download size={16} /> Export JSON
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <FileText size={16} /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Importer
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

        <Card className="flex items-center justify-between p-5">
          <div>
            <p className="text-ink">Réinitialiser</p>
            <p className="text-xs text-muted">Repartir d'un profil vierge.</p>
          </div>
          <Button variant="ghost" onClick={confirmReset} className="text-orange">
            <RotateCcw size={16} /> Réinitialiser
          </Button>
        </Card>

        {msg && (
          <p className="text-sm text-fuchsia animate-fade-in">{msg}</p>
        )}
      </div>
    </div>
  );
}
