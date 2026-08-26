/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Version bakée dans le bundle client (anti-cache périmé). Sur Vercel,
  // VERCEL_GIT_COMMIT_SHA identifie le déploiement ; en local → "dev".
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.VERCEL_GIT_COMMIT_SHA || "dev",
  },
  // Type errors now fail the build (the codebase type-checks cleanly).
  // ESLint is still skipped at build time; flip this too once lint is clean.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  // Renommage de route archétype → signature : les anciens liens (testeuses,
  // favoris) continuent de fonctionner en redirigeant vers le nouveau chemin.
  // Anti-cache périmé — verrou fort. Les apps iOS ajoutées à l'écran d'accueil
  // IGNORENT « must-revalidate » et servent une vieille page indéfiniment : c'est
  // LA cause des « rien ne change / manip chaque jour ». On passe donc le document
  // HTML en « no-store » : le navigateur n'a plus le droit de le garder en mémoire,
  // donc CHAQUE ouverture récupère la version en ligne. Les assets hachés (_next,
  // nom unique par build) restent en cache long — aucun coût de perf. Combiné au
  // détecteur de version côté client (VersionGuard) → mise à jour automatique,
  // sans que l'utilisatrice ait quoi que ce soit à vider, jamais.
  async headers() {
    return [
      {
        source: "/((?!_next/|api/).*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/parcours-archetypes",
        destination: "/parcours-signatures",
        permanent: false,
      },
      {
        source: "/parcours-archetypes/:path*",
        destination: "/parcours-signatures/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
