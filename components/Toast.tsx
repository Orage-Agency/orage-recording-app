'use client';

import { useEffect, useState } from 'react';

export type ToastTone = 'info' | 'success' | 'error';

interface ToastProps {
  message: string;
  tone?: ToastTone;
  shownAt?: number;
}

export default function Toast({ message, tone = 'info', shownAt }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    setClosing(false);
    const closeT = setTimeout(() => setClosing(true), 1800);
    const hideT = setTimeout(() => setVisible(false), 2100);
    return () => {
      clearTimeout(closeT);
      clearTimeout(hideT);
    };
  }, [message, shownAt]);

  if (!visible) return null;

  const styles =
    tone === 'success'
      ? 'bg-gold text-black border-gold'
      : tone === 'error'
      ? 'bg-red-600/90 text-white border-red-500'
      : 'bg-ink-2 text-cream-soft border-[color:var(--border)]';

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-sm border font-display text-[11px] tracking-[0.3em] shadow-2xl ${styles} ${
        closing ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      {message}
    </div>
  );
}
