'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function LegacyAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona automaticamente para o novo painel comercial Nezzo
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-center">
      <div className="max-w-md rounded-3xl border border-sand bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-[#FAF8F5]">
          <ShieldCheck size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-primary">
          Redirecionando para o Novo Painel Nezzo...
        </h2>
        <p className="mt-2 text-xs text-ink/60">
          O painel administrativo foi atualizado com nova interface, analytics em tempo real e agente de IA.
        </p>
        <div className="mt-6">
          <Link href="/admin" className="btn-olive inline-flex items-center gap-2 text-xs">
            <span>Acessar Painel /admin</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
