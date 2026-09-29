# Polices

Aujourd'hui : Cormorant (serif éditoriale) + Hanken Grotesk (grotesque),
via `next/font/google` — les fichiers sont téléchargés **au build** et servis
depuis le domaine du site, sans appel à Google côté visiteuse.

Pour une police sous licence maison, déposer les `.woff2` ici puis, dans
`app/layout.tsx`, remplacer l'import par `next/font/local` en gardant les
variables `--font-serif` / `--font-sans`.
