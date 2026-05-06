'use client';

import type { Status } from '@/lib/types';
import { ALL_STATUSES } from '@/lib/constants';
import { STATUS_COLOR, STATUS_LABEL } from '@/lib/brand';

interface Props {
  value: Status;
  onChange: (s: Status) => void;
}

export default function StatusSelect({ value, onChange }: Props) {
  const color = STATUS_COLOR[value];
  return (
    <label
      className="inline-flex items-center gap-2 rounded-sm px-3 py-2 min-touch font-display tracking-[0.2em] text-xs cursor-pointer"
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}55`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Status)}
        className="bg-transparent outline-none cursor-pointer appearance-none pr-2"
        style={{ color }}
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s} className="bg-ink-2 text-cream-soft">
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
