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
  return (
    <div className="bg-white border-b border-orage-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 flex-wrap">
        <SelectField
          label="Status"
          value={filters.status}
          onChange={(v) => onChange({ ...filters, status: v as Status | 'all' })}
          options={[
            { value: 'all', label: 'All statuses' },
            ...ALL_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
          ]}
        />
        <SelectField
          label="Format"
          value={filters.format}
          onChange={(v) => onChange({ ...filters, format: v as Format | 'all' })}
          options={[
            { value: 'all', label: 'All formats' },
            ...ALL_FORMATS.map((f) => ({ value: f, label: FORMAT_LABEL[f] })),
          ]}
        />
        <SelectField
          label="Wedge"
          value={filters.wedge}
          onChange={(v) => onChange({ ...filters, wedge: v as Wedge | 'all' })}
          options={[
            { value: 'all', label: 'All wedges' },
            ...ALL_WEDGES.map((w) => ({ value: w, label: WEDGE_LABEL[w] })),
          ]}
        />
        <SelectField
          label="Source"
          value={filters.source}
          onChange={(v) => onChange({ ...filters, source: v as Source | 'all' })}
          options={[
            { value: 'all', label: 'All sources' },
            ...ALL_SOURCES.map((s) => ({ value: s, label: s })),
          ]}
        />

        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="ml-auto text-sm font-medium text-orage-muted hover:text-orage-text px-3 py-2 rounded-md hover:bg-slate-100"
        >
          Reset
        </button>
      </div>
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
    <label className="flex items-center gap-2 bg-slate-50 border border-orage-border rounded-lg px-3 py-2 min-touch text-sm">
      <span className="text-xs uppercase tracking-wider text-orage-muted font-semibold">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-medium outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
