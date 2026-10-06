import { ArrowUpRight, MapPin, Clock, Phone, Navigation, ShieldCheck, Wrench } from 'lucide-react';
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
            <MapPin size={13} /> ÓTICA NEZZO EM VARGINHA - MG
          </span>
          <h2 id="store-title" className="section-title mt-4">
            Venha tomar um café e <br />
            <em>experimentar seu novo estilo.</em>
          </h2>
          <p className="mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-ink/75">
            Localizada no Centro de Varginha, a <strong>Ótica Nezzo</strong> une um ambiente acolhedor com atendimento consultivo de visagismo. Aqui você descobre como a harmonia das armações certas valoriza sua presença.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-sand bg-light p-4">
              <div className="flex items-center gap-2.5 text-accent font-semibold text-xs mb-1.5">
                <Wrench size={16} /> Laboratório Próprio
              </div>
              <p className="text-xs text-ink/70">
                Montagem precisa com equipamentos digitais para conferência milimétrica de eixo e foco.
              </p>
            </div>

            <div className="rounded-2xl border border-sand bg-light p-4">
              <div className="flex items-center gap-2.5 text-accent font-semibold text-xs mb-1.5">
                <ShieldCheck size={16} /> Garantia & Ajuste
              </div>
              <p className="text-xs text-ink/70">
                Ajuste anatômico de plaquetas e hastes cortesia durante toda a vida útil da sua peça.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WhatsAppButton message="Olá! Gostaria de agendar uma consultoria de visagismo presencial na Ótica Nezzo.">
              Agendar Consultoria
            </WhatsAppButton>
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary underline underline-offset-4 hover:text-accent"
            >
              <Navigation size={14} /> Abrir no Google Maps
            </a>
          </div>
        </div>

        {/* Lado Direito: Card de Informações da Loja */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-sand bg-paper p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-sand pb-5">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">
                  Atendimento Físico & Online
                </span>
                <h3 className="text-2xl font-semibold text-primary mt-1">
                  Ótica Nezzo · Matriz
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-[#FAF8F5]">
                <MapPin size={22} />
              </div>
            </div>

            <div className="py-6 space-y-4">
              <div>
                <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">Endereço</p>
                <p className="text-base font-medium text-primary mt-0.5">
                  {contact.address}
                </p>
                <p className="text-xs text-ink/60">
                  Varginha - MG · CEP {contact.postalCode}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">Contato Direto</p>
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline mt-0.5"
                  >
                    <Phone size={14} /> {contact.phoneLabel}
                  </a>
                </div>

                <div>
                  <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold">Horários</p>
                  <p className="text-xs text-ink/75 mt-0.5 leading-relaxed">
                    {contact.hours}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl bg-primary p-4 text-xs font-semibold text-[#FAF8F5] transition-all hover:bg-accent"
            >
              <span className="flex items-center gap-2">
                <Navigation size={16} /> Traçar rota até a Ótica Nezzo
              </span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
