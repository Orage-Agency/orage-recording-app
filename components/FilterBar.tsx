'use client';

import type { Status, Wedge, Format, Source } from '@/lib/types';
import {
  ALL_STATUSES,
  ALL_WEDGES,
  ALL_FORMATS,
  ALL_SOURCES,
  WEDGE_LABEL,
  FORMAT_LABEL,
} from '@/lib/constants';
import { STATUS_LABEL } from '@/lib/brand';

export type Filters = {
  status: Status | 'all';
  wedge: Wedge | 'all';
  format: Format | 'all';
  source: Source | 'all';
  search: string;
};

export const DEFAULT_FILTERS: Filters = {
  status: 'all',
  wedge: 'all',
  format: 'all',
  source: 'all',
  search: '',
};

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
  const isDefault =
    filters.status === 'all' &&
    filters.wedge === 'all' &&
    filters.format === 'all' &&
    filters.source === 'all';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <SelectField
        label="Status"
        value={filters.status}
        onChange={(v) => onChange({ ...filters, status: v as Status | 'all' })}
        options={[
          { value: 'all', label: 'All' },
          ...ALL_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
        ]}
      />
      <SelectField
        label="Format"
        value={filters.format}
        onChange={(v) => onChange({ ...filters, format: v as Format | 'all' })}
        options={[
          { value: 'all', label: 'All' },
          ...ALL_FORMATS.map((f) => ({ value: f, label: FORMAT_LABEL[f] })),
        ]}
      />
      <SelectField
        label="Wedge"
        value={filters.wedge}
        onChange={(v) => onChange({ ...filters, wedge: v as Wedge | 'all' })}
        options={[
          { value: 'all', label: 'All' },
          ...ALL_WEDGES.map((w) => ({ value: w, label: WEDGE_LABEL[w] })),
        ]}
      />
      <SelectField
        label="Source"
        value={filters.source}
        onChange={(v) => onChange({ ...filters, source: v as Source | 'all' })}
        options={[
          { value: 'all', label: 'All' },
          ...ALL_SOURCES.map((s) => ({ value: s, label: s })),
        ]}
      />

      <button
        onClick={() => onChange(DEFAULT_FILTERS)}
        disabled={isDefault}
        className="ml-auto font-display text-[11px] tracking-[0.25em] text-cream/60 hover:text-gold-high disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 min-touch"
      >
        Reset
      </button>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2.5 bg-ink-2 border border-[color:var(--border-subtle)] hover:border-[color:var(--border)] transition-colors rounded-sm px-3 py-2 min-touch text-sm">
      <span className="font-display text-[10px] tracking-[0.25em] text-gold">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-cream-soft font-medium outline-none cursor-pointer pr-1"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-2 text-cream-soft">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
