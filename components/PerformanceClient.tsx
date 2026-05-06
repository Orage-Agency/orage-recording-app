'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Script, ScriptPerformance, Status } from '@/lib/types';
import { FORMAT_LABEL, WEDGE_LABEL } from '@/lib/constants';
import { STATUS_LABEL } from '@/lib/brand';
import StatusPill from './StatusPill';

const STATUS_FILTERS: Array<Status | 'all'> = ['all', 'live', 'winner', 'killed'];

export default function PerformanceClient({ initial }: { initial: Script[] }) {
  const [scripts, setScripts] = useState<Script[]>(initial);
  const [filter, setFilter] = useState<Status | 'all'>('all');

  const visible = scripts.filter((s) => filter === 'all' || s.status === filter);

  const updateMetric = async (id: string, patch: Partial<ScriptPerformance>) => {
    const idx = scripts.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const current = scripts[idx];
    const next: Script = {
      ...current,
      performance: { ...(current.performance ?? {}), ...patch },
    };
    const nextAll = [...scripts];
    nextAll[idx] = next;
    setScripts(nextAll);
    await fetch(`/api/scripts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
  };

  return (
    <>
      <div className="bg-ink-1 border-b border-[color:var(--border-subtle)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2.5 bg-ink-2 border border-[color:var(--border-subtle)] rounded-sm px-3 py-2 min-touch text-sm">
            <span className="font-display text-[10px] tracking-[0.25em] text-gold">Status</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Status | 'all')}
              className="bg-transparent text-cream-soft font-medium outline-none cursor-pointer"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s} className="bg-ink-2">
                  {s === 'all' ? 'All' : STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>

          <div className="ml-auto font-display text-[11px] tracking-[0.25em] text-cream/60">
            <span className="text-gold-high">{visible.length}</span> scripts
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
        <div className="bg-ink-2 rounded-sm border border-[color:var(--border-subtle)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-1 border-b border-[color:var(--border-subtle)]">
                <tr className="text-left">
                  <Th>#</Th>
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th>Format</Th>
                  <Th>Wedge</Th>
                  <Th align="right">Hook %</Th>
                  <Th align="right">CTR %</Th>
                  <Th align="right">CPL $</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--border-subtle)]">
                {visible.map((s) => (
                  <tr key={s.id} className="hover:bg-black/30">
                    <td className="px-4 py-3 font-mono text-xs text-cream/50">
                      {String(s.number).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <Link
                        href={`/script/${s.id}`}
                        className="font-display tracking-[0.05em] text-cream-soft hover:text-gold-high truncate block"
                      >
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-cream/70">{FORMAT_LABEL[s.format]}</td>
                    <td className="px-4 py-3 text-xs text-cream/70">{WEDGE_LABEL[s.wedge]}</td>
                    <td className="px-4 py-3">
                      <NumberCell
                        value={s.performance?.hookRate}
                        onChange={(v) => updateMetric(s.id, { hookRate: v })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <NumberCell
                        value={s.performance?.ctr}
                        onChange={(v) => updateMetric(s.id, { ctr: v })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <NumberCell
                        value={s.performance?.cpl}
                        onChange={(v) => updateMetric(s.id, { cpl: v })}
                      />
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <input
                        type="text"
                        defaultValue={s.performance?.notes ?? ''}
                        onBlur={(e) => updateMetric(s.id, { notes: e.target.value })}
                        placeholder="—"
                        className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none text-sm text-cream-soft placeholder:text-cream/30"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <PlaceholderCard title="Trending hooks" />
          <PlaceholderCard title="Content pillars" />
          <PlaceholderCard title="Organic vs Paid" />
        </div>
      </main>
    </>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className={`px-4 py-3 font-display text-[10px] tracking-[0.25em] text-gold ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  );
}

function NumberCell({ value, onChange }: { value?: number; onChange: (v: number | undefined) => void }) {
  return (
    <input
      type="number"
      step="0.1"
      defaultValue={value ?? ''}
      onBlur={(e) => {
        const v = e.target.value === '' ? undefined : Number(e.target.value);
        onChange(v);
      }}
      placeholder="—"
      className="w-20 text-right bg-transparent border-b border-transparent focus:border-gold outline-none tabular-nums text-cream-soft placeholder:text-cream/30"
    />
  );
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <div className="bg-ink-2 rounded-sm border border-dashed border-[color:var(--border-subtle)] p-5">
      <div className="eyebrow mb-2">v2 — Coming soon</div>
      <h3 className="font-display text-xl tracking-[0.05em] text-cream/60">{title}</h3>
    </div>
  );
}
