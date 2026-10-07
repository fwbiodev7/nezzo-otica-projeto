'use client';

import { useState, useMemo, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  Eye,
  Filter,
  Glasses,
  History,
  LayoutDashboard,
  Lock,
  MessageCircle,
  MessageSquare,
  Package,
  PlusCircle,
  RefreshCw,
  ScanFace,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  TrendingUp,
  UploadCloud,
  UserCheck,
  Users,
} from 'lucide-react';
import type { Product, ContactLead, FrameShape, ProductCategory } from '@/types';
import {
  loadCatalog,
  saveCatalog,
  addCatalogProduct,
  updateCatalogProduct,
  deleteCatalogProduct,
  resetCatalogToDefault,
  exportCatalogJson,
  importCatalogJson,
} from '@/lib/catalog-storage';
import { getAnalyticsSummary, clearAnalyticsEvents } from '@/lib/analytics';
import { siteConfig } from '@/lib/site-config';
import {
  processAgentQuery,
  getAuditLogs,
  logAgentAction,
  AgentMessage,
  AgentAuditLog,
} from '@/lib/admin-agent';
import { AddProductModal } from '@/components/AddProductModal';
import { useCatalog } from '@/lib/use-catalog';

type AdminTab =
  | 'overview'
  | 'products'
  | 'leads'
  | 'analytics'
  | 'agent'
  | 'content'
  | 'settings';

