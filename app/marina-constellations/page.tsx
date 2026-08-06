"use client";

// « Marina#constellations » — une page épurée, minimaliste, dans le langage
// visuel de la Traversée (nuit constellée, un seul accent, typographie ronde).
// Quatre repères : Concept · Lifestyle · Spirit · Contact. Rien de superflu :
// beaucoup de vide, des filets fins, un fond de particules très discret.

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Compass, Moon, Mail } from "lucide-react";
import { ConstellationBg } from "@/components/ConstellationBg";

const SECTIONS = [
  { id: "concept", label: "Concept" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "spirit", label: "Spirit" },
  { id: "contact", label: "Contact" },
] as const;

export default function MarinaConstellationsPage() {
  return (
    <div className="relative -mx-5 -my-8 min-h-screen overflow-hidden lg:-mx-12 lg:-my-12">
      {/* Fond constellé, très discret : la nuit derrière le verre. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <ConstellationBg
          count={34}
          speed={0.08}
          linkOpacity={0.05}
          dotFuchsia={0.22}
          dotOrange={0.2}
          opacity={0.55}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 70% at 50% 0%, rgba(212,175,106,0.10), transparent 60%)",
          }}
        />
      </div>

      <Nav />

      <main className="mx-auto w-full max-w-3xl px-5 pb-28 lg:px-8">
        <Hero />
        <Concept />
        <Lifestyle />
        <Spirit />
        <Contact />
      </main>

      <footer className="border-t border-line/60 py-10 text-center text-[12px] tracking-[0.16em] text-muted">
        MARINA · CONSTELLATIONS — {new Date().getFullYear()}
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------- Navigation */

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="safe-top sticky top-0 z-30 border-b border-line/60 bg-noir/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 lg:px-8">
        <a
          href="#top"
          className="font-display text-[15px] font-semibold tracking-tight text-ink"
        >
          Marina<span className="brand-text">#constellations</span>
        </a>

        {/* Ancres — desktop */}
        <nav className="hidden items-center gap-8 sm:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-[13px] tracking-[0.02em] text-muted transition-colors hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Ancres — mobile (menu léger) */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink sm:hidden"
          aria-expanded={open}
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line/60 px-5 py-3 sm:hidden">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className="py-2 text-[15px] text-muted transition-colors hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ---------------------------------------------------------------------- Hero */

function Hero() {
  return (
    <section id="top" className="flex min-h-[76vh] flex-col justify-center py-16">
      <div className="mb-6 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.24em] text-fuchsia">
        <Sparkles size={13} />
        Une carte du ciel intérieur
      </div>

      <h1 className="font-display text-[3rem] font-semibold leading-[1.02] tracking-tight text-ink sm:text-[4.5rem]">
        Marina
        <span className="block brand-text">#constellations</span>
      </h1>

      <p className="mt-7 max-w-md text-[16px] leading-relaxed text-muted">
        Relier ses points. Faire apparaître la figure. Un espace sobre pour
        habiter sa nuit — et y lire sa propre lumière.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <a
          href="#concept"
          className="inline-flex min-h-[3rem] items-center gap-2 rounded-full border border-line px-6 text-[15px] font-medium text-ink transition-colors hover:border-fuchsia hover:text-fuchsia"
        >
          Découvrir
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-ink"
        >
          Nous écrire <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Blocs communs */

function Section({
  id,
  index,
  eyebrow,
  icon,
  title,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-line/60 py-20"
    >
      <div className="mb-8 flex items-center gap-3 text-fuchsia">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-muted">
          {index}
        </span>
        <span className="h-px w-8 bg-line" />
        <span className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.22em]">
          {icon}
          {eyebrow}
        </span>
      </div>
      <h2 className="max-w-xl font-display text-[2rem] font-semibold leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
        {title}
      </h2>
      <div className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Concept */

function Concept() {
  return (
    <Section
      id="concept"
      index="01"
      eyebrow="Concept"
      icon={<Sparkles size={13} />}
      title="Une constellation, ce sont des points reliés par le regard."
    >
      <p>
        Isolées, les étoiles ne disent rien. C'est la ligne qu'on trace entre
        elles qui fait naître une figure. Marina part du même geste : réunir les
        fragments épars d'une vie — des gestes, des goûts, des renoncements — et
        laisser apparaître le dessin qui était déjà là.
      </p>
      <p className="mt-4">
        Pas d'ajout, pas de masque. On retire le bruit jusqu'à ce que la forme
        se détache d'elle-même sur le fond noir.
      </p>
    </Section>
  );
}

/* ----------------------------------------------------------------- Lifestyle */

function Lifestyle() {
  const items = [
    {
      k: "Sobriété",
      v: "Moins d'objets, plus d'espace. Chaque chose gardée a une raison d'être là.",
    },
    {
      k: "Rythme",
      v: "Des jours qui respirent. Un pas après l'autre, sans course ni preuve à faire.",
    },
    {
      k: "Présence",
      v: "Le soin des petites choses — la lumière, le silence, le premier café.",
    },
  ];
  return (
    <Section
      id="lifestyle"
      index="02"
      eyebrow="Lifestyle"
      icon={<Compass size={13} />}
      title="Vivre épuré, pour mieux voir ce qui compte."
    >
      <p>
        Un art de vivre qui enlève plutôt qu'il n'accumule. Le luxe, ici, c'est
        le vide autour de l'essentiel.
      </p>
      <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/40 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.k} className="bg-noir/40 p-5">
            <div className="mb-2 font-display text-[15px] font-semibold text-ink">
              {it.k}
            </div>
            <p className="text-[14px] leading-relaxed text-muted">{it.v}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------- Spirit */

function Spirit() {
  return (
    <Section
      id="spirit"
      index="03"
      eyebrow="Spirit"
      icon={<Moon size={13} />}
      title="La nuit n'est pas vide — elle est habitée."
    >
      <p>
        L'esprit de Marina tient dans une intuition simple : ce qu'on cherche au
        loin est souvent déjà inscrit en soi, en pointillé. La démarche est
        contemplative, jamais dogmatique. On observe, on relie, on laisse venir.
      </p>
      <figure className="mt-8 border-l-2 border-fuchsia/60 pl-5">
        <blockquote className="font-display text-[19px] italic leading-snug text-ink">
          « Regarde longtemps le ciel : tu finis par y reconnaître ton propre
          visage. »
        </blockquote>
      </figure>
    </Section>
  );
}

/* ------------------------------------------------------------------- Contact */

function Contact() {
  return (
    <Section
      id="contact"
      index="04"
      eyebrow="Contact"
      icon={<Mail size={13} />}
      title="Un mot, une question, une rencontre."
    >
      <p>
        Cette page est un point de départ. Pour prolonger la conversation,
        écris-nous — on répond, doucement, avec soin.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <a
          href="mailto:marina@constellations.app"
          className="inline-flex min-h-[3rem] items-center gap-2 rounded-full brand-gradient px-7 text-[15px] font-semibold text-[color:var(--on-brand)] transition-transform hover:scale-[1.02]"
        >
          <Mail size={16} />
          marina@constellations.app
        </a>
        <Link
          href="/aujourdhui"
          className="inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-ink"
        >
          Entrer dans la Traversée <ArrowUpRight size={16} />
        </Link>
      </div>
    </Section>
  );
}
