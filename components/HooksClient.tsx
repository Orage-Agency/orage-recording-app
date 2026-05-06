'use client';

import { useMemo, useState } from 'react';
import type { VerbalHook, HookFormula, Wedge } from '@/lib/types';
import { ALL_FORMULAS, ALL_WEDGES, FORMULA_LABEL, WEDGE_LABEL } from '@/lib/constants';

const FORMULA_TINT: Record<HookFormula, string> = {
  SPECIFIC_NUMBER: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  CONTRARIAN: 'bg-rose-50 border-rose-200 text-rose-900',
  THIRD_PERSON_PROOF: 'bg-blue-50 border-blue-200 text-blue-900',
  DIRECT_COMMAND: 'bg-amber-50 border-amber-200 text-amber-900',
  POV_AUTHORITY: 'bg-violet-50 border-violet-200 text-violet-900',
};

const FORMULA_BADGE: Record<HookFormula, string> = {
  SPECIFIC_NUMBER: 'bg-emerald-600',
  CONTRARIAN: 'bg-rose-600',
  THIRD_PERSON_PROOF: 'bg-blue-600',
  DIRECT_COMMAND: 'bg-amber-600',
  POV_AUTHORITY: 'bg-violet-600',
};

export default function HooksClient({ hooks }: { hooks: VerbalHook[] }) {
  const [formula, setFormula] = useState<HookFormula | 'all'>('all');
  const [wedge, setWedge] = useState<Wedge | 'all'>('all');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return hooks
      .filter((h) => formula === 'all' || h.formula === formula)
      .filter((h) => wedge === 'all' || h.pairsWithWedges.includes(wedge));
  }, [hooks, formula, wedge]);

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <div className="bg-white border-b border-orage-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 bg-slate-50 border border-orage-border rounded-lg px-3 py-2 min-touch text-sm">
            <span className="text-xs uppercase tracking-wider text-orage-muted font-semibold">
              Formula
            </span>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value as HookFormula | 'all')}
              className="bg-transparent font-medium outline-none cursor-pointer"
            >
              <option value="all">All formulas</option>
              {ALL_FORMULAS.map((f) => (
                <option key={f} value={f}>
                  {FORMULA_LABEL[f]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 bg-slate-50 border border-orage-border rounded-lg px-3 py-2 min-touch text-sm">
            <span className="text-xs uppercase tracking-wider text-orage-muted font-semibold">
              Wedge
            </span>
            <select
              value={wedge}
              onChange={(e) => setWedge(e.target.value as Wedge | 'all')}
              className="bg-transparent font-medium outline-none cursor-pointer"
            >
              <option value="all">All wedges</option>
              {ALL_WEDGES.map((w) => (
                <option key={w} value={w}>
                  {WEDGE_LABEL[w]}
                </option>
              ))}
            </select>
          </label>

          <div className="ml-auto text-sm text-orage-muted">
            <span className="font-bold text-orage-text">{filtered.length}</span> of {hooks.length} hooks
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((h) => (
          <button
            key={h.id}
            onClick={() => copy(h.text, h.id)}
            className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md active:scale-[0.99] ${FORMULA_TINT[h.formula]}`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`text-[10px] uppercase tracking-wider font-bold text-white px-2 py-1 rounded ${FORMULA_BADGE[h.formula]}`}
              >
                {FORMULA_LABEL[h.formula]}
              </span>
              <span className="text-xs font-mono text-orage-muted">
                {copied === h.id ? '✓ Copied' : 'Tap to copy'}
              </span>
            </div>
            <p className="text-lg leading-snug font-semibold text-balance mb-3">
              {h.text}
            </p>
            <div className="flex flex-wrap gap-1">
              {h.pairsWithWedges.map((w) => (
                <span
                  key={w}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/70 text-orage-muted font-semibold uppercase tracking-wider"
                >
                  {WEDGE_LABEL[w]}
                </span>
              ))}
            </div>
          </button>
        ))}
      </main>
    </>
  );
}
