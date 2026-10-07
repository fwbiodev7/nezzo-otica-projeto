import { ArrowUpRight, Clock, MapPin, Navigation, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { WhatsAppButton } from './WhatsAppButton';

export function StoreLocation() {
  const { contact } = siteConfig;

  return (
    <section className="border-t border-forest/10 bg-mint">
      <div className="container-wide grid grid-cols-1 lg:grid-cols-2">
        {/* Imagem / Visual */}
        <div className="relative min-h-[400px] lg:min-h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/store-facade.jpg')",
              backgroundColor: '#164230', // Fallback color
            }}
          />
          <div className="absolute inset-0 bg-forest/80 backdrop-blur-sm lg:hidden" />
          
          <div className="relative h-full flex flex-col justify-end p-8 lg:p-12 lg:hidden text-white">
            <span className="eyebrow" style={{ color: '#C9A96E' }}>NOSSO ESPAÇO</span>
            <h2 className="mt-4 text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Venha tomar um <em style={{ color: '#C9A96E', fontStyle: 'italic' }}>café conosco.</em>
            </h2>
          </div>
        </div>

        {/* Conteúdo Info */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20 lg:py-24 bg-white shadow-[-20px_0_40px_rgba(10,38,26,0.03)] relative z-10">
          <div className="hidden lg:block mb-10">
            <span className="eyebrow">NOSSA ESTRUTURA</span>
            <h2 className="mt-4 text-5xl font-medium text-ink" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '-0.03em' }}>
              Venha tomar um<br />
              <em style={{ color: '#164230', fontStyle: 'italic' }}>café conosco.</em>
            </h2>
          </div>

          <div className="space-y-10">
            {/* Endereço */}
            <div className="flex gap-5 group">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                <MapPin size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-1.5">Onde estamos</h3>
                <p className="text-base text-muted leading-relaxed">
                  {contact.street}<br />
                  {contact.city} — CEP {contact.postalCode}
                </p>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-forest hover:text-gold transition-colors"
                >
                  <Navigation size={13} /> Traçar rota
                </a>
              </div>
            </div>

            {/* Contato & Horário */}
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
                  <Phone size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-2xs font-bold uppercase tracking-widest text-ink mb-1">Contato</h3>
                  <p className="text-sm text-muted mb-2">{contact.phoneLabel}</p>
                  <WhatsAppButton className="!px-0 !py-0 !bg-transparent !text-forest hover:!text-gold hover:!shadow-none !justify-start !font-bold">
                    Mensagem online
                  </WhatsAppButton>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
                  <Clock size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-2xs font-bold uppercase tracking-widest text-ink mb-1">Atendimento</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {contact.hours.split(' e ').map((line, i) => (
                      <span key={i} className="block">{line}</span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {/* Laboratório Próprio */}
            <div className="rounded-2xl border border-forest/10 bg-mint p-6">
              <div className="flex items-center gap-3 mb-3 text-forest">
                <Wrench size={18} />
                <h3 className="text-xs font-bold uppercase tracking-widest">Laboratório Computadorizado</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Montagem de lentes visão simples e multifocais com precisão milimétrica em nossa própria loja. Rapidez e garantia total.
              </p>
              <div className="mt-4 flex gap-4 text-xs font-medium text-forest">
                <div className="flex items-center gap-1.5"><ShieldCheck size={14} /> Garantia de fábrica</div>
                <div className="flex items-center gap-1.5"><ShieldCheck size={14} /> Manutenção gratuita</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
