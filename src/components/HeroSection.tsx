import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, CheckCircle2, MessageCircle, ScanFace, Sparkles, Star } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { whatsappUrl } from '@/lib/mock-data';

export function HeroSection() {
  const { campaign } = siteConfig;

  return (
    <section className="hero-shell relative overflow-hidden">
      {/* Luz ambiente orgânica e textura de profundidade Nezzo */}
      <div
        className="pointer-events-none absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full opacity-25 blur-[140px] animate-pulse-subtle"
        style={{ background: 'radial-gradient(circle, #384B39 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-48 right-0 h-[550px] w-[550px] rounded-full opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #C8AD7F 0%, transparent 70%)' }}
      />

      <div className="container-wide relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-12 lg:py-28">
        {/* Lado Esquerdo: Conteúdo Editorial */}
        <div className="lg:col-span-7 z-10 space-y-7">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-xl shadow-sm">
            <span className="status-dot text-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FAF8F5]">
              Ótica Nezzo · Varginha - MG
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[10px] text-gold font-semibold flex items-center gap-1">
              <Star size={11} className="fill-gold" /> Curadoria Exclusiva
            </span>
          </div>

          <h1 className="hero-title">
            Sua visão com <br />
            <em className="text-highlight">personalidade.</em>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-[#FAF8F5]/85 sm:text-lg font-normal">
            Muito mais do que óculos: uma moldura autêntica para a sua expressão. Aliamos alta tecnologia em lentes de precisão, curadoria internacional de armações e o nosso <strong>Visagista IA 2.0</strong> no Centro de Varginha.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/visagismo"
              className="btn-olive group shadow-olive-glow text-xs"
            >
              <ScanFace size={18} className="text-gold transition-transform group-hover:scale-110" />
              <span>Descobrir Armação Ideal (IA)</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/catalogo"
              className="btn-outline border-white/30 text-white hover:bg-white hover:text-primary text-xs"
            >
              <span>Ver Vitrine de Óculos</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Destaques Técnicos da Boutique */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/15 pt-8 text-xs text-[#FAF8F5]/80">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gold backdrop-blur-md border border-white/10 shrink-0">
                <Sparkles size={16} />
              </div>
              <span className="leading-snug">Laboratório computadorizado</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gold backdrop-blur-md border border-white/10 shrink-0">
                <ScanFace size={16} />
              </div>
              <span className="leading-snug">Visagismo facial biométrico</span>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gold backdrop-blur-md border border-white/10 shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <span className="leading-snug">Garantia & ajuste cortesia</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Composição Visual Editorial com Animações */}
        <div className="relative lg:col-span-5 flex justify-center">
          <div className="relative h-[500px] w-full max-w-[440px] sm:h-[560px]">
            {/* Moldura da Foto */}
            <div className="relative h-full w-full overflow-hidden rounded-[2.8rem] border border-white/20 bg-primary shadow-2xl transition-all duration-700 hover:shadow-glow">
              <Image
                src={campaign.image}
                alt={campaign.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-cover object-[65%_center] transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent" />

              {/* Tag Flutuante Inferior */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-primary/85 p-5 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-highlight">
                    Coleção Nezzo Atelier
                  </span>
                  <span className="rounded-full bg-accent/40 px-2 py-0.5 text-[9px] font-bold text-white border border-white/10">
                    Varginha - MG
                  </span>
                </div>
                <p className="mt-2 font-serif text-xl italic text-[#FAF8F5]">
                  &quot;{campaign.caption}&quot;
                </p>
              </div>
            </div>

            {/* Card Flutuante com Micro-Animação */}
            <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-3 rounded-2xl border border-white/20 bg-primary/90 px-4 py-3 text-xs text-white backdrop-blur-xl shadow-2xl animate-float">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-gold">
                <Star size={16} className="fill-gold" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-white">4.9 / 5.0 estrelas</strong>
                <span className="text-[10px] text-white/70">Atendimento de excelência</span>
              </div>
            </div>

            {/* Selo Giratório Nezzo */}
            <div
              className="absolute -left-6 -bottom-6 flex h-28 w-28 items-center justify-center rounded-full border border-sand bg-paper text-primary shadow-2xl z-20"
              aria-hidden="true"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
                <defs>
                  <path id="circle-path-hero" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                </defs>
                <text className="text-[7.5px] font-bold uppercase tracking-[0.18em] fill-primary">
                  <textPath href="#circle-path-hero">
                    · ÓTICA NEZZO · VARGINHA - MG ·
                  </textPath>
                </text>
              </svg>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-[#FAF8F5] shadow-md">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
