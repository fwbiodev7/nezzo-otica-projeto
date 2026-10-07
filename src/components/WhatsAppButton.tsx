import { ArrowUpRight } from 'lucide-react';
import { whatsappUrl } from '@/lib/mock-data';

export function WhatsAppButton({
  message,
  children,
  className = '',
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
      id="whatsapp-cta"
      className={`btn btn-gold group shrink-0 ${className}`}
    >
      <span>{children || 'Falar no WhatsApp'}</span>
      <ArrowUpRight
        size={16}
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
