import Link from "next/link";
import { redirect } from "next/navigation";
import { EnTete } from "@/components/EnTete";
import { RemonterEnHaut } from "@/components/RemonterEnHaut";
import { Boutique, GrandPrix, MesCommandes, type CadeauVue, type CommandeVue } from "@/components/Cadeaux";
import { db } from "@/lib/db";
import { soldeGreenPoints } from "@/lib/cadeaux-serveur";
import { TIRAGE_SAISON } from "@/lib/cadeaux";
import { formaterPoints } from "@/lib/carte";
import { carteConnectee } from "@/lib/session";
import { chargerVueCarte } from "@/lib/vue-carte";

export const metadata = { title: "Cadeaux" };
export const dynamic = "force-dynamic";

export default async function PageCadeaux() {
  const carte = await carteConnectee();
  if (!carte) redirect("/connexion");

  const [vue, solde, cadeaux, commandes, tirage] = await Promise.all([
    chargerVueCarte(carte.id),
    soldeGreenPoints(carte.id),
    db.cadeau.findMany({ where: { actif: true }, orderBy: { ordre: "asc" } }),
    db.commande.findMany({ where: { carteId: carte.id }, include: { cadeau: { select: { nom: true } } }, orderBy: { createdAt: "desc" } }),
    db.tirage.findUnique({
      where: { id: TIRAGE_SAISON.id },
      include: {
        cadeau: true,
        participations: { where: { carteId: carte.id } },
        gagnant: { select: { id: true, pseudo: true, logement: { select: { residence: { select: { nom: true } } } } } },
        _count: { select: { participations: true } },
      },
    }),
  ]);
  if (!vue) redirect("/connexion");

  const actives = new Set(commandes.filter((c) => c.statut !== "annulee").map((c) => c.cadeauId));
  const boutique: CadeauVue[] = cadeaux
    .filter((c) => c.type === "boutique")
    .map((c) => ({
      id: c.id,
      nom: c.nom,
      description: c.description,
      prix: c.prix ?? 0,
      stock: c.stock,
      tailles: c.tailles ? JSON.parse(c.tailles) : null,
      dejaCommande: actives.has(c.id),
    }));
  const vuesCommandes: CommandeVue[] = commandes.map((c) => ({
    id: c.id,
    nom: c.cadeau.nom,
    taille: c.taille,
    points: c.points,
    code: c.code,
    statut: c.statut,
    date: c.createdAt.toISOString(),
  }));

  return (
    <>
      <EnTete lienAccueil="/carte" />
      <RemonterEnHaut />
      <main id="contenu" className="mx-auto max-w-md space-y-6 px-5 pb-16 pt-4">
        <Link href="/carte" className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-ink">
          ← Ma carte
        </Link>
        <div>
          <h1 className="text-2xl font-bold">🎁 Les cadeaux</h1>
          <p className="text-sm text-muted">Vos éco-gestes méritent bien une récompense.</p>
        </div>

        <section className="rounded-carte bg-gradient-to-br from-green-400 to-green-700 p-5 text-white" aria-label="Mes GreenPoints">
          <p className="text-sm text-white/90">Points disponibles</p>
          <p className="text-[2rem] font-bold leading-tight">
            {formaterPoints(solde.disponible)} <span className="text-sm font-medium">GreenPoints</span>
          </p>
          <p className="mt-1 text-xs text-white/85">
            {formaterPoints(solde.gagnes)} gagnés · {formaterPoints(solde.depenses)} échangés. Votre niveau et vos médailles ne baissent jamais quand vous
            échangez des points.
          </p>
        </section>

        {tirage && (
          <GrandPrix
            tirageId={tirage.id}
            libelle={tirage.libelle}
            nom={tirage.cadeau.nom}
            description={tirage.cadeau.description}
            cloture={tirage.clotureLe.toISOString()}
            inscrit={tirage.participations.length > 0}
            gold={vue.gold}
            casesValidees={vue.casesValidees}
            inscrits={tirage._count.participations}
            gagnant={
              tirage.gagnant
                ? { pseudo: tirage.gagnant.pseudo, residence: tirage.gagnant.logement.residence.nom, moi: tirage.gagnant.id === carte.id }
                : null
            }
          />
        )}

        <Boutique cadeaux={boutique} solde={solde.disponible} />
        <MesCommandes commandes={vuesCommandes} />

        <p className="text-center text-xs text-muted">
          <Link href="/cadeaux/reglement" className="underline">
            Règlement des cadeaux et du grand tirage
          </Link>
        </p>
      </main>
    </>
  );
}
