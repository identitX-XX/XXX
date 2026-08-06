"use client";

// « Marina#constellations » — page vitrine + contact.
// Une interface épurée pour exposer sa « constellation » : un portfolio de
// photos et de réalisations personnelles, et une porte pour se rencontrer.
// Le contenu (profil, réalisations) se modifie dans  data/constellation.ts —
// on dépose ses images dans  public/portfolio/  sans toucher à ce fichier.

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Compass,
  Mail,
  MapPin,
  Send,
  X,
} from "lucide-react";
import { ConstellationBg } from "@/components/ConstellationBg";
import {
  PROFIL,
  REALISATIONS,
  CATEGORIES,
  type Realisation,
} from "@/data/constellation";

const SECTIONS = [
  { id: "concept", label: "Concept" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
] as const;

export default function MarinaConstellationsPage() {
  const [actif, setActif] = useState<Realisation | null>(null);

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
        <Portfolio onOpen={setActif} />
        <Contact />
      </main>

      <footer className="border-t border-line/60 py-10 text-center text-[12px] tracking-[0.16em] text-muted">
        {PROFIL.nom.toUpperCase()} · CONSTELLATIONS — {new Date().getFullYear()}
      </footer>

      {actif && <Lightbox item={actif} onClose={() => setActif(null)} />}
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
          {PROFIL.nom}
          <span className="brand-text">#constellations</span>
        </a>

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
    <section id="top" className="flex min-h-[72vh] flex-col justify-center py-16">
      <div className="mb-6 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.24em] text-fuchsia">
        <Sparkles size={13} />
        Portfolio &amp; contact
      </div>

      <h1 className="font-display text-[3rem] font-semibold leading-[1.02] tracking-tight text-ink sm:text-[4.5rem]">
        {PROFIL.nom}
        <span className="block brand-text">#constellations</span>
      </h1>

      <p className="mt-4 text-[14px] uppercase tracking-[0.16em] text-muted">
        {PROFIL.role}
      </p>

      <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-muted">
        {PROFIL.bio}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <a
          href="#portfolio"
          className="inline-flex min-h-[3rem] items-center gap-2 rounded-full border border-line px-6 text-[15px] font-medium text-ink transition-colors hover:border-fuchsia hover:text-fuchsia"
        >
          Voir les réalisations
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-ink"
        >
          Me contacter <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Bloc commun */

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
    <section id={id} className="scroll-mt-24 border-t border-line/60 py-20">
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
      <div className="mt-6 text-[16px] leading-relaxed text-muted">{children}</div>
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
      <p className="max-w-xl">
        Isolées, les étoiles ne disent rien. C'est la ligne qu'on trace entre
        elles qui fait naître une figure. Mon travail part du même geste :
        réunir des fragments épars — images, matières, silences — et laisser
        apparaître le dessin qui était déjà là.
      </p>
      <p className="mt-4 max-w-xl">
        Une esthétique de la sobriété : on retire le bruit jusqu'à ce que la
        forme se détache d'elle-même sur le fond noir.
      </p>
    </Section>
  );
}

/* ----------------------------------------------------------------- Portfolio */

