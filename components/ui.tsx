"use client";

import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-8 animate-fade-up">
      {eyebrow && (
        <div className="mb-2 text-xs uppercase tracking-[0.25em] text-fuchsia">
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-3xl font-light leading-tight text-ink md:text-4xl">
        {title}
      </h1>
      {sub && <p className="mt-2 max-w-xl text-sm text-muted">{sub}</p>}
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
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "solid"
      ? "brand-gradient text-white hover:opacity-90 hover:shadow-glow"
      : variant === "outline"
      ? "border border-line text-ink hover:border-fuchsia hover:text-fuchsia"
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
    <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
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
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-[color:var(--fuchsia)]"
        style={{
          background: `linear-gradient(90deg, var(--fuchsia), var(--orange) ${value}%, var(--line) ${value}%)`,
        }}
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
      className="w-full rounded-xl border border-line bg-noir px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-fuchsia"
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
      className="w-full resize-none rounded-xl border border-line bg-noir px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-muted focus:border-fuchsia"
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
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  );
}
