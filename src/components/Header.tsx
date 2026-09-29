'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

const nav = [['Início', '/'], ['Nossos óculos', '/catalogo'], ['Descubra seu estilo', '/visagismo'], ['A sua-marca', '/sobre'], ['Contato', '/contato']];
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return <header className="site-header sticky top-0 z-50 bg-primary/95 text-white backdrop-blur-xl">
    <div className="announcement"><span>{siteConfig.announcement}</span><Link href="/catalogo">Conheça a coleção <ArrowUpRight size={12} /></Link></div>
    <div className="container-wide flex h-[88px] items-center justify-between gap-5 border-b border-white/10">
      <Logo compact light />
      <nav className="hidden items-center gap-5 xl:flex" aria-label="Navegação principal">
        {nav.map(([label, href]) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined} className="nav-link">{label}</Link>)}
      </nav>
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-5 rounded-full border border-white/30 px-5 py-3 text-xs font-semibold transition hover:bg-highlight hover:text-primary xl:flex">Vamos conversar <ArrowUpRight size={16} /></a>
      <button ref={toggle} type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} className="rounded-full border border-white/30 p-3 xl:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
    {open && <nav id="mobile-menu" aria-label="Navegação móvel" className="absolute left-0 right-0 border-b border-primary/15 bg-paper p-5 text-primary shadow-soft xl:hidden">
      {nav.map(([label, href]) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined} onClick={() => setOpen(false)} className="block border-b border-primary/10 px-2 py-4 text-base">{label}<ArrowUpRight className="float-right" size={18} /></Link>)}
    </nav>}
  </header>;
}
