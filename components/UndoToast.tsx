'use client';

import { useEffect, useState } from 'react';

export interface UndoToastModel {
  id: string;
  message: string;
  durationMs?: number;
  onUndo: () => void;
  onExpire?: () => void;
}

interface Props {
  toast: UndoToastModel | null;
}

export default function UndoToast({ toast }: Props) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setClosing(false);
    const dur = toast.durationMs ?? 3500;
    const closeT = setTimeout(() => setClosing(true), dur - 200);
    const expireT = setTimeout(() => {
      toast.onExpire?.();
    }, dur);
    return () => {
      clearTimeout(closeT);
      clearTimeout(expireT);
    };
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-sm bg-ink-2 border border-[color:var(--border)] shadow-2xl ${
        closing ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <span className="font-display text-[11px] tracking-[0.3em] text-cream-soft">
        {toast.message}
      </span>
      <button
        onClick={toast.onUndo}
        className="font-display text-[11px] tracking-[0.3em] text-gold hover:text-gold-high px-2 py-1 min-touch"
      >
        Undo
      </button>
    </div>
  );
}
