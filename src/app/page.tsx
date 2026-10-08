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
import { Testimonials } from '@/components/Testimonials';

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
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#C9A96E', opacity: .9 }}
                  >
                    Nº {item.n}
                  </span>
                </div>
                <span>{item.label}</span>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-forest/10 flex items-center justify-between text-xs font-semibold text-muted group-hover:text-forest transition-colors">
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
              <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', color: '#C9A96E' }} />{' '}
              ÓTICA NEZZO{' '}
              <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', color: '#C9A96E' }} />{' '}
              VARGINHA · MINAS GERAIS{' '}
              <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', color: '#C9A96E' }} />{' '}
              LABORATÓRIO COMPUTADORIZADO{' '}
              <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', color: '#C9A96E' }} />{' '}
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. Visagista IA ── */}
      <section className="container-wide section-space">
        <Reveal className="style-feature">
          {/* Lado esquerdo — Arte biométrica */}
          <div className="style-art" aria-hidden="true">
            <Image
              src="/images/analise-facial-oculos-v2.png"
              alt=""
              width={1254}
              height={1254}
              sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 520px"
              className="style-face-image"
            />
            <span className="scan-label">
              <span className="status-dot" /> VISAGISMO 2.0 · SEU ESTILO
            </span>
          </div>

          {/* Lado direito — Copy */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <span className="eyebrow">TECNOLOGIA & VISAGISMO ÓPTICO</span>
            <h2
              className="mt-5 leading-tight text-ink"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 3.4rem)', fontWeight: 500, letterSpacing: '-0.025em' }}
            >
              A armação certa<br />
              não esconde.<br />
              <em style={{ fontStyle: 'italic', color: '#164230' }}>Revela quem você é.</em>
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Nosso <strong className="text-forest font-bold">Visagista IA 2.0</strong> mapeia seus pontos faciais
              diretamente no navegador e ajuda a escolher modelos Nezzo que valorizam seus traços.
              Personalize a seleção pelo tipo de óculos e pelo estilo que você gosta.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-muted">
              {[
                'Sugestões a partir dos seus traços faciais',
                'Recomendações com justificativa estética',
                'Você pode apagar a foto ao reiniciar',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 size={16} style={{ color: '#164230', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/visagismo" className="btn btn-dark text-xs">
                <ScanFace size={16} />
                Fazer minha analise agora!
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-4xl bg-void border border-forest/10 p-8 sm:p-12 shadow-sm">
            <div className="lg:col-span-5 relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden border border-forest/10">
              <Image
                src="/images/frame-champagne.png"
                alt="Armações artesanais da Ótica Nezzo"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
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

              <p className="text-sm leading-relaxed text-muted">
                Nascida no Centro de Varginha - MG, a <strong className="text-forest font-bold">Ótica Nezzo</strong> foi
                concebida com o propósito de que óculos não devem ser padronizados. Eles são
                a primeira impressão que você passa ao mundo.
              </p>

              <div className="grid grid-cols-3 gap-6 border-t border-forest/10 pt-6">
                {[
                  { val: '100%', desc: 'Aferição milimétrica digital' },
                  { val: 'Curadoria', desc: 'Acetatos nobres & titânio' },
                  { val: 'Visagismo', desc: 'Consultoria presencial & IA' },
                ].map(({ val, desc }) => (
                  <div key={val}>
                    <h4
                      className="text-2xl text-forest"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
                    >
                      {val}
                    </h4>
                    <p className="text-xs text-muted mt-1">{desc}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest border-b border-forest/30 pb-1 hover:border-forest transition-colors mt-2"
              >
                Conheça nossa estrutura e laboratório <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 6. Depoimentos (Google) ── */}
      <Testimonials />

      {/* ── 7. CTA WhatsApp ── */}
      <section
        className="relative overflow-hidden py-20 border-y border-forest/10"
        style={{ background: 'radial-gradient(110% 180% at 80% 50%, rgba(22,66,48,.04) 0%, rgba(255,255,255,0) 60%), #F9FAF7' }}
      >
        <div
          className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,.2) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="container-wide relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow">CONSULTORIA PERSONALIZADA</span>
            <h2
              className="mt-4 leading-tight text-ink"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400 }}
            >
              Quer uma indicação para sua receita?{' '}
              <em style={{ fontStyle: 'italic', color: '#164230', fontWeight: 500 }}>Fale com nossos consultores.</em>
            </h2>
            <p className="mt-4 text-sm text-muted leading-relaxed">
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
