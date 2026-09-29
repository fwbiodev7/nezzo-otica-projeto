import { products as defaultProducts } from '@/lib/mock-data';
import type { Product } from '@/types';
import { siteConfig } from './site-config';

// Mantém as chaves antigas para preservar o catálogo já cadastrado no navegador.
export const CATALOG_STORAGE_KEY = 'oticafabio_catalog_v1';
export const CATALOG_CHANGE_EVENT = 'oticafabio_catalog_changed';
const shapes = ['Redondo', 'Gatinho', 'Aviador', 'Retangular', 'Oval', 'Quadrado'];
const categories = ['Grau', 'Sol', 'Multifocal'];
function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return ['id', 'name', 'brand', 'color', 'image'].every(k => typeof p[k] === 'string' && (p[k] as string).trim().length > 0)
    && typeof p.price === 'number' && Number.isFinite(p.price) && p.price >= 0
    && shapes.includes(p.frameShape as string) && categories.includes(p.category as string)
    && Array.isArray(p.tags) && p.tags.every(t => typeof t === 'string')
    && (/^\/images\/[a-zA-Z0-9._/-]+$/.test(p.image as string) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.image as string) || /^https:\/\/[^\s]+$/.test(p.image as string));
}
function validateCatalog(value: unknown): Product[] {
  if (!Array.isArray(value) || !value.every(isProduct) || new Set(value.map(p => p.id)).size !== value.length) throw new Error('Catálogo inválido. Confira os campos dos produtos, os preços e os identificadores duplicados.');
  return value.map(p => ({ ...p, brand: ['Coleção Fábio', 'Coleção Inovação', 'Coleção Sul'].includes(p.brand) ? siteConfig.collectionName : p.brand }));
}
export function loadCatalog(): Product[] {
  if (typeof window === 'undefined') return defaultProducts;
  try {
    const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (saved !== null) return validateCatalog(JSON.parse(saved));
    const legacy = localStorage.getItem('oticafabio_custom_products');
    if (legacy !== null) {
      const items = validateCatalog(JSON.parse(legacy));
      return [...items, ...defaultProducts.filter(p => !items.some(item => item.id === p.id))];
    }
  } catch { /* Um backup corrompido não pode impedir a abertura da vitrine. */ }
  return defaultProducts;
}
export function saveCatalog(items: Product[]): void {
  const validated = validateCatalog(items);
  if (typeof window === 'undefined') throw new Error('O catálogo só pode ser salvo no navegador.');
  try { localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(validated)); }
  catch { throw new Error('Não foi possível salvar. O armazenamento pode estar cheio ou bloqueado. Reduza o tamanho das fotos e tente novamente.'); }
  window.dispatchEvent(new CustomEvent(CATALOG_CHANGE_EVENT));
}
export function addCatalogProduct(product: Product): Product[] {
  const updated = [product, ...loadCatalog()]; saveCatalog(updated); return updated;
}
export function updateCatalogProduct(product: Product): Product[] {
  const updated = loadCatalog().map(p => p.id === product.id ? product : p); saveCatalog(updated); return updated;
}
export function deleteCatalogProduct(id: string): Product[] {
  const updated = loadCatalog().filter(p => p.id !== id); saveCatalog(updated); return updated;
}
export function resetCatalogToDefault(): Product[] {
  saveCatalog(defaultProducts); return defaultProducts;
}
export function exportCatalogJson(): string { return JSON.stringify(loadCatalog(), null, 2); }
export function importCatalogJson(text: string): Product[] {
  const items = validateCatalog(JSON.parse(text)); saveCatalog(items); return items;
}
