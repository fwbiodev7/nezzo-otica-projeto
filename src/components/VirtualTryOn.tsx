'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import type { FacePlacement, Product } from '@/types';
import { CatalogPhoto } from './CatalogPhoto';

async function framePhoto(product: Product): Promise<string> {
  const response = await fetch(product.image, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error('Não foi possível carregar a foto desta armação.');
  const blob = await response.blob();
  if (blob.size > 10 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(blob.type)) {
    throw new Error('A foto da armação deve ser JPG, PNG ou WebP, com até 10 MB.');
  }
  const bitmap = await createImageBitmap(blob);
  const crop = product.imageCrop || { x: 0, y: 0, width: bitmap.width, height: bitmap.height };
  const scale = Math.min(1, 1024 / Math.max(crop.width, crop.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(crop.width * scale));
  canvas.height = Math.max(1, Math.round(crop.height * scale));
  const context = canvas.getContext('2d');
  if (!context) { bitmap.close(); throw new Error('Não foi possível preparar a foto da armação.'); }
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.9);
}

export function VirtualTryOn({ image, products, placement, cloudAvailable = false }: { image: string; products: Product[]; placement?: FacePlacement; cloudAvailable?: boolean }) {
  const [selected, setSelected] = useState(products[0]?.id || '');
  const [preview, setPreview] = useState<{ key: string; image: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const cache = useRef(new Map<string, string>());
  const product = products.find(item => item.id === selected) || products[0];
  const cacheKey = product ? JSON.stringify([image, product.id, product.image, product.imageCrop]) : '';
  const hasPreview = preview?.key === cacheKey;
  const showPreview = hasPreview && !showOriginal;

  async function tryOn() {
    if (!product || loading || !cloudAvailable) return;
    setError('');
    setShowOriginal(false);
    const cached = cache.current.get(cacheKey);
    if (cached) { setPreview({ key: cacheKey, image: cached }); return; }
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
      setPreview({ key: cacheKey, image: data.image });
    } catch (err) {
      setError(err instanceof Error && err.name !== 'TimeoutError' ? err.message : 'A prévia demorou demais. Tente novamente.');
    } finally { setLoading(false); }
  }

  if (!product) return null;
  return (
    <section className="rounded-3xl border border-sand bg-paper p-6 sm:p-8" aria-labelledby="provador-title">
      <h3 id="provador-title" className="section-title text-2xl">Veja os óculos no seu rosto</h3>
      <p className="mt-2 text-sm text-primary">Escolha uma armação do catálogo e gere uma foto com ela no seu rosto.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-light" style={{ aspectRatio: placement?.imageAspectRatio || 4 / 3 }} aria-busy={loading}>
          <Image src={showPreview && preview ? preview.image : image} alt={showPreview ? `Prévia com ${product.name}` : 'Sua foto original'} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
          <span className="absolute left-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm">{showPreview ? 'Prévia com IA' : 'Sua foto'}</span>
          {loading && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper/90 px-6 text-center text-primary" role="status"><LoaderCircle className="animate-spin" size={26} /><span className="font-semibold">Criando sua foto com os óculos…</span><span className="text-xs">Pode levar alguns instantes.</span></div>}
        </div>
        <div>
          <label htmlFor="tryon-model" className="text-sm font-semibold text-primary">Modelo escolhido</label>
          <select id="tryon-model" value={product.id} disabled={loading} onChange={event => { setSelected(event.target.value); setPreview(null); setError(''); }} className="mt-2 w-full rounded-xl border border-sand bg-paper p-3 text-sm text-primary">
            {products.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <div className="relative mt-4 h-44 overflow-hidden rounded-xl bg-light">
            <CatalogPhoto product={product} alt={`Foto de ${product.name}`} sizes="(max-width: 768px) 100vw, 400px" />
          </div>
          <button type="button" disabled={loading || !cloudAvailable} onClick={tryOn} className="btn-olive mt-5 disabled:opacity-50"><Sparkles size={17} /> {loading ? 'Gerando sua foto…' : 'Gerar prévia com IA'}</button>
          {hasPreview && <button type="button" disabled={loading} onClick={() => setShowOriginal(value => !value)} className="mt-3 block text-xs font-semibold text-forest underline">{showOriginal ? 'Ver foto com os óculos' : 'Comparar com minha foto original'}</button>}
          <p className="mt-3 text-xs leading-relaxed text-primary">{cloudAvailable ? 'Ao gerar, sua foto e a da armação são enviadas ao Gemini. A imagem é uma simulação: detalhes e ajuste podem variar. Confirme o conforto ao experimentar na loja.' : 'A prévia com IA está indisponível no momento. Você pode comparar as fotos das armações e consultar nossa equipe.'}</p>
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </section>
  );
}
