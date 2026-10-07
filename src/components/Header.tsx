'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, MessageCircle, X, Eye } from 'lucide-react';
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
        boxShadow: scrolled ? '0 1px 0 rgba(201,169,110,.1), 0 8px 32px rgba(0,0,0,.4)' : 'none',
      }}
    >
      {/* Announcement bar */}
      <div className="announcement">
        <span className="truncate text-2xs font-bold tracking-[0.14em] uppercase text-cream/90">
          {siteConfig.announcement}
        </span>
        <a
          href={siteConfig.contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-2xs"
        >
          {siteConfig.contact.instagramLabel} <ArrowUpRight size={11} />
        </a>
      </div>

      <div className="container-wide flex h-[76px] items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Ótica Nezzo — Início">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold transition-all group-hover:bg-gold group-hover:text-void">
            <Eye size={18} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span
              className="text-base font-semibold leading-none tracking-[0.05em] text-cream uppercase"
              style={{ letterSpacing: '0.1em' }}
            >
              ÓTICA NEZZO
            </span>
            <span className="text-2xs tracking-[0.12em] text-soft mt-0.5">Varginha · MG</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
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
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-2xs font-bold uppercase tracking-[0.1em] text-void transition-all hover:bg-gold-light hover:shadow-glow"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>

          <button
            ref={toggle}
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-white/10 p-2.5 text-light/60 lg:hidden transition hover:bg-white/8 hover:text-cream"
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
          className="absolute left-0 right-0 border-b border-mid bg-dark/95 p-6 shadow-luxury backdrop-blur-xl lg:hidden animate-fade-in"
        >
          <div className="flex flex-col divide-y divide-mid">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-sm font-medium text-light/70 transition hover:text-gold"
              >
                <span>{label}</span>
                <ArrowUpRight size={16} className="text-soft" />
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-mid">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold w-full justify-center text-xs"
            >
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
