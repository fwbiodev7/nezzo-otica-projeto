export { officialProducts as products } from './official-catalog';
import { siteConfig } from './site-config';

export const whatsappNumber = siteConfig.contact.whatsapp.replace(/\D/g, '');
export const whatsappUrl = (message = `Olá! Vim pelo site da ${siteConfig.name} e gostaria de atendimento.`) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
