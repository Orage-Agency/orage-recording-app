'use client';

import { useState } from 'react';
import type { HookFormula, Wedge } from '@/lib/types';
import Modal from './Modal';
import HookComposer from './HookComposer';

interface Props {
  open: boolean;
  onClose: () => void;
  scriptId: string;
  scriptTitle: string;
  currentNotes: string;
  onNoteAppended: (newNotes: string) => void;
  onHookCreated?: () => void;
}

type Tab = 'hook' | 'note';

export default function CaptureSheet({
  open,
  onClose,
  scriptId,
  scriptTitle,
  currentNotes,
  onNoteAppended,
  onHookCreated,
}: Props) {
  const [tab, setTab] = useState<Tab>('hook');
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const close = () => {
    setNoteText('');
    setTab('hook');
    onClose();
  };

  const submitHook = async (data: { text: string; formula: HookFormula; pairsWithWedges: Wedge[] }) => {
    const res = await fetch('/api/hooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    onHookCreated?.();
    close();
  };

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const stamp = new Date().toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const appended = currentNotes
        ? `${currentNotes}\n\n[${stamp}] ${noteText.trim()}`
        : `[${stamp}] ${noteText.trim()}`;
      const res = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: appended }),
      });
      if (!res.ok) throw new Error('save failed');
      onNoteAppended(appended);
      close();
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      eyebrow="Capture"
      title="Drop the thought"
      size="md"
    >
      <div className="space-y-5">
        <div className="inline-flex bg-black/30 border border-[color:var(--border-subtle)] rounded-sm p-0.5 font-display text-xs tracking-[0.2em]">
          <button
            onClick={() => setTab('hook')}
            className={`px-4 py-2 rounded-sm min-touch transition-colors ${
              tab === 'hook' ? 'bg-gold text-black' : 'text-cream/70 hover:text-cream-soft'
            }`}
          >
            Hook
          </button>
          <button
            onClick={() => setTab('note')}
            className={`px-4 py-2 rounded-sm min-touch transition-colors ${
              tab === 'note' ? 'bg-gold text-black' : 'text-cream/70 hover:text-cream-soft'
            }`}
          >
            Note
          </button>
        </div>

        {tab === 'hook' ? (
          <>
            <p className="text-xs text-cream/50">
              Saves to the Hook Bank — pick the formula and which wedges it pairs with.
            </p>
            <HookComposer
              onSubmit={submitHook}
              onCancel={close}
              submitLabel="Add to Hook Bank"
            />
          </>
        ) : (
          <form onSubmit={submitNote} className="space-y-4">
            <p className="text-xs text-cream/50">
              Pinned to <span className="text-cream/80">&ldquo;{scriptTitle}&rdquo;</span> with a timestamp.
            </p>
            <textarea
              autoFocus
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="What just hit you?"
              rows={5}
              className="w-full bg-black/30 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-3 py-3 text-base text-cream-soft placeholder:text-cream/30 outline-none resize-y"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={close}
                className="font-display text-[11px] tracking-[0.25em] text-cream/60 hover:text-cream-soft px-4 py-2 min-touch"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!noteText.trim() || savingNote}
                className="font-display text-sm tracking-[0.2em] bg-gold text-black hover:bg-gold-high disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-sm min-touch transition-colors"
              >
                {savingNote ? 'Saving…' : 'Save note'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
