"use client";

import { ReactNode } from "react";
import { EspritParcours } from "@/components/bd/EspritParcours";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line shadow-soft ${className}`}
      style={{
        // Lignes épurées : un seul filet fin, pas de liseré coloré. Un dégradé
        // très subtil du haut vers le fond donne juste ce qu'il faut de relief.
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--raised) 45%, var(--surface)), var(--surface) 62%)",
      }}
    >
      {children}
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  sub,
  accessory,
  esprit = true,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  // Accessoire explicite aligné en haut à droite (prioritaire sur l'esprit).
  accessory?: ReactNode;
  // Esprit du parcours par défaut (déterministe par page). false pour désactiver
  // sur les pages où il n'a pas sa place (mentions légales, admin…).
  esprit?: boolean;
}) {
  const acc =
    accessory ??
    (esprit ? <EspritParcours seed={`page-${title || eyebrow || ""}`} size={48} /> : null);
  return (
    <div className="mb-8 animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <div className="mb-2 text-[12px] font-mono font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--prune)" }}>
              {eyebrow}
            </div>
          )}
          {title && (
            <h1 className="font-display text-[2rem] font-semibold leading-tight text-ink md:text-[2.6rem]">
              {title}
            </h1>
          )}
        </div>
        {acc && <div className="flex-none pt-1">{acc}</div>}
      </div>
      {sub && <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "solid",
  type = "button",
  className = "",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost" | "outline";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  // Boutons fuselés & modernes : fins (hauteur réduite), coins nets, aplat, lettres
  // légèrement espacées. Le plein est un gris très clair ; l'outline un filet fin.
  const base =
    "inline-flex min-h-[2.5rem] items-center justify-center gap-2 rounded-[10px] px-5 py-2 text-[13px] font-medium tracking-[0.01em] transition-colors duration-200 active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "solid"
      ? "bg-fuchsia text-[color:var(--on-brand)] hover:opacity-90"
      : variant === "outline"
      ? "border border-line text-ink hover:border-ink"
      : "text-muted hover:text-ink";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
      {children}
    </span>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted">
      {children}
    </span>
  );
}

export function Slider({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted">{label}</span>
          <span className="font-display text-ink">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="idx-range"
        style={{ ["--fill" as string]: `${value}%` } as React.CSSProperties}
      />
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-line bg-noir px-4 py-3 text-base text-ink placeholder:text-muted focus:border-fuchsia"
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-xl border border-line bg-noir px-4 py-3 text-base leading-relaxed text-ink placeholder:text-muted focus:border-fuchsia"
    />
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line py-16 text-center">
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{hint}</p>
    </div>
  );
}
