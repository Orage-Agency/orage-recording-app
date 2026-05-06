export const BRAND = {
  name: 'ORAGE',
  tagline: 'AI for OKC founders',

  colors: {
    primary: '#0F172A',
    accent: '#2563EB',
    background: '#FFFFFF',
    text: '#0F172A',

    visualHook: '#7C3AED',
    verbalHook: '#0891B2',
    body: '#059669',
    cta: '#DC2626',

    statusDraft: '#6B7280',
    statusReady: '#D97706',
    statusShooting: '#2563EB',
    statusRecorded: '#7C3AED',
    statusEdited: '#0891B2',
    statusLive: '#059669',
    statusWinner: '#16A34A',
    statusKilled: '#DC2626',
  },

  fonts: {
    display: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
  },

  logo: {
    text: 'ORAGE',
    src: null as string | null,
  },
};

export const SECTION_COLOR: Record<string, string> = {
  VISUAL_HOOK: BRAND.colors.visualHook,
  VERBAL_HOOK: BRAND.colors.verbalHook,
  BODY: BRAND.colors.body,
  CTA: BRAND.colors.cta,
};

export const SECTION_LABEL: Record<string, string> = {
  VISUAL_HOOK: 'VISUAL HOOK',
  VERBAL_HOOK: 'VERBAL HOOK',
  BODY: 'BODY',
  CTA: 'CTA',
};

export const STATUS_COLOR: Record<string, string> = {
  draft: BRAND.colors.statusDraft,
  ready_to_shoot: BRAND.colors.statusReady,
  shooting: BRAND.colors.statusShooting,
  recorded: BRAND.colors.statusRecorded,
  edited: BRAND.colors.statusEdited,
  live: BRAND.colors.statusLive,
  winner: BRAND.colors.statusWinner,
  killed: BRAND.colors.statusKilled,
};

export const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  ready_to_shoot: 'Ready to shoot',
  shooting: 'Shooting',
  recorded: 'Recorded',
  edited: 'Edited',
  live: 'Live',
  winner: 'Winner',
  killed: 'Killed',
};
