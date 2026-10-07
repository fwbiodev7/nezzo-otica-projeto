import type { FacePlacement, Product } from '@/types';

export function FrameIllustration({ placement, product }: { placement: FacePlacement; product: Product }) {
  const color = /metal|dourado|âmbar/i.test(product.color) ? '#aa813c' : /azul/i.test(product.color) ? '#1d3159' : /verde/i.test(product.color) ? '#365a49' : /cristal|translúcido/i.test(product.color) ? '#859b9c' : '#292620';
  const thin = /metal/i.test(product.color);
  const lens = product.category === 'Sol' ? '#212b35' : '#acd9e4';
  const lensOpacity = product.category === 'Sol' ? 0.65 : 0.1;
  const leftLens = product.frameShape === 'Gatinho'
    ? <path d="M24 35 Q88 8 177 51 L175 100 Q116 143 50 103 Z" />
    : product.frameShape === 'Redondo' || product.frameShape === 'Oval'
      ? <ellipse cx="102" cy="77" rx="73" ry={product.frameShape === 'Oval' ? 46 : 61} />
      : product.frameShape === 'Aviador'
        ? <path d="M28 46 Q80 8 176 47 Q177 130 120 140 Q65 147 28 46Z" />
        : <rect x="26" y="28" width="151" height="100" rx={product.frameShape === 'Quadrado' ? 17 : 27} />;
  return <svg role="img" aria-label={`Simulação ilustrativa do formato ${product.frameShape} de ${product.name}`} viewBox="0 0 400 160" className="pointer-events-none absolute" style={{ width: `${placement.width * 100}%`, left: `${placement.centerX * 100}%`, top: `${placement.centerY * 100}%`, transform: `translate(-50%, -50%) rotate(${placement.rotation}deg)` }}>
    <g fill={lens} fillOpacity={lensOpacity} stroke={color} strokeWidth={thin ? 4 : 8} strokeLinejoin="round">
      {leftLens}
      <g transform="translate(400 0) scale(-1 1)">{leftLens}</g>
    </g>
    <g stroke={color} strokeWidth={thin ? 4 : 8} fill="none" strokeLinecap="round">
      <path d="M177 68 Q200 53 223 68 M26 53 L4 46 M374 53 L396 46" />
      {product.frameShape === 'Aviador' && <path d="M177 38 H223" />}
    </g>
  </svg>;
}
