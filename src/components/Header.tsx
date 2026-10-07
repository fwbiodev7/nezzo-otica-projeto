'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, MessageCircle, X, Sparkles, Shield } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

const nav = [
  ['Início', '/'],
  ['Catálogo', '/catalogo'],
  ['Visagista IA', '/visagismo'],
  ['Sobre', '/sobre'],
  ['Contato', '/contato'],
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  return (
    <header
      className="site-header sticky top-0 z-50 transition-all duration-500"
      style={{
        boxShadow: scrolled ? '0 4px 20px rgba(10,38,26,0.06)' : 'none',
      }}
    >
      {/* Announcement bar */}
      <div className="announcement">
        <span className="truncate text-2xs font-bold tracking-[0.14em] uppercase text-white flex items-center gap-2">
          <Sparkles size={11} className="text-gold" />
          {siteConfig.announcement}
        </span>
        <a
          href={siteConfig.contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-2xs text-gold hover:text-white"
        >
          {siteConfig.contact.instagramLabel} <ArrowUpRight size={11} />
        </a>
      </div>

      <div className="container-wide flex h-[76px] items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Ótica Nezzo — Início">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-forest/20 bg-forest text-white shadow-sm transition-all group-hover:scale-105 group-hover:bg-ink">
            <svg viewBox="0 0 100 60" className="h-6 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 30C18 12 40 5 50 5C60 5 82 12 95 30C82 48 60 55 50 55C40 55 18 48 5 30Z"
                stroke="#C9A96E"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="30" r="13" fill="#C9A96E" />
              <circle cx="47" cy="26" r="4" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span
              className="text-base font-bold leading-none tracking-[0.1em] text-ink uppercase flex items-center gap-1.5"
            >
              ÓTICA <span className="text-forest font-extrabold">NEZZO</span>
            </span>
            <span className="text-2xs tracking-[0.15em] text-muted mt-0.5 uppercase">Varginha · MG</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? 'page' : undefined}
              className="nav-link"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl('Olá! Vim pelo site da Ótica Nezzo e gostaria de atendimento.')}
            target="_blank"
            rel="noopener noreferrer"
            id="header-whatsapp"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-2xs font-bold uppercase tracking-[0.1em] text-white transition-all hover:scale-105 hover:bg-ink hover:shadow-sm"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>

          <Link
            href="/admin"
            aria-label="Acesso Admin"
            className="hidden sm:flex h-[38px] w-[38px] items-center justify-center rounded-full border border-forest/10 bg-mint text-forest transition hover:bg-forest hover:text-white"
          >
            <Shield size={16} />
          </Link>

          <button
            ref={toggle}
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-forest/10 bg-mint p-2.5 text-forest lg:hidden transition hover:bg-forest hover:text-white"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Navegação móvel"
          className="absolute left-0 right-0 border-b border-forest/10 bg-white/95 p-6 shadow-lg backdrop-blur-xl lg:hidden animate-fade-in"
        >
          <div className="flex flex-col divide-y divide-forest/10">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-sm font-semibold text-ink transition hover:text-forest"
              >
                <span>{label}</span>
                <ArrowUpRight size={16} className="text-gold" />
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-forest/10">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark w-full justify-center text-xs"
            >
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
