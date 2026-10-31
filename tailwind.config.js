const v = (n) => `rgb(var(--${n}) / <alpha-value>)`
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      colors: {
        bg: v('bg'), surface: v('surface'), text: v('text'), muted: v('muted'),
        border: v('border'), soft: v('soft'),
        primary: v('primary'), secondary: v('secondary'), accent: v('accent'),
      },
      boxShadow: { card: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px rgb(15 23 42 / 0.06)' },
    },
  },
  plugins: [],
}
