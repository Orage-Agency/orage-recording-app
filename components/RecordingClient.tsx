'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Script, ScriptSection, Status, SectionType } from '@/lib/types';
import StatusSelect from './StatusSelect';
import SectionBlock, { newSection } from './SectionBlock';
import ShotDirectionsPanel from './ShotDirectionsPanel';
import Toast from './Toast';

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
  const [toast, setToast] = useState<{ msg: string; tone: 'success' | 'info' | 'error'; at: number } | null>(null);
  const [recordedHighlight, setRecordedHighlight] = useState(false);

  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  sectionRefs.current = script.sections.map((_, i) => sectionRefs.current[i] ?? null);

  const persist = useCallback(async (next: Script, opts?: { silent?: boolean }) => {
    setSave('saving');
    try {
      const res = await fetch(`/api/scripts/${next.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error('save failed');
      setSave('saved');
      if (!opts?.silent) setToast({ msg: 'Saved', tone: 'info', at: Date.now() });
      setTimeout(() => setSave('idle'), 1500);
    } catch {
      setSave('error');
      setToast({ msg: 'Save failed', tone: 'error', at: Date.now() });
    }
  }, []);

  const update = useCallback(
    (patch: Partial<Script>, commit = false) => {
      setScript((prev) => {
        const next = { ...prev, ...patch };
        if (commit) persist(next);
        return next;
      });
    },
    [persist]
  );

  const commit = useCallback(() => {
    setScript((curr) => {
      persist(curr, { silent: true });
      return curr;
    });
  }, [persist]);

  const total = script.sections.length;
  const completed = script.sections.filter((s) => s.completed).length;
  const allComplete = total > 0 && completed === total;
  const progressPct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const firstPendingIdx = script.sections.findIndex((s) => !s.completed);
  const currentIdx = firstPendingIdx === -1 ? script.sections.length - 1 : firstPendingIdx;

  const updateSection = (idx: number, next: ScriptSection) => {
    setScript((prev) => {
      const sections = [...prev.sections];
      sections[idx] = next;
      return { ...prev, sections };
    });
  };

  const toggleSection = (idx: number) => {
    let willComplete = false;
    setScript((prev) => {
      const sections = [...prev.sections];
      const wasCompleted = sections[idx].completed;
      sections[idx] = { ...sections[idx], completed: !wasCompleted };
      willComplete = !wasCompleted;
      const next = { ...prev, sections };
      persist(next, { silent: true });
      return next;
    });
    if (willComplete && mode === 'READ') {
      setTimeout(() => {
        const nextIdx = idx + 1;
        const target = sectionRefs.current[nextIdx];
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 280);
    }
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

  const markRecorded = async () => {
    const next: Script = {
      ...script,
      status: 'recorded',
      recordedAt: new Date().toISOString(),
    };
    setScript(next);
    setRecordedHighlight(true);
    await persist(next, { silent: true });
    setToast({ msg: '✓ Recorded', tone: 'success', at: Date.now() });
    setTimeout(() => setRecordedHighlight(false), 1400);
  };

  const goNext = () => {
    if (nextScriptId) router.push(`/script/${nextScriptId}`);
  };

  const goBack = () => router.push('/');

  const setStatus = (status: Status) => {
    const next = { ...script, status };
    setScript(next);
    persist(next, { silent: true });
    setToast({ msg: status.replace('_', ' ').toUpperCase(), tone: 'info', at: Date.now() });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      if (mode !== 'READ') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (firstPendingIdx !== -1) {
          toggleSection(firstPendingIdx);
        } else if (script.status !== 'recorded') {
          markRecorded();
        }
      } else if (e.key === 'ArrowRight' && nextScriptId) {
        e.preventDefault();
        goNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, firstPendingIdx, script.id, nextScriptId, script.status]);

  const saveLabel = useMemo(() => {
    if (save === 'saving') return 'Saving';
    if (save === 'saved') return 'Saved';
    if (save === 'error') return 'Error';
    return '';
  }, [save]);

  return (
    <>
      <header className="sticky top-0 z-30 bg-black/85 backdrop-blur border-b border-[color:var(--border-subtle)]">
        <div className="flex items-center gap-3 px-3 sm:px-6 py-3 max-w-[1600px] mx-auto">
          <Link
            href="/"
            className="w-11 h-11 inline-flex items-center justify-center rounded-sm hover:bg-ink-2 text-gold shrink-0"
            aria-label="Back to library"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-display text-[10px] tracking-[0.3em] text-gold">
              <span>Script {String(script.number).padStart(2, '0')}</span>
              <span className="w-1 h-1 rounded-full bg-gold/40" />
              <span className="text-cream/40 tabular-nums">{completed}/{total}</span>
              {saveLabel && (
                <>
                  <span className="w-1 h-1 rounded-full bg-cream/30" />
                  <span className="text-cream/40">{saveLabel}</span>
                </>
              )}
            </div>
            <h1 className="font-display text-base sm:text-xl tracking-[0.06em] leading-tight text-cream-soft truncate">
              {script.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex bg-ink-2 border border-[color:var(--border-subtle)] rounded-sm p-0.5 font-display text-xs tracking-[0.2em]">
              <button
                onClick={() => setMode('READ')}
                className={`px-3 py-1.5 rounded-sm min-touch transition-colors ${
                  mode === 'READ' ? 'bg-gold text-black' : 'text-cream/70 hover:text-cream-soft'
                }`}
              >
                Read
              </button>
              <button
                onClick={() => setMode('EDIT')}
                className={`px-3 py-1.5 rounded-sm min-touch transition-colors ${
                  mode === 'EDIT' ? 'bg-gold text-black' : 'text-cream/70 hover:text-cream-soft'
                }`}
              >
                Edit
              </button>
            </div>

            <StatusSelect value={script.status} onChange={setStatus} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] w-full bg-black/60 relative">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-high transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto animate-fade-in">
        <main className="flex-1 px-3 sm:px-6 py-6 pb-32 space-y-4">
          {mode === 'EDIT' && (
            <div className="bg-gold/10 border-l-4 border-gold rounded-sm px-4 py-3 font-display text-xs tracking-[0.2em] text-gold-high">
              Edit mode — changes auto-save when you tap away
            </div>
          )}

          {script.sections.map((section, idx) => (
            <SectionBlock
              key={section.id}
              ref={(el) => {
                sectionRefs.current[idx] = el;
              }}
              section={section}
              index={idx}
              isCurrent={mode === 'READ' && idx === currentIdx && !allComplete}
              mode={mode}
              onChange={(next) => updateSection(idx, next)}
              onCommit={commit}
              onRemove={() => removeSection(idx)}
            />
          ))}

          {allComplete && mode === 'READ' && (
            <div className="rounded-sm bg-gold/8 border border-gold/40 p-6 text-center animate-rise">
              <div className="eyebrow mb-2">All sections complete</div>
              <p className="font-display text-2xl tracking-[0.08em] text-gold-high mb-1">
                Ready to record
              </p>
              <p className="text-sm text-cream/60 font-light">
                Mark this script recorded below, or press <kbd className="font-mono px-1.5 py-0.5 rounded-sm bg-black/40 border border-[color:var(--border-subtle)] text-cream/70">Space</kbd>
              </p>
            </div>
          )}

          {mode === 'EDIT' && (
            <div className="rounded-sm border border-dashed border-[color:var(--border)] p-5 text-center">
              <div className="eyebrow mb-3">Add section</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {(['VISUAL_HOOK', 'VERBAL_HOOK', 'BODY', 'CTA'] as SectionType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => addSection(t)}
                    className="font-display text-[11px] tracking-[0.2em] px-3 py-2 rounded-sm bg-ink-2 hover:bg-ink-3 border border-[color:var(--border-subtle)] hover:border-[color:var(--border)] text-cream-soft min-touch"
                  >
                    + {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'EDIT' && (
            <div className="rounded-sm bg-ink-2 border border-[color:var(--border-subtle)] p-5 space-y-3">
              <div className="eyebrow">Notes</div>
              <textarea
                value={script.notes}
                onChange={(e) => update({ notes: e.target.value })}
                onBlur={commit}
                placeholder="Free-form notes for this script..."
                className="w-full min-h-[100px] bg-black/30 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-3 py-2 text-sm outline-none resize-y text-cream-soft"
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

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur border-t border-[color:var(--border-subtle)]">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={markRecorded}
            disabled={script.status === 'recorded'}
            className={`flex-1 sm:flex-none font-display text-sm tracking-[0.2em] bg-gold text-black px-5 py-3 rounded-sm hover:bg-gold-high disabled:opacity-40 disabled:cursor-not-allowed min-touch transition-all ${
              allComplete && script.status !== 'recorded' ? 'animate-pulse-gold' : ''
            }`}
          >
            {script.status === 'recorded' ? '✓ Recorded' : '● Mark Recorded'}
          </button>

          <div className="flex-1 text-center font-display text-xs tracking-[0.2em]">
            <span className="text-cream/50">Sections </span>
            <span className="text-gold-high tabular-nums">
              {completed}/{total}
            </span>
          </div>

          <button
            onClick={goNext}
            disabled={!nextScriptId}
            className={`flex-1 sm:flex-none font-display text-sm tracking-[0.2em] bg-ink-2 border border-[color:var(--border)] text-cream-soft px-5 py-3 rounded-sm hover:border-gold hover:text-gold-high disabled:opacity-40 disabled:cursor-not-allowed min-touch transition-all ${
              recordedHighlight ? 'animate-glow-once border-gold text-gold-high' : ''
            }`}
          >
            Next ↓
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.msg} tone={toast.tone} shownAt={toast.at} />}
    </>
  );
}
