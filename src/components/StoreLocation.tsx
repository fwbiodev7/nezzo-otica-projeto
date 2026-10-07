import { ArrowUpRight, Clock, MapPin, Navigation, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { WhatsAppButton } from './WhatsAppButton';

export function StoreLocation() {
  const { contact } = siteConfig;

  return (
    <section className="container-wide section-space" aria-labelledby="store-title">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* Lado Esquerdo */}
        <div className="lg:col-span-6">
          <span className="eyebrow">
            <MapPin size={12} /> ÓTICA NEZZO EM VARGINHA — MG
          </span>
          <h2 id="store-title" className="section-title mt-4">
            Venha tomar um café e{' '}
            <em>experimentar seu estilo.</em>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-soft">
            No Centro de Varginha, a <strong className="text-cream font-medium">Ótica Nezzo</strong> une um ambiente acolhedor com atendimento consultivo de visagismo. Aqui você descobre como as armações certas valorizam sua presença.
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="surface-card p-5">
              <div className="flex items-center gap-2.5 text-gold font-semibold text-xs mb-2">
                <Wrench size={15} /> Laboratório Próprio
              </div>
              <p className="text-xs text-soft leading-relaxed">
                Montagem precisa com equipamentos digitais para conferência milimétrica de eixo e foco.
              </p>
            </div>

            <div className="surface-card p-5">
              <div className="flex items-center gap-2.5 text-gold font-semibold text-xs mb-2">
                <ShieldCheck size={15} /> Garantia &amp; Ajuste
              </div>
              <p className="text-xs text-soft leading-relaxed">
                Ajuste anatômico de plaquetas e hastes cortesia durante toda a vida útil da peça.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WhatsAppButton message="Olá! Gostaria de agendar uma consultoria de visagismo presencial na Ótica Nezzo.">
              Agendar consultoria
            </WhatsAppButton>
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-soft hover:text-gold transition-colors border-b border-mid hover:border-gold/40 pb-0.5"
            >
              <Navigation size={13} /> Abrir no Google Maps
            </a>
          </div>
        </div>

        {/* Lado Direito: Card Info */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-mid bg-dark p-8 relative overflow-hidden">
            {/* Orb de luz dourada decorativa */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full blur-[80px]"
              style={{ background: 'radial-gradient(circle, rgba(201,169,110,.12) 0%, transparent 70%)' }}
              aria-hidden="true"
            />

            <div className="relative flex items-center justify-between border-b border-mid pb-5">
              <div>
                <span className="text-2xs font-bold tracking-[0.2em] uppercase text-gold">
                  Atendimento Físico &amp; Online
                </span>
                <h3 className="text-2xl font-medium text-cream mt-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Ótica Nezzo · Matriz
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 border border-gold/20 text-gold">
                <MapPin size={20} />
              </div>
            </div>

            <div className="relative py-6 space-y-5">
              <div>
                <p className="text-2xs text-muted uppercase tracking-wider font-semibold mb-1">Endereço</p>
                <p className="text-base font-medium text-cream">{contact.address}</p>
                <p className="text-xs text-soft mt-0.5">Varginha — MG · CEP {contact.postalCode}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="text-2xs text-muted uppercase tracking-wider font-semibold mb-1">Contato direto</p>
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
                  >
                    <Phone size={14} /> {contact.phoneLabel}
                  </a>
                </div>

                <div>
                  <p className="text-2xs text-muted uppercase tracking-wider font-semibold mb-1">Horários</p>
                  <p className="text-xs text-soft leading-relaxed">{contact.hours}</p>
                </div>
              </div>
            </div>

            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-between rounded-2xl bg-gold/10 border border-gold/20 p-4 text-xs font-semibold text-gold transition-all hover:bg-gold hover:text-void"
            >
              <span className="flex items-center gap-2">
                <Navigation size={15} /> Traçar rota até a Ótica Nezzo
              </span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
