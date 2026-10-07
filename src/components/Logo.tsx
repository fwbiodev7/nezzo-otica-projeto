import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export function Logo({
  light = false,
  compact = false,
  showTagline = true,
}: {
  light?: boolean;
  compact?: boolean;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} - Ir para página inicial`}
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${
        light ? 'text-white' : 'text-ink'
      }`}
    >
      {/* Símbolo Nezzo */}
      <div
        className={`relative flex items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 ${
          compact ? 'h-9 w-9' : 'h-11 w-11'
        } ${light 
          ? 'bg-white/10 border-white/20 text-gold group-hover:bg-white group-hover:text-forest' 
          : 'bg-forest text-white border-forest/20 group-hover:bg-ink group-hover:border-ink'}`}
      >
        <svg
          viewBox="0 0 100 60"
          className={compact ? 'h-5 w-6' : 'h-6 w-7'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 30C18 12 40 5 50 5C60 5 82 12 95 30C82 48 60 55 50 55C40 55 18 48 5 30Z"
            stroke={light ? '#D4AF37' : '#C9A96E'}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="30" r="13" fill={light ? '#D4AF37' : '#C9A96E'} />
          <circle
            cx="47"
            cy="26"
            r="4"
            fill={light ? '#164230' : '#FFFFFF'}
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-bold tracking-[0.1em] leading-none uppercase ${
            compact ? 'text-sm' : 'text-base'
          } ${light ? 'text-white' : 'text-ink'}`}
        >
          ÓTICA <span className={`font-extrabold ${light ? 'text-gold' : 'text-forest'}`}>NEZZO</span>
        </span>
        {showTagline && !compact && (
          <span
            className={`mt-0.5 text-2xs font-semibold tracking-[0.15em] uppercase ${
              light ? 'text-white/60' : 'text-muted'
            }`}
          >
            Sua visão com personalidade
          </span>
        )}
      </div>
    </Link>
  );
}
