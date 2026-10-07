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
            <span className="absolute top-3.5 right-3.5 rounded-full bg-void/80 px-2 py-0.5 text-2xs font-bold text-gold border border-gold/20 backdrop-blur-sm">
              Tam. {product.size}
            </span>
          )}
          <span className="product-arrow">
            <ArrowUpRight size={17} />
          </span>
        </a>

        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-2xs font-bold uppercase tracking-[0.18em] text-gold/80">
              {product.brand}
            </p>
            {product.featured && (
              <span className="inline-flex items-center gap-1 text-2xs font-bold text-amber px-2 py-0.5 rounded-full bg-amber/10 border border-amber/20">
                <Sparkles size={10} /> Destaque
              </span>
            )}
          </div>

          <h3 className="mt-1 text-base font-semibold tracking-tight text-cream group-hover:text-gold transition-colors">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-muted">
            Formato {product.frameShape} · {product.color}
          </p>

          {product.tags && product.tags.length > 0 && !compact && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-mid bg-dark px-2.5 py-0.5 text-2xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-mid pt-3">
        <div>
          <span className="block text-2xs uppercase tracking-wider text-muted">Investimento</span>
          <span className="text-sm font-semibold text-gold">
            {money.format(product.price)}
          </span>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="inline-flex items-center gap-1.5 rounded-full bg-dark border border-mid px-3.5 py-1.5 text-2xs font-semibold text-soft transition-all hover:bg-gold hover:border-gold hover:text-void"
        >
          <MessageCircle size={13} />
          <span>Experimentar</span>
        </a>
      </div>
    </article>
  );
}
