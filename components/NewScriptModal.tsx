'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Format, Wedge } from '@/lib/types';
import { ALL_FORMATS, ALL_WEDGES, FORMAT_LABEL, WEDGE_LABEL } from '@/lib/constants';
import Modal from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewScriptModal({ open, onClose }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<Format>('BEHIND_DESK');
  const [wedge, setWedge] = useState<Wedge>('AUTOMATION');
  const [length, setLength] = useState('20 sec');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTitle('');
    setFormat('BEHIND_DESK');
    setWedge('AUTOMATION');
    setLength('20 sec');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          format,
          wedge,
          length,
          source: 'GEORGE',
          status: 'draft',
          recommended: false,
          energy: '',
          setup: '',
          shotDirections: [],
          sections: [
            { id: `s-${Date.now()}-vh`, type: 'VERBAL_HOOK', timecode: '0:00–0:05', action: '', spokenLines: [''], completed: false },
            { id: `s-${Date.now() + 1}-bd`, type: 'BODY', timecode: '0:05–0:18', action: '', spokenLines: [''], completed: false },
            { id: `s-${Date.now() + 2}-cta`, type: 'CTA', timecode: '0:18–0:22', action: '', spokenLines: [''], completed: false },
          ],
          notes: '',
        }),
      });
      if (!res.ok) throw new Error('create failed');
      const created = await res.json();
      reset();
      onClose();
      // Land directly in EDIT mode for the new script
      router.push(`/script/${created.id}?edit=1`);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="New script"
      title="What's the working title?"
      footer={
        <>
          <button
            onClick={onClose}
            className="font-display text-[11px] tracking-[0.25em] text-cream/60 hover:text-cream-soft px-4 py-2 min-touch"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="new-script-form"
            disabled={!title.trim() || submitting}
            className="font-display text-sm tracking-[0.2em] bg-gold text-black hover:bg-gold-high disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-sm min-touch transition-colors"
          >
            {submitting ? 'Creating…' : 'Create & Edit'}
          </button>
        </>
      }
    >
      <form id="new-script-form" onSubmit={submit} className="space-y-5">
        <div>
          <label className="eyebrow block mb-2">Title</label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The 3am Founder"
            className="w-full bg-black/30 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-3 py-3 text-base text-cream-soft placeholder:text-cream/30 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Format">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="w-full bg-black/30 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-3 py-2.5 text-sm text-cream-soft outline-none"
            >
              {ALL_FORMATS.map((f) => (
                <option key={f} value={f} className="bg-ink-2">
                  {FORMAT_LABEL[f]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Wedge">
            <select
              value={wedge}
              onChange={(e) => setWedge(e.target.value as Wedge)}
              className="w-full bg-black/30 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-3 py-2.5 text-sm text-cream-soft outline-none"
            >
              {ALL_WEDGES.map((w) => (
                <option key={w} value={w} className="bg-ink-2">
                  {WEDGE_LABEL[w]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Estimated length">
          <input
            type="text"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="20 sec"
            className="w-full bg-black/30 border border-[color:var(--border-subtle)] focus:border-gold rounded-sm px-3 py-2.5 text-sm text-cream-soft placeholder:text-cream/30 outline-none"
          />
        </Field>

        <p className="text-xs text-cream/50 leading-relaxed">
          We&rsquo;ll create a draft with starter sections and drop you straight into Edit mode.
        </p>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      {children}
    </div>
  );
}
