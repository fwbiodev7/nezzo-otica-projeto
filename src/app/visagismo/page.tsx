import type { Metadata } from 'next';
import { ArrowDown, ShieldCheck, Sparkles } from 'lucide-react';
import { FaceAnalyzer } from '@/components/FaceAnalyzer';

export const metadata: Metadata = { title: 'Visagismo IA' };

export default function VisagismoPage() {
  return <>
    <section className="relative overflow-hidden bg-primary text-white">
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full border-[70px] border-accent/10" />
      <div className="container-wide relative grid gap-10 py-16 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:py-20">
        <div>
          <span className="eyebrow"><Sparkles size={15} /> VISAGISMO POR IA</span>
          <h1 className="mt-5 max-w-2xl text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[1.09] tracking-[-.05em]">O óculos ideal começa <span className="font-serif italic font-normal text-accent">com você.</span></h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-white/70 sm:text-base">Uma foto, novas possibilidades. Receba sugestões de formatos que podem valorizar seus traços e descubra peças para experimentar na sua-marca.</p>
          <a href="#experimente" className="btn-highlight mt-8">Começar agora <ArrowDown size={18} /></a>
        </div>
        <div className="hidden justify-self-end rounded-[2rem] border border-white/15 bg-white/5 p-10 backdrop-blur md:block shadow-2xl">
          <div className="flex h-60 w-60 items-center justify-center rounded-full border border-accent/40">
            <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-dashed border-accent/60">
              <Sparkles size={70} className="text-accent" />
            </div>
          </div>
          <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[.2em] text-white/60">Sua beleza em foco</p>
        </div>
      </div>
    </section>
    <section className="bg-light py-16 lg:py-20">
      <div className="container-wide">
        <div className="mx-auto mb-9 max-w-xl text-center">
          <span className="eyebrow">EXPERIMENTE</span>
          <h2 className="section-title mt-3">Descubra sua próxima armação.</h2>
          <p className="mt-4 text-sm leading-7 text-ink/60">A sugestão é um ponto de partida; nossa equipe pode ajudar você a experimentar e decidir.</p>
        </div>
        <FaceAnalyzer />
        <div className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-ink/50">
          <ShieldCheck size={17} />Sugestões de estilo, sem diagnóstico ou prescrição.
        </div>
      </div>
    </section>
  </>;
}
