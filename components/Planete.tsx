"use client";

// Une planète sphérique sobre, en pur CSS (aucune image) : dégradé radial qui
// donne le volume (source de lumière en haut-gauche, ombre en bas-droite), fine
// couronne et halo doux à l'accent de la palette. Discrète, premium, « monde
// que tu t'apprêtes à explorer ». S'adapte à Nuit & Or et à toute palette.

export function Planete({ size = 260 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size, position: "relative", flex: "none" }}
    >
      {/* Halo diffus derrière la sphère */}
      <div
        style={{
          position: "absolute",
          inset: "-18%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--fuchsia) 22%, transparent), transparent 68%)",
          filter: "blur(6px)",
        }}
      />
      {/* La sphère */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 34% 30%, color-mix(in srgb, var(--fuchsia) 42%, var(--raised)) 0%, var(--raised) 42%, var(--noir) 100%)",
          boxShadow:
            "inset -18px -22px 48px rgba(0,0,0,0.55), inset 8px 10px 26px color-mix(in srgb, var(--fuchsia) 18%, transparent), 0 24px 70px -18px color-mix(in srgb, var(--fuchsia) 30%, transparent)",
        }}
      />
      {/* Fine couronne à l'accent */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--fuchsia) 40%, transparent)",
        }}
      />
      {/* Reflet spéculaire ténu */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "26%",
          width: "26%",
          height: "18%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ink) 40%, transparent), transparent 70%)",
          filter: "blur(3px)",
        }}
      />
    </div>
  );
}
