// Crée une session de paiement Stripe (Checkout hébergé). Appel direct à l'API
// REST Stripe (aucune dépendance npm à installer). S'active dès que la variable
// STRIPE_SECRET_KEY est présente dans Vercel ; sans elle → { configured:false }
// (le client bascule alors sur le déblocage démo, le temps de brancher la clé).

import { CATALOGUE, OffreId } from "@/lib/entitlements";

export async function POST(req: Request): Promise<Response> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ configured: false });

  let body: { offerId?: OffreId };
  try {
    body = (await req.json()) as { offerId?: OffreId };
  } catch {
    return Response.json({ error: "requête invalide" }, { status: 400 });
  }
  const offerId = body.offerId;
  const item = offerId ? CATALOGUE[offerId] : undefined;
  if (!offerId || !item) {
    return Response.json({ error: "offre inconnue" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  // Corps form-encodé attendu par l'API Stripe.
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("line_items[0][quantity]", "1");
  form.set("line_items[0][price_data][currency]", "eur");
  form.set("line_items[0][price_data][unit_amount]", String(item.montant));
  form.set("line_items[0][price_data][product_data][name]", item.nom);
  form.set("payment_method_types[0]", "card");
  form.set("metadata[offerId]", offerId);
  form.set("success_url", `${origin}/premium?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${origin}/premium`);

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      signal: AbortSignal.timeout(15000),
    });
    const data = await r.json();
    if (!r.ok || !data?.url) {
      return Response.json(
        { error: data?.error?.message ?? "création du paiement impossible" },
        { status: 502 }
      );
    }
    return Response.json({ url: data.url as string });
  } catch {
    return Response.json({ error: "service de paiement injoignable" }, { status: 502 });
  }
}
