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
      className={`group relative flex flex-col bg-white rounded-2xl border-2 transition-all hover:shadow-lg active:scale-[0.99] ${
        script.recommended
          ? 'border-amber-400 shadow-amber-100 shadow'
          : 'border-orage-border hover:border-slate-300'
      }`}
    >
      {script.recommended && (
        <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          ★ PRIORITY
        </div>
      )}

      <div className="p-5 pb-3 flex items-start justify-between gap-3">
        <div className="text-2xl font-bold text-orage-muted tabular-nums">
          {String(script.number).padStart(2, '0')}
        </div>
        <StatusPill status={script.status} />
      </div>

      <div className="px-5 pb-3 flex-1">
        <h3 className="font-bold text-xl leading-tight text-balance text-orage-text mb-3">
          {script.title}
        </h3>
        {preview && (
          <p className="text-sm text-orage-muted line-clamp-2 italic">&ldquo;{preview}&rdquo;</p>
        )}
      </div>

      <div className="px-5 pb-3 flex flex-wrap gap-1.5 text-xs">
        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
          {FORMAT_LABEL[script.format]}
        </span>
        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
          {WEDGE_LABEL[script.wedge]}
        </span>
        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
          {script.length}
        </span>
      </div>

      <div className="px-5 py-3 border-t border-orage-border flex items-center gap-2">
        <span className="text-xs text-orage-muted font-medium mr-1">Sections</span>
        {sectionTypes.map((t) => {
          const has = completedByType.has(t);
          const done = completedByType.get(t);
          return (
            <span
              key={t}
              className={`w-3 h-3 rounded-full transition-all ${has ? '' : 'opacity-20'}`}
              style={{
                backgroundColor: done ? SECTION_COLOR[t] : 'transparent',
                border: `2px solid ${SECTION_COLOR[t]}`,
              }}
              title={t.replace('_', ' ')}
            />
          );
        })}
      </div>
    </Link>
  );
}
