import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--brand-primary) / <alpha-value>)',
        accent: 'rgb(var(--brand-accent) / <alpha-value>)',
        light: 'rgb(var(--brand-light) / <alpha-value>)',
        ink: 'rgb(var(--brand-ink) / <alpha-value>)',
        paper: 'rgb(var(--brand-paper) / <alpha-value>)',
        highlight: 'rgb(var(--brand-highlight) / <alpha-value>)',
        sand: 'rgb(var(--brand-sand) / <alpha-value>)',
        gold: '#C8AD7F',
        cream: '#FAF8F5',
        olive: {
          50: '#F3F6F3',
          100: '#E4EDE4',
          500: '#384B39',
          700: '#253326',
          900: '#151D16',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 16px 45px rgba(18, 19, 22, 0.06)',
        luxury: '0 25px 60px -15px rgba(18, 19, 22, 0.12)',
        glow: '0 0 35px rgba(200, 173, 127, 0.25)',
        'olive-glow': '0 0 35px rgba(56, 75, 57, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-up': 'scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 30s linear infinite',
        'ping-slow': 'pingSlow 3s ease-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pingSlow: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
