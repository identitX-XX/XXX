const TROIS = [
  {
    n: "I",
    vers: "Aux autres",
    titre: "Un réseau d'affinités électives, pas un catalogue de profils.",
    texte: "Amitiés, amours, alliances pro : chaque mise en relation part de ce qui vous relie vraiment, et Maï Diaw veille sur le Cercle.",
  },
  {
    n: "II",
    vers: "À son corps",
    titre: "Énergie, sommeil, cycles : écouter ce que le corps sait déjà.",
    texte: "Le Compagnon lit votre sommeil, votre cardio et votre énergie. Vos données de santé ne quittent jamais votre espace.",
  },
  {
    n: "III",
    vers: "À son intuition",
    titre: "Des rituels au rythme de la lune pour clarifier ce que l'on veut.",
    texte: "Nouvelle lune : poser une intention. Pleine lune : faire le point. Un journal guidé entre les deux.",
  },
];

export function SeRelier() {
  return (
    <section className="bg-ivoire py-rythme text-encre">
      <div className="mx-auto max-w-[90rem] space-y-16 px-6 md:px-10 xl:px-24">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="font-serif text-titre font-extrabold">
            Se relier,
            <br />
            <span className="font-normal italic text-bordeaux">trois fois.</span>
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-gris">
            On ne rencontre bien les autres qu&apos;après s&apos;être retrouvé soi-même : dans son corps, dans son intuition, dans ses choix.
          </p>
        </div>
        <div className="grid border-t-2 border-encre md:grid-cols-3">
          {TROIS.map((t, i) => (
            <article
              key={t.n}
              className={`space-y-5 py-10 md:px-10 ${i === 0 ? "md:pl-0" : ""} ${i === 2 ? "md:pr-0" : "border-b border-filet md:border-b-0 md:border-r"}`}
            >
              <span className="block font-serif text-7xl font-extrabold leading-none text-bordeaux">{t.n}</span>
              <p className="text-xs font-semibold uppercase tracking-[0.26em]">{t.vers}</p>
              <h3 className="font-serif text-3xl font-medium leading-tight">{t.titre}</h3>
              <p className="leading-relaxed text-gris">{t.texte}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
