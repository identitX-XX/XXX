// Les 7 « monstres de bureau » en SVG. Contour sombre fixe (#1c140f) :
// ils sont toujours posés sur un cadre clair (--portrait) pour rester lisibles
// dans les deux thèmes.

const G =
  'stroke="#1c140f" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" fill="none"';

export const MONSTERS: Record<string, string> = {
  volcan: `<svg viewBox="0 0 120 120"><g ${G}>
    <path d="M16 104 L46 36 Q60 22 74 36 L104 104 Z" fill="#f4531f"/>
    <path d="M47 42 Q60 30 73 42 Q71 58 60 52 Q49 58 47 42 Z" fill="#ffd23f"/>
    <path d="M52 34 q3 -12 -1 -18 M60 30 q2 -14 6 -18 M68 34 q4 -10 10 -12"/>
    <circle cx="50" cy="74" r="9" fill="#fff"/><circle cx="72" cy="74" r="9" fill="#fff"/>
    <circle cx="51" cy="77" r="4" fill="#1c140f"/><circle cx="73" cy="77" r="4" fill="#1c140f"/>
    <path d="M42 66 L58 70"/><path d="M80 66 L64 70"/>
    <path d="M50 92 Q60 100 70 92" fill="#7a1d0a"/></g></svg>`,
  "tour-ivoire": `<svg viewBox="0 0 120 120"><g ${G}>
    <path d="M42 34 v-9 h8 v6 h6 v-6 h8 v6 h6 v-6 h8 v9" fill="#6366f1"/>
    <rect x="42" y="34" width="36" height="70" rx="6" fill="#6366f1"/>
    <path d="M51 22 l4 -11 l5 7 l5 -7 l4 11 z" fill="#ffd23f"/>
    <circle cx="53" cy="60" r="6.5" fill="#fff"/><circle cx="67" cy="60" r="6.5" fill="#fff"/>
    <path d="M45 60 h30" stroke-width="9" stroke="#6366f1"/>
    <circle cx="53" cy="63" r="3" fill="#1c140f"/><circle cx="67" cy="63" r="3" fill="#1c140f"/>
    <rect x="55" y="82" width="10" height="22" rx="5" fill="#1c140f"/>
    <path d="M48 74 h24" stroke-width="3"/></g></svg>`,
  "panier-crabes": `<svg viewBox="0 0 120 120"><g ${G}>
    <circle cx="16" cy="66" r="12" fill="#fb7168"/><path d="M8 61 l11 4 M8 71 l11 -4"/>
    <circle cx="104" cy="66" r="12" fill="#fb7168"/><path d="M112 61 l-11 4 M112 71 l-11 -4"/>
    <circle cx="60" cy="70" r="28" fill="#fb7168"/>
    <path d="M48 44 l-3 -18 M72 44 l3 -18"/>
    <circle cx="45" cy="24" r="7.5" fill="#fff"/><circle cx="75" cy="24" r="7.5" fill="#fff"/>
    <circle cx="45" cy="25" r="3.4" fill="#1c140f"/><circle cx="75" cy="25" r="3.4" fill="#1c140f"/>
    <path d="M48 76 q12 9 24 0" fill="#8a221c"/></g></svg>`,
  forteresse: `<svg viewBox="0 0 120 120"><g ${G}>
    <path d="M22 48 v-11 h9 v8 h8 v-8 h9 v8 h8 v-8 h9 v8 h8 v-8 h9 v11" fill="#8291a6"/>
    <rect x="22" y="48" width="76" height="56" rx="6" fill="#8291a6"/>
    <path d="M48 104 v-20 a12 12 0 0 1 24 0 v20 Z" fill="#1c140f"/>
    <path d="M54 86 v18 M60 84 v20 M66 86 v18" stroke="#8291a6" stroke-width="3"/>
    <rect x="35" y="60" width="11" height="15" rx="4.5" fill="#fff"/><rect x="74" y="60" width="11" height="15" rx="4.5" fill="#fff"/>
    <circle cx="40" cy="68" r="3" fill="#1c140f"/><circle cx="79" cy="68" r="3" fill="#1c140f"/>
    <path d="M60 37 v-15"/><path d="M60 22 l15 4 l-15 6 z" fill="#f4531f"/></g></svg>`,
  "petit-chef": `<svg viewBox="0 0 120 120"><g ${G}>
    <path d="M35 76 q-13 1 -11 15 M85 76 q13 1 11 15"/>
    <circle cx="60" cy="76" r="24" fill="#8b5cf6"/>
    <path d="M32 46 L41 15 L52 37 L60 11 L68 37 L79 15 L88 46 Z" fill="#ffd23f"/>
    <circle cx="41" cy="16" r="3.2" fill="#fb6a5b"/><circle cx="60" cy="12" r="3.8" fill="#fb6a5b"/><circle cx="79" cy="16" r="3.2" fill="#fb6a5b"/>
    <circle cx="52" cy="72" r="6.5" fill="#fff"/><circle cx="68" cy="72" r="6.5" fill="#fff"/>
    <circle cx="54" cy="73" r="3" fill="#1c140f"/><circle cx="70" cy="73" r="3" fill="#1c140f"/>
    <path d="M52 86 q8 5 16 0"/></g></svg>`,
  "cour-recre": `<svg viewBox="0 0 120 120"><g ${G}>
    <circle cx="96" cy="54" r="3.2" fill="#f472b6"/><circle cx="106" cy="45" r="4.6" fill="#f472b6"/>
    <circle cx="57" cy="66" r="28" fill="#f472b6"/>
    <circle cx="49" cy="60" r="7.5" fill="#fff"/><circle cx="67" cy="60" r="7.5" fill="#fff"/>
    <circle cx="53" cy="61" r="3.2" fill="#1c140f"/><circle cx="71" cy="61" r="3.2" fill="#1c140f"/>
    <circle cx="60" cy="78" r="4.5" fill="#8a2260"/>
    <path d="M76 78 q11 1 12 -8" fill="#f472b6"/><circle cx="80" cy="76" r="6.5" fill="#f9a8d4"/></g></svg>`,
  oasis: `<svg viewBox="0 0 120 120"><g ${G}>
    <path d="M60 46 C55 22 41 24 45 36 C48 46 58 46 60 46 Z" fill="#22c55e"/>
    <path d="M60 46 C65 20 80 24 75 36 C71 46 62 46 60 46 Z" fill="#22c55e"/>
    <path d="M60 48 v-16"/>
    <circle cx="60" cy="72" r="28" fill="#34d399"/>
    <path d="M45 70 q6 -7 12 0"/><path d="M63 70 q6 -7 12 0"/>
    <circle cx="45" cy="80" r="4" fill="#fca5a5"/><circle cx="75" cy="80" r="4" fill="#fca5a5"/>
    <path d="M50 82 q10 10 20 0" fill="#0f7a4d"/></g></svg>`,
};

/** Affiche un monstre par son id de profil, cadré par le parent (.mon / .pic). */
export default function Monster({ id }: { id: string }) {
  const svg = MONSTERS[id];
  if (!svg) return null;
  return <span className="mon-svg" dangerouslySetInnerHTML={{ __html: svg }} />;
}
