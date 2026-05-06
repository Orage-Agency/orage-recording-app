import Link from 'next/link';
import type { Script } from '@/lib/types';
import { FORMAT_LABEL, WEDGE_LABEL } from '@/lib/constants';
import { SECTION_COLOR } from '@/lib/brand';
import StatusPill from './StatusPill';

const SECTION_TYPES = ['VISUAL_HOOK', 'VERBAL_HOOK', 'BODY', 'CTA'] as const;

export default function NextUpHero({ script }: { script: Script | null }) {
  if (!script) {
    return (
      <section className="relative ambient-hero rounded-sm bg-ink-2 border border-[color:var(--border-subtle)] p-10 text-center overflow-hidden">
        <div className="eyebrow mb-3">All clear</div>
        <h2 className="font-display text-4xl tracking-[0.08em] text-cream-soft mb-3">
          Nothing on deck
        </h2>
        <div className="divider-gold mx-auto mb-3" />
        <p className="text-sm text-cream/60 font-light max-w-md mx-auto">
          Every priority script is recorded. Pull from &ldquo;All scripts&rdquo; below to keep going.
        </p>
      </section>
    );
  }

  const verbalHook = script.sections.find((s) => s.type === 'VERBAL_HOOK');
  const preview = verbalHook?.spokenLines[0] ?? script.sections[0]?.spokenLines[0] ?? '';

  const completedByType = new Map<string, boolean>();
  for (const t of SECTION_TYPES) {
    const present = script.sections.filter((s) => s.type === t);
    if (present.length === 0) continue;
    completedByType.set(t, present.every((s) => s.completed));
  }

  return (
    <Link
      href={`/script/${script.id}`}
      className="group relative ambient-hero block rounded-sm bg-ink-2 border border-[color:var(--border)] hover:border-gold transition-colors overflow-hidden"
    >
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 p-5 sm:p-7 lg:p-9">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="eyebrow">On deck</div>
            <span className="w-1 h-1 rounded-full bg-gold/40" />
            {script.recommended && (
              <span className="font-display text-[10px] tracking-[0.3em] text-gold">★ Priority</span>
            )}
            <span className="ml-auto"><StatusPill status={script.status} /></span>
          </div>

          <div className="flex items-baseline gap-3 sm:gap-4 mb-4">
            <span className="font-display text-3xl sm:text-4xl text-gold tabular-nums leading-none">
              {String(script.number).padStart(2, '0')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.04em] text-cream-soft leading-[0.98] text-balance">
              {script.title}
            </h2>
          </div>

          {preview && (
            <p className="text-base sm:text-lg text-cream/70 italic font-light leading-snug max-w-2xl mb-5 text-balance line-clamp-2">
              &ldquo;{preview}&rdquo;
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Tag>{FORMAT_LABEL[script.format]}</Tag>
            <Tag>{WEDGE_LABEL[script.wedge]}</Tag>
            <Tag>{script.length}</Tag>
          </div>

          <div className="flex items-center gap-4">
            <span
              className="font-display text-sm tracking-[0.25em] text-black bg-gold group-hover:bg-gold-high px-5 py-2.5 rounded-sm transition-colors inline-flex items-center gap-3"
            >
              Open script
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
            <span className="font-display text-[10px] tracking-[0.25em] text-cream/40 hidden sm:inline">
              Tap anywhere
            </span>
          </div>
        </div>

        <div className="lg:border-l lg:border-[color:var(--border-subtle)] lg:pl-8 lg:pr-2 grid grid-cols-2 lg:grid-cols-1 gap-x-4">
          <div className="lg:hidden eyebrow mb-3 col-span-2">Sections</div>
          <div className="hidden lg:block eyebrow mb-3">Sections</div>
          <ul className="space-y-2 lg:space-y-3 col-span-2 lg:col-span-1 grid grid-cols-2 lg:block gap-2 lg:gap-0">
            {SECTION_TYPES.map((t) => {
              const has = completedByType.has(t);
              const done = completedByType.get(t);
              return (
                <li key={t} className="flex items-center gap-2.5 text-sm">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
                    style={{
                      backgroundColor: done ? SECTION_COLOR[t] : 'transparent',
                      border: `1.5px solid ${SECTION_COLOR[t]}${has ? '' : '55'}`,
                      opacity: has ? 1 : 0.35,
                    }}
                  />
                  <span
                    className={`font-display tracking-[0.2em] text-[10px] ${
                      done ? 'text-cream/40 line-through' : 'text-cream-soft'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-[10px] tracking-[0.25em] px-2 py-1 rounded-sm bg-black/40 text-cream/80 border border-[color:var(--border-subtle)]">
      {children}
    </span>
  );
}
