// État de chargement global — reprend l'emblème de marque du ClientShell pour
// une transition sans rupture visuelle.
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="brand-gradient h-10 w-10 animate-pulse rounded-xl" />
    </div>
  );
}
