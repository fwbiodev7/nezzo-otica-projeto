import Link from 'next/link';
import { ArrowUpRight, Eye, Instagram, MapPin, MessageCircle, Phone, Shield } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

const LINKS = [
  { label: 'Catálogo de Óculos', href: '/catalogo' },
  { label: 'Visagista IA 2.0', href: '/visagismo' },
  { label: 'Sobre a Nezzo', href: '/sobre' },
  { label: 'Localização & Contato', href: '/contato' },
];

export function Footer() {
  const { contact } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-forest/10 bg-forest-deep text-white">
      <div className="container-wide grid gap-14 py-16 md:grid-cols-[1.5fr_1fr_1.3fr]">

        {/* Coluna 1: Marca */}
        <div>
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition-all group-hover:bg-gold group-hover:text-forest-deep">
              <Eye size={20} strokeWidth={1.5} />
            </div>
            <div>
              <span className="block text-base font-bold tracking-[0.1em] text-white uppercase">
                ÓTICA <span className="text-gold font-extrabold">NEZZO</span>
              </span>
              <span className="block text-2xs tracking-[0.12em] text-white/50 mt-0.5">Varginha · MG</span>
            </div>
          </Link>

          <p className="mt-6 max-w-xs text-sm leading-7 text-white/70">
            Sua visão com personalidade. Curadoria de armações internacionais, lentes de alta tecnologia e laboratório especializado.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-2xs font-extrabold uppercase tracking-[0.1em] text-forest-deep transition-all hover:bg-white hover:shadow-sm"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-2xs font-semibold text-white/80 transition hover:border-gold hover:text-gold"
            >
              <Instagram size={13} /> {contact.instagramLabel}
            </a>
          </div>
        </div>

        {/* Coluna 2: Navegação */}
        <div>
          <h3 className="mb-5 text-2xs font-bold uppercase tracking-[0.22em] text-gold">
            Navegação
          </h3>
          <ul className="space-y-3">
            {LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white group"
                >
                  <span>{label}</span>
                  <ArrowUpRight size={13} className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-gold" />
                </Link>
              </li>
            ))}
            <li className="pt-3 border-t border-white/10 mt-3">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white/80"
              >
                <Shield size={12} /> Área Administrativa
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Endereço */}
        <div>
          <h3 className="mb-5 text-2xs font-bold uppercase tracking-[0.22em] text-gold">
            Visite nossa loja
          </h3>
          <div className="space-y-4 text-sm text-white/70">
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 transition hover:text-white group"
            >
              <MapPin size={17} className="mt-0.5 shrink-0 text-gold group-hover:text-gold-light transition-colors" />
              <span className="leading-relaxed">
                {contact.street}<br />
                {contact.city} · CEP {contact.postalCode}
              </span>
            </a>

            <a
              href={contact.phoneHref}
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Phone size={15} className="text-gold shrink-0" />
              {contact.phoneLabel}
            </a>

            <div className="rounded-xl border border-white/10 bg-forest-card/50 p-4 text-xs leading-6">
              <span className="block text-xs font-bold text-white mb-1 uppercase tracking-wide">Horário de Atendimento</span>
              <span className="text-white/60">{contact.hours}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide border-t border-white/10 py-6">
        <div className="flex flex-col items-center justify-between gap-3 text-2xs text-white/40 sm:flex-row">
          <span>© {year} {siteConfig.name} · Varginha, MG. Todos os direitos reservados.</span>
          <span>Privacidade & LGPD · Imagens analisadas localmente</span>
        </div>
      </div>
    </footer>
  );
}
