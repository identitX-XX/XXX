import { JeuTri } from "@/components/jeux/JeuTri";
import { db } from "@/lib/db";
import { PARTIES_MAX_PAR_JOUR } from "@/lib/jeux/tri";

export async function SectionTri({ carteId }: { carteId: string }) {
  const debut = new Date();
  debut.setHours(0, 0, 0, 0);
  const [record, aujourdhui] = await Promise.all([
    db.partieTri.findFirst({
      where: { carteId, fin: { not: null } },
      orderBy: [{ score: "desc" }, { dureeMs: "asc" }],
      select: { score: true, dureeMs: true },
    }),
    db.partieTri.count({ where: { carteId, debut: { gte: debut } } }),
  ]);

  return (
    <JeuTri
      record={record?.score != null ? { score: record.score, dureeMs: record.dureeMs ?? 0 } : null}
      partiesRestantes={Math.max(0, PARTIES_MAX_PAR_JOUR - aujourdhui)}
    />
  );
}
