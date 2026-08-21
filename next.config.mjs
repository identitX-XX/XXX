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
