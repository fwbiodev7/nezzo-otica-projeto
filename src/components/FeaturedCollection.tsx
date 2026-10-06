'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useCatalog } from '@/lib/use-catalog';
import { ProductCard } from './ProductCard';

export function FeaturedCollection() {
  const products = useCatalog();
  const [category, setCategory] = useState<'Todos' | 'Grau' | 'Sol'>('Todos');

  const selected = products
    .filter((p) => category === 'Todos' || p.category === category)
    .slice(0, 4);

  return (
    <>
      <div className="section-heading flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <span className="eyebrow">CURADORIA EXCLUSIVA · ÓTICA NEZZO</span>
          <h2 className="section-title mt-3">
            Armações que revelam sua <em>personalidade.</em>
          </h2>
        </div>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent border-b border-accent/30 pb-1 hover:text-primary hover:border-primary transition-colors"
        >
          <span>Ver catálogo completo ({products.length} modelos)</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="collection-tabs mb-8 flex items-center gap-6 border-b border-sand pb-3">
        {(['Todos', 'Grau', 'Sol'] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={`text-xs font-semibold tracking-wider uppercase transition-colors pb-2 relative ${
              category === item
                ? 'text-primary border-b-2 border-accent'
                : 'text-ink/50 hover:text-ink'
            }`}
          >
            {item === 'Todos' ? 'Todas as Peças' : `Óculos de ${item}`}
          </button>
        ))}
        <span className="hidden sm:inline-block ml-auto text-[10px] tracking-widest uppercase text-ink/40 font-medium">
          Acetato Italiano & Ligas Metálicas Nobres
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {selected.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {selected.length === 0 && (
        <p className="py-12 text-center text-ink/60">
          Novas armações estão a caminho do nosso atelier. Consulte modelos pelo WhatsApp.
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-light p-5 border border-sand">
        <p className="text-xs text-ink/70">
          <strong className="text-primary font-semibold">Dúvida sobre o tamanho ou graduação?</strong> Lentes multifocais e visão simples montadas em laboratório próprio computadorizado.
        </p>
        <Link
          href="/visagismo"
          className="inline-flex items-center gap-2 text-xs font-bold text-accent whitespace-nowrap hover:underline"
        >
          Descobrir formato do seu rosto <ArrowUpRight size={14} />
        </Link>
      </div>
    </>
  );
}
