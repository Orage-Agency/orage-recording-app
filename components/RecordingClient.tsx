'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Script, ScriptSection, Status, SectionType } from '@/lib/types';
import StatusSelect from './StatusSelect';
import SectionBlock, { newSection } from './SectionBlock';
import ShotDirectionsPanel from './ShotDirectionsPanel';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface Props {
  initial: Script;
  nextScriptId: string | null;
}

export default function RecordingClient({ initial, nextScriptId }: Props) {
  const router = useRouter();
  const [script, setScript] = useState<Script>(initial);
  const [mode, setMode] = useState<'READ' | 'EDIT'>('READ');
  const [save, setSave] = useState<SaveState>('idle');

  const persist = useCallback(async (next: Script) => {
    setSave('saving');
    try {
      const res = await fetch(`/api/scripts/${next.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error('save failed');
      setSave('saved');
      setTimeout(() => setSave('idle'), 1500);
    } catch {
      setSave('error');
    }
  }, []);

  const update = useCallback(
    (patch: Partial<Script>, commit = false) => {
      setScript((prev) => {
        const next = { ...prev, ...patch };
        if (commit) {
          // fire and forget
          persist(next);
        }
        return next;
      });
    },
    [persist]
  );

  const commit = useCallback(() => {
    setScript((curr) => {
      persist(curr);
      return curr;
    });
  }, [persist]);

  const updateSection = (idx: number, next: ScriptSection) => {
    setScript((prev) => {
      const sections = [...prev.sections];
      sections[idx] = next;
      return { ...prev, sections };
    });
  };

  const removeSection = (idx: number) => {
    setScript((prev) => {
      const sections = prev.sections.filter((_, i) => i !== idx);
      return { ...prev, sections };
    });
    setTimeout(commit, 0);
  };

  const addSection = (type: SectionType) => {
    setScript((prev) => ({ ...prev, sections: [...prev.sections, newSection(type)] }));
    setTimeout(commit, 0);
  };

  const completed = script.sections.filter((s) => s.completed).length;
  const total = script.sections.length;

  const markRecorded = async () => {
    const next: Script = {
      ...script,
      status: 'recorded',
      recordedAt: new Date().toISOString(),
    };
    setScript(next);
    await persist(next);
  };

  const goNext = () => {
    if (nextScriptId) {
      router.push(`/script/${nextScriptId}`);
    }
  };

  const setStatus = (status: Status) => {
    const next = { ...script, status };
    setScript(next);
    persist(next);
  };

  const saveLabel = useMemo(() => {
    if (save === 'saving') return 'Saving…';
    if (save === 'saved') return 'Saved';
    if (save === 'error') return 'Save failed';
    return '';
  }, [save]);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-orage-border">
        <div className="flex items-center gap-3 px-3 sm:px-5 py-3 max-w-[1600px] mx-auto">
          <Link
            href="/"
            className="w-11 h-11 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-orage-muted shrink-0"
            aria-label="Back to library"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className="min-w-0 flex-1">
            <div className="text-xs text-orage-muted font-mono">
              Script {String(script.number).padStart(2, '0')}
            </div>
            <h1 className="font-bold text-base sm:text-lg leading-tight truncate">
              {script.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-xs text-orage-muted hidden sm:inline-block min-w-16 text-right">
              {saveLabel}
            </span>

            <div className="inline-flex bg-slate-100 rounded-lg p-1 text-sm font-semibold">
              <button
                onClick={() => setMode('READ')}
                className={`px-3 py-1.5 rounded-md min-touch transition-colors ${
                  mode === 'READ' ? 'bg-white text-orage-text shadow-sm' : 'text-orage-muted'
                }`}
              >
                Read
              </button>
              <button
                onClick={() => setMode('EDIT')}
                className={`px-3 py-1.5 rounded-md min-touch transition-colors ${
                  mode === 'EDIT' ? 'bg-white text-orage-text shadow-sm' : 'text-orage-muted'
                }`}
              >
                Edit
              </button>
            </div>

            <StatusSelect value={script.status} onChange={setStatus} />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        <main className="flex-1 px-3 sm:px-6 py-5 pb-32 space-y-4">
          {mode === 'EDIT' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              <strong>Edit mode</strong> — changes auto-save when you tap away from a field.
            </div>
          )}

          {script.sections.map((section, idx) => (
            <SectionBlock
              key={section.id}
              section={section}
              mode={mode}
              onChange={(next) => updateSection(idx, next)}
              onCommit={commit}
              onRemove={() => removeSection(idx)}
            />
          ))}

          {mode === 'EDIT' && (
            <div className="rounded-2xl border-2 border-dashed border-orage-border p-5 text-center">
              <div className="text-sm text-orage-muted mb-3">Add section</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {(['VISUAL_HOOK', 'VERBAL_HOOK', 'BODY', 'CTA'] as SectionType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => addSection(t)}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold min-touch"
                  >
                    + {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'EDIT' && (
            <div className="rounded-2xl bg-white border border-orage-border p-5 space-y-3">
              <div className="text-xs uppercase tracking-wider text-orage-muted font-semibold">
                Notes
              </div>
              <textarea
                value={script.notes}
                onChange={(e) => update({ notes: e.target.value })}
                onBlur={commit}
                placeholder="Free-form notes for this script..."
                className="w-full min-h-[100px] bg-slate-50 border border-orage-border rounded-lg px-3 py-2 text-sm focus:border-orage-accent outline-none resize-y"
              />
            </div>
          )}
        </main>

        <ShotDirectionsPanel
          directions={script.shotDirections}
          setup={script.setup}
          energy={script.energy}
          format={script.format}
          length={script.length}
          editing={mode === 'EDIT'}
          onChange={(next) => update({ shotDirections: next })}
          onCommit={commit}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-orage-border">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-3 flex items-center gap-3">
          <button
            onClick={markRecorded}
            disabled={script.status === 'recorded'}
            className="flex-1 sm:flex-none bg-orage-primary text-white font-bold px-5 py-3 rounded-xl shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed min-touch"
          >
            {script.status === 'recorded' ? '✓ Recorded' : '● Mark Recorded'}
          </button>

          <div className="flex-1 text-center text-sm">
            <span className="text-orage-muted">Sections complete</span>{' '}
            <span className="font-bold text-orage-text">
              {completed}/{total}
            </span>
          </div>

          <button
            onClick={goNext}
            disabled={!nextScriptId}
            className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-orage-text font-bold px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed min-touch"
          >
            Next ↓
          </button>
        </div>
      </div>
    </>
  );
}
