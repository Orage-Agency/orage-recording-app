interface Stat {
  label: string;
  value: number | string;
  hint?: string;
  accent?: boolean;
}

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[color:var(--border-subtle)] rounded-sm overflow-hidden border border-[color:var(--border-subtle)]">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-ink-2 px-5 py-4 flex flex-col gap-1"
        >
          <div className="eyebrow">{s.label}</div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-display text-3xl sm:text-4xl tabular-nums leading-none ${
                s.accent ? 'text-gold-high' : 'text-cream-soft'
              }`}
            >
              {s.value}
            </span>
            {s.hint && (
              <span className="font-display text-[10px] tracking-[0.25em] text-cream/40">
                {s.hint}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
