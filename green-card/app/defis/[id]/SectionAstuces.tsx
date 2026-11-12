import { FormAstuce, ListeAstuces, type AstuceVue } from "@/components/jeux/Astuces";
import { db } from "@/lib/db";
import { VOTES_DONNES_ARGENT } from "@/lib/jeux/astuces";

export async function SectionAstuces({ carteId, residenceId }: { carteId: string; residenceId: string }) {
  const [astuces, votesDonnes] = await Promise.all([
    db.astuce.findMany({
      where: { residenceId, statut: "publiee" },
      include: {
        carte: { select: { pseudo: true } },
        votes: { select: { carteId: true } },
        signalements: { where: { carteId }, select: { carteId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.voteAstuce.count({ where: { carteId } }),
  ]);

  const vues: AstuceVue[] = astuces
    .map((a) => ({
      id: a.id,
      titre: a.titre,
      texte: a.texte,
      univers: a.univers,
      auteur: a.carte.pseudo,
      date: a.createdAt.toISOString(),
      votes: a.votes.length,
      aVote: a.votes.some((v) => v.carteId === carteId),
      aSignale: a.signalements.length > 0,
      mienne: a.carteId === carteId,
    }))
    .sort((a, b) => b.votes - a.votes || b.date.localeCompare(a.date));

  return (
    <>
      <FormAstuce />
      <ListeAstuces
        astuces={vues}
        votesDonnes={votesDonnes}
        objectifVotes={VOTES_DONNES_ARGENT}
      />
    </>
  );
}
