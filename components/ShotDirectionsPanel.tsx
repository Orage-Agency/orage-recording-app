'use client';

import { useState } from 'react';

interface Props {
  directions: string[];
  setup: string;
  energy: string;
  format: string;
  length: string;
  editing: boolean;
  onChange: (next: string[]) => void;
  onCommit: () => void;
}

export default function ShotDirectionsPanel({
  directions,
  setup,
  energy,
  format,
  length,
  editing,
  onChange,
  onCommit,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`bg-ink-1 border-[color:var(--border-subtle)] lg:border-l lg:sticky lg:top-[64px] lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto transition-all ${
        open ? 'lg:w-80' : 'lg:w-12'
      }`}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--border-subtle)] lg:sticky lg:top-0 bg-ink-1 z-10">
        <h3 className={`eyebrow ${open ? '' : 'lg:hidden'}`}>
          Shot directions
        </h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="hidden lg:inline-flex w-8 h-8 items-center justify-center rounded-sm hover:bg-ink-2 text-gold"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? '→' : '←'}
        </button>
      </div>

      {open && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Meta label="Format" value={format} />
            <Meta label="Length" value={length} />
            <Meta label="Energy" value={energy} className="col-span-2" />
            <Meta label="Setup" value={setup} className="col-span-2" />
          </div>

          <div className="border-t border-[color:var(--border-subtle)] pt-5">
            <h4 className="eyebrow mb-3">Directions</h4>
            <ul className="space-y-2.5">
              {directions.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold shrink-0 leading-relaxed">→</span>
                  {editing ? (
                    <>
                      <input
                        type="text"
                        value={d}
                        onChange={(e) => {
                          const next = [...directions];
                          next[i] = e.target.value;
                          onChange(next);
                        }}
                        onBlur={onCommit}
                        className="flex-1 bg-ink-2 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-2 py-1 text-sm outline-none text-cream-soft"
                      />
                      <button
                        onClick={() => {
                          const next = directions.filter((_, j) => j !== i);
                          onChange(next);
                          onCommit();
                        }}
                        className="text-cream/50 hover:text-red-400 px-1 shrink-0"
                        aria-label="Remove direction"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-cream-soft leading-relaxed">{d}</span>
                  )}
                </li>
              ))}
            </ul>
            {editing && (
              <button
                onClick={() => {
                  onChange([...directions, '']);
                  onCommit();
                }}
                className="mt-3 font-display text-[11px] tracking-[0.25em] text-gold hover:text-gold-high"
              >
                + Add direction
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

function Meta({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <div className="eyebrow text-[10px] mb-1">{label}</div>
      <div className="text-sm text-cream-soft">{value}</div>
    </div>
  );
}
