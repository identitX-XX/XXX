import { NextResponse } from "next/server";
import { valider, VERSION_NOTICE } from "@/lib/candidature";

// Réception d'une demande d'appel. Les données ne sont PAS stockées par le
// site : elles sont transmises à l'outil défini par CANDIDATURE_WEBHOOK_URL
// (CRM, Brevo, Make, Airtable EU…) — ce sous-traitant doit figurer dans
// /confidentialite et être lié par un contrat conforme à l'art. 28 RGPD.
// Aucune donnée personnelle n'est écrite dans les logs.

export async function POST(req: Request) {
  let brut: Record<string, unknown>;
  try {
    brut = await req.json();
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  // Pot de miel anti-robots : champ invisible pour un humain.
  if (typeof brut.site === "string" && brut.site !== "") {
    return NextResponse.json({ ok: true });
  }

  const r = valider(brut);
  if (!r.ok) return NextResponse.json({ erreurs: r.erreurs }, { status: 422 });

  const cible = process.env.CANDIDATURE_WEBHOOK_URL;
  if (!cible) {
    if (process.env.NODE_ENV === "development") return NextResponse.json({ ok: true, dev: true });
    return NextResponse.json({ erreur: "Les demandes ouvrent très bientôt." }, { status: 503 });
  }

  const envoi = await fetch(cible, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...r.data,
      // Preuve du consentement (art. 7.1) : quand, et sur quelle notice.
      consentement: { donne: true, le: new Date().toISOString(), notice: VERSION_NOTICE },
      source: "celiboss.fr/appel",
    }),
  }).catch(() => null);

  if (!envoi?.ok) {
    return NextResponse.json({ erreur: "Envoi impossible pour le moment. Réessayez dans un instant." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
