import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* Tons Claros - Fundo Mistura de Branco */
        white:   '#FFFFFF',
        cream:   '#F8FAF7',
        light:   '#EBF0ED',
        mint:    '#F2F7F4', // Fundo bem sutil esverdeado

        /* Textos e contrastes (Preto e Verde Escuro) */
        ink:     '#050B08', // Quase preto para textos principais
        dark:    '#111C16', // Cinza/Verde muito escuro
        muted:   '#4A5E54', // Verde/Cinza para texto secundário
        soft:    '#829A8F', // Placeholder/desabilitado

        /* Tons Diferentes de Verde */
        forest: {
          DEFAULT: '#164230', // Verde floresta profundo
          deep:    '#0A261A',
          card:    '#20543D',
          surface: '#DDF0E6',
          sage:    '#8EAFA0',
        },
        emerald: {
          accent: '#10B981',
          light:  '#34D399',
          glow:   '#059669',
        },

        /* Dourado (Cor Terciária) */
        gold: {
          DEFAULT: '#C9A96E', // Dourado suave/premium
          light:   '#EAD7A1',
          deep:    '#A88645',
          glow:    '#D4AF37',
        },
        amber:   '#D4874A',

        /* Legacy compat */
        void:    '#FFFFFF', // Fundo principal agora é branco
        deep:    '#F8FAF7', 
        primary: '#0A261A',
        accent:  '#C9A96E',
        paper:   '#FFFFFF',
        highlight: '#C9A96E',
        sand:    '#EBF0ED',
      },

      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
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
        soft:      '0 2px 8px rgba(10, 38, 26, 0.05)',
        card:      '0 12px 32px rgba(10, 38, 26, 0.08), 0 2px 8px rgba(10, 38, 26, 0.03)',
        luxury:    '0 24px 64px rgba(10, 38, 26, 0.12), 0 8px 24px rgba(201, 169, 110, 0.15)',
        glow:      '0 0 30px rgba(201, 169, 110, 0.3)',
        'white-card': '0 12px 36px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.02)',
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
          '0%,100%': { boxShadow: '0 0 15px rgba(201,169,110,.3)' },
          '50%':     { boxShadow: '0 0 35px rgba(201,169,110,.6)' },
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
