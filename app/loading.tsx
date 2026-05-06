export default function Loading() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 space-y-10 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[color:var(--border-subtle)] rounded-sm overflow-hidden border border-[color:var(--border-subtle)]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-ink-2 px-5 py-4">
            <div className="h-3 w-16 bg-ink-3 rounded-sm mb-3" />
            <div className="h-9 w-12 bg-ink-3 rounded-sm" />
          </div>
        ))}
      </div>
      <div className="rounded-sm bg-ink-2 border border-[color:var(--border-subtle)] p-12 h-72" />
    </main>
  );
}
