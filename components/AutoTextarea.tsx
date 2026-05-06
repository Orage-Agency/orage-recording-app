'use client';

import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  italic?: boolean;
}

export default function AutoTextarea({ value, onChange, onBlur, placeholder, className, italic }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={1}
      className={`w-full bg-transparent outline-none resize-none border-b border-transparent focus:border-gold transition-colors ${
        italic ? 'italic' : ''
      } ${className ?? ''}`}
    />
  );
}
