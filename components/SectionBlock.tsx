'use client';

import { forwardRef } from 'react';
import type { ScriptSection, SectionType } from '@/lib/types';
import { SECTION_COLOR, SECTION_LABEL } from '@/lib/brand';
import AutoTextarea from './AutoTextarea';

interface Props {
  section: ScriptSection;
  index: number;
  isCurrent: boolean;
  mode: 'READ' | 'EDIT';
  onChange: (next: ScriptSection) => void;
  onCommit: () => void;
  onRemove: () => void;
}

const SectionBlock = forwardRef<HTMLElement, Props>(function SectionBlock(
  { section, index, isCurrent, mode, onChange, onCommit, onRemove },
  ref
) {
  const color = SECTION_COLOR[section.type];
  const dimmed = section.completed && mode === 'READ';
  const highlighted = isCurrent && !section.completed && mode === 'READ';

  return (
    <section
      ref={ref}
      className={`scroll-mt-32 rounded-sm bg-ink-2 border-l-[3px] transition-all duration-500 ${
        dimmed ? 'opacity-35' : 'opacity-100'
      } ${highlighted ? 'ring-1 ring-gold/40' : ''}`}
      style={{ borderLeftColor: color }}
      aria-current={isCurrent ? 'step' : undefined}
    >
      <header className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--border-subtle)]">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="font-display text-[10px] tracking-[0.3em] text-cream/40 tabular-nums"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="font-display text-xs tracking-[0.3em]"
            style={{ color }}
          >
            {SECTION_LABEL[section.type].toUpperCase()}
          </span>
          {mode === 'EDIT' ? (
            <input
              type="text"
              value={section.timecode}
              onChange={(e) => onChange({ ...section, timecode: e.target.value })}
              onBlur={onCommit}
              className="bg-black/30 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-2 py-1 text-xs font-mono w-28 outline-none text-cream-soft"
              placeholder="0:00–0:04"
            />
          ) : (
            <span className="text-xs font-mono text-cream/45">{section.timecode}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {mode === 'EDIT' && (
            <button
              onClick={onRemove}
              className="px-2 py-1 rounded-sm text-xs bg-black/30 border border-[color:var(--border-subtle)] hover:border-red-500/50 text-cream/70 min-touch"
              aria-label="Remove section"
            >
              −
            </button>
          )}

          <button
            onClick={() => {
              onChange({ ...section, completed: !section.completed });
              onCommit();
            }}
            className="w-11 h-11 rounded-sm flex items-center justify-center transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: section.completed ? color : 'transparent',
              border: `1.5px solid ${color}${section.completed ? '' : '88'}`,
            }}
            aria-label={section.completed ? 'Mark incomplete' : 'Mark complete'}
            aria-pressed={section.completed}
          >
            {section.completed && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-fade-in">
                <path d="M5 12.5L9.5 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="p-5 sm:p-6 space-y-3">
        {mode === 'EDIT' ? (
          <>
            <div>
              <div className="eyebrow mb-2">Action / direction</div>
              <AutoTextarea
                value={section.action ?? ''}
                onChange={(v) => onChange({ ...section, action: v })}
                onBlur={onCommit}
                placeholder="What's happening visually..."
                italic
                className="text-base text-cream/60"
              />
            </div>

            <div>
              <div className="eyebrow mb-2">Spoken lines</div>
              <div className="space-y-2">
                {section.spokenLines.map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AutoTextarea
                      value={line}
                      onChange={(v) => {
                        const next = [...section.spokenLines];
                        next[i] = v;
                        onChange({ ...section, spokenLines: next });
                      }}
                      onBlur={onCommit}
                      placeholder="Spoken line..."
                      className="text-lg font-medium text-cream-soft"
                    />
                    <button
                      onClick={() => {
                        const next = section.spokenLines.filter((_, j) => j !== i);
                        onChange({ ...section, spokenLines: next });
                        onCommit();
                      }}
                      className="text-cream/50 hover:text-red-400 text-lg shrink-0 px-2 min-touch"
                      aria-label="Remove line"
                    >
                      −
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    onChange({ ...section, spokenLines: [...section.spokenLines, ''] });
                    onCommit();
                  }}
                  className="font-display text-[11px] tracking-[0.25em] text-gold hover:text-gold-high mt-2"
                >
                  + Add line
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {section.action && (
              <p className="text-base sm:text-lg italic text-cream/55 leading-relaxed font-light">
                {section.action}
              </p>
            )}
            {section.spokenLines.length > 0 && (
              <div className="space-y-4 pt-2">
                {section.spokenLines.map((line, i) => (
                  <p
                    key={i}
                    className="text-2xl sm:text-3xl lg:text-[2.25rem] font-medium leading-snug text-cream-soft text-balance"
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
            {section.spokenLines.length === 0 && !section.action && (
              <p className="text-cream/40 italic">Empty section.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
});

export default SectionBlock;

export function newSection(type: SectionType): ScriptSection {
  return {
    id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    timecode: '0:00–0:00',
    action: '',
    spokenLines: [],
    completed: false,
  };
}
