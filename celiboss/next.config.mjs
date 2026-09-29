/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Le MDX du Journal est lu depuis content/ (lib/mdx.ts) et compilé côté
  // serveur par next-mdx-remote/rsc : pas besoin de @next/mdx / withMDX, qui ne
  // sert qu'aux pages .mdx placées dans app/. Même rendu, frontmatter natif.
  pageExtensions: ["ts", "tsx"],
  // Les événements vivent désormais avec les programmes.
  async redirects() {
    return [{ source: "/evenements", destination: "/programmes#evenements", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
