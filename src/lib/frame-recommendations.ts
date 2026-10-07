import type { FrameShape, FrameSize, Product, ProductCategory } from '@/types';
export type StylePreference = 'Versátil' | 'Discreto' | 'Marcante';
export interface FramePreferences { category: ProductCategory | 'Todos'; style: StylePreference }

const preferences: Record<string, FrameShape[]> = {
  redondo: ['Retangular', 'Quadrado', 'Gatinho', 'Aviador'],
  quadrado: ['Redondo', 'Oval', 'Aviador', 'Gatinho'],
  oval: ['Gatinho', 'Quadrado', 'Retangular', 'Redondo', 'Aviador', 'Oval'],
  coração: ['Oval', 'Redondo', 'Aviador', 'Gatinho'],
  alongado: ['Quadrado', 'Aviador', 'Retangular', 'Redondo'],
};
const explanations: Record<string, string> = {
  redondo: 'as linhas mais definidas contrastam com a suavidade das bochechas',
  quadrado: 'os contornos mais suaves ajudam a equilibrar uma mandíbula marcada',
  oval: 'o desenho valoriza o equilíbrio entre a altura e a largura do rosto',
  coração: 'o contorno ajuda a equilibrar a testa mais ampla com o queixo delicado',
  alongado: 'a presença da armação ajuda a equilibrar visualmente o comprimento do rosto',
};

export function recommendCatalogFrames(faceShape: string, catalog: Product[], size?: FrameSize, options?: FramePreferences) {
  const shape = faceShape.toLocaleLowerCase('pt-BR');
  const preferred = preferences[shape] || [];
  const score = (product: Product) => {
    const index = preferred.indexOf(product.frameShape);
    const discreet = /cristal|translúcido|metal claro/i.test(product.color);
    const styleScore = options?.style === 'Discreto' ? (discreet ? 16 : 0) : options?.style === 'Marcante' ? (discreet ? 0 : 16) : 0;
    return (index < 0 ? 0 : (preferred.length - index) * 10) + (product.category === 'Grau' ? 12 : 0) + (size && product.size === size ? 2 : 0) + styleScore;
  };
  return catalog.filter(product => product.inStock !== false && (!options || options.category === 'Todos' || product.category === options.category))
    .slice().sort((a, b) => score(b) - score(a)).slice(0, 3)
    .map(product => ({ product, reason: preferred.includes(product.frameShape)
      ? `${product.name}: ${explanations[shape] || 'o formato oferece uma opção de estilo para seus traços'}. Experimente para confirmar o ajuste.`
      : `${product.name} é uma alternativa do catálogo para experimentar. O ajuste e sua preferência pessoal ajudam a decidir.` }));
}
