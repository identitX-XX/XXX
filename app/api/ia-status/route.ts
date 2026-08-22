// Vérification EN DIRECT de la clé Mistral : fait un tout petit appel réel et
// dit si ça répond. Ouvre /api/ia-status dans le navigateur —
//   { "ok": true, ... }                → la clé marche, l'IA répond
//   { "ok": false, "error": "..." }    → la raison exacte (crédit, clé, lenteur)
export const dynamic = "force-dynamic";

export async function GET() {
  const noStore = { headers: { "cache-control": "no-store" } };
  const key = process.env.MISTRAL_API_KEY;
  if (!key) {
    return Response.json({ ok: false, hasKey: false, raison: "clé absente dans Vercel" }, noStore);
  }
  const t0 = Date.now();
  try {
    const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "mistral-large-latest",
        max_tokens: 1,
        messages: [{ role: "user", content: "ping" }],
      }),
      signal: AbortSignal.timeout(12000),
    });
    const latence_ms = Date.now() - t0;
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      return Response.json(
        {
          ok: false,
          hasKey: true,
          status: r.status,
          error: d?.error?.message ?? d?.message ?? "erreur du service",
          latence_ms,
        },
        noStore
      );
    }
    return Response.json({ ok: true, hasKey: true, latence_ms }, noStore);
  } catch {
    return Response.json(
      { ok: false, hasKey: true, error: "injoignable ou trop lent (timeout)", latence_ms: Date.now() - t0 },
      noStore
    );
  }
}
