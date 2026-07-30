/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
