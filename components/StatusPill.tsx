import type { Status } from '@/lib/types';
import { STATUS_COLOR, STATUS_LABEL } from '@/lib/brand';

export default function StatusPill({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'md' }) {
  const color = STATUS_COLOR[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-sm font-display tracking-[0.2em] ${
        size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2 py-1 text-[10px]'
      }`}
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}55`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {STATUS_LABEL[status]}
    </span>
  );
}
