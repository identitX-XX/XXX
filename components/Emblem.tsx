"use client";

/**
 * Emblème planète-boussole de la marque IdentitX.
 * Auparavant réimplémenté inline dans Gate, Welcome, CoachIA et JournalFusion.
 * `dual` ajoute le second anneau (point orange contra-rotatif) des écrans hero.
 * Les keyframes `idx-spin` vivent dans globals.css.
 */
export function Emblem({
  size = 78,
  dual = true,
}: {
  size?: number;
  dual?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "relative", width: size, height: size }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          animation: "idx-spin 9s linear infinite",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -4,
            left: "calc(50% - 4px)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--fuchsia)",
            boxShadow: "0 0 12px rgba(255,79,163,.8)",
          }}
        />
      </div>
      {dual && (
        <div
          style={{
            position: "absolute",
            inset: 12,
            animation: "idx-spin 14s linear infinite reverse",
          }}
        >
          <span
            style={{
              position: "absolute",
              bottom: -3,
              left: "calc(50% - 3px)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--orange)",
              boxShadow: "0 0 10px rgba(255,138,76,.8)",
            }}
          />
        </div>
      )}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          inset: size * 0.26,
          width: size * 0.49,
          height: size * 0.49,
          color: "var(--fuchsia)",
        }}
      >
        <circle cx="12" cy="12" r="9.2" />
        <path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5 5-2.2Z" />
      </svg>
    </div>
  );
}
