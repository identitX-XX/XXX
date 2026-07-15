
export default function JournalPage() {
  const journal = useStore((s) => s.journal);
  const add = useStore((s) => s.addJournalEntry);
  const remove = useStore((s) => s.removeJournalEntry);
  const [adding, setAdding] = useState(false);
  const [d, setD] = useState({
    mood: 60,
    energy: 60,
    stress: 30,
    confidence: 55,
    gratitude: "",
    thoughts: "",
  });

  const save = () => {
    add({
      id: `jr-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      tags: [],
      ...d,
    });
    setD({ mood: 60, energy: 60, stress: 30, confidence: 55, gratitude: "", thoughts: "" });
    setAdding(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHead
          eyebrow="Journal"
          title="Ton journal"
          sub="Un point rapide, jour après jour. La continuité fait le récit."
        />
        <Button onClick={() => setAdding((v) => !v)} variant="outline">
          <Plus size={16} /> Entrée
        </Button>
      </div>

      {adding && (
        <Card className="mb-8 space-y-4 p-6 animate-fade-up">
          <div className="grid gap-4 md:grid-cols-2">
            <Slider label="Humeur" value={d.mood} onChange={(v) => setD({ ...d, mood: v })} />
            <Slider label="Énergie" value={d.energy} onChange={(v) => setD({ ...d, energy: v })} />
            <Slider label="Stress" value={d.stress} onChange={(v) => setD({ ...d, stress: v })} />
            <Slider label="Confiance" value={d.confidence} onChange={(v) => setD({ ...d, confidence: v })} />
          </div>
          <TextInput value={d.gratitude} onChange={(v) => setD({ ...d, gratitude: v })} placeholder="Gratitude du jour" />
          <TextArea value={d.thoughts} onChange={(v) => setD({ ...d, thoughts: v })} placeholder="Pensées libres" rows={3} />
          <div className="flex gap-3">
            <Button onClick={save}>Enregistrer</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Annuler</Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {journal.map((e) => (
          <Card key={e.id} className="p-5 animate-fade-up">
            <div className="flex items-start justify-between">
              <span className="font-display text-sm text-fuchsia">
                {new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
              </span>
              <button
                onClick={() => remove(e.id)}
                className="text-muted transition-colors hover:text-fuchsia"
                aria-label="Supprimer"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                METRIC("Humeur", e.mood),
                METRIC("Énergie", e.energy),
                METRIC("Stress", e.stress),
                METRIC("Confiance", e.confidence),
              ].map((m) => (
                <div key={m.label}>
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>{m.label}</span>
                    <span className="text-ink">{m.value}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <div className="brand-gradient h-full" style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {e.gratitude && (
              <p className="mt-3 text-sm text-muted">
                <span className="text-ink">Gratitude : </span>
                {e.gratitude}
              </p>
            )}
            {e.thoughts && <p className="mt-1 text-sm leading-relaxed text-ink">{e.thoughts}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
