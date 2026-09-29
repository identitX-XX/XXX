/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Le MDX du Journal est lu depuis content/ (lib/mdx.ts) et compilé côté
  // serveur par next-mdx-remote/rsc : pas besoin de @next/mdx / withMDX, qui ne
  // sert qu'aux pages .mdx placées dans app/. Même rendu, frontmatter natif.
  pageExtensions: ["ts", "tsx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
