import type { Metadata } from 'next';
import { ArrowUpRight, MessageCircle, MapPin, Clock, Instagram } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';
export const metadata: Metadata = { title: 'Fale com a gente' };
export default function ContactPage() {
  const contact = siteConfig.contact;
  return <><section className="bg-light"><div className="container-wide py-16 sm:py-20"><span className="eyebrow">ESTAMOS AQUI PARA VOCÊ</span><h1 className="section-title mt-4">Toda boa escolha começa<br />com <em>uma conversa.</em></h1><p className="mt-5 max-w-lg text-sm leading-7 text-ink/65">Dúvidas sobre uma armação? Quer conhecer as marcas ou experimentar novos estilos? Conte com a gente.</p></div></section><section className="container-wide grid gap-12 py-16 lg:grid-cols-[.8fr_1.2fr]"><div><h2 className="text-2xl tracking-tight">Atendimento do seu jeito.</h2><p className="mt-4 max-w-sm text-sm leading-7 text-ink/60">Fale diretamente com a equipe da sua-marca e descubra as possibilidades para o seu olhar.</p><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mt-8 flex items-center gap-4 rounded-xl border border-primary/20 p-6"><MessageCircle size={25} strokeWidth={1.5} /><span className="flex-1"><span className="block text-[10px] uppercase tracking-widest text-accent">WhatsApp</span><strong className="mt-1 block text-lg font-medium">{contact.phoneLabel}</strong></span><ArrowUpRight size={20} /></a>{contact.address && <p className="mt-6 flex gap-3 text-sm"><MapPin size={18} />{contact.address}</p>}{contact.hours && <p className="mt-5 flex gap-3 text-sm"><Clock size={18} />{contact.hours}</p>}{contact.instagramUrl && <a className="mt-5 flex gap-3 text-sm" href={contact.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={18} />{contact.instagramLabel}</a>}</div><ContactForm /></section></>;
}
