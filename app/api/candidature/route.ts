import { NextResponse } from "next/server";
import { valider } from "@/lib/candidature";
import { transmettre } from "@/lib/webhook";

// Réception d'une demande d'appel → relayée par lib/webhook.ts.
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

  const relais = await transmettre("candidature", { ...r.data, source: "/appel" });
  if (!relais.ok) return NextResponse.json({ erreur: relais.erreur }, { status: relais.statut });
  return NextResponse.json({ ok: true });
}
