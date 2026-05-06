import Link from 'next/link';
import type { Script } from '@/lib/types';
import { FORMAT_LABEL, WEDGE_LABEL } from '@/lib/constants';
import { SECTION_COLOR } from '@/lib/brand';
import StatusPill from './StatusPill';

const SECTION_TYPES = ['VISUAL_HOOK', 'VERBAL_HOOK', 'BODY', 'CTA'] as const;

export default function ScriptCard({ script }: { script: Script }) {
  const completedByType = new Map<string, boolean>();
  for (const t of SECTION_TYPES) {
    const present = script.sections.filter((s) => s.type === t);
    if (present.length === 0) continue;
    completedByType.set(t, present.every((s) => s.completed));
  }

  return (
    <Link
      href={`/script/${script.id}`}
      className={`group relative flex flex-col rounded-sm transition-all hover:-translate-y-0.5 active:scale-[0.99] bg-ink-2 ${
        script.recommended
          ? 'border border-gold/70 hover:border-gold'
          : 'border border-[color:var(--border-subtle)] hover:border-[color:var(--border)]'
      }`}
    >
      {script.recommended && (
        <div className="absolute -top-px left-4 -translate-y-1/2 bg-gold text-black font-display text-[9px] tracking-[0.3em] px-2 py-0.5">
          ★ Priority
        </div>
      )}

      <div className="px-4 pt-5 pb-2 flex items-start justify-between gap-3">
        <div className="font-display text-2xl text-gold tabular-nums leading-none">
          {String(script.number).padStart(2, '0')}
        </div>
        <StatusPill status={script.status} />
      </div>

      <div className="px-4 pb-3 flex-1">
        <h3 className="font-display text-lg tracking-[0.05em] leading-tight text-cream-soft text-balance">
          {script.title}
        </h3>
      </div>

      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        <Tag>{FORMAT_LABEL[script.format]}</Tag>
        <Tag>{WEDGE_LABEL[script.wedge]}</Tag>
        <Tag>{script.length}</Tag>
      </div>

      <div className="px-4 py-2.5 border-t border-[color:var(--border-subtle)] flex items-center gap-2">
        <span className="eyebrow text-[9px]">Sections</span>
        <div className="flex items-center gap-1.5 ml-auto">
          {SECTION_TYPES.map((t) => {
            const has = completedByType.has(t);
            const done = completedByType.get(t);
            return (
              <span
                key={t}
                className={`w-2 h-2 rounded-full transition-all ${has ? '' : 'opacity-25'}`}
                style={{
                  backgroundColor: done ? SECTION_COLOR[t] : 'transparent',
                  border: `1.5px solid ${SECTION_COLOR[t]}`,
                }}
                title={t.replace('_', ' ')}
              />
            );
          })}
        </div>
      </div>
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-[9px] tracking-[0.22em] px-1.5 py-0.5 rounded-sm bg-black/40 text-cream/70 border border-[color:var(--border-subtle)]">
      {children}
    </span>
  );
}
