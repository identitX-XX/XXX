// Build de production (Vercel) : bascule Prisma sur PostgreSQL, crée les tables,
// remplit la base de démo si elle est vide, puis compile Next.js.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

for (const nom of ["DATABASE_URL", "AUTH_SECRET"]) {
  if (!process.env[nom]) {
    console.error(`\n✖ Variable d'environnement manquante : ${nom} (à ajouter dans Vercel → Settings → Environment Variables)\n`);
    process.exit(1);
  }
}

const schema = "prisma/schema.prisma";
writeFileSync(schema, readFileSync(schema, "utf8").replace('provider = "sqlite"', 'provider = "postgresql"'));

const run = (cmd, env = {}) => execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } });
run("npx prisma generate");
run("npx prisma db push --skip-generate");
run("npx tsx prisma/seed.ts", { SEED_SI_VIDE: "1" });
run("npx next build");
