'use client';

import { forwardRef, useEffect, useRef } from 'react';
import type { Script, ScriptSection } from '@/lib/types';
import { SECTION_COLOR, SECTION_LABEL } from '@/lib/brand';

interface Props {
  script: Script;
  currentIdx: number;
  onToggle: (idx: number) => void;
  onExit: () => void;
}

export default function FocusOverlay({ script, currentIdx, onToggle, onExit }: Props) {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  sectionRefs.current = script.sections.map((_, i) => sectionRefs.current[i] ?? null);

  // Center the current section
  useEffect(() => {
    const el = sectionRefs.current[currentIdx];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentIdx]);

  // Lock body scroll while focused
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const total = script.sections.length;
  const completed = script.sections.filter((s) => s.completed).length;
  const progressPct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black overflow-y-auto animate-fade-in"
      role="dialog"
      aria-label="Focus mode"
    >
      <div className="sticky top-0 z-10 h-[2px] w-full bg-black/40">
        <div
          className="h-full bg-gradient-to-r from-gold to-gold-high transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="sticky top-[2px] z-10 bg-black/85 backdrop-blur flex items-center justify-between px-6 py-3 border-b border-[color:var(--border-subtle)]">
        <div className="font-display text-[10px] tracking-[0.3em] text-cream/50">
          Focus · Script {String(script.number).padStart(2, '0')} ·{' '}
          <span className="text-gold-high tabular-nums">{completed}/{total}</span>
        </div>
        <button
          onClick={onExit}
          className="font-display text-[11px] tracking-[0.3em] text-cream/70 hover:text-gold-high px-3 py-2 min-touch"
          aria-label="Exit focus"
        >
          Exit ✕
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-12 pb-[40vh] pt-[20vh] space-y-24">
        {script.sections.map((section, idx) => (
          <FocusSection
            key={section.id}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            section={section}
            index={idx}
            total={total}
            isCurrent={idx === currentIdx && !section.completed}
            onToggle={() => onToggle(idx)}
          />
        ))}
      </div>
    </div>
  );
}

interface FSProps {
  section: ScriptSection;
  index: number;
  total: number;
  isCurrent: boolean;
  onToggle: () => void;
}

const FocusSection = forwardRef<HTMLElement, FSProps>(function FocusSection(
  { section, index, total, isCurrent, onToggle },
  ref
) {
  const color = SECTION_COLOR[section.type];
  const dimmed = section.completed;
  return (
    <section
      ref={ref}
      className={`scroll-mt-32 transition-all duration-500 ${
        dimmed ? 'opacity-25' : isCurrent ? 'opacity-100' : 'opacity-55'
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="font-display text-[10px] tracking-[0.3em] text-cream/40 tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="w-1 h-1 rounded-full bg-cream/30" />
        <span className="font-display text-xs tracking-[0.3em]" style={{ color }}>
          {SECTION_LABEL[section.type].toUpperCase()}
        </span>
        <span className="w-1 h-1 rounded-full bg-cream/30" />
        <span className="text-xs font-mono text-cream/40">{section.timecode}</span>
      </div>

      {section.action && (
        <p className="text-base sm:text-lg italic text-cream/45 leading-relaxed font-light mb-6 max-w-2xl">
          {section.action}
        </p>
      )}

      {section.spokenLines.length > 0 && (
        <div className="space-y-6">
          {section.spokenLines.map((line, i) => (
            <p
              key={i}
              className="text-3xl sm:text-5xl lg:text-[3.5rem] font-medium leading-[1.15] text-cream-soft text-balance"
            >
              {line}
            </p>
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={onToggle}
          className="w-14 h-14 rounded-sm flex items-center justify-center transition-all duration-300 active:scale-95"
          style={{
            backgroundColor: section.completed ? color : 'transparent',
            border: `1.5px solid ${color}${section.completed ? '' : '88'}`,
          }}
          aria-label={section.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {section.completed && (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-fade-in">
              <path d="M5 12.5L9.5 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span className="font-display text-[11px] tracking-[0.3em] text-cream/50">
          {section.completed
            ? 'Complete'
            : isCurrent
            ? 'Up next — tap or press space'
            : 'Tap to mark complete'}
        </span>
      </div>
    </section>
  );
});
