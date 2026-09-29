import { NextResponse } from "next/server";
import { validerInscription } from "@/lib/candidature";
import { transmettre } from "@/lib/webhook";

// Inscription à une liste d'intérêt → relayée par lib/webhook.ts.
export async function POST(req: Request) {
  const brut = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!brut) return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  if (typeof brut.site === "string" && brut.site !== "") return NextResponse.json({ ok: true });

  const r = validerInscription(brut);
  if (!r.ok) return NextResponse.json({ erreur: r.erreur }, { status: 422 });

  const relais = await transmettre("liste", r.data);
  if (!relais.ok) return NextResponse.json({ erreur: relais.erreur }, { status: relais.statut });
  return NextResponse.json({ ok: true });
}
