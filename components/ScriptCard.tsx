import Link from 'next/link';
import type { Script } from '@/lib/types';
import { FORMAT_LABEL, WEDGE_LABEL } from '@/lib/constants';
import { SECTION_COLOR } from '@/lib/brand';
import StatusPill from './StatusPill';

export default function ScriptCard({ script }: { script: Script }) {
  const sectionTypes: Array<keyof typeof SECTION_COLOR> = [
    'VISUAL_HOOK',
    'VERBAL_HOOK',
    'BODY',
    'CTA',
  ];
  const completedByType = new Map<string, boolean>();
  for (const t of sectionTypes) {
    const present = script.sections.filter((s) => s.type === t);
    if (present.length === 0) continue;
    completedByType.set(t, present.every((s) => s.completed));
  }

  const verbalHook = script.sections.find((s) => s.type === 'VERBAL_HOOK');
  const preview = verbalHook?.spokenLines[0] ?? script.sections[0]?.spokenLines[0] ?? '';

  return (
    <Link
      href={`/script/${script.id}`}
      className={`group relative flex flex-col rounded-sm transition-all hover:-translate-y-0.5 active:scale-[0.99] ${
        script.recommended
          ? 'bg-ink-2 border border-gold'
          : 'bg-ink-2 border border-[color:var(--border-subtle)] hover:border-[color:var(--border)]'
      }`}
    >
      {script.recommended && (
        <div className="absolute -top-px left-5 -translate-y-1/2 bg-gold text-black font-display text-[10px] tracking-[0.3em] px-2 py-0.5">
          ★ Priority
        </div>
      )}

      <div className="px-5 pt-6 pb-3 flex items-start justify-between gap-3">
        <div className="font-display text-3xl text-gold tabular-nums leading-none">
          {String(script.number).padStart(2, '0')}
        </div>
        <StatusPill status={script.status} />
      </div>

      <div className="px-5 pb-3 flex-1">
        <h3 className="font-display text-2xl tracking-[0.06em] leading-tight text-cream-soft mb-3 text-balance">
          {script.title}
        </h3>
        {preview && (
          <p className="text-sm text-cream/60 line-clamp-2 italic font-light leading-snug">
            &ldquo;{preview}&rdquo;
          </p>
        )}
      </div>

      <div className="px-5 pb-4 flex flex-wrap gap-1.5">
        <Tag>{FORMAT_LABEL[script.format]}</Tag>
        <Tag>{WEDGE_LABEL[script.wedge]}</Tag>
        <Tag>{script.length}</Tag>
      </div>

      <div className="px-5 py-3 border-t border-[color:var(--border-subtle)] flex items-center gap-2">
        <span className="eyebrow">Sections</span>
        <div className="flex items-center gap-1.5 ml-auto">
          {sectionTypes.map((t) => {
            const has = completedByType.has(t);
            const done = completedByType.get(t);
            return (
              <span
                key={t}
                className={`w-2.5 h-2.5 rounded-full transition-all ${has ? '' : 'opacity-25'}`}
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
    <span className="text-[10px] font-display tracking-[0.2em] px-2 py-1 rounded-sm bg-black/40 text-cream/80 border border-[color:var(--border-subtle)]">
      {children}
    </span>
  );
}
