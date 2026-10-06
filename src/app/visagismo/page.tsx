import type { Metadata } from 'next';
import { ArrowDown, CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { FaceAnalyzer } from '@/components/FaceAnalyzer';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Visagista IA 2.0 | Ótica Nezzo',
  description: 'Descubra quais armações valorizam o formato do seu rosto através de análise biométrica inteligente.',
};

export default function VisagismoPage() {
  return (
    <>
      <section className="visagismo-intro relative overflow-hidden bg-primary text-[#FAF8F5]">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #4A604B 0%, transparent 70%)' }}
        />

        <div className="container-wide relative grid gap-12 py-16 lg:grid-cols-[1.3fr_.7fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-md">
              <Sparkles size={14} className="text-highlight" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]/90">
                Visagista IA 2.0 · Ótica Nezzo
              </span>
            </div>

            <h1 className="mt-5 max-w-2xl text-[clamp(2.6rem,4.8vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.04em] text-[#FAF8F5]">
              A armação perfeita começa pelos seus <br />
              <em className="font-serif italic font-normal text-highlight">próprios traços.</em>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#FAF8F5]/80">
              Mapeie os ângulos e proporções do seu rosto com privacidade absoluta. Nosso sistema avalia a simetria e sugere os modelos e portes ideais (P, M ou G) do acervo Nezzo em Varginha.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#experimente" className="btn-olive inline-flex items-center gap-2">
                <span>Iniciar Análise Facial</span>
                <ArrowDown size={16} />
              </a>
              <span className="text-xs text-[#FAF8F5]/60 flex items-center gap-1.5">
                <Lock size={13} className="text-highlight" /> 100% privado · Descarte imediato da foto
              </span>
            </div>
          </div>

          <div className="hidden justify-self-end rounded-3xl border border-white/15 bg-white/5 p-10 backdrop-blur-md md:block shadow-2xl">
            <div className="flex h-56 w-56 items-center justify-center rounded-full border border-white/20">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-highlight/50 animate-spin" style={{ animationDuration: '40s' }}>
                <Sparkles size={50} className="text-highlight" />
              </div>
            </div>
            <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-highlight">
              Biometria Facial & Estilo
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <div className="container-wide">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="eyebrow">CONSULTORIA DIGITAL</span>
            <h2 className="section-title mt-3">
              Descubra sua próxima <em>armação favorita.</em>
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/70">
              O visagismo é uma ferramenta de autoconhecimento estético. Nossos consultores no Centro de Varginha estão à disposição para provar os modelos com você.
            </p>
          </div>

          <FaceAnalyzer />

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center text-xs text-ink/60 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-accent shrink-0" />
              <span>Estimativa estética não clínica</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-accent shrink-0" />
              <span>Em conformidade com a LGPD</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
