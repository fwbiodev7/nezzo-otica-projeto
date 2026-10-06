import type { Metadata } from 'next';
import { ArrowUpRight, MessageCircle, Phone, MapPin, Instagram } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { StoreLocation } from '@/components/StoreLocation';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Contato & Localização | Ótica Nezzo Varginha',
  description: 'Fale com a equipe da Ótica Nezzo em Varginha - MG. Atendimento pelo WhatsApp (35) 3677-1170 e consultoria presencial na loja.',
};

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <>
      <section className="bg-light border-b border-sand">
        <div className="container-wide py-16 sm:py-20">
          <span className="eyebrow">ATENDIMENTO & CONSULTORIA · ÓTICA NEZZO</span>
          <h1 className="section-title mt-4">
            Sua visão em primeiro lugar. <br />
            <em>Vamos conversar?</em>
          </h1>
          <p className="mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-ink/75">
            Tire dúvidas sobre modelos de armações, tratamentos de lentes (como controle de miopia e anti-reflexo digital) ou combine uma visita presencial em Varginha - MG.
          </p>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <span className="eyebrow">CANAIS OFICIAIS</span>
            <h2 className="mt-3 text-2xl font-bold text-primary">
              Atendimento ágil e personalizado.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-ink/70 leading-relaxed">
              Nossa equipe técnica analisa sua receita médica e orienta qual armação respeita seu centro óptico.
            </p>
          </div>

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-sand bg-paper p-6 shadow-sm transition hover:shadow-md hover:border-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-[#FAF8F5]">
              <MessageCircle size={24} />
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-accent">
                WhatsApp Oficial
              </span>
              <strong className="mt-0.5 block text-base font-bold text-primary">
                {contact.phoneLabel}
              </strong>
            </div>
            <ArrowUpRight size={18} className="text-ink/40" />
          </a>

          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-sand bg-paper p-6 shadow-sm transition hover:shadow-md hover:border-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-[#FAF8F5]">
              <Instagram size={22} />
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-accent">
                Instagram da Loja
              </span>
              <strong className="mt-0.5 block text-base font-bold text-primary">
                {contact.instagramLabel}
              </strong>
            </div>
            <ArrowUpRight size={18} className="text-ink/40" />
          </a>

          <div className="pt-2">
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-accent"
            >
              <Phone size={14} className="text-accent" />
              <span>Ligação telefônica: {contact.phoneLabel}</span>
            </a>
          </div>
        </div>

        <ContactForm />
      </section>

      <div className="border-t border-sand">
        <StoreLocation />
      </div>
    </>
  );
}
