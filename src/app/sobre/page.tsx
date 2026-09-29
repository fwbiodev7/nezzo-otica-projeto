import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Eye, HeartHandshake, Sparkles } from 'lucide-react';
import { StoreLocation } from '@/components/StoreLocation';
import { Reveal } from '@/components/Reveal';
export const metadata: Metadata = { title: 'A sua-marca em Varginha' };
export default function AboutPage() {
  return <><section className="container-wide section-space"><div className="about-teaser"><div><span className="eyebrow">PRAZER, sua-marca.</span><h1 className="section-title mt-5">Um novo jeito<br />de ver.<br /><em>E de se reconhecer.</em></h1><p className="mt-7 max-w-md text-sm leading-8 text-ink/65">Cada pessoa tem um jeito único de olhar para o mundo. A sua-marca nasce dessa ideia: a melhor escolha é aquela que respeita sua personalidade, seu conforto e sua rotina.</p><Link href="/catalogo" className="text-link mt-7">Explore nossos óculos <ArrowUpRight size={18} /></Link></div><div className="relative min-h-[450px] overflow-hidden rounded-t-[220px] rounded-b-2xl"><Image src="/images/hero-editorial.png" alt="Armação dourada de linhas leves em uma composição editorial" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-[68%_center]" /></div></div></section><section className="bg-light"><Reveal className="container-wide section-space"><span className="eyebrow">NOSSA FORMA DE ENXERGAR</span><h2 className="section-title mt-4">Detalhes que fazem <em>diferença.</em></h2><div className="mt-12 grid gap-8 md:grid-cols-3">{[
    { icon: Eye, title: 'Design com propósito', text: 'Armações que equilibram presença e conforto, para acompanhar os diferentes momentos do seu dia.' },
    { icon: HeartHandshake, title: 'Uma escolha acompanhada', text: 'Escutar antes de sugerir. Entender o que você procura e ajudar a descobrir o que combina com você.' },
    { icon: Sparkles, title: 'Novas possibilidades', text: 'O visagismo aproxima tecnologia e estilo. Um ponto de partida para experimentar, sem limitar quem você é.' },
  ].map(item => <div key={item.title} className="border-t border-primary/20 pt-7"><item.icon strokeWidth={1.3} size={30} /><h3 className="mt-7 text-xl tracking-tight">{item.title}</h3><p className="mt-4 text-sm leading-7 text-ink/65">{item.text}</p></div>)}</div></Reveal></section><StoreLocation /><section className="container-wide flex flex-col justify-between gap-6 py-16 sm:flex-row sm:items-center"><h2 className="text-3xl tracking-tight">Seu próximo olhar está por aqui.</h2><Link href="/contato" className="btn-primary">Vamos conversar <ArrowUpRight size={18} /></Link></section></>;
}
