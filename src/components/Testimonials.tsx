'use client';

import { Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Rodrigo Bento',
    role: 'Local Guide',
    content: 'Atendimento super top. Bons produtos e a entrega no prazo.',
    initials: 'RB',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    name: 'Kelvin Jones',
    role: 'Cliente verificado',
    content: 'Lugar incrível! Fui muito bem atendido e a variedade de armações é gigantesca. Recomendo muito!',
    initials: 'KJ',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    name: 'Mariana S.',
    role: 'Local Guide',
    content: 'Melhor ótica de Varginha. O ambiente é super aconchegante e o atendimento é impecável. Satisfeita.',
    initials: 'MS',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 4,
    name: 'Lucas T.',
    role: 'Cliente verificado',
    content: 'Qualidade dos produtos nota 1000. Comprei minhas lentes com filtro azul e a armação chegou perfeita.',
    initials: 'LT',
    color: 'bg-amber-100 text-amber-700',
  },
];

export function Testimonials() {
  return (
    <section className="bg-mint/30 py-24 relative overflow-hidden">
      <div className="container-wide relative z-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm font-bold text-ink">5,0 no Google</span>
          </div>
          <h2 className="section-title">
            A visão de quem já <em>experimentou.</em>
          </h2>
          <p className="mt-4 text-ink/70 leading-relaxed">
            Nós nos orgulhamos de oferecer não apenas óculos, mas uma experiência
            completa de cuidado e estilo. Veja o que dizem nossos clientes de Varginha e região.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl border border-forest/5 bg-white p-6 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-ink/80 leading-relaxed mb-6">
                  &ldquo;{review.content}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-xs ${review.color}`}>
                  {review.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-ink">{review.name}</span>
                  <span className="text-2xs text-muted uppercase tracking-wider">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
