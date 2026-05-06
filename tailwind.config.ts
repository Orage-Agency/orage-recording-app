import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orage: {
          primary: '#0F172A',
          accent: '#2563EB',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          text: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
        section: {
          visual: '#7C3AED',
          verbal: '#0891B2',
          body: '#059669',
          cta: '#DC2626',
        },
        status: {
          draft: '#6B7280',
          ready: '#D97706',
          shooting: '#2563EB',
          recorded: '#7C3AED',
          edited: '#0891B2',
          live: '#059669',
          winner: '#16A34A',
          killed: '#DC2626',
        },
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
