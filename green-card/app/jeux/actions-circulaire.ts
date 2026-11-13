"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { exigerCarte } from "@/lib/carte-courante";
import { attribuerNiveau, type Gain } from "@/lib/points";
import { problemeContenu, nettoyerLigne } from "@/lib/jeux/moderation";
import {
  ACTIONS_MAX_PAR_JOUR,
  ANNONCES_MAX_OUVERTES,
  co2Action,
  estCategorie,
  estTypeAction,
  estTypeAnnonce,
  lirePrix,
  niveauSecondeVie,
  verifierAnnonce,
  type Categorie,
} from "@/lib/jeux/circulaire";
import type { EtatJeu } from "./actions";

async function majNiveauSecondeVie(tx: Prisma.TransactionClient, carteId: string) {
  const [actions, echangesVoisins] = await Promise.all([
    tx.actionCirculaire.count({ where: { carteId } }),
    tx.actionCirculaire.count({ where: { carteId, annonceId: { not: null } } }),
  ]);
  return attribuerNiveau(tx, carteId, "seconde-vie", niveauSecondeVie({ actions, echangesVoisins }));
}

const debutDuJour = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

function rafraichir() {
  revalidatePath("/defis/seconde-vie");
  revalidatePath("/carte");
}

// ---------------------------------------------------------------------------
// Déclarer une action (achat d'occasion, réparation, don, revente)
// ---------------------------------------------------------------------------
export async function declarerAction(_: EtatJeu, form: FormData): Promise<EtatJeu> {
  const carte = await exigerCarte();
  const type = form.get("type");
  const cat = form.get("categorie");
  if (!estTypeAction(type)) return { erreur: "Choisissez ce que vous avez fait." };
  if (!estCategorie(cat)) return { erreur: "Choisissez le type d'objet." };

  const description = nettoyerLigne(String(form.get("description") ?? ""));
  if (description.length > 100) return { erreur: "La description fait 100 caractères maximum." };
  const probleme = description ? problemeContenu(description) : undefined;
  if (probleme) return { erreur: probleme };

  const prixPaye = type === "occasion" ? lirePrix(String(form.get("prixPaye") ?? "")) : null;
  const prixNeuf = type === "occasion" ? lirePrix(String(form.get("prixNeuf") ?? "")) : null;
  if (Number.isNaN(prixPaye) || Number.isNaN(prixNeuf)) return { erreur: "Les prix doivent être des montants en euros (par exemple 12,50)." };

  const aujourdhui = await db.actionCirculaire.count({ where: { carteId: carte.id, annonceId: null, createdAt: { gte: debutDuJour() } } });
  if (aujourdhui >= ACTIONS_MAX_PAR_JOUR) return { erreur: `${ACTIONS_MAX_PAR_JOUR} actions par jour maximum. Gardez les autres pour demain !` };

  const co2 = co2Action(type, cat);
  const gain = await db.$transaction(async (tx) => {
    await tx.actionCirculaire.create({
      data: { carteId: carte.id, type, categorie: cat, description: description || null, prixPaye, prixNeuf, co2Evite: co2 },
    });
    return majNiveauSecondeVie(tx, carte.id);
  });

  rafraichir();
  return { succes: `Bravo ! Environ ${Math.round(co2)} kg de CO₂ évités.`, gain, cle: Date.now() };
}

// ---------------------------------------------------------------------------
// Le mur des voisins : dons, trocs et prêts
// ---------------------------------------------------------------------------
export async function publierAnnonce(_: EtatJeu, form: FormData): Promise<EtatJeu> {
  const carte = await exigerCarte();
  const type = form.get("type");
  const cat = form.get("categorie");
  if (!estTypeAnnonce(type)) return { erreur: "Choisissez : donner, échanger ou prêter." };
  if (!estCategorie(cat)) return { erreur: "Choisissez le type d'objet." };
  const { titre, description, erreur } = verifierAnnonce(String(form.get("titre") ?? ""), String(form.get("description") ?? ""));
  if (erreur) return { erreur };

  const ouvertes = await db.annonce.count({ where: { carteId: carte.id, statut: "ouverte" } });
  if (ouvertes >= ANNONCES_MAX_OUVERTES) return { erreur: `${ANNONCES_MAX_OUVERTES} annonces en cours maximum. Concluez ou retirez-en une d'abord.` };

  await db.annonce.create({ data: { carteId: carte.id, residenceId: carte.logement.residenceId, type, categorie: cat, titre, description } });
  revalidatePath("/defis/seconde-vie");
  return { succes: "Votre annonce est visible par les voisins de la résidence.", cle: Date.now() };
}

export async function basculerInteret(annonceId: string): Promise<{ erreur?: string }> {
  const carte = await exigerCarte();
  const annonce = await db.annonce.findUnique({ where: { id: annonceId } });
  if (!annonce || annonce.statut !== "ouverte" || annonce.residenceId !== carte.logement.residenceId) return { erreur: "Cette annonce n'est plus disponible." };
  if (annonce.carteId === carte.id) return { erreur: "C'est votre annonce." };

  const cle = { annonceId_carteId: { annonceId, carteId: carte.id } };
  const existant = await db.interetAnnonce.findUnique({ where: cle });
  if (existant) await db.interetAnnonce.delete({ where: cle });
  else await db.interetAnnonce.create({ data: { annonceId, carteId: carte.id } });
  revalidatePath("/defis/seconde-vie");
  return {};
}

/**
 * Le donneur confirme à qui l'objet est allé. Les deux voisins reçoivent une action « échange entre voisins »,
 * vérifiée par construction : le receveur s'était déclaré intéressé, le donneur confirme.
 */
export async function conclureAnnonce(annonceId: string, beneficiaireId: string): Promise<{ erreur?: string; gain?: Gain | null }> {
  const carte = await exigerCarte();
  const annonce = await db.annonce.findUnique({ where: { id: annonceId }, include: { interets: true } });
  if (!annonce || annonce.carteId !== carte.id || annonce.statut !== "ouverte") return { erreur: "Cette annonce n'est plus ouverte." };
  if (!annonce.interets.some((i) => i.carteId === beneficiaireId)) return { erreur: "Ce voisin ne s'est pas déclaré intéressé." };

  const cat = annonce.categorie as Categorie;
  const gain = await db.$transaction(async (tx) => {
    await tx.annonce.update({ where: { id: annonceId }, data: { statut: "conclue", beneficiaireId, concluLe: new Date() } });
    await tx.actionCirculaire.createMany({
      data: [
        // Le donneur : un don compte pour moitié, un troc ou un prêt évite aussi un achat neuf de son côté.
        { carteId: carte.id, type: annonce.type === "don" ? "don" : "echange", categorie: cat, description: annonce.titre, co2Evite: co2Action(annonce.type === "don" ? "don" : "echange", cat), annonceId },
        { carteId: beneficiaireId, type: "echange", categorie: cat, description: annonce.titre, co2Evite: co2Action("echange", cat), annonceId },
      ],
    });
    const monGain = await majNiveauSecondeVie(tx, carte.id);
    await majNiveauSecondeVie(tx, beneficiaireId);
    return monGain;
  });

  rafraichir();
  return { gain };
}

export async function retirerAnnonce(annonceId: string): Promise<{ erreur?: string }> {
  const carte = await exigerCarte();
  const { count } = await db.annonce.updateMany({ where: { id: annonceId, carteId: carte.id, statut: "ouverte" }, data: { statut: "retiree" } });
  if (!count) return { erreur: "Cette annonce n'est plus ouverte." };
  revalidatePath("/defis/seconde-vie");
  return {};
}
