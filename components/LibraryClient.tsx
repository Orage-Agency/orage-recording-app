'use client';

import { useMemo, useState } from 'react';
import type { Script, Status } from '@/lib/types';
import FilterBar, { DEFAULT_FILTERS, type Filters } from './FilterBar';
import ScriptCard from './ScriptCard';
import NextUpHero from './NextUpHero';
import QueueStrip from './QueueStrip';
import StatsBar from './StatsBar';
import NewScriptModal from './NewScriptModal';

const RECORDED_STATUSES: Status[] = ['recorded', 'edited', 'live', 'winner'];
const isRecorded = (s: Script) => RECORDED_STATUSES.includes(s.status);

export default function LibraryClient({ scripts }: { scripts: Script[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showAll, setShowAll] = useState(true);
  const [newScript, setNewScript] = useState(false);

  const ranked = useMemo(
    () => [...scripts].sort((a, b) => a.priorityRank - b.priorityRank),
    [scripts]
  );

  const onDeck = useMemo(() => ranked.find((s) => !isRecorded(s)) ?? null, [ranked]);
  const upNext = useMemo(() => {
    if (!onDeck) return [];
    const idx = ranked.findIndex((s) => s.id === onDeck.id);
    return ranked.slice(idx + 1).filter((s) => !isRecorded(s)).slice(0, 4);
  }, [ranked, onDeck]);

  const recordedCount = scripts.filter(isRecorded).length;
  const priorityCount = scripts.filter((s) => s.recommended).length;
  const winnerCount = scripts.filter((s) => s.status === 'winner').length;

  const filtered = useMemo(() => {
    return ranked
      .filter((s) => filters.status === 'all' || s.status === filters.status)
      .filter((s) => filters.format === 'all' || s.format === filters.format)
      .filter((s) => filters.wedge === 'all' || s.wedge === filters.wedge)
      .filter((s) => filters.source === 'all' || s.source === filters.source);
  }, [ranked, filters]);

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 space-y-10">
      <section className="animate-rise flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <StatsBar
            stats={[
              { label: 'Scripts', value: scripts.length },
              { label: 'Priority', value: priorityCount, accent: true, hint: '★' },
              { label: 'Recorded', value: `${recordedCount}/${scripts.length}` },
              { label: 'Winners', value: winnerCount },
            ]}
          />
        </div>
        <button
          onClick={() => setNewScript(true)}
          className="hidden sm:inline-flex items-center gap-2 font-display text-sm tracking-[0.25em] bg-gold text-black hover:bg-gold-high px-5 py-3 rounded-sm min-touch shrink-0 self-stretch transition-colors"
        >
          + New Script
        </button>
      </section>

      <button
        onClick={() => setNewScript(true)}
        className="sm:hidden font-display text-sm tracking-[0.25em] bg-gold text-black hover:bg-gold-high px-5 py-3 rounded-sm min-touch w-full transition-colors animate-rise"
      >
        + New Script
      </button>

      <section className="animate-rise-delay-1">
        <NextUpHero script={onDeck} />
      </section>

      {upNext.length > 0 && (
        <section className="animate-rise-delay-2">
          <QueueStrip scripts={upNext} />
        </section>
      )}

      <section className="animate-rise-delay-3 space-y-4">
        <button
          onClick={() => setShowAll((v) => !v)}
          className="flex items-center gap-3 group"
        >
          <span className="eyebrow">All scripts</span>
          <span className="font-display text-[10px] tracking-[0.25em] text-cream/40">
            {scripts.length}
          </span>
          <span className="font-display text-[10px] tracking-[0.25em] text-gold/70 group-hover:text-gold transition-colors ml-2">
            {showAll ? 'Hide' : 'Show'} {showAll ? '↑' : '↓'}
          </span>
        </button>

        {showAll && (
          <>
            <FilterBar filters={filters} onChange={setFilters} />
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-ink-2 border border-[color:var(--border-subtle)] rounded-sm">
                <div className="eyebrow mb-3">No matches</div>
                <p className="font-display text-2xl tracking-[0.1em] text-cream/60 mb-4">
                  Nothing here
                </p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="font-display text-[11px] tracking-[0.3em] text-gold hover:text-gold-high"
                >
                  Reset filters →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.map((s) => (
                  <ScriptCard key={s.id} script={s} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <NewScriptModal open={newScript} onClose={() => setNewScript(false)} />
    </main>
  );
}
