import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* Obsidiana system */
        void:    '#080808',
        deep:    '#111113',
        dark:    '#1A1A1E',
        mid:     '#242428',
        muted:   '#5A5A62',
        soft:    '#A8A8B3',
        light:   '#F0EDE8',
        cream:   '#FAF8F4',

        /* Dourado Líquido */
        gold: {
          DEFAULT: '#C9A96E',
          light:   '#DEC28F',
          deep:    '#9E7D45',
        },
        amber:   '#D4874A',
        rose:    '#E8C5A0',

        /* Legacy compat */
        primary:   '#080808',
        accent:    '#C9A96E',
        paper:     '#FAF8F4',
        ink:       '#1A1A1E',
        highlight: '#C9A96E',
        sand:      '#242428',
      },

      fontFamily: {
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },

      fontSize: {
        '2xs': ['9px',  { lineHeight: '1.4', letterSpacing: '0.1em' }],
        xs:    ['11px', { lineHeight: '1.5' }],
        sm:    ['13px', { lineHeight: '1.55' }],
        base:  ['15px', { lineHeight: '1.6' }],
        lg:    ['17px', { lineHeight: '1.55' }],
        xl:    ['20px', { lineHeight: '1.45' }],
        '2xl': ['24px', { lineHeight: '1.35' }],
      },

      boxShadow: {
        soft:    '0 1px 3px rgba(0,0,0,.3), 0 1px 2px rgba(0,0,0,.2)',
        card:    '0 8px 24px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.3)',
        luxury:  '0 24px 64px rgba(0,0,0,.5), 0 8px 24px rgba(0,0,0,.3)',
        glow:    '0 0 40px rgba(201,169,110,.2), 0 4px 16px rgba(201,169,110,.12)',
        'glow-lg':'0 0 80px rgba(201,169,110,.3), 0 16px 48px rgba(201,169,110,.15)',
      },

      animation: {
        'fade-in':        'fade-in .5s cubic-bezier(.16,1,.3,1) both',
        'fade-up':        'fade-up .7s cubic-bezier(.16,1,.3,1) both',
        'scale-up':       'scale-up .4s cubic-bezier(.16,1,.3,1) both',
        'slide-in-right': 'slide-in-right .6s cubic-bezier(.16,1,.3,1) both',
        'float':          'float 6s ease-in-out infinite',
        'pulse-subtle':   'pulse-subtle 3s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s infinite linear',
        'spin-slow':      'spin 30s linear infinite',
        'glow-pulse':     'glow-pulse 3s ease-in-out infinite',
        'ticker':         'ticker-move 35s linear infinite',
      },

      keyframes: {
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up':  {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-up': {
          from: { opacity: '0', transform: 'scale(.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '.6' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%,100%': { boxShadow: '0 0 20px rgba(201,169,110,.2)' },
          '50%':     { boxShadow: '0 0 50px rgba(201,169,110,.45)' },
        },
        'ticker-move': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      backdropBlur: {
        xs: '2px',
      },

      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
};
export default config;
