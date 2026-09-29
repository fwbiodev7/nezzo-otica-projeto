import type { Metadata } from 'next';
import { ProductGrid } from '@/components/ProductGrid';
import type { ProductCategory } from '@/types';
export const metadata: Metadata = { title: 'Nossos óculos' };
export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const category: ProductCategory | 'Todos' = categoria === 'Grau' || categoria === 'Sol' || categoria === 'Multifocal' ? categoria : 'Todos';
  return <><section className="page-banner"><div className="container-wide py-16 sm:py-20"><span className="eyebrow">VITRINE sua-marca</span><h1 className="section-title mt-4">Óculos com <em>o seu ponto de vista.</em></h1><p className="mt-5 max-w-xl text-sm leading-7 text-ink/65">Explore formatos, cores e possibilidades. Gostou de um modelo? Converse com a sua-marca e venha experimentar em Varginha.</p></div></section><section className="container-wide py-10 pb-24"><ProductGrid key={category} initialCategory={category} /><p className="mt-8 text-xs text-ink/50">Vitrine demonstrativa. Imagens e preços ilustrativos. Consulte disponibilidade e condições com a equipe.</p></section></>;
}
