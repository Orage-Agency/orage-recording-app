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
      className={`bg-white border-orage-border lg:border-l lg:sticky lg:top-[57px] lg:self-start lg:h-[calc(100vh-57px)] lg:overflow-y-auto transition-all ${
        open ? 'lg:w-80' : 'lg:w-12'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-orage-border lg:sticky lg:top-0 bg-white">
        <h3 className={`font-bold text-sm uppercase tracking-wider text-orage-muted ${open ? '' : 'lg:hidden'}`}>
          Shot directions
        </h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="hidden lg:inline-flex w-8 h-8 items-center justify-center rounded-md hover:bg-slate-100 text-orage-muted"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? '→' : '←'}
        </button>
      </div>

      {open && (
        <div className="p-4 space-y-5 text-sm">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Meta label="Format" value={format} />
            <Meta label="Length" value={length} />
            <Meta label="Energy" value={energy} className="col-span-2" />
            <Meta label="Setup" value={setup} className="col-span-2" />
          </div>

          <div className="border-t border-orage-border pt-4">
            <h4 className="text-xs uppercase tracking-wider text-orage-muted font-semibold mb-2">
              Directions
            </h4>
            <ul className="space-y-2">
              {directions.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orage-muted shrink-0">•</span>
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
                        className="flex-1 bg-slate-50 border border-orage-border rounded px-2 py-1 text-sm focus:border-orage-accent outline-none"
                      />
                      <button
                        onClick={() => {
                          const next = directions.filter((_, j) => j !== i);
                          onChange(next);
                          onCommit();
                        }}
                        className="text-red-500 px-1 shrink-0"
                        aria-label="Remove direction"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="text-orage-text leading-relaxed">{d}</span>
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
                className="mt-3 text-sm text-orage-accent font-semibold"
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
      <div className="text-orage-muted uppercase tracking-wider text-[10px] font-semibold">
        {label}
      </div>
      <div className="text-orage-text text-sm">{value}</div>
    </div>
  );
}
