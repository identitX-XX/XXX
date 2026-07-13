"use client";

import { useRef, useState } from "react";
import { Download, FileText, Moon, RotateCcw, Sun, Upload } from "lucide-react";
import { useStore } from "@/store/useStore";
import { downloadJSON, readJSONFile } from "@/lib/exportImport";
import { Button, Card, PageHead } from "@/components/ui";

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
