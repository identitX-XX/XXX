"use client";

// La bibliothèque — toutes les pratiques, lectures et réflexions, consultables à
// tout moment, ORGANISÉES PAR THÈME DE VIE (Relationnel · Parentalité · Santé ·
// Corps · Style & présence · Soi & esprit) plutôt que par type. On filtre d'un
// geste ; chaque fiche nomme son mécanisme et sa source — rien ne flotte. La
// « ressource du jour » de la home en met une en avant ; ici, on les parcourt.

import { useMemo, useState } from "react";
import { Users, Baby, HeartPulse, Footprints, Sparkles, Compass } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import {
  RESSOURCES,
  THEME_META,
  TYPE_LABEL,
  RessourceTheme,
  Ressource,
} from "@/parcours-archetypes/quotidien";

// Icône par thème — discrète, un seul trait, jamais gadget.
const THEME_ICON: Record<RessourceTheme, React.ReactNode> = {
  relationnel: <Users size={15} />,
  parentalite: <Baby size={15} />,
  sante: <HeartPulse size={15} />,
  corps: <Footprints size={15} />,
  style: <Sparkles size={15} />,
  soi: <Compass size={15} />,
};

type Filtre = RessourceTheme | "all";

export default function RessourcesPage() {
  const [filtre, setFiltre] = useState<Filtre>("all");

  // Compte par thème (pour les pastilles) — calculé une fois.
  const comptes = useMemo(() => {
    const c = {} as Record<RessourceTheme, number>;
    for (const t of THEME_META) c[t.key] = 0;
    for (const r of RESSOURCES) c[r.theme] += 1;
    return c;
  }, []);

  const themesAffiches =
    filtre === "all" ? THEME_META : THEME_META.filter((t) => t.key === filtre);

  return (
    <div>
      <PageHead
        eyebrow="Bibliothèque"
        title="Ta bibliothèque"
        sub="Des pratiques, des réflexions et des savoirs — classés par thème de vie, chacun adossé à une source. Choisis un fil, reprends-le quand tu veux."
      />

      {/* Filtres par thème — on navigue, la page n'est plus un mur figé. */}
      <div className="-mx-1 mb-9 flex gap-2 overflow-x-auto px-1 pb-1">
        <Chip actif={filtre === "all"} onClick={() => setFiltre("all")}>
          Tout
          <span className="ml-1.5 opacity-50">{RESSOURCES.length}</span>
        </Chip>
        {THEME_META.map((t) => (
          <Chip key={t.key} actif={filtre === t.key} onClick={() => setFiltre(t.key)}>
            <span className="opacity-70">{THEME_ICON[t.key]}</span>
            {t.label}
            <span className="ml-0.5 opacity-50">{comptes[t.key]}</span>
          </Chip>
        ))}
      </div>

      <div key={filtre} className="flex animate-fade-up flex-col gap-12">
        {themesAffiches.map(({ key, label, intro }) => {
          const liste = RESSOURCES.filter((r) => r.theme === key);
          if (liste.length === 0) return null;
          return (
            <section key={key}>
              {/* En-tête de thème — éditorial, filet fin. */}
              <div className="mb-1.5 flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--prune)" }}>
                {THEME_ICON[key]} {label}
                <span className="opacity-50">· {liste.length}</span>
              </div>
              <p className="mb-5 max-w-xl text-sm leading-relaxed text-muted">{intro}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                {liste.map((r) => (
                  <FicheRessource key={r.id} r={r} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Chip({
  actif,
  onClick,
  children,
}: {
  actif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] transition-colors"
      style={{
        border: `1px solid ${actif ? "var(--ink)" : "var(--line)"}`,
        background: actif ? "var(--ink)" : "transparent",
        color: actif ? "var(--on-brand)" : "var(--muted)",
        fontWeight: actif ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

function FicheRessource({ r }: { r: Ressource }) {
  return (
    <Card className="flex flex-col p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        <span>{TYPE_LABEL[r.type]}</span>
        <span className="opacity-40">·</span>
        <span>{r.duree}</span>
      </div>
      <h3 className="mt-2 font-display text-lg font-light leading-snug text-ink">{r.titre}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{r.corps}</p>
      {r.source && (
        <p className="mt-3 border-t border-line pt-3 text-xs italic text-muted">{r.source}</p>
      )}
    </Card>
  );
}
