import { formaterPoints, MEDAILLES } from "@/lib/carte";
import type { VueCarte } from "@/lib/vue-carte";

const COULEUR_MEDAILLE = ["", "bg-[#f3d9bf] text-[#7a4512]", "bg-[#eef0f2] text-[#4a5560]", "bg-[#fff1b8] text-[#7a5a00]"];

/** La Green Card du foyer : niveau, GreenPoints et les 10 cases du parcours. */
export function CarteVerte({ vue, animer = false }: { vue: VueCarte; animer?: boolean }) {
  return (
    <section
      aria-label={`Green Card de ${vue.pseudo}`}
      className={`relative overflow-hidden rounded-carte bg-gradient-to-br from-green-400 to-green-700 p-5 text-white shadow-[0_12px_28px_rgba(11,138,66,.35)] ${animer ? "animate-activation" : ""}`}
      style={{ perspective: 800 }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative flex items-center justify-between">
        <span aria-hidden className="h-6 w-8 rounded-md bg-cdc-red shadow-inner" />
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
          <span aria-hidden>{vue.niveau.emoji} </span>Niveau {vue.niveau.nom}
          {vue.gold && " · Gold"}
        </span>
      </div>

      <p className="relative mt-4 text-lg font-semibold leading-tight">{vue.pseudo}</p>
      <p className="relative text-xs text-white/85">
        {vue.residence} · UG {vue.ug}
        {vue.batiment ? ` · Bât. ${vue.batiment}` : ""}
      </p>

      <p className="relative mt-3 text-[2rem] font-bold leading-none">
        {formaterPoints(vue.points)} <span className="text-sm font-medium text-white/90">GreenPoints</span>
      </p>

      <ol className="relative mt-4 grid grid-cols-5 gap-2" aria-label={`Parcours : ${vue.casesValidees} cases sur 10`}>
        {vue.cases.map((c, i) => (
          <li
            key={c.id}
            className={`grid aspect-square place-items-center rounded-xl text-sm font-semibold ${
              c.niveau > 0 ? "bg-white text-green-700" : "border-2 border-dashed border-white/50"
            } ${animer && c.niveau > 0 ? "animate-tampon" : ""}`}
            style={animer ? { animationDelay: `${0.6 + i * 0.08}s` } : undefined}
            title={c.titre}
          >
            {c.niveau > 0 ? <span aria-hidden className="text-lg">{c.emoji}</span> : <span aria-hidden>{c.ordre}</span>}
            <span className="sr-only">
              {c.titre} : {c.niveau > 0 ? `réussi, médaille ${MEDAILLES[c.niveau]}` : "à faire"}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function PastilleMedaille({ niveau }: { niveau: number }) {
  if (!niveau) return null;
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${COULEUR_MEDAILLE[niveau]}`}>{MEDAILLES[niveau]}</span>;
}
