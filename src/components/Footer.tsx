import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

export function Footer() {
  const { contact } = siteConfig;
  return <footer className="bg-primary text-white">
    <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.3fr_.8fr_1.1fr]">
      <div><Logo light /><p className="mt-6 max-w-xs text-sm leading-7 text-white/75">Seu jeito de ver a vida.<br />Sua ótica no Centro de Varginha.</p><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-3 text-xs text-highlight">Converse com a nossa equipe <ArrowUpRight size={16} /></a></div>
      <div><h3 className="mb-6 text-[10px] uppercase tracking-[.2em] text-highlight">Um novo olhar</h3><div className="grid gap-4 text-xs text-white/80"><Link href="/catalogo">Nossos óculos</Link><Link href="/visagismo">Descubra seu estilo</Link><Link href="/sobre">A sua-marca</Link><Link href="/contato">Fale com a gente</Link></div></div>
      <div><h3 className="mb-6 text-[10px] uppercase tracking-[.2em] text-highlight">Venha nos conhecer</h3><a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm leading-7"><MapPin size={18} className="mt-1 shrink-0 text-highlight" /><span>{contact.street}<br />{contact.city}<br /><span className="text-xs text-white/65">CEP {contact.postalCode}</span></span></a><a href={contact.phoneHref} className="mt-5 inline-flex items-center gap-3 text-sm"><Phone size={17} className="text-highlight" />{contact.phoneLabel}</a><p className="mt-4 max-w-xs text-xs leading-6 text-white/70">{contact.hours}</p></div>
    </div>
    <div className="container-wide"><div className="flex flex-col justify-between gap-3 border-t border-white/20 py-6 text-[10px] text-white/65 sm:flex-row"><span>© {new Date().getFullYear()} {siteConfig.name} · Varginha, MG.</span><span>Vitrine demonstrativa · Imagens e preços ilustrativos</span></div></div>
  </footer>;
}
