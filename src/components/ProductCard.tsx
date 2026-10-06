'use client';

import Image from 'next/image';
import { ArrowUpRight, MessageCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';
import { whatsappUrl } from '@/lib/mock-data';
import { trackEvent } from '@/lib/analytics';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const [failedImage, setFailedImage] = useState<string | null>(null);

  const message = `Olá! Gostei muito da armação "${product.name}" (${product.brand} - ${product.frameShape}). Vocês têm disponível para eu experimentar?`;
  const href = whatsappUrl(message);

  const handleClick = () => {
    trackEvent('product_viewed', {
      productId: product.id,
      productName: product.name,
      frameShape: product.frameShape,
    });
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      source: 'product_card',
      productId: product.id,
      productName: product.name,
    });
  };

  return (
    <article className="product-card group flex flex-col justify-between">
      <div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            handleClick();
            handleWhatsAppClick();
          }}
          className="product-image block relative"
          aria-label={`Ver detalhes de ${product.name} no WhatsApp`}
        >
          <Image
            src={failedImage === product.image ? '/images/frame-champagne.png' : product.image}
            onError={() => setFailedImage(product.image)}
            alt={`Armação ${product.name} - Ótica Nezzo`}
            fill
            unoptimized={!product.image.startsWith('/images/')}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
          <span className="product-category">
            {product.category === 'Grau' ? 'Armação de Grau' : 'Óculos de Sol'}
          </span>
          {product.size && (
            <span className="absolute top-3.5 right-3.5 rounded-full bg-paper/90 px-2 py-0.5 text-[9px] font-bold text-accent shadow-sm border border-sand">
              Tam. {product.size}
            </span>
          )}
          <span className="product-arrow">
            <ArrowUpRight size={17} />
          </span>
        </a>

        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">
              {product.brand}
            </p>
            {product.featured && (
              <span className="inline-flex items-center gap-1 text-[9px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                <Sparkles size={10} /> Destaque
              </span>
            )}
          </div>

          <h3 className="mt-1 text-[16px] font-semibold tracking-tight text-primary group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-ink/60">
            Formato {product.frameShape} · {product.color}
          </p>

          {product.tags && product.tags.length > 0 && !compact && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-sand/50 px-2 py-0.5 text-[10px] text-ink/75"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-sand pt-3">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-ink/45">Investimento</span>
          <span className="text-[14px] font-bold text-primary">
            {money.format(product.price)}
          </span>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="inline-flex items-center gap-1.5 rounded-full bg-light px-3.5 py-1.5 text-[11px] font-semibold text-primary transition-all hover:bg-accent hover:text-[#FAF8F5]"
        >
          <MessageCircle size={13} />
          <span>Experimentar</span>
        </a>
      </div>
    </article>
  );
}
