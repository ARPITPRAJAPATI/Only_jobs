import type { Config } from 'tailwindcss';

// Every colour is a CSS variable (see globals.css) so themes can be swapped at runtime.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ['class', '[data-theme="midnight"]'],
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
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        xs: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        card: '0 1px 2px rgba(0,0,0,.04), 0 6px 16px -8px rgba(0,0,0,.08)',
        pop: '0 20px 50px -12px rgba(0,0,0,.25)',
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
