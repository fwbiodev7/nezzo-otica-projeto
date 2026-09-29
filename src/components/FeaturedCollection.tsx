'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useCatalog } from '@/lib/use-catalog';
import { ProductCard } from './ProductCard';
export function FeaturedCollection() {
  const products = useCatalog();
  const [category, setCategory] = useState('Todos');
  const selected = products.filter(p => category === 'Todos' || p.category === category).slice(0, 4);
  return <><div className="section-heading"><div><span className="eyebrow">UM ENCONTRO COM SEU ESTILO</span><h2 className="section-title mt-4">Seu próximo <em>favorito.</em></h2></div><Link href="/catalogo" className="text-link">Explore a vitrine <ArrowUpRight size={18} /></Link></div>
    <div className="collection-tabs" aria-label="Tipo de óculos">{['Todos', 'Grau', 'Sol'].map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item === 'Todos' ? 'Todos os olhares' : 'Óculos de ' + item.toLowerCase()}</button>)}<span>ESCOLHAS QUE DIZEM MUITO SOBRE VOCÊ</span></div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{selected.map(p => <ProductCard key={p.id} product={p} />)}</div>
    {selected.length === 0 && <p className="py-12 text-center text-ink/60">Novos modelos estão chegando. Converse com a nossa equipe.</p>}
    <p className="mt-6 text-xs text-ink/50">Vitrine demonstrativa. Consulte modelos, preços e disponibilidade com a equipe.</p>
  </>;
}
