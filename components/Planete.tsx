"use client";

// Planète sphérique en pur CSS (aucune image), travaillée pour le RELIEF :
// forte lumière rasante en haut-gauche, terminateur net, ombre profonde en
// bas-droite, plus de fines variations de surface pour un rendu organique —
// jamais une bille lisse. Sobre, premium, s'adapte à toute palette.

export function Planete({ size = 260 }: { size?: number }) {
  const layer: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: "50%" };
  return (
    <div aria-hidden="true" style={{ width: size, height: size, position: "relative", flex: "none" }}>
      {/* Halo diffus + lumière rasante projetée derrière la sphère */}
      <div
        style={{
          position: "absolute",
          inset: "-22%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--fuchsia) 26%, transparent), transparent 60%)",
          filter: "blur(10px)",
        }}
      />

      {/* Corps de la sphère : tout est clippé au cercle (overflow hidden) */}
      <div style={{ ...layer, overflow: "hidden", background: "var(--noir)" }}>
        {/* 1. Dégradé de base : plein jour en haut-gauche → nuit profonde en bas-droite */}
        <div
          style={{
            ...layer,
            background:
              "radial-gradient(120% 120% at 30% 26%, color-mix(in srgb, var(--fuchsia) 55%, var(--raised)) 0%, color-mix(in srgb, var(--fuchsia) 22%, var(--raised)) 26%, var(--raised) 46%, color-mix(in srgb, var(--noir) 80%, #000) 78%, #05040a 100%)",
          }}
        />
        {/* 2. Variations de surface (organique) : deux masses douces, décentrées */}
        <div
          style={{
            ...layer,
            background:
              "radial-gradient(38% 30% at 58% 62%, color-mix(in srgb, #000 55%, transparent), transparent 70%), radial-gradient(30% 26% at 24% 38%, color-mix(in srgb, var(--fuchsia) 24%, transparent), transparent 72%), radial-gradient(22% 20% at 70% 30%, color-mix(in srgb, var(--ink) 14%, transparent), transparent 70%)",
            filter: "blur(4px)",
            mixBlendMode: "soft-light",
            opacity: 0.9,
          }}
        />
        {/* 3. Terminateur + ombre volumétrique : creuse le relief en bas-droite */}
        <div
          style={{
            ...layer,
            background:
              "radial-gradient(130% 130% at 34% 28%, transparent 40%, rgba(0,0,0,0.35) 66%, rgba(0,0,0,0.82) 100%)",
          }}
        />
        {/* 4. Lumière rasante sur le limbe haut-gauche (rim light chaud) */}
        <div
          style={{
            ...layer,
            boxShadow:
              "inset 14px 16px 30px color-mix(in srgb, var(--fuchsia) 30%, transparent), inset -26px -30px 60px rgba(0,0,0,0.7)",
          }}
        />
        {/* 5. Reflet spéculaire net */}
        <div
          style={{
            position: "absolute",
            top: "17%",
            left: "24%",
            width: "24%",
            height: "16%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--ink) 60%, transparent), transparent 68%)",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* Fine couronne à l'accent, par-dessus le clip */}
      <div
        style={{
          ...layer,
          boxShadow:
            "inset 0 0 0 1px color-mix(in srgb, var(--fuchsia) 34%, transparent), 0 30px 80px -20px color-mix(in srgb, var(--fuchsia) 26%, transparent)",
        }}
      />
    </div>
  );
}
