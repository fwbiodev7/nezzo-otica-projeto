import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} | Óculos de grau e de sol em Varginha, MG`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body><a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-4">Pular para o conteúdo</a><Header /><main id="conteudo">{children}</main><Footer /></body></html>;
}
