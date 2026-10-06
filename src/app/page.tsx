import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  Glasses,
  ScanFace,
  Sun,
  Sparkles,
  MoveUpRight,
  CheckCircle2,
  Shield,
  Eye,
  Award,
  Star,
  Wrench,
  Sparkle,
} from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedCollection } from '@/components/FeaturedCollection';
import { Reveal } from '@/components/Reveal';
import { StoreLocation } from '@/components/StoreLocation';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteConfig } from '@/lib/site-config';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Impactante */}
      <HeroSection />

      {/* 2. Categorias e Armações Rápidas */}
      <section className="container-wide -mt-6 relative z-20 pb-16">
        <div className="category-paths rounded-3xl overflow-hidden border border-sand bg-white shadow-luxury">
          {[
            {
              icon: Glasses,
              n: '01',
              title: 'Lentes de alta precisão & grau',
              label: 'ÓCULOS DE GRAU',
              desc: 'Montagem milimétrica em laboratório digital próprio.',
              href: '/catalogo?categoria=Grau',
            },
            {
              icon: Sun,
              n: '02',
              title: 'Proteção UV400 com estilo',
              label: 'ÓCULOS DE SOL',
              desc: 'Lentes polarizadas com proteção UVA/UVB total.',
              href: '/catalogo?categoria=Sol',
            },
            {
              icon: ScanFace,
              n: '03',
              title: 'Análise facial biométrica 2.0',
              label: 'VISAGISTA INTELIGENTE',
              desc: 'Harmonização de proporções do rosto em instantes.',
              href: '/visagismo',
            },
          ].map((item) => (
            <Link key={item.n} href={item.href} className="group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-light text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-[#FAF8F5] group-hover:scale-105 shadow-sm">
                    <item.icon size={26} strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-bold text-accent font-serif italic">
                    Nº {item.n}
                  </span>
                </div>
                <span>{item.label}</span>
                <h2>{item.title}</h2>
                <p className="mt-2 text-xs text-ink/60 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sand/60 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                <span>Explorar coleção</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ticker Dinâmico de Identidade Nezzo */}
      <div className="ticker" aria-label="Sua visão com personalidade">
        <div aria-hidden="true">
          {[0, 1, 2, 3].map((n) => (
            <span key={n}>
              SUA VISÃO COM PERSONALIDADE <Sparkles size={16} className="text-gold" /> ÓTICA NEZZO <Sparkles size={16} className="text-gold" /> VARGINHA · MINAS GERAIS <Sparkles size={16} className="text-gold" /> CURADORIA EXCLUSIVA <Sparkles size={16} className="text-gold" /> LABORATÓRIO COMPUTADORIZADO <Sparkles size={16} className="text-gold" />
            </span>
          ))}
        </div>
      </div>

      {/* 3. Seção do Visagista IA 2.0 */}
      <section className="container-wide section-space">
        <Reveal className="style-feature">
          {/* Arte do Scanner Biométrico */}
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
                  strokeOpacity=".25"
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

          {/* Copy Editorial */}
          <div className="p-8 sm:p-14 lg:p-16 flex flex-col justify-center">
            <span className="eyebrow text-highlight">TECNOLOGIA & VISAGISMO ÓPTICO</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-[#FAF8F5]">
              A armação certa <br />
              não esconde. <br />
              <em className="text-highlight">Revela quem você é.</em>
            </h2>
            <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#FAF8F5]/80">
              Cada rosto possui proporções, distâncias e contrastes singulares. Nosso <strong>Visagista IA 2.0</strong> mapeia seus pontos faciais no próprio navegador com total respeito à sua privacidade e recomenda os modelos do catálogo Nezzo que equilibram suas linhas naturais.
            </p>

            <div className="mt-6 space-y-3 text-xs text-[#FAF8F5]/75">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-highlight shrink-0" />
                <span>Cálculo real de proporções anatômicas (sem métricas inventadas)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-highlight shrink-0" />
                <span>Recomendações com justificativa estética fundamentada</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-highlight shrink-0" />
                <span>Foto descartada da memória imediatamente após o laudo (LGPD)</span>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/visagismo"
                className="btn-olive shadow-olive-glow text-xs"
              >
                <ScanFace size={16} />
                <span>Fazer meu Visagismo Agora</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. Destaques e Produtos do Catálogo */}
      <section id="colecao" className="container-wide section-space scroll-mt-28">
        <Reveal>
          <FeaturedCollection />
        </Reveal>
      </section>

      {/* 5. Sobre a Nezzo: Filosofia & Varginha */}
      <section className="container-wide pb-20 lg:pb-28">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-3xl bg-white border border-sand p-8 sm:p-14 shadow-luxury">
            <div className="lg:col-span-5 relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden border border-sand shadow-md">
              <Image
                src="/images/frame-champagne.png"
                alt="Detalhes artesanais de armações Ótica Nezzo"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FAF8F5]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-highlight">
                  Atelier Nezzo · Varginha
                </span>
                <p className="mt-1 font-serif text-xl italic">
                  &quot;Sua visão com personalidade.&quot;
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <span className="eyebrow">A HISTÓRIA DA ÓTICA NEZZO</span>
              <h2 className="section-title">
                Não vendemos apenas armações. <br />
                <em>Cuidamos da sua expressão visual.</em>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-ink/75 font-normal">
                Nascida no Centro de Varginha - MG, a <strong>Ótica Nezzo</strong> foi concebida sob o propósito de que óculos não devem ser padronizados. Eles são a primeira impressão que você passa ao mundo e a lente pela qual constrói suas memórias.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-sand pt-6">
                <div>
                  <h4 className="text-2xl font-bold text-primary font-serif">100%</h4>
                  <p className="text-xs text-ink/60 mt-1 font-medium">Lentes com aferição milimétrica digital</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-primary font-serif">Curadoria</h4>
                  <p className="text-xs text-ink/60 mt-1 font-medium">Acetatos nobres e titânio cirúrgico</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-primary font-serif">Visagismo</h4>
                  <p className="text-xs text-ink/60 mt-1 font-medium">Consultoria personalizada na loja e IA</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent border-b-2 border-accent pb-1 hover:text-primary transition"
                >
                  Conheça nossa estrutura e laboratório <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 6. CTA Direto para WhatsApp com Fundo Nobre */}
      <section className="bg-primary text-[#FAF8F5] relative overflow-hidden py-20 border-y border-white/10">
        <div
          className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full opacity-25 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #384B39 0%, transparent 70%)' }}
        />

        <div className="container-wide relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow text-gold">CONSULTORIA PERSONALIZADA</span>
            <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl lg:text-5xl text-white font-medium">
              Quer uma indicação para sua receita? <br />
              <em className="font-serif italic text-gold">Fale direto com nossos consultores.</em>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#FAF8F5]/75 leading-relaxed">
              Envie sua receita médica ou tire suas dúvidas sobre armações e lentes diretamente pelo WhatsApp da Ótica Nezzo. Atendimento ágil e consultivo.
            </p>
          </div>
          <WhatsAppButton message="Olá! Gostaria de uma avaliação para meus óculos na Ótica Nezzo.">
            Conversar no WhatsApp Oficial
          </WhatsAppButton>
        </div>
      </section>

      {/* 7. Localização & Contato */}
      <StoreLocation />
    </>
  );
}
