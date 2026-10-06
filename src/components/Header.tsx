'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react';
import { Logo } from './Logo';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

const nav = [
  ['Início', '/'],
  ['Catálogo & Armações', '/catalogo'],
  ['Visagista IA', '/visagismo'],
  ['Sobre a Nezzo', '/sobre'],
  ['Contato & Localização', '/contato'],
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  return (
    <header className="site-header sticky top-0 z-50 transition-all duration-300">
      <div className="announcement">
        <span className="truncate">{siteConfig.announcement}</span>
        <a
          href={siteConfig.contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex"
        >
          {siteConfig.contact.instagramLabel} <ArrowUpRight size={12} />
        </a>
      </div>

      <div className="container-wide flex h-[82px] items-center justify-between gap-6">
        <Logo compact={false} showTagline={true} />

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Navegação principal"
        >
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

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl('Olá! Vim pelo site da Ótica Nezzo e gostaria de atendimento especializado.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-[#FAF8F5] transition-all hover:bg-primary hover:shadow-md"
          >
            <MessageCircle size={15} />
            <span>Falar no WhatsApp</span>
          </a>

          <button
            ref={toggle}
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className="rounded-full border border-primary/15 p-2.5 text-primary lg:hidden transition hover:bg-light"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Navegação móvel"
          className="absolute left-0 right-0 border-b border-sand bg-paper p-6 text-primary shadow-xl lg:hidden animate-fade-in"
        >
          <div className="flex flex-col divide-y divide-primary/10">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-sm font-medium transition hover:text-accent"
              >
                <span>{label}</span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-primary/10">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-olive w-full text-center"
            >
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
