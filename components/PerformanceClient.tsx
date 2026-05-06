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
      <div className="bg-white border-b border-orage-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 bg-slate-50 border border-orage-border rounded-lg px-3 py-2 min-touch text-sm">
            <span className="text-xs uppercase tracking-wider text-orage-muted font-semibold">
              Status
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Status | 'all')}
              className="bg-transparent font-medium outline-none cursor-pointer"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All' : STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>

          <div className="ml-auto text-sm text-orage-muted">
            Showing <span className="font-bold text-orage-text">{visible.length}</span> scripts
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl border border-orage-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-orage-border">
                <tr className="text-left text-[11px] uppercase tracking-wider text-orage-muted font-semibold">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Wedge</th>
                  <th className="px-4 py-3 text-right">Hook %</th>
                  <th className="px-4 py-3 text-right">CTR %</th>
                  <th className="px-4 py-3 text-right">CPL $</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orage-border">
                {visible.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-orage-muted">
                      {String(s.number).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <Link href={`/script/${s.id}`} className="font-semibold hover:underline truncate block">
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-4 py-3 text-xs">{FORMAT_LABEL[s.format]}</td>
                    <td className="px-4 py-3 text-xs">{WEDGE_LABEL[s.wedge]}</td>
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
                        className="w-full bg-transparent border-b border-transparent focus:border-orage-accent outline-none text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <PlaceholderCard title="Trending hooks this week" subtitle="v2 — coming soon" />
          <PlaceholderCard title="Content pillars" subtitle="v2 — coming soon" />
          <PlaceholderCard title="Organic vs Paid winners" subtitle="v2 — coming soon" />
        </div>
      </main>
    </>
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
      className="w-20 text-right bg-transparent border-b border-transparent focus:border-orage-accent outline-none tabular-nums"
    />
  );
}

function PlaceholderCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-orage-border p-5">
      <div className="text-xs uppercase tracking-wider text-orage-muted font-semibold mb-1">
        {subtitle}
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
  );
}
