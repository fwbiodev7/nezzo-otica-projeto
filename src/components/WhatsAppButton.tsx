import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/mock-data';

export function WhatsAppButton({
  message,
  children,
  className = '',
  outline = false,
}: {
  message?: string;
  children?: React.ReactNode;
  className?: string;
  outline?: boolean;
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${outline ? 'btn-outline' : 'btn-olive shadow-olive-glow'} group ${className}`}
    >
      <MessageCircle size={18} strokeWidth={2} className="text-gold transition-transform group-hover:scale-110" />
      <span>{children || 'Falar no WhatsApp'}</span>
      <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
    </a>
  );
}
