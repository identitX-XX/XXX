"use client";

// Offre premium n°2 — « Lecture approfondie de ta signature » (2,50 €).
// Compose principale + secondaire + celle qui émerge, à partir de tes données.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead, Card } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { radarCourant } from "@/parcours-archetypes/indicateurs";
import { lectureApprofondie, FicheLecture } from "@/parcours-archetypes/lectureSignature";
import type { SignatureKey } from "@/parcours-archetypes/signatures";

export default function LectureSignaturePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const etat = useParcoursStore((s) => s.etat);

  if (!mounted) return null;

  if (!diagnostic) {
    return (
      <div>
        <PageHead
          eyebrow="Lecture approfondie"
          title="Révèle d'abord ta signature"
          sub="Cette lecture se compose à partir de ta signature — commence par les douze questions."
        />
        <Link href="/parcours-signatures" className="inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-semibold text-[color:var(--on-brand)] shadow-glow">
          Révéler ma signature <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Celle qui ÉMERGE : la plus haute du radar qui n'est ni la principale ni la secondaire.
  const tri = [...radarCourant(etat)].sort((a, b) => b.valeur - a.valeur);
  const emergente =
    (tri.find((p) => p.key !== diagnostic.dominant && p.key !== diagnostic.secondaire)?.key as
      | SignatureKey
      | undefined) ?? null;

  const lecture = lectureApprofondie(diagnostic.dominant, diagnostic.secondaire, emergente);
  if (!lecture) return null;

  return (
    <div>
      <PageHead
        eyebrow="Aller plus loin"
        title="Ta signature, en profondeur"
        sub="Ta signature principale, ta secondaire, et celle qui commence à émerger — reliées en une seule lecture."
      />
      <div className="space-y-4">
        <SyntheseBloc synthese={lecture.synthese} />
        <FicheView titre="Ta signature principale" fiche={lecture.principale} />
        {lecture.secondaire && <FicheView titre="Ta signature secondaire" fiche={lecture.secondaire} />}
        {lecture.emergente && <FicheView titre="Celle qui émerge en toi" fiche={lecture.emergente} />}
      </div>
    </div>
  );
}

function SyntheseBloc({ synthese }: { synthese: string }) {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: "color-mix(in srgb, var(--fuchsia) 32%, transparent)",
        background: "radial-gradient(130% 130% at 0% 0%, color-mix(in srgb, var(--fuchsia) 9%, transparent), transparent 60%)",
      }}
    >
      <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-fuchsia">La lecture d'ensemble</div>
      <p className="mt-2 text-[15px] leading-relaxed text-ink">{synthese}</p>
    </div>
  );
}

function Ligne({ label, texte }: { label: string; texte: string }) {
  return (
    <div>
      <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-fuchsia">{label}</div>
      <p className="mt-1 text-sm leading-relaxed text-ink">{texte}</p>
    </div>
  );
}

function FicheView({ titre, fiche, apercu }: { titre: string; fiche: FicheLecture; apercu?: boolean }) {
  return (
    <Card className="p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-muted">{titre}</div>
      <h2 className="mt-1 font-display text-2xl font-light text-ink">{fiche.name}</h2>
      <p className="mt-1 font-display text-sm italic text-muted">{fiche.phrase}</p>
      <div className="mt-4 grid gap-4">
        <Ligne label="Ta valeur profonde" texte={fiche.valeur} />
        <Ligne label="Tes forces" texte={fiche.forces} />
        {!apercu && (
          <>
            <Ligne label="Ton schéma" texte={fiche.schema} />
            <Ligne label="Ta zone d'ombre" texte={fiche.ombres} />
            <Ligne label="Ta communication" texte={fiche.communication} />
            <Ligne label="Ta version mature" texte={fiche.mature} />
            <Ligne label="Ta question de bascule" texte={fiche.coaching} />
          </>
        )}
      </div>
    </Card>
  );
}
