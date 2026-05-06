'use client';

import { useState } from 'react';
import type { HookFormula, Wedge } from '@/lib/types';
import { ALL_FORMULAS, ALL_WEDGES, FORMULA_LABEL, WEDGE_LABEL } from '@/lib/constants';

interface Props {
  initialText?: string;
  onSubmit: (data: { text: string; formula: HookFormula; pairsWithWedges: Wedge[] }) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}

const FORMULA_ACCENT: Record<HookFormula, string> = {
  SPECIFIC_NUMBER: '#10B981',
  CONTRARIAN: '#E4AF7A',
  THIRD_PERSON_PROOF: '#3B82F6',
  DIRECT_COMMAND: '#B68039',
  POV_AUTHORITY: '#A78BFA',
};

export default function HookComposer({
  initialText = '',
  onSubmit,
  onCancel,
  submitLabel = 'Save hook',
}: Props) {
  const [text, setText] = useState(initialText);
  const [formula, setFormula] = useState<HookFormula>('CONTRARIAN');
  const [wedges, setWedges] = useState<Wedge[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleWedge = (w: Wedge) => {
    setWedges((curr) => (curr.includes(w) ? curr.filter((x) => x !== w) : [...curr, w]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ text: text.trim(), formula, pairsWithWedges: wedges });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="eyebrow block mb-2">Hook</label>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type the line as you'd say it on camera..."
          rows={3}
          className="w-full bg-black/30 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-3 py-3 text-base text-cream-soft placeholder:text-cream/30 outline-none resize-y"
        />
      </div>

      <div>
        <label className="eyebrow block mb-2">Formula</label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_FORMULAS.map((f) => {
            const accent = FORMULA_ACCENT[f];
            const active = formula === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFormula(f)}
                className="font-display text-[10px] tracking-[0.25em] px-2.5 py-2 rounded-sm transition-all min-touch"
                style={{
                  backgroundColor: active ? accent : 'transparent',
                  color: active ? '#000' : accent,
                  border: `1px solid ${accent}${active ? '' : '55'}`,
                }}
              >
                {FORMULA_LABEL[f]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="eyebrow block mb-2">Pairs with wedges</label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_WEDGES.map((w) => {
            const active = wedges.includes(w);
            return (
              <button
                key={w}
                type="button"
                onClick={() => toggleWedge(w)}
                className={`font-display text-[10px] tracking-[0.22em] px-2 py-1.5 rounded-sm border transition-colors min-touch ${
                  active
                    ? 'bg-gold/15 border-gold text-gold-high'
                    : 'border-[color:var(--border-subtle)] text-cream/60 hover:border-[color:var(--border)]'
                }`}
              >
                {WEDGE_LABEL[w]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="font-display text-[11px] tracking-[0.25em] text-cream/60 hover:text-cream-soft px-4 py-2 min-touch"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="font-display text-sm tracking-[0.2em] bg-gold text-black hover:bg-gold-high disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-sm min-touch transition-colors"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
