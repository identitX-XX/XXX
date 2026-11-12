import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carteConnectee } from "@/lib/session";

/** RGPD, droit d'accès et de portabilité : export JSON de toutes les données de la carte. */
export async function GET() {
  const carte = await carteConnectee();
  if (!carte) return NextResponse.json({ erreur: "Non connecté" }, { status: 401 });

  const [progressions, mouvements] = await Promise.all([
    db.progression.findMany({ where: { carteId: carte.id }, select: { defiId: true, niveau: true, majLe: true } }),
    db.mouvementPoints.findMany({ where: { carteId: carte.id }, select: { points: true, motif: true, createdAt: true }, orderBy: { createdAt: "asc" } }),
  ]);

  const donnees = {
    exporteLe: new Date().toISOString(),
    carte: {
      pseudo: carte.pseudo,
      activeeLe: carte.activeeLe,
      consentementCGU: carte.consentCGU,
      consentementConsommation: carte.consentConsommation,
    },
    logement: { ug: carte.logement.ug, batiment: carte.logement.batiment, residence: carte.logement.residence.nom },
    progressions,
    greenPoints: mouvements,
  };

  return new NextResponse(JSON.stringify(donnees, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="green-card-mes-donnees.json"',
      "Cache-Control": "no-store",
    },
  });
}
