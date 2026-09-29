import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, ScanFace } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export function HeroSection() {
  const { campaign } = siteConfig;
  return <section className="hero-shell"><div className="container-wide hero-section">
    <div className="hero-copy">
      <span className="eyebrow"><span className="status-dot" />{campaign.label}</span>
      <h1 className="hero-title">{campaign.title}<br /><em>{campaign.emphasis}</em></h1>
      <p className="mt-7 max-w-[360px] text-sm leading-7 text-white/75 sm:text-base">{campaign.description}</p>
      <div className="mt-9 flex flex-wrap items-center gap-5"><Link href="/catalogo" className="btn-highlight">Encontre seus óculos <ArrowUpRight size={18} /></Link><Link href="/visagismo" className="hero-style-link"><ScanFace size={18} />Descubra seu estilo</Link></div>
      <a href="#colecao" className="hero-scroll"><span><ArrowDown size={16} /></span> UM MUNDO DE POSSIBILIDADES</a>
    </div>
    <div className="hero-visual">
      <div className="hero-photo"><Image src={campaign.image} alt={campaign.imageAlt} fill preload sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover object-[68%_center]" /><div className="hero-photo-shade" /><div className="hero-caption"><span>ESSENCIAIS, DO SEU JEITO.</span><p>{campaign.caption}</p></div></div>
      <div className="hero-stamp" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs><text><textPath href="#stamp-circle" textLength="273">NOVOS OLHARES · NOVAS POSSIBILIDADES · </textPath></text></svg><ArrowUpRight size={36} strokeWidth={1} /></div>
      <span className="hero-side-note" aria-hidden="true">{siteConfig.name} — SEJA SEU PONTO DE VISTA</span>
    </div>
  </div></section>;
}
