'use client';

import type { ScriptSection, SectionType } from '@/lib/types';
import { SECTION_COLOR, SECTION_LABEL } from '@/lib/brand';
import AutoTextarea from './AutoTextarea';

interface Props {
  section: ScriptSection;
  mode: 'READ' | 'EDIT';
  onChange: (next: ScriptSection) => void;
  onCommit: () => void;
  onRemove: () => void;
}

export default function SectionBlock({ section, mode, onChange, onCommit, onRemove }: Props) {
  const color = SECTION_COLOR[section.type];
  const dimmed = section.completed && mode === 'READ';

  return (
    <section
      className={`rounded-2xl border-2 bg-white transition-all ${
        dimmed ? 'opacity-50' : ''
      }`}
      style={{ borderColor: color }}
    >
      <header
        className="flex items-center justify-between px-5 py-3 rounded-t-xl text-white"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-bold text-sm tracking-widest uppercase">
            {SECTION_LABEL[section.type]}
          </span>
          {mode === 'EDIT' ? (
            <input
              type="text"
              value={section.timecode}
              onChange={(e) => onChange({ ...section, timecode: e.target.value })}
              onBlur={onCommit}
              className="bg-white/20 placeholder-white/60 px-2 py-1 rounded text-xs font-mono w-32 outline-none focus:bg-white/30"
              placeholder="0:00–0:04"
            />
          ) : (
            <span className="text-xs font-mono opacity-80">{section.timecode}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {mode === 'EDIT' && (
            <button
              onClick={onRemove}
              className="px-2 py-1 rounded text-xs bg-white/20 hover:bg-white/30 min-touch"
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
            className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label={section.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {section.completed ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5L9.5 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span className="w-5 h-5 rounded-md border-2 border-white/80" />
            )}
          </button>
        </div>
      </header>

      <div className="p-5 space-y-3">
        {mode === 'EDIT' ? (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-orage-muted font-semibold mb-1">
                Action / direction
              </div>
              <AutoTextarea
                value={section.action ?? ''}
                onChange={(v) => onChange({ ...section, action: v })}
                onBlur={onCommit}
                placeholder="What's happening visually..."
                italic
                className="text-base text-orage-muted"
              />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-orage-muted font-semibold mb-1">
                Spoken lines
              </div>
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
                      className="text-lg font-semibold text-orage-text"
                    />
                    <button
                      onClick={() => {
                        const next = section.spokenLines.filter((_, j) => j !== i);
                        onChange({ ...section, spokenLines: next });
                        onCommit();
                      }}
                      className="text-red-500 text-lg shrink-0 px-2 min-touch"
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
                  className="text-sm text-orage-accent font-semibold"
                >
                  + Add line
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {section.action && (
              <p className="text-base sm:text-lg italic text-orage-muted leading-relaxed">
                {section.action}
              </p>
            )}
            {section.spokenLines.length > 0 && (
              <div className="space-y-3 pt-1">
                {section.spokenLines.map((line, i) => (
                  <p
                    key={i}
                    className="text-2xl sm:text-3xl font-semibold leading-snug text-balance"
                    style={{ color: 'var(--orage-text)' }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
            {section.spokenLines.length === 0 && !section.action && (
              <p className="text-orage-muted italic">Empty section.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

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
