'use client';

import Image from 'next/image';
import type { Product } from '@/types';

export function CatalogPhoto({ product, alt, sizes = '400px' }: { product: Product; alt?: string; sizes?: string }) {
  const crop = product.imageCrop;
  if (!crop) return <Image src={product.image} alt={alt || product.name} fill unoptimized sizes={sizes} className="object-contain" />;
  return <div className="flex h-full w-full items-center justify-center overflow-hidden">
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: crop.width / crop.height }}>
      <div className="absolute" style={{ width: `${crop.sourceWidth / crop.width * 100}%`, height: `${crop.sourceHeight / crop.height * 100}%`, left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%` }}>
        <Image src={product.image} alt={alt || product.name} fill unoptimized sizes={sizes} />
      </div>
    </div>
  </div>;
}
