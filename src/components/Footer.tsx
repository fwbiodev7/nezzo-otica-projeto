import Link from 'next/link';
import { ArrowUpRight, Instagram, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

export function Footer() {
  const { contact } = siteConfig;

  return (
    <footer className="bg-primary text-[#FAF8F5] border-t border-white/10">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        {/* Coluna 1: Marca & Missão */}
        <div>
          <Logo light compact={false} showTagline={true} />
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#FAF8F5]/75">
            Sua visão com personalidade. Curadoria de armações, lentes de alta tecnologia e laboratório especializado no Centro de Varginha - MG.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-[#FAF8F5] transition hover:bg-white hover:text-primary"
            >
              <MessageCircle size={15} /> WhatsApp Oficial
            </a>
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-[#FAF8F5] transition hover:border-white hover:bg-white/10"
            >
              <Instagram size={15} /> {contact.instagramLabel}
            </a>
          </div>
        </div>

        {/* Coluna 2: Navegação & Recursos */}
        <div>
          <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-highlight">
            Navegação
          </h3>
          <ul className="space-y-3 text-sm text-[#FAF8F5]/80">
            <li>
              <Link href="/catalogo" className="transition hover:text-white flex items-center gap-1.5">
                Catálogo de Óculos <ArrowUpRight size={14} className="opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/visagismo" className="transition hover:text-white flex items-center gap-1.5">
                Visagista IA 2.0 <ArrowUpRight size={14} className="opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="transition hover:text-white flex items-center gap-1.5">
                Sobre a Ótica Nezzo <ArrowUpRight size={14} className="opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/contato" className="transition hover:text-white flex items-center gap-1.5">
                Localização & Contato <ArrowUpRight size={14} className="opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/admin" className="transition hover:text-white text-xs opacity-50 flex items-center gap-1 pt-2">
                <ShieldCheck size={13} /> Área Administrativa
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Visite nossa Loja */}
        <div>
          <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-highlight">
            Visite Nossa Loja
          </h3>
          <div className="space-y-4 text-sm text-[#FAF8F5]/80">
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 transition hover:text-white group"
            >
              <MapPin size={18} className="mt-1 shrink-0 text-highlight group-hover:scale-110 transition-transform" />
              <span className="leading-relaxed">
                {contact.street}<br />
                {contact.city} · CEP {contact.postalCode}
              </span>
            </a>

            <a
              href={contact.phoneHref}
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Phone size={17} className="text-highlight" />
              <span>{contact.phoneLabel}</span>
            </a>

            <p className="text-xs leading-6 text-[#FAF8F5]/60 pt-2 border-t border-white/10">
              <strong className="text-[#FAF8F5]/80 block font-medium">Horário de Atendimento:</strong>
              {contact.hours}
            </p>
          </div>
        </div>
      </div>

      <div className="container-wide border-t border-white/10 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-[#FAF8F5]/60 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name} · Varginha - MG. Todos os direitos reservados.
          </span>
          <span className="text-[11px]">
            Privacidade & LGPD respeitadas · Imagens faciais analisadas localmente
          </span>
        </div>
      </div>
    </footer>
  );
}
