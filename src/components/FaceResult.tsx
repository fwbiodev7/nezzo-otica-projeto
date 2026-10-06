'use client';

import Link from 'next/link';
import Image from 'next/image';
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
import { ProductCard } from './ProductCard';
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

  const matched = (result.recommendedProducts || [])
    .map(item => ({
      product: products.find(product => product.id === item.productId),
      reason: item.reason,
    }))
    .filter((item): item is { product: Product; reason: string } => Boolean(item.product));

  const chosen = [
    ...matched,
    ...products
      .filter(
        p =>
          !matched.some(item => item.product.id === p.id) &&
          result.recommendedFrameShapes.includes(p.frameShape)
      )
      .map(product => ({
        product,
        reason: 'O desenho desta armação equilibra proporcionalmente as linhas observadas.',
      })),
  ].slice(0, 3);

  const suggestedSize = result.suggestedSize || result.metrics?.suggestedSize || 'M';

  const whatsappMessage = `Olá! Fiz a análise no Visagista IA da Ótica Nezzo. Meu formato identificado foi "${result.faceShape}" com tamanho sugerido "${suggestedSize}". Gostaria de experimentar as armações: ${chosen
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
      {/* 1. Header do Laudo */}
      <div className="overflow-hidden rounded-3xl border border-sand bg-paper shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Lado Esquerdo: Diagnóstico Principal */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-primary p-8 sm:p-12 text-[#FAF8F5]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-highlight">
                <ScanFace size={14} /> Laudo Visagista Nezzo 2.0
              </div>

              <span className="mt-8 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5]/60">
                Formato Facial Identificado
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
                Porte Sugerido de Armação
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">Tamanho {suggestedSize}</span>
                <span className="text-xs text-[#FAF8F5]/60">
                  {suggestedSize === 'P'
                    ? '(Aros entre 48mm e 51mm)'
                    : suggestedSize === 'G'
                    ? '(Aros a partir de 55mm)'
                    : '(Aros entre 52mm e 54mm)'}
                </span>
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
                      ? 'Processamento Biométrico Local (MediaPipe)'
                      : 'Curadoria Inteligente Nezzo'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest">
                  Privacidade 100% Protegida
                </span>
              </div>

              {/* Grid de Proporções Reais Calculadas */}
              {result.metrics ? (
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Ruler size={14} className="text-accent" />
                    Proporções Faciais Mensuradas
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
                        Simetria Bilateral
                      </span>
                      <strong className="mt-1 block text-lg font-bold text-accent">
                        {(result.metrics.symmetryRatio * 100).toFixed(0)}%
                      </strong>
                      <span className="text-[10px] text-ink/60">Equilíbrio dos eixos</span>
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
                <p className="mt-2 text-sm leading-relaxed text-ink/80 bg-light/70 p-4 rounded-2xl border border-sand">
                  {result.styleAdvice}
                </p>
              </div>

              {/* Formatos Recomendados */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                  Formatos de Armação Mais Favoráveis:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.recommendedFrameShapes.map(shape => (
                    <span
                      key={shape}
                      className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20"
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
              Armações perfeitas para <em>o seu perfil.</em>
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
                    {index + 1}º Recomendação
                  </span>
                  <span className="text-[11px] font-semibold text-accent">
                    Formato {product.frameShape}
                  </span>
                </div>

                <div className="relative aspect-[1.25] overflow-hidden rounded-2xl bg-light border border-sand">
                  <Image
                    src={product.image}
                    alt={`Armação ${product.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
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
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
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
      </div>
    </div>
  );
}
