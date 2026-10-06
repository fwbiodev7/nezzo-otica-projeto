import type { Metadata } from 'next';
import { ProductGrid } from '@/components/ProductGrid';
import type { ProductCategory } from '@/types';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Catálogo de Óculos & Armações | Ótica Nezzo',
  description: 'Conheça a curadoria de armações de grau e sol da Ótica Nezzo em Varginha - MG. Acetato nobre, titânio e designs contemporâneos.',
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const category: ProductCategory | 'Todos' =
    categoria === 'Grau' || categoria === 'Sol' || categoria === 'Multifocal'
      ? categoria
      : 'Todos';

  return (
    <>
      <section className="bg-light border-b border-sand">
        <div className="container-wide py-16 sm:py-20">
          <span className="eyebrow">CURADORIA DE ESTILO · ÓTICA NEZZO</span>
          <h1 className="section-title mt-4">
            Armações com <em>a sua personalidade.</em>
          </h1>
          <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-ink/75">
            Explore modelos receituário e solares com materiais de alto padrão. Encontrou sua peça favorita? Agende um atendimento ou consulte disponibilidade via WhatsApp com nossos especialistas em Varginha.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 pb-28">
        <ProductGrid key={category} initialCategory={category} />
      </section>
    </>
  );
}
