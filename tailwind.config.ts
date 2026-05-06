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
        ink: {
          0: '#000000',
          1: '#151515',
          2: '#212121',
          3: '#2a2a2a',
        },
        gold: {
          DEFAULT: '#B68039',
          high: '#E4AF7A',
          deep: '#543C1C',
        },
        cream: {
          DEFAULT: '#FFD69C',
          soft: '#FFE8C7',
          alt: '#F5E5D7',
          light: '#FCE8D4',
        },
        section: {
          visual: '#A78BFA',
          verbal: '#0891B2',
          body: '#059669',
          cta: '#DC2626',
        },
        status: {
          draft: '#6B7280',
          ready: '#B68039',
          shooting: '#2563EB',
          recorded: '#A78BFA',
          edited: '#0891B2',
          live: '#059669',
          winner: '#16A34A',
          killed: '#C24040',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'Anton', 'Oswald', 'Arial Narrow', 'sans-serif'],
        sans: ['var(--font-montserrat)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(182,128,57,0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