function Portfolio({ onOpen }: { onOpen: (r: Realisation) => void }) {
  const [filtre, setFiltre] = useState<string>("Tout");
  const items = useMemo(
    () =>
      filtre === "Tout"
        ? REALISATIONS
        : REALISATIONS.filter((r) => r.categorie === filtre),
    [filtre]
  );
  const filtres = ["Tout", ...CATEGORIES];

  return (
    <Section
      id="portfolio"
      index="02"
      eyebrow="Portfolio"
      icon={<Compass size={13} />}
      title="Mes réalisations."
    >
      <p className="max-w-xl">
        Un choix de projets — photographie, direction artistique, espaces. Clique
        une vignette pour l'agrandir.
      </p>

      {/* Filtres par catégorie */}
      <div className="mt-8 flex flex-wrap gap-2">
        {filtres.map((f) => {
          const on = f === filtre;
          return (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
                on
                  ? "border-fuchsia bg-fuchsia/10 text-ink"
                  : "border-line text-muted hover:border-fuchsia hover:text-ink"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grille */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((r) => (
          <Tuile key={r.id} item={r} onOpen={() => onOpen(r)} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-8 text-[15px] text-muted">Rien dans cette catégorie.</p>
      )}
    </Section>
  );
}

function Tuile({ item, onOpen }: { item: Realisation; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line/60 bg-noir/40 text-left transition-colors hover:border-fuchsia/50"
    >
      <Visuel item={item} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
      {/* Voile + légende */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4">
        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-fuchsia">
          {item.categorie}
          {item.annee ? ` · ${item.annee}` : ""}
        </div>
        <div className="mt-0.5 font-display text-[17px] font-semibold text-white">
          {item.titre}
        </div>
      </div>
    </button>
  );
}

/**
 * Visuel d'une réalisation. Si `image` existe et se charge, on l'affiche ;
 * sinon (pas d'image, ou fichier manquant) on tombe sur une vignette
 * « constellation » générée, pour que la grille tienne dès le premier jour.
 */
function Visuel({
  item,
  className = "",
}: {
  item: Realisation;
  className?: string;
}) {
  const [erreur, setErreur] = useState(false);
  if (item.image && !erreur) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={item.image}
        alt={item.titre}
        loading="lazy"
        onError={() => setErreur(true)}
        className={className}
      />
    );
  }
  return <Repli seed={item.id} className={className} />;
}

/** Vignette de repli : un petit ciel étoilé déterministe (SVG, sans réseau). */
function Repli({ seed, className = "" }: { seed: string; className?: string }) {
  const etoiles = useMemo(() => {
    // Générateur pseudo-aléatoire déterministe à partir du seed (mulberry32).
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    let a = h >>> 0;
    const rnd = () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return Array.from({ length: 16 }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      r: rnd() * 1.1 + 0.4,
    }));
  }, [seed]);

  return (
    <div
      className={`relative bg-[radial-gradient(120%_100%_at_30%_10%,rgba(212,175,106,0.14),transparent_60%)] ${className}`}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {etoiles.map((e, i) => {
          const n = etoiles[(i + 1) % etoiles.length];
          return (
            <line
              key={`l${i}`}
              x1={e.x}
              y1={e.y}
              x2={n.x}
              y2={n.y}
              stroke="var(--fuchsia)"
              strokeWidth={0.18}
              opacity={0.18}
            />
          );
        })}
        {etoiles.map((e, i) => (
          <circle key={`s${i}`} cx={e.x} cy={e.y} r={e.r} fill="var(--fuchsia)" opacity={0.7} />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ Lightbox */

function Lightbox({ item, onClose }: { item: Realisation; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={item.titre}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 z-10 rounded-full border border-line bg-noir/60 p-2 text-ink transition-colors hover:text-fuchsia"
        >
          <X size={18} />
        </button>
        <div className="aspect-[16/10] w-full bg-noir">
          <Visuel item={item} className="h-full w-full object-cover" />
        </div>
        <div className="p-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-fuchsia">
            {item.categorie}
            {item.annee ? ` · ${item.annee}` : ""}
          </div>
          <h3 className="mt-1 font-display text-[1.5rem] font-semibold text-ink">
            {item.titre}
          </h3>
          {item.description && (
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {item.description}
            </p>
          )}
          {item.lien && (
            <a
              href={item.lien}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[15px] text-ink transition-colors hover:text-fuchsia"
            >
              Voir le projet <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Contact */

function Contact() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "merci" | "erreur">("repos");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const valide = emailOk && message.trim().length > 0;

  const mailto = `mailto:${PROFIL.email}?subject=${encodeURIComponent(
    `Contact — constellations${nom ? ` (${nom})` : ""}`
  )}&body=${encodeURIComponent(message)}`;

  const envoyer = async () => {
    if (!valide || etat === "envoi") return;
    setEtat("envoi");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nom: nom.trim(), email: email.trim(), message: message.trim() }),
      });
      if (r.ok) {
        setNom("");
        setEmail("");
        setMessage("");
        setEtat("merci");
        setTimeout(() => setEtat("repos"), 5000);
      } else {
        setEtat("erreur");
      }
    } catch {
      setEtat("erreur");
    }
  };

  return (
    <Section
      id="contact"
      index="03"
      eyebrow="Contact"
      icon={<Mail size={13} />}
      title="Se rencontrer."
    >
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
        {/* Coordonnées */}
        <div>
          <p className="max-w-sm">
            Un projet, une question, une envie de collaborer ? Écris-moi — je
            réponds avec soin.
          </p>
          <div className="mt-6 flex flex-col gap-3 text-[15px]">
            <a
              href={`mailto:${PROFIL.email}`}
              className="inline-flex items-center gap-2 text-ink transition-colors hover:text-fuchsia"
            >
              <Mail size={16} className="text-fuchsia" />
              {PROFIL.email}
            </a>
            <span className="inline-flex items-center gap-2 text-muted">
              <MapPin size={16} className="text-fuchsia" />
              {PROFIL.lieu}
            </span>
          </div>

          {PROFIL.reseaux.some((r) => r.href) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {PROFIL.reseaux
                .filter((r) => r.href)
                .map((r) => (
                  <a
                    key={r.nom}
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-1.5 text-[13px] text-muted transition-colors hover:border-fuchsia hover:text-ink"
                  >
                    {r.nom} <ArrowUpRight size={13} />
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* Formulaire */}
        <div>
          {etat === "merci" ? (
            <div className="rounded-2xl border border-line bg-noir/40 px-5 py-10 text-center animate-fade-in">
              <p className="font-display text-[1.3rem] font-semibold text-ink">
                Merci — je te lis.
              </p>
              <p className="mt-1 text-[15px] text-muted">
                Je reviens vers toi au plus vite.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {etat === "erreur" && (
                <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-[13px] text-danger">
                  L'envoi a échoué. Réessaie, ou écris-moi directement par{" "}
                  <a href={mailto} className="underline">
                    email
                  </a>
                  .
                </p>
              )}
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ton nom (optionnel)"
                className="min-h-[3rem] rounded-xl border border-line bg-noir/40 px-4 text-[15px] text-ink placeholder:text-muted focus:border-fuchsia"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ton email"
                className="min-h-[3rem] rounded-xl border border-line bg-noir/40 px-4 text-[15px] text-ink placeholder:text-muted focus:border-fuchsia"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ton message…"
                rows={5}
                className="rounded-xl border border-line bg-noir/40 px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-muted focus:border-fuchsia"
              />
              <div className="flex items-center justify-between gap-3">
                <a
                  href={mailto}
                  className="text-[13px] text-muted underline-offset-2 transition-colors hover:text-ink hover:underline"
                >
                  ou par email direct
                </a>
                <button
                  onClick={envoyer}
                  disabled={!valide || etat === "envoi"}
                  className="inline-flex min-h-[3rem] items-center gap-2 rounded-full brand-gradient px-7 text-[15px] font-semibold text-[color:var(--on-brand)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send size={16} />
                  {etat === "envoi" ? "Envoi…" : "Envoyer"}
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-[13px] text-muted">
            Envie d'explorer plus loin ?{" "}
            <Link href="/aujourdhui" className="text-ink underline-offset-2 hover:underline">
              Entrer dans la Traversée
            </Link>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}
