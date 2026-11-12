/** Logo Green Card : icône (carte + feuille validée, puce rouge CDC) + texte en minuscules. */
export function LogoGreenCard({ taille = "md", signature = false }: { taille?: "sm" | "md" | "lg"; signature?: boolean }) {
  const t = {
    sm: { icone: 36, texte: "text-xl" },
    md: { icone: 56, texte: "text-3xl" },
    lg: { icone: 132, texte: "text-[2.6rem]" },
  }[taille];
  const vertical = taille === "lg";

  return (
    <div className={`flex items-center ${vertical ? "flex-col gap-3 text-center" : "gap-2"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/green-card-icon.svg" alt="" width={t.icone} height={t.icone} />
      <div>
        <p className={`${t.texte} font-bold leading-none tracking-tight`}>
          <span className="text-green-text">green</span> <span className="font-medium text-ink">card</span>
          <span className="sr-only"> — CDC Habitat</span>
        </p>
        {signature && <p className="mt-2 text-sm text-muted">vos éco-gestes comptent</p>}
      </div>
    </div>
  );
}

/** Logo CDC Habitat. « seul » = sans le bloc Caisse des Dépôts (pour les petites tailles). */
export function LogoCDC({ variante = "seul", hauteur = 24 }: { variante?: "seul" | "complet"; hauteur?: number }) {
  const src = variante === "seul" ? "/brand/cdc-habitat-seul.png" : "/brand/cdc-habitat.png";
  const ratio = variante === "seul" ? 322 / 128 : 460 / 128;
  return (
    // Pastille blanche : le logo garde ses couleurs d'origine en mode sombre.
    <span className="inline-flex rounded-md bg-white px-1.5 py-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="CDC Habitat" height={hauteur} width={Math.round(hauteur * ratio)} style={{ height: hauteur, width: "auto" }} />
    </span>
  );
}
