import type { Config } from 'tailwindcss';

// Every colour is a CSS variable (see globals.css) so themes can be swapped at runtime.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        surface2: token('surface2'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        side: token('side'),
        sideInk: token('side-ink'),
        sideActive: token('side-active'),
        sideActiveInk: token('side-active-ink'),
        accent: token('accent'),
        accentInk: token('accent-ink'),
        accentSoft: token('accent-soft'),
        accent2: token('accent2'),
        good: token('good'),
        warn: token('warn'),
        bad: token('bad'),
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.04), 0 10px 30px -14px rgba(0,0,0,.14)',
        pop: '0 20px 50px -12px rgba(0,0,0,.35)',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-up': 'fade-up .35s ease both',
        'fade-in': 'fade-in .2s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
