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
        light ? 'text-white' : 'text-primary'
      }`}
    >
      {/* Símbolo Nezzo: Ícone geométrico do olho com traços orgânicos */}
      <div
        className={`relative flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 ${
          compact ? 'h-9 w-9' : 'h-11 w-11'
        } ${light ? 'bg-white/10 text-highlight' : 'bg-light text-primary'}`}
      >
        <svg
          viewBox="0 0 100 60"
          className={compact ? 'h-6 w-7' : 'h-7 w-8'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Contorno do olho estilizado Nezzo */}
          <path
            d="M5 30C18 12 40 5 50 5C60 5 82 12 95 30C82 48 60 55 50 55C40 55 18 48 5 30Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Círculo central (íris / pupila) */}
          <circle cx="50" cy="30" r="14" fill="currentColor" />
          <circle
            cx="46"
            cy="26"
            r="4"
            fill={light ? '#121316' : '#FBF9F4'}
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-semibold tracking-[-0.03em] leading-tight ${
            compact ? 'text-lg' : 'text-xl'
          } ${light ? 'text-white' : 'text-primary'}`}
        >
          ÓTICA <span className="font-extrabold tracking-tight">NEZZO</span>
        </span>
        {showTagline && !compact && (
          <span
            className={`text-[8.5px] font-medium tracking-[0.14em] uppercase ${
              light ? 'text-highlight/85' : 'text-accent'
            }`}
          >
            Sua visão com personalidade
          </span>
        )}
      </div>
    </Link>
  );
}
