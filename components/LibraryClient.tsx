'use client';

import { useMemo, useState } from 'react';
import type { Script } from '@/lib/types';
import FilterBar, { DEFAULT_FILTERS, type Filters } from './FilterBar';
import ScriptCard from './ScriptCard';

export default function LibraryClient({ scripts }: { scripts: Script[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return scripts
      .filter((s) => filters.status === 'all' || s.status === filters.status)
      .filter((s) => filters.format === 'all' || s.format === filters.format)
      .filter((s) => filters.wedge === 'all' || s.wedge === filters.wedge)
      .filter((s) => filters.source === 'all' || s.source === filters.source)
      .sort((a, b) => a.priorityRank - b.priorityRank);
  }, [scripts, filters]);

  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-orage-muted">
            <p className="text-lg mb-3">No scripts match these filters.</p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-orage-accent font-semibold underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((s) => (
              <ScriptCard key={s.id} script={s} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
