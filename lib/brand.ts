export const BRAND = {
  name: 'ORAGE',
  tagline: 'AI for OKC founders',

  colors: {
    bg: '#000000',
    bgSecondary: '#151515',
    bgContainer: '#212121',

    primary: '#B68039',
    highlight: '#E4AF7A',
    deep: '#543C1C',

    text: '#FFD69C',
    textSecondary: '#FFE8C7',

    border: 'rgba(182,128,57,0.25)',
    borderSubtle: 'rgba(182,128,57,0.12)',

    visualHook: '#A78BFA',
    verbalHook: '#0891B2',
    body: '#059669',
    cta: '#DC2626',

    statusDraft: '#6B7280',
    statusReady: '#B68039',
    statusShooting: '#2563EB',
    statusRecorded: '#A78BFA',
    statusEdited: '#0891B2',
    statusLive: '#059669',
    statusWinner: '#16A34A',
    statusKilled: '#C24040',
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
  VISUAL_HOOK: 'Visual Hook',
  VERBAL_HOOK: 'Verbal Hook',
  BODY: 'Body',
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
  ready_to_shoot: 'Ready',
  shooting: 'Shooting',
  recorded: 'Recorded',
  edited: 'Edited',
  live: 'Live',
  winner: 'Winner',
  killed: 'Killed',
};
