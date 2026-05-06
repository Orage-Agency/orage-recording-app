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
    <label className="inline-flex items-center gap-2">
      <span
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white font-semibold text-sm cursor-pointer min-touch"
        style={{ backgroundColor: color }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as Status)}
          className="bg-transparent text-white outline-none cursor-pointer appearance-none pr-2"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s} className="text-orage-text">
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}
