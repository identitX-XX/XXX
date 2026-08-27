// Vérifie une session Stripe au RETOUR du paiement (success_url ?session_id=…).
// On interroge Stripe directement : si la session est bien payée, on renvoie
// l'offre débloquée. Le client déverrouille alors, adossé à une vérification
// serveur réelle (pas à une simple redirection qu'on pourrait falsifier).

export async function GET(req: Request): Promise<Response> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ ok: false, configured: false });

  const sessionId = new URL(req.url).searchParams.get("session_id") || "";
  if (!sessionId) return Response.json({ ok: false, error: "session manquante" }, { status: 400 });

  try {
    const r = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: { authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(15000),
      }
    );
    const data = await r.json();
    if (!r.ok) return Response.json({ ok: false, error: "session introuvable" }, { status: 502 });

    const paye = data?.payment_status === "paid";
    const offerId = data?.metadata?.offerId ?? null;
    return Response.json({ ok: paye && Boolean(offerId), offerId: paye ? offerId : null });
  } catch {
    return Response.json({ ok: false, error: "vérification impossible" }, { status: 502 });
  }
}