const ADMIN_PIN = '2000'; // PIN de acesso da demonstração Nezzo

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Catálogo
  const products = useCatalog();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Analytics
  const [summary, setSummary] = useState(getAnalyticsSummary());

  // Agente IA
  const [chatMessages, setChatMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Olá! Sou o Agente de Inteligência Administrativa da Ótica Nezzo. Estou conectado ao catálogo em tempo real, métricas do Visagista e conversões no WhatsApp. Pergunte-me qualquer métrica ou solicite análises do negócio.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [pendingAction, setPendingAction] = useState<AgentMessage['actionRequired'] | null>(null);
  const [auditLogs, setAuditLogs] = useState<AgentAuditLog[]>([]);

  // Leads Simulados para Nezzo
  const [leads, setLeads] = useState<ContactLead[]>([
    {
      id: 'lead-1',
      name: 'Mariana Silveira',
      phone: '(35) 99812-4433',
      email: 'mariana.silveira@email.com',
      message: 'Fiz a análise facial (Rosto Oval) e gostaria de experimentar a armação Nezzo Tartaruga Bold.',
      source: 'visagismo',
      faceShape: 'Oval',
      status: 'novo',
      createdAt: 'Hoje às 14:20',
    },
    {
      id: 'lead-2',
      name: 'Carlos Eduardo Ramos',
      phone: '(35) 98877-2211',
      email: 'carlos.ramos@email.com',
      message: 'Gostaria de saber o valor para confecção de lentes multifocais com anti-reflexo digital.',
      source: 'site',
      status: 'em_atendimento',
      createdAt: 'Ontem às 17:05',
    },
    {
      id: 'lead-3',
      name: 'Beatriz Rezende',
      phone: '(35) 99133-8899',
      email: 'beatriz.rezende@email.com',
      message: 'Interesse no óculos solar Nezzo Wayfarer Classic visto no Instagram.',
      source: 'whatsapp',
      status: 'convertido',
      createdAt: '2 dias atrás',
    },
  ]);

  useEffect(() => {
    const sessionFrame = requestAnimationFrame(() => {
      try {
        const auth = sessionStorage.getItem('nezzo_admin_session');
        if (auth === 'true') setIsAuthenticated(true);
        setAuditLogs(getAuditLogs());
      } catch {}
    });
    return () => cancelAnimationFrame(sessionFrame);
  }, []);

  function handleLogin(e?: FormEvent) {
    if (e) e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(null);
      try {
        sessionStorage.setItem('nezzo_admin_session', 'true');
      } catch {}
    } else {
      setPinError('Código PIN inválido. Utilize o código de acesso da gerência.');
      setPinInput('');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('nezzo_admin_session');
    } catch {}
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.color.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === 'Todos' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, search, categoryFilter]);

  async function handleSendQuery(e: FormEvent) {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');
    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsAgentTyping(true);
    try {
      const { reply, actionRequired } = await processAgentQuery(userText);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'agent',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionRequired,
        },
      ]);
      if (actionRequired) {
        setPendingAction(actionRequired);
      }
      setAuditLogs(getAuditLogs());
    } finally {
      setIsAgentTyping(false);
    }
  }

  function handleConfirmAction(action: AgentMessage['actionRequired']) {
    if (!action) return;
    logAgentAction(
      `Ação Confirmada: ${action.type}`,
      `Executado: ${action.description}`,
      true
    );
    showToast(`Ação "${action.description}" aplicada com sucesso no sistema!`);
    setPendingAction(null);
    setAuditLogs(getAuditLogs());
  }

  // TELA DE AUTENTICAÇÃO PIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-sand bg-white p-8 sm:p-10 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-[#FAF8F5]">
              <ShieldCheck size={32} />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-primary">
              Painel Administrativo Nezzo
            </h1>
            <p className="mt-2 text-xs text-ink/60">
              Digite o PIN de acesso gerencial para visualizar métricas, catálogo e controle da IA.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Código de Acesso
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ex: 2000"
                className="w-full rounded-2xl border border-sand bg-light px-4 py-3.5 text-center text-xl font-bold tracking-widest text-primary focus:border-accent focus:outline-none"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 text-center">
                {pinError}
              </p>
            )}

            <button type="submit" className="btn-primary w-full py-3.5">
              Entrar no Dashboard
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-ink/50 hover:text-primary transition">
                ← Voltar para o site público
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD PRINCIPAL
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Topo do Painel */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-sand backdrop-blur-md">
        <div className="container-wide flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-primary hover:text-accent font-bold text-sm flex items-center gap-1.5">
              <ArrowLeft size={16} /> Ver Loja
            </Link>
            <div className="h-5 w-px bg-sand" />
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-primary tracking-wide">
                ÓTICA NEZZO · ADMIN 2.0
              </span>
              <span className="rounded bg-sand/60 px-2 py-0.5 text-[10px] font-semibold text-ink/60">
                tenant: nezzo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSummary(getAnalyticsSummary());
                showToast('Métricas atualizadas!');
              }}
              className="p-2 text-ink/60 hover:text-primary transition rounded-full hover:bg-light"
              title="Recarregar Métricas"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200 transition"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="container-wide flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-sand/40">
          {[
            { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
            { id: 'products', label: 'Produtos & Catálogo', icon: Package },
            { id: 'leads', label: 'Leads & Clientes', icon: Users },
            { id: 'analytics', label: 'Resultados Visagista', icon: BarChart3 },
            { id: 'agent', label: 'Agente IA Nezzo', icon: Bot },
            { id: 'content', label: 'Conteúdo do Site', icon: Store },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? 'bg-primary text-[#FAF8F5] shadow-sm'
                    : 'text-ink/65 hover:bg-light hover:text-primary'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container-wide flex-1 py-8">
        {/* TOAST */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-primary px-5 py-3 text-xs font-semibold text-[#FAF8F5] shadow-2xl animate-fade-in flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. ABA: VISÃO GERAL */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Cards de Métricas Principais */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                  Visitas no Site
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-primary font-serif">
                    {summary.pageViews}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +18% semana
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink/60">Acessos orgânicos e diretos</p>
              </div>

              <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                  Usos do Visagista IA
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-primary font-serif">
                    {summary.visagismoStarts}
                  </span>
                  <span className="text-xs font-semibold text-accent bg-light px-2 py-0.5 rounded-full">
                    {summary.completionRate}% conclusão
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink/60">{summary.visagismoCompletions} laudos gerados</p>
              </div>

              <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                  Leads & Interessados
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-accent font-serif">
                    {summary.leadsCount}
                  </span>
                  <span className="text-xs font-semibold text-primary bg-light px-2 py-0.5 rounded-full">
                    Alta intenção
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink/60">Contatos via laudo e vitrine</p>
              </div>

              <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                  Conversões no WhatsApp
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-primary font-serif">
                    {summary.whatsappClicks}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Direto p/ Atendimento
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink/60">Conversão de visita para contato</p>
              </div>
            </div>

            {/* Destaque de Armações & Formatos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Armações mais recomendadas pela IA */}
              <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-sand pb-3">
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    Armações Mais Recomendadas pela IA
                  </h3>
                  <span className="text-xs text-ink/50">Ranking em tempo real</span>
                </div>
                <div className="space-y-3">
                  {summary.topRecommendedProducts.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-light border border-sand/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[#FAF8F5] text-xs font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-sm font-semibold text-primary block">
                            {p.name}
                          </strong>
                          <span className="text-[11px] text-ink/60">ID: {p.id}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-accent">
                        {p.count} indicações
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formatos de Rosto Mais Identificados */}
              <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-sand pb-3">
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <ScanFace size={16} className="text-accent" />
                    Formatos de Rosto Mais Comuns (Leads)
                  </h3>
                  <span className="text-xs text-ink/50">Mapeamento anatômico</span>
                </div>
                <div className="space-y-3">
                  {summary.topFaceShapes.map((s) => (
                    <div
                      key={s.shape}
                      className="flex items-center justify-between p-3 rounded-2xl bg-light border border-sand/60"
                    >
                      <span className="text-sm font-semibold text-primary">
                        Formato {s.shape}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-sand overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{
                              width: `${Math.min(100, s.count * 30)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-ink/75 w-8 text-right">
                          {s.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ABA: PRODUTOS & CATÁLOGO */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Gestão de Catálogo de Armações
                </h2>
                <p className="text-xs text-ink/60 mt-0.5">
                  {products.length} modelos cadastrados para a Ótica Nezzo.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsModalOpen(true);
                  }}
                  className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2"
                >
                  <PlusCircle size={16} /> Novo Produto
                </button>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-3.5 text-ink/40" />
                <input
                  type="text"
                  placeholder="Buscar por nome, marca ou cor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-sand bg-white pl-10 pr-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filtrar por Categoria"
                className="rounded-2xl border border-sand bg-white px-4 py-2.5 text-xs font-semibold text-primary focus:border-accent focus:outline-none"
              >
                <option value="Todos">Todas as Categorias</option>
                <option value="Grau">Óculos de Grau</option>
                <option value="Sol">Óculos de Sol</option>
              </select>
            </div>

            {/* Tabela de Produtos */}
            <div className="overflow-hidden rounded-3xl border border-sand bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sand bg-light/50 text-[10px] font-bold uppercase tracking-wider text-ink/60">
                    <th className="py-4 px-6">Produto</th>
                    <th className="py-4 px-4">Categoria</th>
                    <th className="py-4 px-4">Formato / Porte</th>
                    <th className="py-4 px-4">Preço</th>
                    <th className="py-4 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand text-xs">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-light/40 transition">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl bg-light border border-sand overflow-hidden shrink-0">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <strong className="block font-semibold text-primary">
                              {p.name}
                            </strong>
                            <span className="text-[11px] text-ink/50">
                              {p.brand} · {p.color}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-ink/80">
                        {p.category}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/60 px-2.5 py-1 text-[10px] font-semibold text-primary">
                          {p.frameShape} {p.size ? `(Tam. ${p.size})` : ''}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-ink/60 hover:text-accent rounded-lg hover:bg-light"
                            title="Editar Produto"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Excluir armação "${p.name}"?`)) {
                                deleteCatalogProduct(p.id);
                                showToast('Produto excluído do catálogo.');
                              }
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                            title="Excluir Produto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
              <AddProductModal
                isOpen={isModalOpen}
                productToEdit={editingProduct}
                onClose={() => {
                  setIsModalOpen(false);
                  setEditingProduct(null);
                }}
                onAddProduct={(saved: Product) => {
                  if (editingProduct) {
                    updateCatalogProduct(saved);
                    showToast('Produto atualizado!');
                  } else {
                    addCatalogProduct(saved);
                    showToast('Produto adicionado ao catálogo!');
                  }
                  setIsModalOpen(false);
                  setEditingProduct(null);
                }}
              />
            )}
          </div>
        )}

        {/* 3. ABA: LEADS & CLIENTES */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Leads & Clientes Interessados
                </h2>
                <p className="text-xs text-ink/60 mt-0.5">
                  Contatos gerados a partir do Visagista IA e cliques em armações para atendimento no WhatsApp.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-3xl border border-sand bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-primary">{lead.name}</span>
                      <span className="rounded-full bg-accent/10 text-accent px-2.5 py-0.5 text-[10px] font-bold">
                        {lead.source === 'visagismo' ? 'Laudo Visagista' : 'Vitrine / WhatsApp'}
                      </span>
                      {lead.faceShape && (
                        <span className="rounded-full bg-light border border-sand px-2 py-0.5 text-[10px] text-ink/60">
                          Rosto {lead.faceShape}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink/75 leading-relaxed">{lead.message}</p>
                    <div className="flex items-center gap-4 text-[11px] text-ink/50 pt-1">
                      <span>{lead.phone}</span>
                      <span>·</span>
                      <span>{lead.email}</span>
                      <span>·</span>
                      <span>{lead.createdAt}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.name}! Sou consultor da Ótica Nezzo. Recebemos seu interesse na nossa consultoria.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-olive py-2.5 px-5 text-xs whitespace-nowrap self-start sm:self-center"
                  >
                    <MessageCircle size={15} /> Responder no WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ABA: RESULTADOS DO VISAGISTA & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-primary">
                Analytics do Visagista & Funil de Conversão
              </h2>
              <p className="text-xs text-ink/60 mt-0.5">
                Mapeamento das etapas: Início da Análise → Conclusão do Laudo → Clique no WhatsApp.
              </p>
            </div>

            {/* Funil Visual */}
            <div className="rounded-3xl border border-sand bg-white p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
                Funil de Conversão do Visagista IA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="rounded-2xl border border-sand bg-light p-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                    Etapa 1
                  </span>
                  <h4 className="text-3xl font-extrabold text-primary mt-2 font-serif">
                    {summary.visagismoStarts}
                  </h4>
                  <p className="text-xs font-semibold text-primary mt-1">Análises Iniciadas</p>
                  <p className="text-[11px] text-ink/50 mt-1">100% de entrada</p>
                </div>

                <div className="rounded-2xl border border-sand bg-light p-6 relative">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                    Etapa 2
                  </span>
                  <h4 className="text-3xl font-extrabold text-accent mt-2 font-serif">
                    {summary.visagismoCompletions}
                  </h4>
                  <p className="text-xs font-semibold text-primary mt-1">Laudos Concluídos</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    {summary.completionRate}% taxa de conclusão
                  </p>
                </div>

                <div className="rounded-2xl border border-sand bg-light p-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                    Etapa 3
                  </span>
                  <h4 className="text-3xl font-extrabold text-primary mt-2 font-serif">
                    {summary.whatsappClicks}
                  </h4>
                  <p className="text-xs font-semibold text-primary mt-1">Contatos no WhatsApp</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    Conversão em atendimento real
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. ABA: AGENTE IA ADMINISTRATIVO */}
        {activeTab === 'agent' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent mb-2">
                <Bot size={15} /> Agente Administrativo Autônomo Nezzo
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Assistente de Gestão & Insights em Linguagem Natural
              </h2>
              <p className="text-xs text-ink/60 mt-0.5">
                Conectado aos dados do catálogo e eventos. Ações destrutivas ou de preços exigem aprovação explícita.
              </p>
            </div>

            {/* Diálogo de Ação Pendente */}
            {pendingAction && (
              <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={22} className="text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="text-sm font-bold text-amber-900 block">
                      Confirmação Obrigatória do Administrador
                    </strong>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      O Agente de IA propôs: <strong>{pendingAction.description}</strong>. Confirma a aplicação desta alteração?
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => handleConfirmAction(pendingAction)}
                        className="btn-primary py-2 px-4 text-xs bg-amber-900 hover:bg-amber-950"
                      >
                        Confirmar e Aplicar Ação
                      </button>
                      <button
                        onClick={() => setPendingAction(null)}
                        className="text-xs font-semibold text-amber-900 hover:underline px-3 py-2"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Box */}
            <div className="rounded-3xl border border-sand bg-white shadow-sm flex flex-col h-[520px]">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-primary text-[#FAF8F5]'
                          : 'bg-light border border-sand text-primary whitespace-pre-line'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="font-bold text-[10px] opacity-70">
                          {msg.sender === 'user' ? 'Administrador' : 'Agente IA Nezzo'}
                        </span>
                        <span className="text-[9px] opacity-50">{msg.timestamp}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isAgentTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-light p-3 border border-sand text-xs text-ink/60 flex items-center gap-2">
                      <Sparkles size={14} className="animate-spin text-accent" />
                      <span>Consultando dados e gerando análise...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Chat */}
              <form onSubmit={handleSendQuery} className="p-4 border-t border-sand bg-paper/50 flex gap-3">
                <input
                  type="text"
                  placeholder="Ex: 'Quais armações a IA mais recomendou?' ou 'Como foi o desempenho do site?'"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 rounded-2xl border border-sand bg-white px-4 py-3 text-xs text-primary focus:border-accent focus:outline-none"
                />
                <button type="submit" className="btn-olive py-3 px-6 text-xs shrink-0">
                  Perguntar ao Agente
                </button>
              </form>
            </div>

            {/* Log de Auditoria */}
            <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                <History size={16} className="text-accent" />
                Log de Auditoria de Ações do Agente IA
              </h3>
              <div className="divide-y divide-sand text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-primary font-semibold block">{log.action}</strong>
                      <span className="text-ink/60 text-[11px]">{log.details}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-ink/50 block">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {log.confirmed ? 'Autorizado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. ABA: CONTEÚDO DO SITE */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold text-primary">Conteúdo & Identidade da Ótica Nezzo</h2>
              <p className="text-xs text-ink/60 mt-0.5">
                Dados oficiais apresentados nas páginas públicas e no rodapé.
              </p>
            </div>

            <div className="rounded-3xl border border-sand bg-white p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-primary block mb-1">Nome Fantasia</label>
                <input
                  type="text"
                  readOnly
                  value={siteConfig.name}
                  className="w-full rounded-xl border border-sand bg-light p-3 text-primary"
                />
              </div>

              <div>
                <label className="font-bold text-primary block mb-1">Slogan Oficial</label>
                <input
                  type="text"
                  readOnly
                  value={siteConfig.tagline}
                  className="w-full rounded-xl border border-sand bg-light p-3 text-primary font-serif italic text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-primary block mb-1">WhatsApp de Atendimento</label>
                  <input
                    type="text"
                    readOnly
                    value={siteConfig.contact.whatsapp}
                    className="w-full rounded-xl border border-sand bg-light p-3 text-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-primary block mb-1">Instagram Oficial</label>
                  <input
                    type="text"
                    readOnly
                    value={siteConfig.contact.instagramLabel}
                    className="w-full rounded-xl border border-sand bg-light p-3 text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-primary block mb-1">Endereço da Loja</label>
                <input
                  type="text"
                  readOnly
                  value={siteConfig.contact.address}
                  className="w-full rounded-xl border border-sand bg-light p-3 text-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. ABA: CONFIGURAÇÕES & MULTI-TENANT */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold text-primary">Arquitetura Multi-Tenant & Sistema</h2>
              <p className="text-xs text-ink/60 mt-0.5">
                Configuração para que este sistema atenda múltiplas unidades ou outras óticas parceiras.
              </p>
            </div>

            <div className="rounded-3xl border border-sand bg-white p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div>
                  <strong className="block text-sm font-bold text-primary">Identificador da Ótica (Tenant ID)</strong>
                  <span className="text-ink/60">Chave de particionamento no banco de dados</span>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 font-mono font-bold text-accent">
                  tenant_id: &quot;nezzo&quot;
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div>
                  <strong className="block text-sm font-bold text-primary">Motor de IA Padrão</strong>
                  <span className="text-ink/60">Google Gemini 2.0 Flash com fallback local MediaPipe</span>
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 font-semibold">
                  Habilitado & Resiliente
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div>
                  <strong className="block text-sm font-bold text-primary">Camada de Banco de Dados</strong>
                  <span className="text-ink/60">Pronto para Firestore com fallback local offline</span>
                </div>
                <span className="rounded-full bg-light px-3 py-1 text-ink/70 font-semibold">
                  Multi-Tenant Ready
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm('Deseja limpar todos os eventos registrados de analytics?')) {
                      clearAnalyticsEvents();
                      setSummary(getAnalyticsSummary());
                      showToast('Eventos de analytics limpos.');
                    }
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Limpar eventos de teste de analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
