import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  Glasses,
  ScanFace,
  Sun,
  CheckCircle2,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedCollection } from '@/components/FeaturedCollection';
import { Reveal } from '@/components/Reveal';
import { StoreLocation } from '@/components/StoreLocation';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteConfig } from '@/lib/site-config';

const CATEGORIES = [
  {
    icon: Glasses,
    n: '01',
    title: 'Lentes de alta precisão',
    label: 'ÓCULOS DE GRAU',
    desc: 'Montagem milimétrica em laboratório digital.',
    href: '/catalogo?categoria=Grau',
  },
  {
    icon: Sun,
    n: '02',
    title: 'Proteção UV400 com estilo',
    label: 'ÓCULOS DE SOL',
    desc: 'Lentes polarizadas, UVA/UVB total.',
    href: '/catalogo?categoria=Sol',
  },
  {
    icon: ScanFace,
    n: '03',
    title: 'Análise facial biométrica',
    label: 'VISAGISTA IA 2.0',
    desc: 'Harmonização de proporções em instantes.',
    href: '/visagismo',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <HeroSection />

      {/* ── 2. Category shortcuts ── */}
      <section className="container-wide relative z-20 -mt-8 pb-16">
        <div className="category-paths">
          {CATEGORIES.map((item) => (
            <Link key={item.n} href={item.href} className="group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="cat-icon">
                    <item.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span
                    className="text-2xs font-bold italic"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#C9A96E', opacity: .7 }}
                  >
                    Nº {item.n}
                  </span>
                </div>
                <span>{item.label}</span>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-mid flex items-center justify-between text-xs font-semibold text-muted group-hover:text-gold transition-colors">
                <span>Explorar</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Ticker tape ── */}
      <div className="ticker" aria-label="Ótica Nezzo — Sua visão com personalidade">
        <div aria-hidden="true">
          {[0, 1, 2, 3].map((n) => (
            <span key={n}>
              SUA VISÃO COM PERSONALIDADE{' '}
              <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', color: 'rgba(250,248,244,.6)' }} />{' '}
              ÓTICA NEZZO{' '}
              <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', color: 'rgba(250,248,244,.6)' }} />{' '}
              VARGINHA · MINAS GERAIS{' '}
              <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', color: 'rgba(250,248,244,.6)' }} />{' '}
              LABORATÓRIO COMPUTADORIZADO{' '}
              <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', color: 'rgba(250,248,244,.6)' }} />{' '}
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. Visagista IA ── */}
      <section className="container-wide section-space">
        <Reveal className="style-feature">
          {/* Lado esquerdo — Arte biométrica */}
          <div className="style-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="face-outline">
              <svg viewBox="0 0 240 290" fill="none">
                <path
                  d="M120 24C52 24 44 82 52 145C60 213 88 256 120 263C152 256 180 213 188 145C196 82 188 24 120 24Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M52 118H188M61 177H179M120 24V263M70 55L171 218M170 55L69 218M50 145L120 84L190 145L120 235Z"
                  stroke="currentColor"
                  strokeOpacity=".2"
                />
                <path
                  d="M67 118C75 108 93 108 102 118M138 118C147 108 165 108 173 118M120 126L109 172H131M98 204Q120 219 142 204"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <rect x="57" y="99" width="50" height="40" rx="17" stroke="currentColor" strokeWidth="2" />
                <rect x="133" y="99" width="50" height="40" rx="17" stroke="currentColor" strokeWidth="2" />
                <path d="M107 114Q120 106 133 114" stroke="currentColor" strokeWidth="2" />
                {[[52, 145], [188, 145], [120, 24], [120, 263], [61, 177], [179, 177]].map(([cx, cy]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="currentColor" />
                ))}
              </svg>
              <div className="scan-line" />
            </div>
            <span className="scan-label">
              <span className="status-dot" /> VISAGISMO 2.0 · PRIVACIDADE TOTAL
            </span>
          </div>

          {/* Lado direito — Copy */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <span className="eyebrow" style={{ color: '#C9A96E' }}>TECNOLOGIA & VISAGISMO ÓPTICO</span>
            <h2
              className="mt-5 leading-tight text-cream"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 3.4rem)', fontWeight: 400, letterSpacing: '-0.025em' }}
            >
              A armação certa<br />
              não esconde.<br />
              <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>Revela quem você é.</em>
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-soft">
              Nosso <strong className="text-cream font-medium">Visagista IA 2.0</strong> mapeia seus pontos faciais
              diretamente no navegador — com total privacidade — e recomenda os modelos Nezzo
              que equilibram suas proporções naturais.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-soft">
              {[
                'Cálculo real de proporções anatômicas',
                'Recomendações com justificativa estética',
                'Foto descartada após análise (LGPD)',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} style={{ color: '#C9A96E', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/visagismo" className="btn btn-gold text-xs">
                <ScanFace size={16} />
                Fazer meu visagismo agora
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 4. Coleção em destaque ── */}
      <section id="colecao" className="container-wide section-space scroll-mt-28">
        <Reveal>
          <FeaturedCollection />
        </Reveal>
      </section>

      {/* ── 5. Sobre a Nezzo ── */}
      <section className="container-wide pb-20 lg:pb-28">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-4xl bg-dark border border-mid p-8 sm:p-12">
            <div className="lg:col-span-5 relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden border border-mid">
              <Image
                src="/images/frame-champagne.png"
                alt="Armações artesanais da Ótica Nezzo"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-cream">
                <span className="text-2xs uppercase font-bold tracking-widest text-gold">
                  Atelier Nezzo · Varginha
                </span>
                <p className="mt-1 text-lg font-light italic" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  &ldquo;Sua visão com personalidade.&rdquo;
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <span className="eyebrow">A HISTÓRIA DA ÓTICA NEZZO</span>
              <h2 className="section-title">
                Não vendemos armações.<br />
                <em>Cuidamos da sua expressão.</em>
              </h2>

              <p className="text-sm leading-relaxed text-soft">
                Nascida no Centro de Varginha - MG, a <strong className="text-cream font-medium">Ótica Nezzo</strong> foi
                concebida com o propósito de que óculos não devem ser padronizados. Eles são
                a primeira impressão que você passa ao mundo.
              </p>

              <div className="grid grid-cols-3 gap-6 border-t border-mid pt-6">
                {[
                  { val: '100%', desc: 'Aferição milimétrica digital' },
                  { val: 'Curadoria', desc: 'Acetatos nobres & titânio' },
                  { val: 'Visagismo', desc: 'Consultoria presencial & IA' },
                ].map(({ val, desc }) => (
                  <div key={val}>
                    <h4
                      className="text-2xl text-gold"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}
                    >
                      {val}
                    </h4>
                    <p className="text-xs text-muted mt-1">{desc}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold border-b border-gold/30 pb-1 hover:border-gold transition-colors"
              >
                Conheça nossa estrutura e laboratório <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 6. CTA WhatsApp ── */}
      <section
        className="relative overflow-hidden py-20 border-y border-mid"
        style={{ background: 'radial-gradient(110% 180% at 80% 50%, rgba(201,169,110,.08) 0%, rgba(8,8,8,0) 60%), #0D0D0F' }}
      >
        <div
          className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,.15) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="container-wide relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow">CONSULTORIA PERSONALIZADA</span>
            <h2
              className="mt-4 leading-tight text-cream"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300 }}
            >
              Quer uma indicação para sua receita?{' '}
              <em style={{ fontStyle: 'italic', color: '#C9A96E', fontWeight: 300 }}>Fale com nossos consultores.</em>
            </h2>
            <p className="mt-4 text-sm text-soft leading-relaxed">
              Envie sua receita ou tire dúvidas sobre armações e lentes diretamente pelo WhatsApp da Ótica Nezzo.
            </p>
          </div>
          <WhatsAppButton message="Olá! Gostaria de atendimento personalizado na Ótica Nezzo.">
            <MessageCircle size={17} /> Conversar no WhatsApp
          </WhatsAppButton>
        </div>
      </section>

      {/* ── 7. Localização ── */}
      <StoreLocation />
    </>
  );
}
