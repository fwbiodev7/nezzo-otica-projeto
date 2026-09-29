'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Plus, X, Upload, Check, Sparkles, Edit3 } from 'lucide-react';
import type { FrameShape, Product, ProductCategory } from '@/types';
import { siteConfig } from '@/lib/site-config';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  productToEdit?: Product | null;
}

const TEMPLATE_IMAGES = [
  { label: 'Redondo (Champagne)', path: '/images/frame-champagne.png', defaultShape: 'Redondo' },
  { label: 'Gatinho (Preto / Sofisticado)', path: '/images/frame-cat-eye.png', defaultShape: 'Gatinho' },
  { label: 'Aviador (Dourado / Metal)', path: '/images/frame-aviator.png', defaultShape: 'Aviador' },
  { label: 'Retangular (Urbano)', path: '/images/frame-rectangular.png', defaultShape: 'Retangular' },
];

export function AddProductModal(props: AddProductModalProps) {
  return props.isOpen ? <ProductModalForm key={props.productToEdit?.id || 'new'} {...props} /> : null;
}

function ProductModalForm({ isOpen, onClose, onAddProduct, productToEdit }: AddProductModalProps) {
  const [name, setName] = useState(productToEdit?.name ?? '');
  const [brand, setBrand] = useState(productToEdit?.brand ?? siteConfig.collectionName);
  const [price, setPrice] = useState(productToEdit?.price.toString() ?? '399');
  const [category, setCategory] = useState<ProductCategory>(productToEdit?.category ?? 'Grau');
  const [frameShape, setFrameShape] = useState<FrameShape>(productToEdit?.frameShape ?? 'Redondo');
  const [color, setColor] = useState(productToEdit?.color ?? '');
  const [tags, setTags] = useState(productToEdit?.tags.join(', ') ?? 'Acetato, Leve');
  const [image, setImage] = useState(productToEdit?.image ?? TEMPLATE_IMAGES[0].path);
  const [imageCustom, setImageCustom] = useState<string | null>(productToEdit?.image.startsWith('data:') ? productToEdit.image : null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [isOpen]);

  function resetForm() {
    setError('');
    setName('');
    setBrand(siteConfig.collectionName);
    setPrice('399');
    setCategory('Grau');
    setFrameShape('Redondo');
    setColor('');
    setTags('Acetato, Leve');
    setImage(TEMPLATE_IMAGES[0].path);
    setImageCustom(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  if (!isOpen) return null;

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) { setError('Envie uma foto JPG, PNG ou WebP de até 10 MB.'); return; }
    setUploading(true);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) { bitmap.close(); throw new Error('Não foi possível preparar a foto.'); }
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      const optimized = canvas.toDataURL('image/jpeg', .82);
      setImageCustom(optimized); setImage(optimized);
    } catch { setError('Não foi possível abrir essa foto. Tente outra imagem.'); }
    finally { setUploading(false); }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const amount = Number(price);
    if (!price.trim() || !Number.isFinite(amount) || amount < 0) { setError('Informe um preço válido.'); return; }

    const productData: Product = {
      id: productToEdit ? productToEdit.id : 'custom-' + crypto.randomUUID(),
      name: name.trim(),
      brand: brand.trim() || siteConfig.collectionName,
      price: amount,
      image,
      category,
      frameShape,
      color: color.trim() || 'Padrão',
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    };

    try { onAddProduct(productData); resetForm(); onClose(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível salvar o produto.'); }
  }

  const isEditing = Boolean(productToEdit);

  return (
    <dialog ref={dialogRef} onCancel={handleClose} aria-labelledby="product-dialog-title" className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl bg-transparent p-0 backdrop:bg-primary/60 backdrop:backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-primary/10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary/10 px-6 py-5 bg-gradient-to-r from-light to-white">
          <div className="flex items-center gap-2 text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
              {isEditing ? <Edit3 size={19} /> : <Plus size={20} />}
            </span>
            <div>
              <h2 id="product-dialog-title" className="text-lg font-bold text-primary">
                {isEditing ? 'Editar Armação' : 'Adicionar Nova Armação'}
              </h2>
              <p className="text-xs text-ink/60">
                {isEditing
                  ? `Atualizando informações de "${productToEdit?.name}"`
                  : 'Cadastre um modelo para exibir no catálogo da loja'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar cadastro"
            className="rounded-full p-2 text-ink/40 hover:bg-light hover:text-ink transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
          <div>
            <label htmlFor="product-name" className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">
                Nome do Modelo *
            </label>
            <input
              type="text"
              required
              id="product-name"
                value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Milano Havana, Óculos Capri..."
              className="w-full rounded-xl border border-primary/15 bg-light/40 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-accent focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="product-brand" className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">
                Marca / Coleção
              </label>
              <input
                type="text"
                id="product-brand"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder={`Ex: ${siteConfig.collectionName}, Ray-Ban...`}
                className="w-full rounded-xl border border-primary/15 bg-light/40 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-accent focus:bg-white transition"
              />
            </div>

            <div>
              <label htmlFor="product-category" className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">
                Tipo
              </label>
              <select
                id="product-category"
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full rounded-xl border border-primary/15 bg-light/40 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-accent focus:bg-white transition"
              >
                <option value="Grau">Grau</option>
                <option value="Sol">Sol</option>
                <option value="Multifocal">Multifocal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="product-frameShape" className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">
                Formato da armação
              </label>
              <select
                id="product-frameShape"
                value={frameShape}
                onChange={e => setFrameShape(e.target.value as FrameShape)}
                className="w-full rounded-xl border border-primary/15 bg-light/40 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-accent focus:bg-white transition"
              >
                <option value="Redondo">Redondo</option>
                <option value="Oval">Oval</option>
                <option value="Gatinho">Gatinho</option>
                <option value="Aviador">Aviador</option>
                <option value="Retangular">Retangular</option>
                <option value="Quadrado">Quadrado</option>
              </select>
            </div>

            <div>
              <label htmlFor="product-price" className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                id="product-price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="399"
                className="w-full rounded-xl border border-primary/15 bg-light/40 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-accent focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="product-color" className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">
                Cor da Armação
              </label>
              <input
                type="text"
                id="product-color"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="Ex: Dourado, Preto..."
                className="w-full rounded-xl border border-primary/15 bg-light/40 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-accent focus:bg-white transition"
              />
            </div>

            <div>
              <label htmlFor="product-tags" className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                id="product-tags"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Acetato, Leve, UV"
                className="w-full rounded-xl border border-primary/15 bg-light/40 px-3.5 py-2.5 text-sm font-semibold text-primary outline-none focus:border-accent focus:bg-white transition"
              />
            </div>
          </div>

          {/* Selecionar Foto */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-2">
              Foto da Armação
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {TEMPLATE_IMAGES.map(tmpl => (
                <button
                  key={tmpl.path}
                  type="button"
                  onClick={() => {
                    setImage(tmpl.path);
                    setImageCustom(null);
                    setFrameShape(tmpl.defaultShape as FrameShape);
                  }}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                    image === tmpl.path
                      ? 'border-accent ring-2 ring-accent/30 shadow-md'
                      : 'border-primary/10 hover:border-primary/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={tmpl.path} alt={tmpl.label} fill sizes="90px" className="object-cover" />
                  {image === tmpl.path && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/25 bg-light/50 px-4 py-2.5 text-xs font-bold text-primary hover:border-accent hover:bg-accent/5 hover:text-accent transition cursor-pointer">
              <Upload size={14} />
              <span>{imageCustom ? 'Foto personalizada carregada (trocar)' : 'Ou enviar foto do seu computador / celular'}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileUpload} className="sr-only" />
            </label>
          </div>

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-full border border-primary/15 px-4 py-3 text-sm font-bold text-primary hover:bg-light transition"
            >
              Cancelar
            </button>
            <button type="submit" disabled={uploading} className="flex-1 btn-primary disabled:opacity-50">
              <Sparkles size={16} /> {isEditing ? 'Salvar Alterações' : 'Cadastrar no Catálogo'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
