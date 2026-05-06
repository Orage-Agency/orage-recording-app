export default function Loading() {
  return (
    <>
      <header className="sticky top-0 z-30 bg-black/85 backdrop-blur border-b border-[color:var(--border-subtle)]">
        <div className="flex items-center gap-3 px-3 sm:px-6 py-3 max-w-[1600px] mx-auto">
          <div className="w-11 h-11 rounded-sm bg-ink-2" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-24 bg-ink-2 rounded-sm" />
            <div className="h-5 w-64 bg-ink-2 rounded-sm" />
          </div>
        </div>
        <div className="h-[2px] w-full bg-ink-2 overflow-hidden">
          <div className="h-full w-1/4 bg-gold/40 animate-pulse" />
        </div>
      </header>
      <main className="max-w-[1600px] mx-auto px-3 sm:px-6 py-6 space-y-4 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-sm bg-ink-2 border-l-[3px] border-[color:var(--border-subtle)] p-6"
          >
            <div className="h-4 w-32 bg-ink-3 rounded-sm mb-4" />
            <div className="h-8 w-full bg-ink-3 rounded-sm mb-3" />
            <div className="h-8 w-4/5 bg-ink-3 rounded-sm" />
          </div>
        ))}
      </main>
    </>
  );
}
