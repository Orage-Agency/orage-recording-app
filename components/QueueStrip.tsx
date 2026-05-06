import Link from 'next/link';
import type { Script } from '@/lib/types';
import { FORMAT_LABEL } from '@/lib/constants';
import StatusPill from './StatusPill';

export default function QueueStrip({ scripts }: { scripts: Script[] }) {
  if (scripts.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">Up next</div>
        <div className="font-display text-[10px] tracking-[0.25em] text-cream/40">
          {scripts.length} queued
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
        {scripts.map((s) => (
          <Link
            key={s.id}
            href={`/script/${s.id}`}
            className="group shrink-0 w-72 sm:w-80 snap-start bg-ink-2 border border-[color:var(--border-subtle)] hover:border-[color:var(--border)] rounded-sm p-5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="font-display text-2xl text-gold tabular-nums leading-none">
                {String(s.number).padStart(2, '0')}
              </span>
              <StatusPill status={s.status} />
            </div>
            <h3 className="font-display text-xl tracking-[0.04em] text-cream-soft leading-tight mb-3 line-clamp-2 text-balance">
              {s.title}
            </h3>
            <div className="flex items-center justify-between font-display text-[10px] tracking-[0.25em] text-cream/50">
              <span>{FORMAT_LABEL[s.format]}</span>
              <span className="text-gold/70 group-hover:text-gold transition-colors">
                Open →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
