'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useCatalog } from '@/lib/use-catalog';
import { ProductCard } from './ProductCard';

const TABS = [
  { key: 'Todos', label: 'Todas as peças' },
  { key: 'Grau',  label: 'Óculos de Grau' },
  { key: 'Sol',   label: 'Óculos de Sol' },
] as const;

type Tab = typeof TABS[number]['key'];

export function FeaturedCollection() {
  const products = useCatalog();
  const [category, setCategory] = useState<Tab>('Todos');

  const selected = products
    .filter((p) => category === 'Todos' || p.category === category)
    .slice(0, 4);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <span className="eyebrow">CURADORIA EXCLUSIVA · ÓTICA NEZZO</span>
          <h2 className="section-title mt-3">
            Armações que revelam sua <em>personalidade.</em>
          </h2>
        </div>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.14em] text-forest border-b border-forest/30 pb-1 hover:border-forest transition-colors whitespace-nowrap"
        >
          Ver catálogo completo ({products.length} modelos)
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex items-center gap-1 border-b border-forest/10 pb-0">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={category === key}
            onClick={() => setCategory(key)}
            className={`
              relative px-4 py-3 text-xs font-semibold tracking-wider uppercase transition-colors
              ${category === key ? 'text-forest' : 'text-muted hover:text-ink'}
            `}
          >
            {label}
            {category === key && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: 'var(--c-forest)' }}
              />
            )}
          </button>
        ))}
        <span className="hidden sm:inline ml-auto text-2xs tracking-widest uppercase text-muted font-medium pr-1">
          Acetato italiano &amp; titânio
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {selected.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {selected.length === 0 && (
        <p className="py-12 text-center text-muted text-sm">
          Novas armações estão a caminho. Consulte modelos pelo WhatsApp.
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-mint border border-forest/10 p-5">
        <p className="text-xs text-muted">
          <strong className="text-ink font-semibold">Dúvida sobre tamanho ou graduação?</strong>{' '}
          Lentes multifocais e visão simples montadas em laboratório computadorizado próprio.
        </p>
        <Link
          href="/visagismo"
          className="inline-flex items-center gap-2 text-xs font-bold text-forest whitespace-nowrap hover:underline"
        >
          Descobrir formato do seu rosto <ArrowUpRight size={14} />
        </Link>
      </div>
    </>
  );
}
