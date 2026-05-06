'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { VerbalHook, HookFormula, Wedge } from '@/lib/types';
import { ALL_FORMULAS, ALL_WEDGES, FORMULA_LABEL, WEDGE_LABEL } from '@/lib/constants';
import Modal from './Modal';
import HookComposer from './HookComposer';

const FORMULA_ACCENT: Record<HookFormula, string> = {
  SPECIFIC_NUMBER: '#10B981',
  CONTRARIAN: '#E4AF7A',
  THIRD_PERSON_PROOF: '#3B82F6',
  DIRECT_COMMAND: '#B68039',
  POV_AUTHORITY: '#A78BFA',
};

export default function HooksClient({ hooks: initialHooks }: { hooks: VerbalHook[] }) {
  const router = useRouter();
  const [hooks, setHooks] = useState<VerbalHook[]>(initialHooks);
  const [formula, setFormula] = useState<HookFormula | 'all'>('all');
  const [wedge, setWedge] = useState<Wedge | 'all'>('all');
  const [copied, setCopied] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);

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
      /* ignore */
    }
  };

  const submitNew = async (data: {
    text: string;
    formula: HookFormula;
    pairsWithWedges: Wedge[];
  }) => {
    const res = await fetch('/api/hooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    const created: VerbalHook = await res.json();
    setHooks((curr) => [created, ...curr]);
    setComposing(false);
    router.refresh();
  };

  return (
    <>
      <div className="bg-ink-1 border-b border-[color:var(--border-subtle)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center gap-2">
          <Selector label="Formula" value={formula} onChange={(v) => setFormula(v as HookFormula | 'all')}>
            <option value="all" className="bg-ink-2">All formulas</option>
            {ALL_FORMULAS.map((f) => (
              <option key={f} value={f} className="bg-ink-2">{FORMULA_LABEL[f]}</option>
            ))}
          </Selector>
          <Selector label="Wedge" value={wedge} onChange={(v) => setWedge(v as Wedge | 'all')}>
            <option value="all" className="bg-ink-2">All wedges</option>
            {ALL_WEDGES.map((w) => (
              <option key={w} value={w} className="bg-ink-2">{WEDGE_LABEL[w]}</option>
            ))}
          </Selector>

          <div className="ml-auto flex items-center gap-3">
            <div className="font-display text-[11px] tracking-[0.25em] text-cream/60">
              <span className="text-gold-high">{filtered.length}</span>
              <span className="text-cream/40"> / {hooks.length}</span>
            </div>
            <button
              onClick={() => setComposing(true)}
              className="font-display text-[11px] tracking-[0.25em] bg-gold text-black hover:bg-gold-high px-4 py-2 rounded-sm min-touch transition-colors"
            >
              + New Hook
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((h) => {
          const accent = FORMULA_ACCENT[h.formula];
          return (
            <button
              key={h.id}
              onClick={() => copy(h.text, h.id)}
              className="text-left p-5 rounded-sm bg-ink-2 border border-[color:var(--border-subtle)] hover:border-[color:var(--border)] hover:-translate-y-0.5 transition-all"
              style={{ borderLeftWidth: '3px', borderLeftColor: accent }}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className="font-display text-[10px] tracking-[0.25em] px-2 py-1 rounded-sm"
                  style={{ backgroundColor: `${accent}22`, color: accent, border: `1px solid ${accent}55` }}
                >
                  {FORMULA_LABEL[h.formula]}
                </span>
                <span className="font-display text-[10px] tracking-[0.25em] text-cream/40">
                  {copied === h.id ? '✓ Copied' : 'Tap to copy'}
                </span>
              </div>
              <p className="text-base leading-snug font-medium text-cream-soft mb-3 text-balance">
                {h.text}
              </p>
              <div className="flex flex-wrap gap-1">
                {h.pairsWithWedges.map((w) => (
                  <span
                    key={w}
                    className="font-display text-[9px] tracking-[0.2em] px-1.5 py-0.5 rounded-sm bg-black/40 text-cream/60 border border-[color:var(--border-subtle)]"
                  >
                    {WEDGE_LABEL[w]}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </main>

      <Modal
        open={composing}
        onClose={() => setComposing(false)}
        eyebrow="New hook"
        title="What did you just hear in your head?"
        size="md"
      >
        <HookComposer
          onSubmit={submitNew}
          onCancel={() => setComposing(false)}
          submitLabel="Save hook"
        />
      </Modal>
    </>
  );
}

function Selector({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2.5 bg-ink-2 border border-[color:var(--border-subtle)] hover:border-[color:var(--border)] transition-colors rounded-sm px-3 py-2 min-touch text-sm">
      <span className="font-display text-[10px] tracking-[0.25em] text-gold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-cream-soft font-medium outline-none cursor-pointer pr-1"
      >
        {children}
      </select>
    </label>
  );
}
