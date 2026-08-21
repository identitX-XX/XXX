// Version ACTUELLEMENT déployée, lue au runtime. Jamais mise en cache, sinon la
// détection elle-même serait périmée. Sur Vercel, VERCEL_GIT_COMMIT_SHA change à
// chaque déploiement ; en local il est absent → "dev".
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { v: process.env.VERCEL_GIT_COMMIT_SHA || "dev" },
    { headers: { "cache-control": "no-store, max-age=0" } }
  );
}
