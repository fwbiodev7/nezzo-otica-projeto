import type { Metadata } from 'next';
import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { StoreLocation } from '@/components/StoreLocation';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

export const metadata: Metadata = { title: 'Contato e localização em Varginha' };
export default function ContactPage() {
  const { contact } = siteConfig;
  return <>
    <section className="page-banner"><div className="container-wide py-16 sm:py-20"><span className="eyebrow">FALE COM A sua-marca</span><h1 className="section-title mt-4">Toda boa escolha começa<br />com <em>uma conversa.</em></h1><p className="mt-5 max-w-lg text-sm leading-7 text-ink/70">Pelo WhatsApp ou em uma visita à nossa loja no Centro de Varginha. Escolha como quer começar.</p></div></section>
    <section className="container-wide grid gap-12 py-16 lg:grid-cols-[.8fr_1.2fr]">
      <div><span className="eyebrow">PODE CHEGAR</span><h2 className="mt-4 text-3xl tracking-tight">A gente ajuda você a escolher.</h2><p className="mt-4 max-w-sm text-sm leading-7 text-ink/70">Tire suas dúvidas sobre armações, consulte a disponibilidade dos modelos ou combine sua visita com a equipe da sua-marca.</p><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mt-8 flex items-center gap-4 rounded-xl border border-primary/20 bg-light p-6"><MessageCircle size={25} strokeWidth={1.5} /><span className="flex-1"><span className="block text-[10px] uppercase tracking-widest text-accent">WhatsApp</span><strong className="mt-1 block text-lg font-medium">{contact.phoneLabel}</strong></span><ArrowUpRight size={20} /></a><a href={contact.phoneHref} className="mt-6 inline-flex items-center gap-3 text-sm"><Phone size={17} />Prefere ligar? {contact.phoneLabel}</a></div>
      <ContactForm />
    </section>
    <div className="border-t border-primary/10"><StoreLocation /></div>
  </>;
}
