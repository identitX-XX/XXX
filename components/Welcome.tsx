"use client";

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-noir p-8 text-center">
      <h1 className="brand-gradient bg-clip-text text-4xl font-bold text-transparent">
        IdentitX
      </h1>
      <p className="max-w-md text-lg opacity-80">
        Bienvenue. Explore ton identité, une conversation à la fois.
      </p>
      <button
        onClick={onStart}
        className="rounded-full bg-fuchsia-600 px-8 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Commencer
      </button>
    </div>
  );
}

