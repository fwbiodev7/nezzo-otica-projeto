'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export function AdminLogin({ available }: { available: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  async function login(event: FormEvent) {
    event.preventDefault();
    if (pending || !available) return;
    setPending(true); setError(null);
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      });
      setPassword('');
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Não foi possível entrar. Tente novamente.');
      } else { router.refresh(); }
    } catch { setError('Não foi possível conectar. Tente novamente.'); }
    finally { setPending(false); }
  }
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-sand bg-white p-8 sm:p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-[#FAF8F5]"><ShieldCheck size={32} /></div>
          <h1 className="mt-5 text-2xl font-bold text-primary">Painel Administrativo Nezzo</h1>
          <p className="mt-2 text-xs text-ink/60">{available ? 'Digite sua senha para acessar o painel administrativo.' : 'Acesso administrativo temporariamente indisponível. Contate o responsável pelo site.'}</p>
        </div>
        <form onSubmit={login} className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-primary uppercase tracking-wider mb-2">Senha de acesso</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={128}
              value={password} onChange={event => setPassword(event.target.value)} placeholder="Digite sua senha" disabled={pending || !available}
              className="w-full rounded-2xl border border-sand bg-light px-4 py-3.5 text-center text-base text-primary focus:border-accent focus:outline-none" />
          </div>
          {error && <p role="alert" className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 text-center">{error}</p>}
          <button type="submit" disabled={pending || !available} className="btn-primary w-full py-3.5 disabled:opacity-50">{pending ? 'Verificando...' : 'Entrar no Dashboard'}</button>
          <div className="text-center pt-2"><Link href="/" className="text-xs text-ink/50 hover:text-primary transition">← Voltar para o site público</Link></div>
        </form>
      </div>
    </div>
  );
}
