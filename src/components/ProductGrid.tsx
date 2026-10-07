'use client';
import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { FrameShape, ProductCategory } from '@/types';
import { useCatalog } from '@/lib/use-catalog';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function ProductGrid({ initialCategory = 'Todos' }: { initialCategory?: ProductCategory | 'Todos' }) {
  const allProducts = useCatalog();
  const [category, setCategory] = useState<ProductCategory | 'Todos'>(initialCategory);
  const [shape, setShape] = useState<FrameShape | 'Todos'>('Todos');
  const [brand, setBrand] = useState('Todas');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');
  const [limit, setLimit] = useState(8);
  const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand))].sort((a,b) => a.localeCompare(b, 'pt-BR')), [allProducts]);
  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    const result = allProducts.filter(p => (category === 'Todos' || p.category === category) && (shape === 'Todos' || p.frameShape === shape) && (brand === 'Todas' || p.brand === brand) && normalize([p.name, p.brand, p.color, p.frameShape, ...p.tags].join(' ')).includes(term));
    if (sort === 'price-asc') result.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a,b) => b.price - a.price);
    if (sort === 'name') result.sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));
    return result;
  }, [allProducts, category, shape, brand, query, sort]);
  function reset() { setCategory('Todos'); setShape('Todos'); setBrand('Todas'); setQuery(''); setLimit(8); }
  const field = 'min-h-12 rounded-lg border border-primary/15 bg-white px-4 text-xs text-primary outline-none focus:border-accent';
  return <>
    <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_200px]">
      <label className={'flex items-center gap-3 ' + field}><Search size={17} className="shrink-0 text-accent" /><input aria-label="Buscar óculos" placeholder="Encontre por nome, marca, cor ou estilo..." value={query} onChange={e => { setQuery(e.target.value); setLimit(8); }} className="min-w-0 flex-1 bg-transparent py-3 outline-none" />{query && <button type="button" aria-label="Limpar busca" onClick={() => setQuery('')}><X size={16} /></button>}</label>
      <select aria-label="Filtrar por marca" className={field} value={brand} onChange={e => { setBrand(e.target.value); setLimit(8); }}><option value="Todas">Todas as marcas</option>{brands.map(b => <option key={b}>{b}</option>)}</select>
      <select aria-label="Ordenar produtos" className={field} value={sort} onChange={e => { setSort(e.target.value); setLimit(8); }}><option value="recent">Destaques da coleção</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome: A a Z</option></select>
    </div>
    <CategoryFilter category={category} shape={shape} onCategory={v => { setCategory(v); setLimit(8); }} onShape={v => { setShape(v); setLimit(8); }} />
    <div className="mb-6 mt-6 flex items-center justify-between border-b border-primary/10 pb-4 text-xs text-ink/60"><p aria-live="polite" className="flex items-center gap-2"><SlidersHorizontal size={14} />{filtered.length} {filtered.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}</p>{(category !== 'Todos' || shape !== 'Todos' || brand !== 'Todas' || query) && <button type="button" onClick={reset} className="text-primary underline underline-offset-4">Limpar filtros</button>}</div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.slice(0, limit).map(p => <ProductCard key={p.id} product={p} />)}</div>
    {filtered.length === 0 && <div className="rounded-2xl border border-primary/10 p-12 text-center"><h2 className="text-xl">Ainda não encontramos esse olhar.</h2><p className="mt-3 text-sm text-ink/60">Experimente outra marca, formato ou palavra na busca.</p><button type="button" className="btn-primary mt-6" onClick={reset}>Ver todos os óculos</button></div>}
    {filtered.length > limit && <div className="mt-10 text-center"><button type="button" onClick={() => setLimit(n => n + 8)} className="btn-outline">Ver mais modelos ({filtered.length - limit})</button></div>}
  </>;
}
