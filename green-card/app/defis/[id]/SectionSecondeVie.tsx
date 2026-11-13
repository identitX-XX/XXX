import { FormActionCirculaire, MurVoisins, type AnnonceVue, type MonAnnonceVue } from "@/components/jeux/SecondeVie";
import { Onglets } from "@/components/Onglets";
import { db } from "@/lib/db";
import { ACTIONS_ARGENT, TYPES_ACTION, categorie, economie } from "@/lib/jeux/circulaire";

const nombre = (n: number, max = 0) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: max }).format(n).replace(/[  ]/g, " ");
const dateCourte = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

export async function SectionSecondeVie({ carteId, residenceId }: { carteId: string; residenceId: string }) {
  const [actions, annonces, miennes] = await Promise.all([
    db.actionCirculaire.findMany({ where: { carteId }, orderBy: { createdAt: "desc" } }),
    db.annonce.findMany({
      where: { residenceId, statut: "ouverte", carteId: { not: carteId } },
      include: { carte: { select: { pseudo: true, logement: { select: { batiment: true } } } }, interets: { select: { carteId: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.annonce.findMany({
      where: { carteId, statut: { in: ["ouverte", "conclue"] } },
      include: {
        interets: { include: { carte: { select: { id: true, pseudo: true, logement: { select: { batiment: true } } } } }, orderBy: { createdAt: "asc" } },
        beneficiaire: { select: { pseudo: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const co2 = actions.reduce((s, a) => s + a.co2Evite, 0);
  const euros = actions.reduce((s, a) => s + economie(a.prixPaye, a.prixNeuf), 0);
  const echanges = actions.filter((a) => a.annonceId).length;

  const vuesAnnonces: AnnonceVue[] = annonces.map((a) => ({
    id: a.id,
    type: a.type,
    categorie: a.categorie,
    titre: a.titre,
    description: a.description,
    auteur: a.carte.pseudo,
    batiment: a.carte.logement.batiment,
    interesses: a.interets.length,
    jeSuisInteresse: a.interets.some((i) => i.carteId === carteId),
  }));

  const vuesMiennes: MonAnnonceVue[] = miennes.map((a) => ({
    id: a.id,
    type: a.type,
    categorie: a.categorie,
    titre: a.titre,
    statut: a.statut,
    beneficiaire: a.beneficiaire?.pseudo ?? null,
    interesses: a.interets.map((i) => ({ id: i.carte.id, pseudo: i.carte.pseudo, batiment: i.carte.logement.batiment })),
  }));

  const nomType = (t: string) => (t === "echange" ? "Échange entre voisins" : TYPES_ACTION.find((x) => x.id === t)?.nom ?? t);

  return (
    <>
      <section aria-labelledby="titre-bilan-sv" className="panneau">
        <h2 id="titre-bilan-sv" className="sr-only">
          Mon bilan seconde vie
        </h2>
        <dl className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-green-50 p-3">
            <dt className="text-xs text-muted">CO₂ évité</dt>
            <dd className="text-lg font-bold text-green-text">{nombre(co2)} kg</dd>
          </div>
          <div className="rounded-xl bg-bg p-3">
            <dt className="text-xs text-muted">Économisé</dt>
            <dd className="text-lg font-bold">{nombre(euros)} €</dd>
          </div>
          <div className="rounded-xl bg-bg p-3">
            <dt className="text-xs text-muted">Actions</dt>
            <dd className="text-lg font-bold">
              {actions.length}
              <span className="text-sm font-medium text-muted">{actions.length < ACTIONS_ARGENT ? `/${ACTIONS_ARGENT}` : ""}</span>
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-sm text-muted">
          {echanges > 0
            ? `🤝 ${echanges} échange${echanges > 1 ? "s" : ""} avec vos voisins. Bravo !`
            : "🤝 Donnez, échangez ou prêtez un objet à un voisin pour la médaille d'or."}
        </p>
      </section>

      <Onglets
        onglets={[
          {
            id: "declarer",
            titre: "🛍️ Mes actions",
            contenu: (
              <>
                <FormActionCirculaire />
                {actions.length > 0 && (
                  <section aria-labelledby="titre-mes-actions" className="space-y-2">
                    <h2 id="titre-mes-actions" className="text-lg font-bold">
                      Mes dernières actions
                    </h2>
                    <ul className="space-y-2">
                      {actions.slice(0, 8).map((a) => {
                        const c = categorie(a.categorie);
                        const eco = economie(a.prixPaye, a.prixNeuf);
                        return (
                          <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-sm">
                            <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-100 text-xl">
                              {c?.emoji}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold">{a.description || c?.nom}</p>
                              <p className="text-muted">
                                {dateCourte(a.createdAt)} · {nomType(a.type)} · {nombre(a.co2Evite)} kg CO₂
                                {eco > 0 ? ` · ${nombre(eco)} € économisés` : ""}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
              </>
            ),
          },
          {
            id: "mur",
            titre: `🏢 Mur des voisins${vuesAnnonces.length ? ` (${vuesAnnonces.length})` : ""}`,
            contenu: <MurVoisins annonces={vuesAnnonces} miennes={vuesMiennes} />,
          },
        ]}
      />
      <p className="text-xs text-muted">CO₂ indicatif : moyenne évitée en ne fabriquant pas un objet neuf de la même catégorie.</p>
    </>
  );
}
