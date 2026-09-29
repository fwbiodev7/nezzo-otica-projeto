import { ArrowUpRight, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { WhatsAppButton } from './WhatsAppButton';

export function StoreLocation() {
  const { contact } = siteConfig;
  return <section className="container-wide section-space" aria-labelledby="store-title">
    <div className="store-location">
      <div className="store-copy"><span className="eyebrow"><MapPin size={14} /> SUA ÓTICA EM VARGINHA</span><h2 id="store-title" className="section-title mt-5">O próximo passo?<br /><em>Uma visita.</em></h2><p className="mt-5 max-w-md text-sm leading-7 text-ink/70">Veja os detalhes, experimente as armações e encontre o seu novo olhar com a gente. Esperamos você no Centro.</p><div className="mt-7"><WhatsAppButton>Converse com a equipe</WhatsAppButton></div></div>
      <div className="store-address-card"><div className="store-card-top"><span className="eyebrow">sua-marca · CENTRO</span><MapPin size={25} strokeWidth={1.5} /></div><address className="not-italic"><p className="store-street">Rua Alves e Silva, <strong>61</strong></p><p className="mt-2 text-sm text-ink/65">{contact.city} · CEP {contact.postalCode}</p></address><div className="store-details"><a href={contact.phoneHref}><Phone size={16} />{contact.phoneLabel}</a><p><Clock size={16} />{contact.hours}</p></div><a className="store-directions" href={contact.mapsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={17} />Como chegar<ArrowUpRight size={19} className="ml-auto" /></a></div>
    </div>
  </section>;
}
