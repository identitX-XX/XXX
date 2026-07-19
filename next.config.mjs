/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Type errors now fail the build (the codebase type-checks cleanly).
  // ESLint is still skipped at build time; flip this too once lint is clean.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
