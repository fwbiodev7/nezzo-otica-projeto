'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ScanFace, Sparkles, Star, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

const STATS = [
  { value: '4.9', label: 'Google Avaliações' },
  { value: '+2K', label: 'Clientes atendidos' },
  { value: '15+', label: 'Anos de expertise' },
];

export function HeroSection() {
  const { campaign } = siteConfig;
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-shell"
      aria-label="Apresentação da Ótica Nezzo"
    >
      {/* Background */}
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />

      {/* Gradiente vinheta nas bordas para focar no centro (Light mode) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(255,255,255,.9) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10 flex flex-col gap-12 py-24 lg:py-0 lg:min-h-screen lg:justify-center">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* ── COLUNA ESQUERDA: Editorial ── */}
          <div
            className="lg:col-span-6 xl:col-span-7 space-y-8"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)',
            }}
          >
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-3 rounded-full border border-forest/10 bg-mint px-4 py-2 text-2xs font-bold uppercase tracking-[0.22em] text-forest shadow-sm">
              <span className="status-dot" />
              Ótica Nezzo · Varginha — MG
              <span className="h-3 w-px bg-forest/20" />
              <Star size={10} className="fill-gold text-gold" />
              Curadoria exclusiva
            </div>

            {/* Título principal */}
            <h1 className="hero-title">
              Sua visão<br />
              com{' '}
              <em>persona</em>
              <br />
              <strong>lidade.</strong>
            </h1>

            {/* Linha decorativa verde/dourada */}
            <div className="hero-rule w-24" />

            <p className="max-w-lg text-base leading-relaxed text-muted">
              Curadoria internacional de armações, lentes de alta precisão e o nosso{' '}
              <span className="text-forest font-bold">Visagista IA 2.0</span>{' '}
              — tecnologia facial biométrica para você encontrar a moldura perfeita.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/visagismo" id="hero-cta-visagista" className="btn btn-dark group text-xs">
                <ScanFace size={17} className="transition-transform group-hover:scale-110" />
                Descobrir armação ideal
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <a
                href={whatsappUrl('Olá! Vim pelo site da Ótica Nezzo e gostaria de atendimento.')}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-whatsapp"
                className="btn btn-ghost text-xs"
              >
                <MessageCircle size={16} />
                Falar no WhatsApp
              </a>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 border-t border-forest/10 pt-8">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span
                    className="text-2xl font-medium"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#164230' }}
                  >
                    {s.value}
                  </span>
                  <span className="text-2xs tracking-wider text-muted uppercase mt-0.5 font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLUNA DIREITA: Visual Editorial ── */}
          <div
            className="relative lg:col-span-6 xl:col-span-5 flex justify-center"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(48px)',
              transition: 'opacity 1.1s .2s cubic-bezier(.16,1,.3,1), transform 1.1s .2s cubic-bezier(.16,1,.3,1)',
            }}
          >
            <div className="relative h-[520px] w-full max-w-[420px]">

              {/* Moldura principal da imagem */}
              <div
                className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-forest/10 shadow-luxury"
                style={{
                  background: '#FFFFFF',
                  transform: `perspective(900px) rotateY(${mousePos.x * 0.015}deg) rotateX(${-mousePos.y * 0.015}deg)`,
                  transition: 'transform .08s linear',
                }}
              >
                <Image
                  src={campaign.image}
                  alt={campaign.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover object-center"
                />
                {/* Overlay gradiente inferior para leitura */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Card inferior dentro da imagem */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/90 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-bold tracking-[0.2em] uppercase text-forest">Coleção Nezzo Atelier</span>
                    <span className="rounded-full bg-gold border border-gold px-2.5 py-0.5 text-2xs font-extrabold text-white">
                      Exclusivo
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-medium italic text-ink" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    &ldquo;{campaign.caption}&rdquo;
                  </p>
                </div>
              </div>

              {/* Card flutuante superior direito */}
              <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-3 rounded-2xl border border-forest/10 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-xl animate-float">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint border border-forest/10">
                  <Star size={16} className="fill-gold text-gold" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-ink">4.9 / 5.0 estrelas</strong>
                  <span className="text-2xs text-muted">Excelência no atendimento</span>
                </div>
              </div>

              {/* Selo giratório em verde e branco */}
              <div
                className="absolute -left-6 -bottom-6 z-20 flex h-28 w-28 items-center justify-center rounded-full border border-forest/10 bg-white shadow-lg"
                aria-hidden="true"
              >
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
                  <defs>
                    <path id="seal-path" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                  </defs>
                  <text style={{ fontSize: '7.5px', fontWeight: '800', letterSpacing: '0.18em', fill: '#164230', textTransform: 'uppercase' }}>
                    <textPath href="#seal-path">· ÓTICA NEZZO · VARGINHA - MG ·</textPath>
                  </text>
                </svg>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white shadow-sm">
                  <Sparkles size={17} className="text-gold" />
                </div>
              </div>

              {/* Destaque IA card */}
              <div className="absolute -left-10 top-1/3 hidden lg:flex flex-col gap-1.5 rounded-2xl border border-forest/10 bg-white/95 px-3.5 py-3 shadow-lg backdrop-blur-xl">
                <div className="flex items-center gap-2 text-2xs text-forest font-bold uppercase tracking-widest">
                  <ScanFace size={13} className="text-gold" />
                  Visagista IA 2.0
                </div>
                <div className="text-2xs text-muted">Análise biométrica facial</div>
                <div className="mt-1 h-1 w-full rounded-full bg-mint overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-forest to-gold animate-pulse-subtle" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seta scroll down - Verde escuro */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-2xs font-bold tracking-[0.2em] uppercase text-forest">Explorar</span>
        <div className="h-6 w-px bg-gradient-to-b from-forest to-transparent" />
      </div>
    </section>
  );
}
