import type { Product } from '@/types';

const sourceUrl = 'https://www.instagram.com/stories/highlights/18074778755597299/';
const base = { price: 0, companyId: 'nezzo', featured: true, tags: ['Catálogo oficial'], sourceUrl };
// Nomes descritivos: os prints não informam os códigos, preços ou estoque atual.
export const officialProducts: Product[] = [
  { ...base, id: 'nezzo-88pro', name: '88Pro Esportivo Espelhado', brand: '88Pro', category: 'Sol', frameShape: 'Retangular', color: 'Preto com lentes espelhadas', image: '/images/nezzo-catalogo-122750.png', imageCrop: { x: 10, y: 380, width: 505, height: 300, sourceWidth: 527, sourceHeight: 924 } },
  { ...base, id: 'nezzo-hickmann-translucido', name: 'Hickmann Gatinho Translúcido', brand: 'Hickmann Eyewear', category: 'Grau', frameShape: 'Gatinho', color: 'Cinza translúcido', image: '/images/nezzo-catalogo-122753.png', imageCrop: { x: 42, y: 180, width: 490, height: 250, sourceWidth: 566, sourceHeight: 927 } },
  { ...base, id: 'nezzo-hickmann-bicolor', name: 'Hickmann Bicolor Tartaruga', brand: 'Hickmann Eyewear', category: 'Grau', frameShape: 'Quadrado', color: 'Preto e tartaruga', image: '/images/nezzo-catalogo-122757.png', imageCrop: { x: 40, y: 85, width: 494, height: 270, sourceWidth: 565, sourceHeight: 909 } },
  { ...base, id: 'nezzo-solar-ambar', name: 'Solar Retangular Âmbar', brand: 'Coleção Ótica Nezzo', category: 'Sol', frameShape: 'Retangular', color: 'Metal claro com lentes âmbar', image: '/images/nezzo-catalogo-122805.png', imageCrop: { x: 48, y: 260, width: 440, height: 165, sourceWidth: 543, sourceHeight: 914 } },
  { ...base, id: 'nezzo-auryn-verde', name: 'Auryn Verde Translúcido', brand: 'Auryn', category: 'Grau', frameShape: 'Quadrado', color: 'Verde translúcido', image: '/images/nezzo-catalogo-122813.png', imageCrop: { x: 23, y: 155, width: 485, height: 225, sourceWidth: 539, sourceHeight: 938 } },
  { ...base, id: 'nezzo-auryn-tartaruga', name: 'Auryn Tartaruga', brand: 'Auryn', category: 'Grau', frameShape: 'Redondo', color: 'Tartaruga âmbar', image: '/images/nezzo-catalogo-122813.png', imageCrop: { x: 40, y: 600, width: 465, height: 200, sourceWidth: 539, sourceHeight: 938 } },
  { ...base, id: 'nezzo-nzvision-cristal', name: 'NZ Vision Cristal', brand: 'NZ Vision', category: 'Grau', frameShape: 'Quadrado', color: 'Cristal com hastes mescladas', image: '/images/nezzo-catalogo-122818.png', imageCrop: { x: 23, y: 140, width: 486, height: 228, sourceWidth: 538, sourceHeight: 942 } },
  { ...base, id: 'nezzo-nzvision-azul', name: 'NZ Vision Azul', brand: 'NZ Vision', category: 'Grau', frameShape: 'Retangular', color: 'Azul escuro com hastes mescladas', image: '/images/nezzo-catalogo-122818.png', imageCrop: { x: 23, y: 600, width: 486, height: 210, sourceWidth: 538, sourceHeight: 942 } },
  { ...base, id: 'nezzo-sabrina-sato', name: 'Sabrina Sato Solar Redondo', brand: 'Sabrina Sato', category: 'Sol', frameShape: 'Redondo', color: 'Tartaruga escuro com lentes âmbar', image: '/images/nezzo-sabrina-sato.jpg', sourceUrl: 'https://www.instagram.com/oticanezzo/p/DcmKpyvHB9B/' },
];
