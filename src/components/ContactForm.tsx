'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ContactLead } from '@/types';
import { whatsappUrl } from '@/lib/mock-data';

const initial: ContactLead = { name: '', email: '', phone: '', message: '' };
export function ContactForm() {
  const [form, setForm] = useState<ContactLead>(initial);
  function update<K extends keyof ContactLead>(key: K, value: ContactLead[K]) { setForm(prev => ({ ...prev, [key]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = `Olá, sua-marca! Meu nome é ${form.name}. ${form.message}\nMeu telefone: ${form.phone}${form.email ? `\nE-mail: ${form.email}` : ''}`;
    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
  }
  const cls = 'w-full rounded-xl border border-primary/10 bg-white px-4 py-3.5 text-sm text-primary outline-none transition placeholder:text-primary/35 focus:border-accent focus:ring-2 focus:ring-accent/10';
  return <form onSubmit={submit} className="rounded-[1.75rem] bg-white p-6 shadow-soft sm:p-9"><h2 className="text-2xl font-semibold text-primary">Envie uma mensagem</h2><p className="mt-2 text-sm text-ink/60">Preencha os campos e abra sua mensagem no WhatsApp.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-primary">Seu nome *<input value={form.name} onChange={e => update('name', e.target.value)} required maxLength={80} placeholder="Como podemos chamar você?" className={'mt-2 ' + cls} /></label><label className="block text-xs font-semibold text-primary">Telefone *<input value={form.phone} onChange={e => update('phone', e.target.value)} required maxLength={30} type="tel" placeholder="(35) 99999-9999" className={'mt-2 ' + cls} /></label><label className="block text-xs font-semibold text-primary sm:col-span-2">E-mail (opcional)<input value={form.email} onChange={e => update('email', e.target.value)} type="email" maxLength={120} placeholder="voce@exemplo.com" className={'mt-2 ' + cls} /></label><label className="block text-xs font-semibold text-primary sm:col-span-2">Sua mensagem *<textarea value={form.message} onChange={e => update('message', e.target.value)} required maxLength={1000} rows={5} placeholder="Conte como podemos ajudar..." className={'mt-2 resize-none ' + cls} /></label></div><button type="submit" className="btn-primary mt-6">Abrir no WhatsApp <ArrowRight size={17} /></button><p className="mt-4 text-xs leading-5 text-ink/45">O formulário não armazena seus dados neste protótipo.</p></form>;
}
