/** Visuels simples des cadeaux, aux couleurs Green Card (en attendant les photos des vrais objets). */
export function IllustrationCadeau({ id, className = "" }: { id: string; className?: string }) {
  const commun = { className: `h-full w-full ${className}`, "aria-hidden": true as const, viewBox: "0 0 200 150" };

  if (id === "mug") {
    return (
      <svg {...commun}>
        <ellipse cx="96" cy="132" rx="52" ry="7" fill="#000" opacity=".08" />
        <path d="M140 58 h12 a20 20 0 0 1 0 40 h-12" fill="none" stroke="#e4e6e2" strokeWidth="9" />
        <rect x="52" y="38" width="90" height="94" rx="10" fill="#fff" stroke="#e4e6e2" strokeWidth="2" />
        <rect x="52" y="104" width="90" height="16" fill="#0b8a42" />
        <image href="/brand/green-card-icon.svg" x="72" y="48" width="50" height="50" />
        <path d="M78 30 q6 -10 0 -18 M96 30 q6 -10 0 -18 M114 30 q6 -10 0 -18" stroke="#b4b7b0" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "tee-shirt") {
    return (
      <svg {...commun}>
        <ellipse cx="100" cy="140" rx="60" ry="6" fill="#000" opacity=".08" />
        <path d="M70 14 L44 26 L22 54 L44 68 L54 56 L54 136 L146 136 L146 56 L156 68 L178 54 L156 26 L130 14 Q100 34 70 14 Z" fill="#0b8a42" />
        <path d="M70 14 Q100 34 130 14" fill="none" stroke="#08713a" strokeWidth="4" />
        <rect x="76" y="52" width="48" height="48" rx="12" fill="#fff" />
        <image href="/brand/green-card-icon.svg" x="80" y="56" width="40" height="40" />
        <text x="100" y="122" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="var(--font-poppins), sans-serif">
          green card
        </text>
      </svg>
    );
  }

  if (id === "jeu-de-cartes") {
    const carte = (rot: number, emoji: string, fond: string) => (
      <g transform={`rotate(${rot} 100 130)`}>
        <rect x="70" y="24" width="60" height="88" rx="8" fill={fond} stroke="#e4e6e2" strokeWidth="2" />
        <text x="100" y="78" textAnchor="middle" fontSize="30">
          {emoji}
        </text>
        <rect x="78" y="32" width="12" height="9" rx="2" fill="#e2071b" />
      </g>
    );
    return (
      <svg {...commun}>
        <ellipse cx="100" cy="136" rx="58" ry="6" fill="#000" opacity=".08" />
        {carte(-18, "⚡", "#fff")}
        {carte(0, "💧", "#fff")}
        {carte(18, "♻️", "#e8f6ee")}
      </svg>
    );
  }

  // Le séjour : un immeuble CDC Habitat face à la mer.
  return (
    <svg {...commun}>
      <rect width="200" height="150" fill="#dff2fb" />
      <circle cx="160" cy="34" r="16" fill="#ffd34d" />
      <path d="M0 112 Q50 102 100 112 T200 112 V150 H0 Z" fill="#59b7e3" />
      <path d="M0 126 Q50 118 100 126 T200 126 V150 H0 Z" fill="#f3dfb1" />
      <rect x="34" y="40" width="70" height="78" rx="4" fill="#fff" stroke="#e4e6e2" strokeWidth="2" />
      <rect x="34" y="40" width="70" height="8" fill="#e2071b" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={42 + c * 21} y={56 + r * 18} width="12" height="10" rx="2" fill="#bfe3f3" />),
      )}
      <rect x="62" y="100" width="14" height="18" fill="#0b8a42" />
      <path d="M140 124 L140 84 M140 84 q-16 -2 -22 8 M140 84 q16 -2 22 8 M140 84 q-6 -14 -18 -14 M140 84 q6 -14 18 -14" stroke="#0b8a42" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
