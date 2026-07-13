import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-20"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(236,72,153,0.25),transparent_60%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-500/20" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-400/15" />
        <span className="absolute left-[20%] top-[25%] h-1 w-1 rounded-full bg-white/70" />
        <span className="absolute left-[75%] top-[30%] h-1 w-1 rounded-full bg-fuchsia-300/70" />
        <span className="absolute left-[30%] top-[70%] h-1 w-1 rounded-full bg-white/50" />
        <span className="absolute left-[68%] top-[68%] h-1.5 w-1.5 rounded-full bg-orange-300/60" />
        <span className="absolute left-[50%] top-[15%] h-1 w-1 rounded-full bg-white/60" />
      </div>

      <div className="relative z-10 max-w-md text-center">
        <h1 className="text-4xl font-serif font-semibold leading-tight bg-gradient-to-r from-fuchsia-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
          Bienvenue dans IdentitX
        </h1>
        <p className="mt-5 text-base text-white/70 leading-relaxed">
          Explore ta constellation identitaire — et transforme-la en trajectoire.
        </p>

        <div className="mt-8 inline-flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
          <span className="text-sm text-white/50 uppercase tracking-widest">Moi</span>
          <span className="text-lg font-medium">Marina</span>
          <span className="text-sm text-white/60">Origine X · Optimiste</span>
        </div>

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 px-8 py-3 text-base font-medium text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-90"
          >
            Continuer →
          </Link>
        </div>
      </div>
    </main>
  );
}
