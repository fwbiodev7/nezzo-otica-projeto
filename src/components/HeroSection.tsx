import Link from 'next/link';
import { ArrowUpRight, ScanFace, MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/mock-data';

export function HeroSection() {
  return (
    <section className="hero-shell" aria-label="Apresentação da Ótica Nezzo">
      <div className="container-wide relative z-10 py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-2xs font-bold uppercase tracking-[0.22em] text-forest/70">
            Ótica Nezzo · Varginha, MG
          </p>
          <h1 className="hero-title mt-6 !text-[clamp(48px,8.5vw,128px)]">
            Sua visão com<br /><em>personalidade.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            Encontre os óculos que acompanham seu estilo. Explore nossa coleção
            ou descubra sugestões de armações a partir dos seus traços e preferências.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/visagismo" id="hero-cta-visagista" className="btn btn-dark group text-xs">
              <ScanFace size={17} /> Descobrir minha armação <ArrowUpRight size={15} />
            </Link>
            <Link href="/catalogo" className="btn btn-ghost text-xs">
              Explorar catálogo <ArrowUpRight size={15} />
            </Link>
          </div>
          <a
            href={whatsappUrl('Olá! Vim pelo site da Ótica Nezzo e gostaria de atendimento.')}
            target="_blank"
            rel="noopener noreferrer"
            id="hero-cta-whatsapp"
            className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-forest/80 transition hover:text-forest"
          >
            <MessageCircle size={15} /> Prefere conversar? Fale com a Nezzo
          </a>
        </div>
      </div>
    </section>
  );
}
