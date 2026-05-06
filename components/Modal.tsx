'use client';

import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ open, onClose, title, eyebrow, children, footer, size = 'md' }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        ref={dialogRef}
        className={`relative w-full ${widthClass} mx-0 sm:mx-4 bg-ink-2 border border-[color:var(--border)] rounded-t-md sm:rounded-sm shadow-2xl animate-rise max-h-[90vh] overflow-y-auto`}
      >
        <header className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-3 border-b border-[color:var(--border-subtle)]">
          <div>
            {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
            <h2 className="font-display text-2xl tracking-[0.06em] text-cream-soft leading-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-sm hover:bg-ink-3 text-cream/60 hover:text-cream-soft min-touch"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="px-5 sm:px-6 py-5">{children}</div>

        {footer && (
          <footer className="px-5 sm:px-6 py-4 border-t border-[color:var(--border-subtle)] flex items-center justify-end gap-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
