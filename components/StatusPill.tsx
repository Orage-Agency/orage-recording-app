import type { Status } from '@/lib/types';
import { STATUS_COLOR, STATUS_LABEL } from '@/lib/brand';

export default function StatusPill({ status }: { status: Status }) {
  const color = STATUS_COLOR[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
      {STATUS_LABEL[status]}
    </span>
  );
}
