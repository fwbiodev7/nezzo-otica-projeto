import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return <Link href="/" aria-label={siteConfig.name + ', ir para início'} className={'brand-logo ' + (light ? 'text-white' : 'text-primary')}>
    <svg aria-hidden="true" viewBox="0 0 48 48" className={compact ? 'h-10 w-10' : 'h-12 w-12'} fill="none">
      <path d="M5 24C14 7 34 7 43 24C34 41 14 41 5 24Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M24 2v8M24 38v8M2 10l6 5M40 33l6 5" stroke="currentColor" strokeWidth="2" />
      <circle cx="26" cy="22" r="3" fill="currentColor" />
    </svg>
    <span><span className="block whitespace-nowrap text-[26px] font-semibold leading-none tracking-[-.065em]">{siteConfig.name}<span className={light ? 'text-highlight' : 'text-accent'}>.</span></span><span className="mt-2 block text-[8px] font-medium uppercase tracking-[.32em]">Ótica · um novo olhar</span></span>
  </Link>;
}
