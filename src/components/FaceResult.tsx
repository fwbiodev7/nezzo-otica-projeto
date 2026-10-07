'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Info,
  Layers,
  MessageCircle,
  RotateCcw,
  Ruler,
  ScanFace,
  Sparkles,
} from 'lucide-react';
import type { FaceAnalysisResult, Product } from '@/types';
import { useCatalog } from '@/lib/use-catalog';
import { CatalogPhoto } from './CatalogPhoto';
import { recommendCatalogFrames, type FramePreferences } from '@/lib/frame-recommendations';
import { trackEvent } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/mock-data';

export function FaceResult({
  result,
  onRestart,
}: {
  result: FaceAnalysisResult;
  onRestart: () => void;
}) {
  const products = useCatalog();
  const [preferences, setPreferences] = useState<FramePreferences>({ category: 'Grau', style: 'Versátil' });

  const chosen = recommendCatalogFrames(result.faceShape, products, undefined, preferences);
  const recommendedShapes = [...new Set(chosen.map(({ product }) => product.frameShape))];

  const whatsappMessage = `Olá! Fiz o Visagista IA da Ótica Nezzo e busco óculos ${preferences.category.toLowerCase()} com estilo ${preferences.style.toLowerCase()}. Meu contorno aparente é ${result.faceShape.toLowerCase()}. Gostaria de experimentar as armações: ${chosen
    .map(item => item.product.name)
    .join(', ')}.`;

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      source: 'visagista_result',
      faceShape: result.faceShape,
    });
  };

  const handleInterestClick = (product: Product) => {
    trackEvent('interest_clicked', {
      source: 'visagista_ranking',
      productId: product.id,
      productName: product.name,
      faceShape: result.faceShape,
    });
  };

  return (
    <div className="animate-fade-in space-y-12">
      <section className="rounded-3xl border border-sand bg-paper p-6 sm:p-8" aria-labelledby="preferencias-title">
        <h3 id="preferencias-title" className="section-title text-2xl">Sua personalidade também conta.</h3>
        <p className="mt-2 text-sm text-primary">Escolha o que procura. Suas sugestões mudam na hora, usando os modelos do catálogo.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <fieldset><legend className="mb-2 text-xs font-bold text-primary">Que tipo de óculos você procura?</legend><div className="flex flex-wrap gap-2">
            {(['Grau', 'Sol', 'Todos'] as const).map(category => <button key={category} type="button" aria-pressed={preferences.category === category} onClick={() => setPreferences(current => ({ ...current, category }))} className={`rounded-full border px-4 py-2 text-xs font-semibold ${preferences.category === category ? 'border-forest bg-forest text-white' : 'border-sand bg-white text-primary'}`}>{category === 'Todos' ? 'Todos' : `Óculos de ${category.toLowerCase()}`}</button>)}
          </div></fieldset>
          <fieldset><legend className="mb-2 text-xs font-bold text-primary">Qual estilo tem mais a sua cara?</legend><div className="flex flex-wrap gap-2">
            {(['Versátil', 'Discreto', 'Marcante'] as const).map(style => <button key={style} type="button" aria-pressed={preferences.style === style} onClick={() => setPreferences(current => ({ ...current, style }))} className={`rounded-full border px-4 py-2 text-xs font-semibold ${preferences.style === style ? 'border-forest bg-forest text-white' : 'border-sand bg-white text-primary'}`}>{style}</button>)}
          </div></fieldset>
        </div>
      </section>
      {/* 1. Header do Laudo */}
      <div className="overflow-hidden rounded-3xl border border-sand bg-paper shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Lado Esquerdo: Diagnóstico Principal */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-primary p-8 sm:p-12 text-[#FAF8F5]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-highlight">
                <ScanFace size={14} /> Seu guia de estilo Nezzo
              </div>

              <span className="mt-8 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5]/60">
                Seu contorno aparente
              </span>
              <h2 className="mt-2 text-4xl sm:text-5xl font-medium tracking-tight text-[#FAF8F5]">
                {result.faceShape}
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-[#FAF8F5]/80">
                {result.description}
              </p>
            </div>

            {/* Sugestão de Porte de Armação */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-highlight">
                Ajuste que faz a diferença
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-sm leading-relaxed text-white/85">A largura da armação, o apoio no nariz e o conforto das hastes precisam ser conferidos ao experimentar. Uma foto sozinha não determina medidas em milímetros.</p>
              </div>
            </div>
          </div>

          {/* Lado Direito: Métricas Reais & Estilo */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 border-b border-sand pb-4">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {result.source === 'local'
                      ? 'Análise de proporções'
                      : 'Curadoria Inteligente Nezzo'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest">
                  Foto nesta sessão
                </span>
              </div>

              {/* Grid de Proporções Reais Calculadas */}
              {result.metrics ? (
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Ruler size={14} className="text-accent" />
                    Proporções observadas na foto
                  </h4>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-sand bg-light p-3">
                      <span className="block text-[10px] font-semibold text-ink/50 uppercase">
                        Altura / Largura
                      </span>
                      <strong className="mt-1 block text-lg font-bold text-primary">
                        {result.metrics.aspectRatio.toFixed(2)}x
                      </strong>
                      <span className="text-[10px] text-ink/60">Proporção vertical</span>
                    </div>

                    <div className="rounded-xl border border-sand bg-light p-3">
                      <span className="block text-[10px] font-semibold text-ink/50 uppercase">
                        Mandíbula / Maçãs
                      </span>
                      <strong className="mt-1 block text-lg font-bold text-primary">
                        {(result.metrics.jawToCheekRatio * 100).toFixed(0)}%
                      </strong>
                      <span className="text-[10px] text-ink/60">Largura inferior</span>
                    </div>

                    <div className="rounded-xl border border-sand bg-light p-3">
                      <span className="block text-[10px] font-semibold text-ink/50 uppercase">
                        Orientação da foto
                      </span>
                      <strong className="mt-1 block text-lg font-bold text-accent">
                        {result.metrics.isFrontal ? 'Frontal' : 'Leve inclinação'}
                      </strong>
                      <span className="text-[10px] text-ink/60">Qualidade do enquadramento</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Guia de Estilo */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Layers size={14} className="text-accent" />
                  Diretriz de Harmonização Visual
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-primary bg-light p-4 rounded-2xl border border-sand">
                  {result.styleAdvice}
                </p>
                {chosen[0] && <div id="melhor-armacao" className="mt-4 rounded-2xl border border-forest/20 bg-mint p-4">
                  <span className="text-xs font-bold uppercase text-primary">Melhor opção do catálogo para experimentar</span>
                  <div className="relative mt-3 h-28 overflow-hidden rounded-xl bg-white"><CatalogPhoto product={chosen[0].product} /></div>
                  <strong className="mt-3 block text-base text-primary">{chosen[0].product.name}</strong>
                  <p className="mt-1 text-sm leading-relaxed text-primary">{chosen[0].reason}</p>
                  <a href="#recomendados" className="mt-2 inline-block text-xs font-semibold text-forest underline">Ver esta armação e outras opções</a>
                </div>}
              </div>

              {/* Formatos Recomendados */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                  Formatos de Armação Mais Favoráveis:
                </span>
                <div className="flex flex-wrap gap-2">
                  {recommendedShapes.map(shape => (
                    <span
                      key={shape}
                      className="inline-flex items-center gap-1 rounded-full bg-forest/surface px-3 py-1 text-xs font-semibold text-primary border border-forest/20"
                    >
                      <CheckCircle2 size={13} />
                      {shape}
                    </span>
                  ))}
                </div>
              </div>

              {/* Aviso Não Clínico (Anti-alucinação / LGPD) */}
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-sand bg-sand/30 p-3.5 text-[11px] leading-relaxed text-ink/70">
                <Info size={16} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <strong>Aviso Importante:</strong> Esta análise é uma estimativa anatômica e estética desenvolvida para orientação de estilo. Não substitui consulta médica com médico oftalmologista nem exame de acuidade visual.
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-sand pt-6">
              <a
                href={whatsappUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="btn-olive inline-flex items-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Experimentar modelos no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onRestart}
                className="btn-outline inline-flex items-center gap-2"
              >
                <RotateCcw size={15} />
                <span>Fazer nova análise</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* 2. Ranking de Armações Compatíveis do Catálogo Nezzo */}
      <div id="recomendados" className="scroll-mt-28">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="eyebrow">SELEÇÃO PERSONALIZADA · ÓTICA NEZZO</span>
            <h3 className="section-title mt-2 text-2xl sm:text-3xl">
              Armações selecionadas para <em>o seu estilo.</em>
            </h3>
            <p className="mt-1 text-xs text-ink/60">
              Modelos selecionados do nosso catálogo em Varginha compatíveis com o formato {result.faceShape}.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider hover:underline"
          >
            Ver todo o catálogo <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards Detalhados de Recomendação */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chosen.map(({ product, reason }, index) => (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-3xl border border-sand bg-paper p-5 shadow-sm transition hover:shadow-md hover:border-accent/50"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-[#FAF8F5]">
                    {index === 0 ? 'Melhor combinação' : `${index + 1}ª opção`}
                  </span>
                  <span className="text-[11px] font-semibold text-primary">
                    Formato {product.frameShape}
                  </span>
                </div>

                <div className="relative aspect-[1.25] overflow-hidden rounded-2xl bg-light border border-sand">
                  <CatalogPhoto product={product} alt={`Armação ${product.name}`} sizes="(max-width: 640px) 100vw, 300px" />
                  {product.size && (
                    <span className="absolute top-3 right-3 rounded-md bg-paper/90 px-2 py-0.5 text-[9px] font-bold text-primary shadow-sm border border-sand">
                      Tam. {product.size}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="text-base font-bold text-primary">{product.name}</h4>
                  <p className="text-xs text-ink/60 mt-0.5">{product.brand} · {product.color}</p>

                  <div className="mt-3 rounded-xl bg-light p-3 border border-sand">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                      Por que combina com você:
                    </span>
                    <p className="mt-1 text-xs text-ink/75 leading-relaxed">{reason}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-sand flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink/50 uppercase block">Valor</span>
                  <span className="text-sm font-bold text-primary">
                    {product.price > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price) : 'Preço sob consulta'}
                  </span>
                </div>

                <a
                  href={whatsappUrl(`Olá! Fiz o Visagista IA da Ótica Nezzo e a recomendação nº ${index + 1} foi o modelo "${product.name}". Gostaria de saber mais!`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleInterestClick(product)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] transition hover:bg-accent"
                >
                  <MessageCircle size={14} /> Tenho interesse
                </a>
              </div>
            </div>
          ))}
        </div>
        {chosen.length === 0 && <p className="text-sm text-primary">Nenhuma armação disponível no catálogo neste momento. Consulte a ótica pelo WhatsApp.</p>}
      </div>
    </div>
  );
}
