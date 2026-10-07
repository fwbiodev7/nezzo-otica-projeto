'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import type { FacePlacement, Product } from '@/types';
import { CatalogPhoto } from './CatalogPhoto';
import { FrameIllustration } from './FrameIllustration';

async function framePhoto(product: Product): Promise<string> {
  const response = await fetch(product.image, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error('Não foi possível carregar a foto desta armação.');
  const blob = await response.blob();
  if (blob.size > 10 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(blob.type)) {
    throw new Error('A foto da armação deve ser JPG, PNG ou WebP, com até 10 MB.');
  }
  if (product.imageCrop) {
    const bitmap = await createImageBitmap(blob);
    const crop = product.imageCrop;
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const context = canvas.getContext('2d');
    if (!context) { bitmap.close(); throw new Error('Não foi possível preparar a foto da armação.'); }
    context.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL('image/jpeg', 0.92);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível ler a foto da armação.'));
    reader.readAsDataURL(blob);
  });
}

export function VirtualTryOn({ image, products, placement, cloudAvailable = false }: { image: string; products: Product[]; placement?: FacePlacement; cloudAvailable?: boolean }) {
  const [selected, setSelected] = useState(products[0]?.id || '');
  const [preview, setPreview] = useState<{ id: string; image: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [illustrated, setIllustrated] = useState(Boolean(placement));
  const cache = useRef(new Map<string, string>());
  const product = products.find(item => item.id === selected) || products[0];
  const cacheKey = product ? JSON.stringify([product.id, product.image, product.imageCrop]) : '';

  async function tryOn() {
    if (!product || loading) return;
    setError('');
    if (!cloudAvailable && placement) { setIllustrated(true); return; }
    const cached = cache.current.get(cacheKey);
    if (cached) { setPreview({ id: product.id, image: cached }); return; }
    setPreview(null);
    setLoading(true);
    try {
      const frameImage = await framePhoto(product);
      const response = await fetch('/api/provador', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, frameImage }), signal: AbortSignal.timeout(85_000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível gerar a prévia.');
      if (typeof data.image !== 'string' || !data.image.startsWith('data:image/')) throw new Error('A IA não retornou uma foto válida.');
      cache.current.set(cacheKey, data.image);
      setPreview({ id: product.id, image: data.image });
    } catch (err) {
      setError(err instanceof Error && err.name !== 'TimeoutError' ? err.message : 'A prévia demorou demais. Tente novamente.');
      if (placement) setIllustrated(true);
    } finally { setLoading(false); }
  }

  if (!product) return null;
  return (
    <section className="rounded-3xl border border-sand bg-paper p-6 sm:p-8" aria-labelledby="provador-title">
      <h3 id="provador-title" className="section-title text-2xl">Veja os óculos no seu rosto</h3>
      <p className="mt-2 text-sm text-primary">Compare os modelos e descubra o formato que combina com você.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-light" style={{ aspectRatio: placement?.imageAspectRatio || 4 / 3 }} aria-busy={loading}>
          <Image src={preview?.id === product.id ? preview.image : image} alt={preview?.id === product.id ? `Prévia com ${product.name}` : 'Sua foto original'} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
          {illustrated && placement && preview?.id !== product.id && <FrameIllustration placement={placement} product={product} />}
          {loading && <div className="absolute inset-0 flex items-center justify-center gap-2 bg-paper/80 text-primary" role="status"><LoaderCircle className="animate-spin" size={22} /> Gerando sua prévia…</div>}
        </div>
        <div>
          <label htmlFor="tryon-model" className="text-sm font-semibold text-primary">Modelo escolhido</label>
          <select id="tryon-model" value={product.id} disabled={loading} onChange={event => { setSelected(event.target.value); setPreview(null); setError(''); }} className="mt-2 w-full rounded-xl border border-sand bg-paper p-3 text-sm text-primary">
            {products.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <div className="relative mt-4 h-44 overflow-hidden rounded-xl bg-light">
            <CatalogPhoto product={product} alt={`Foto de ${product.name}`} sizes="(max-width: 768px) 100vw, 400px" />
          </div>
          <button type="button" disabled={loading} onClick={tryOn} className="btn-olive mt-5 disabled:opacity-50"><Sparkles size={17} /> Experimentar no meu rosto</button>
          <p className="mt-3 text-xs leading-relaxed text-primary">{preview?.id === product.id ? 'Prévia gerada por IA: detalhes e ajuste podem variar.' : 'A prévia ilustrativa mostra o formato e a cor aproximados, alinhados aos seus olhos. Compare também a foto real da armação.'} {cloudAvailable && 'Ao gerar uma prévia com IA, sua foto e a da armação são enviadas ao serviço em nuvem.'}</p>
          {placement && cloudAvailable && <button type="button" disabled={loading} onClick={() => { setPreview(null); setIllustrated(true); setError(''); }} className="mt-3 text-xs font-semibold text-forest underline">Ver simulação rápida do formato</button>}
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </section>
  );
}
