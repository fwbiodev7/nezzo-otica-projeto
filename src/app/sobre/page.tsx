import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Award, Eye, HeartHandshake, Sparkles, Wrench } from 'lucide-react';
import { StoreLocation } from '@/components/StoreLocation';
import { Reveal } from '@/components/Reveal';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Sobre a Ótica Nezzo | Varginha, MG',
  description: 'Conheça a essência da Ótica Nezzo. Mais do que vender óculos: proporcionamos conforto visual com curadoria exclusiva e visagismo inteligente.',
};

export default function AboutPage() {
  return (
    <>
      <section className="container-wide section-space">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="eyebrow">ESSÊNCIA & IDENTIDADE</span>
            <h1 className="section-title mt-4">
              Sua visão com <br />
              <em>personalidade.</em>
            </h1>
            <p className="mt-6 text-sm sm:text-base leading-relaxed text-ink/75">
              Fundada em Varginha - MG, a <strong>Ótica Nezzo</strong> nasceu para transformar a maneira como você se enxerga e como o mundo percebe seus traços. Acreditamos que uma armação de óculos não é um mero objeto utilitário — é a moldura viva da sua expressão pessoal.
            </p>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/75">
              Por isso, aliamos curadoria rigorosa de acetatos e ligas nobres com tecnologia óptica de ponta: laboratório próprio de montagem e visagismo computadorizado para indicar harmonia exata.
            </p>
            <div className="mt-8">
              <Link href="/catalogo" className="btn-olive inline-flex items-center gap-2">
                <span>Conhecer o Catálogo Nezzo</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative h-[440px] sm:h-[500px] rounded-3xl overflow-hidden border border-sand shadow-xl">
            <Image
              src="/images/hero-editorial.png"
              alt="Editorial Ótica Nezzo em Varginha"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[65%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-[#FAF8F5]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-highlight">
                Varginha · Minas Gerais
              </span>
              <p className="font-serif italic text-xl mt-1">
                &quot;Cada detalhe pensado para a sua identidade visual.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares da Ótica Nezzo */}
      <section className="bg-light border-y border-sand">
        <Reveal className="container-wide section-space">
          <span className="eyebrow">PILAREM QUE SUSTENTAM NOSSA MARCA</span>
          <h2 className="section-title mt-3">
            O padrão de excelência <em>Ótica Nezzo.</em>
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Eye,
                title: 'Curadoria com Propósito',
                text: 'Selecionamos apenas marcas e armações com procedência garantida, acabamentos manuais e encaixes confortáveis que não machucam o rosto ao longo do dia.',
              },
              {
                icon: Wrench,
                title: 'Laboratório Computadorizado',
                text: 'Lapidação e montagem de lentes em ambiente próprio de alta precisão. Garantimos o alinhamento de grau e foco com tolerância zero para distorções.',
              },
              {
                icon: Sparkles,
                title: 'Visagismo Inteligente 2.0',
                text: 'Integramos ciência das proporções faciais à tecnologia do nosso Visagista IA para descomplicar sua escolha e destacar a sua melhor versão.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-sand bg-paper p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-[#FAF8F5]">
                  <item.icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-primary tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink/70">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <StoreLocation />
    </>
  );
}
