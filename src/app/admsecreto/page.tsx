'use client';

import { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Download,
  Edit3,
  Eye,
  Glasses,
  PlusCircle,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import type { Product } from '@/types';
import {
  addCatalogProduct,
  updateCatalogProduct,
  deleteCatalogProduct,
  resetCatalogToDefault,
  exportCatalogJson,
  importCatalogJson,
} from '@/lib/catalog-storage';
import { AddProductModal } from '@/components/AddProductModal';
import { useCatalog } from '@/lib/use-catalog';
import { useDemoSession, setDemoSession } from '@/lib/demo-session';

const DEFAULT_PIN = '2000'; // Código público de demonstração; não é proteção de produção.

export default function AdminSecretoPage() {
  const isAuthenticated = useDemoSession();
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  const products = useCatalog();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedShape, setSelectedShape] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function handlePinSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setDemoSession(true);
      setPinError(null);
      try {
        sessionStorage.setItem('oticafabio_adm_auth', 'true');
      } catch {
        // Ignora
      }
    } else {
      setPinError('Código incorreto. Confira o código de demonstração no manual.');
      setPinInput('');
    }
  }

  function handleKeypadPress(num: string) {
    setPinError(null);
    if (pinInput.length < 6) {
      const newPin = pinInput + num;
      setPinInput(newPin);
      if (newPin === DEFAULT_PIN) {
        setDemoSession(true);
        try {
          sessionStorage.setItem('oticafabio_adm_auth', 'true');
        } catch {
          // Ignora
        }
      }
    }
  }

  function handleKeypadClear() {
    setPinInput('');
    setPinError(null);
  }

  function handleLogout() {
    setDemoSession(false);
    setPinInput('');
    try {
      sessionStorage.removeItem('oticafabio_adm_auth');
    } catch {
      // Ignora
    }
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }

  function handleOpenAdd() {
    setEditingProduct(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(product: Product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  function handleSaveProduct(productData: Product) {
    if (editingProduct) {
      updateCatalogProduct(productData);
      showToast(`Armação "${productData.name}" atualizada com sucesso!`);
    } else {
      addCatalogProduct(productData);
      showToast(`Nova armação "${productData.name}" adicionada ao catálogo!`);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  }

  function handleDeleteProduct(id: string, name: string) {
    if (confirm(`Tem certeza que deseja remover a armação "${name}" do catálogo?`)) {
      try { deleteCatalogProduct(id); } catch (error) { showToast(error instanceof Error ? error.message : "Falha ao excluir."); return; }
      showToast(`Armação "${name}" removida do catálogo.`);
    }
  }

  function handleResetDefault() {
    if (
      confirm(
        'ATENÇÃO: Deseja restaurar o catálogo para as 18 armações originais da sua-marca? Modelos criados por você serão excluídos.'
      )
    ) {
      try { resetCatalogToDefault(); } catch (error) { showToast(error instanceof Error ? error.message : "Falha ao restaurar."); return; }
      showToast('Catálogo restaurado para as configurações de fábrica.');
    }
  }

  function handleExportBackup() {
    try {
      const dataStr = exportCatalogJson();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sua_marca_catalogo_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Arquivo de backup baixado com sucesso!');
    } catch (e) {
      alert('Erro ao exportar backup: ' + e);
    }
  }

  function handleImportBackup(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (typeof reader.result === 'string') {
          const imported = importCatalogJson(reader.result);
          showToast(`Backup restaurado! ${imported.length} armações carregadas.`);
        }
      } catch (err: unknown) {
        alert('Erro ao importar arquivo: ' + (err instanceof Error ? err.message : String(err)));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.color.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        p.id.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesShape = selectedShape === 'Todos' || p.frameShape === selectedShape;

      return matchesSearch && matchesCategory && matchesShape;
    });
  }, [products, search, selectedCategory, selectedShape]);

  const totalCount = products.length;
  const grauCount = products.filter(p => p.category === 'Grau').length;
  const solCount = products.filter(p => p.category === 'Sol').length;
  const customCount = products.filter(p => p.id.startsWith('custom-')).length;

  // TELA DE PROTEÇÃO / DIGITAÇÃO DE PIN (SUPER SIMPLES E ACOLHEDORA)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary text-white flex flex-col justify-between p-4 sm:p-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="font-sans text-xl font-black tracking-[-.04em] text-white">
            sua-<span className="text-highlight">marca</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
          >
            <ArrowLeft size={14} /> Voltar para o Site
          </Link>
        </header>

        <main className="mx-auto w-full max-w-sm my-auto text-center py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/20 text-accent mb-5 border border-accent/30 shadow-lg shadow-accent/20">
            <Lock size={30} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Área Reservada da Loja
          </h1>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            Editor de demonstração. As alterações ficam apenas neste navegador.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-6">
            {/* Visor do PIN */}
            <div className="flex justify-center items-center gap-3 my-4">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`h-11 w-11 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                    pinInput.length > i
                      ? 'border-accent bg-accent/20 text-white shadow-md'
                      : 'border-white/20 bg-white/5 text-transparent'
                  }`}
                >
                  {pinInput.length > i ? '●' : ''}
                </div>
              ))}
            </div>

            {pinError && (
              <p className="mb-4 rounded-xl bg-red-500/20 border border-red-500/40 p-2.5 text-xs font-semibold text-red-200">
                {pinError}
              </p>
            )}

            {/* Teclado Numérico Grande (Ideal para celular, tablet ou tela de toque) */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mt-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="h-12 rounded-2xl bg-white/10 text-xl font-bold text-white hover:bg-accent hover:text-white transition active:scale-95 border border-white/10 flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="h-12 rounded-2xl bg-white/5 text-xs font-bold text-white/60 hover:bg-white/15 transition active:scale-95 border border-white/10 flex items-center justify-center"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-12 rounded-2xl bg-white/10 text-xl font-bold text-white hover:bg-accent transition active:scale-95 border border-white/10 flex items-center justify-center"
              >
                0
              </button>
              <button
                type="submit"
                className="h-12 rounded-2xl bg-accent text-sm font-bold text-white hover:bg-primary transition active:scale-95 shadow-md flex items-center justify-center gap-1"
              >
                <Unlock size={16} /> Entrar
              </button>
            </div>
          </form>

          {/* Dica Amigável */}
          <div className="mt-8 rounded-2xl bg-white/5 p-4 border border-white/10 text-xs text-white/70">
            <p className="flex items-center justify-center gap-1.5 font-bold text-accent mb-1">
              <KeyRound size={14} /> Código de demonstração:
            </p>
            <p>
              Código para testar este protótipo: <strong>2000</strong>.
            </p>
          </div>
        </main>

        <footer className="text-center text-xs text-white/40">
          sua-marca · Editor de demonstração local
        </footer>
      </div>
    );
  }

  // TELA ADMINISTRATIVA PRINCIPAL
  return (
    <div className="min-h-screen bg-paper text-ink pb-20">
      {/* Toast de notificação */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-primary px-5 py-4 text-sm font-semibold text-white shadow-2xl border border-white/10 animate-fade-in">
          <CheckCircle2 size={18} className="text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Topo Administrativo */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/90 backdrop-blur-md">
        <div className="container-wide flex h-18 items-center justify-between py-3.5">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-sans text-xl font-black tracking-[-.04em] text-primary">
                sua-<span className="text-accent">marca</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-bold text-blue-800">
              <ShieldCheck size={13} className="text-blue-600" /> Acesso Seguro Autorizado
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white px-4 py-2 text-xs font-bold text-primary hover:border-accent hover:text-accent transition"
            >
              <Eye size={14} /> Ver Catálogo do Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              title="Sair do editor"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
            >
              <Lock size={13} /> Bloquear
            </button>
          </div>
        </div>
      </header>

      {/* Hero do Painel */}
      <section className="bg-primary text-white py-10 lg:py-14 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[50px] border-accent/10" />
        <div className="container-wide relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wide text-accent backdrop-blur">
                <Sparkles size={14} /> GERENCIADOR DE PRODUTOS
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
                Painel Administrativo do Catálogo
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Adicione novas armações, altere preços, fotos e descrições, ou remova modelos obsoletos. As alterações entram em vigor no site e no Provador com IA instantaneamente.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/25 hover:bg-primary transition"
            >
              <PlusCircle size={18} /> Adicionar Nova Armação
            </button>
          </div>

          {/* Cards de Métricas */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">Total de Modelos</span>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-white">{totalCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">Armações de Grau</span>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-accent">{grauCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">Armações de Sol</span>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-white">{solCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">Cadastradas por Você</span>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-accent">{customCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="container-wide -mt-4 relative z-10 space-y-6">
        {/* Barra de Ferramentas / Filtros */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-soft border border-primary/5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Campo de Busca */}
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome, marca, cor, formato ou ID..."
                className="w-full rounded-xl border border-primary/15 bg-light/50 pl-10 pr-4 py-2.5 text-sm font-semibold text-primary outline-none focus:border-accent focus:bg-white transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink/40 hover:text-ink"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Ações de Backup / Restaurar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                title="Baixar cópia de segurança de todos os produtos cadastrados"
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/15 bg-white px-3.5 py-2 text-xs font-bold text-primary hover:border-accent hover:text-accent transition"
              >
                <Download size={14} /> Exportar Backup
              </button>

              <label
                title="Restaurar armações a partir de um arquivo JSON salvo anteriormente"
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/15 bg-white px-3.5 py-2 text-xs font-bold text-primary hover:border-accent hover:text-accent transition cursor-pointer"
              >
                <UploadCloud size={14} /> Importar Backup
                <input type="file" accept=".json" onChange={handleImportBackup} className="sr-only" />
              </label>

              <button
                type="button"
                onClick={handleResetDefault}
                title="Voltar ao catálogo original de 18 armações"
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition"
              >
                <RotateCcw size={14} /> Restaurar Padrão
              </button>
            </div>
          </div>

          {/* Filtros de Categoria e Formato */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-primary/5 text-xs">
            <span className="font-bold text-primary/60 flex items-center gap-1 mr-1">
              <SlidersHorizontal size={13} /> Tipo:
            </span>
            {['Todos', 'Grau', 'Sol', 'Multifocal'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-light text-primary/70 hover:bg-primary/10'
                }`}
              >
                {cat}
              </button>
            ))}

            <span className="font-bold text-primary/60 flex items-center gap-1 ml-3 mr-1">
              Formato:
            </span>
            {['Todos', 'Redondo', 'Gatinho', 'Aviador', 'Retangular', 'Oval', 'Quadrado'].map(shp => (
              <button
                key={shp}
                type="button"
                onClick={() => setSelectedShape(shp)}
                className={`rounded-full px-3 py-1 font-bold transition ${
                  selectedShape === shp
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-light text-primary/70 hover:bg-accent/15'
                }`}
              >
                {shp}
              </button>
            ))}
          </div>
        </div>

        {/* Informação sobre os resultados */}
        <div className="flex items-center justify-between text-xs font-semibold text-ink/60 px-1">
          <span>
            Exibindo <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> armações
          </span>
          {search && (
            <span>
              Filtrado por: &quot;{search}&quot;
            </span>
          )}
        </div>

        {/* Tabela / Grid de Armações */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                {/* Imagem e Topo */}
                <div>
                  <div className="relative aspect-[1.4] overflow-hidden bg-[#f3f8fa] border-b border-primary/5">
                    <Image
                      src={p.image}
                      unoptimized={!p.image.startsWith('/images/')}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <span className="rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary shadow-sm">
                        {p.category}
                      </span>
                      <span className="rounded-full bg-accent/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                        {p.frameShape}
                      </span>
                    </div>

                    <span className="absolute right-3 top-3 rounded-md bg-primary/70 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur">
                      #{p.id}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-accent">
                          {p.brand}
                        </p>
                        <h3 className="text-base font-bold text-primary mt-0.5">{p.name}</h3>
                      </div>
                      <p className="text-base font-black text-primary whitespace-nowrap">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        }).format(p.price)}
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-ink/60">
                      Cor: <strong>{p.color}</strong>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.tags.map(t => (
                        <span
                          key={t}
                          className="rounded-full bg-light px-2 py-0.5 text-[10px] font-semibold text-primary/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Barra de Ações (Editar & Excluir) */}
                <div className="border-t border-primary/10 bg-[#f9fcfe] p-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(p)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/15 bg-white py-2 text-xs font-bold text-primary hover:border-accent hover:text-accent hover:shadow-sm transition"
                  >
                    <Edit3 size={14} /> Editar Armação
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(p.id, p.name)}
                    title="Excluir armação"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-primary/10 bg-white p-12 text-center shadow-soft">
            <Glasses size={40} className="mx-auto text-primary/30 mb-3" />
            <h3 className="text-lg font-bold text-primary">Nenhuma armação encontrada</h3>
            <p className="mt-1 text-xs text-ink/60 max-w-sm mx-auto">
              Não encontramos nenhuma armação com os filtros atuais. Experimente limpar a busca ou cadastrar um novo modelo.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="btn-primary mt-5"
            >
              <PlusCircle size={16} /> Cadastrar Nova Armação
            </button>
          </div>
        )}

        {/* Guia Didático Rápido no rodapé do painel */}
        <section className="rounded-2xl border border-primary/10 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2 text-primary font-bold text-base mb-3">
            <Sparkles size={18} className="text-accent" />
            <span>Guia Rápido para a Equipe sua-marca</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 text-xs text-ink/75 leading-5">
            <div className="rounded-xl bg-light p-4">
              <strong className="block text-primary font-bold text-sm mb-1">1. Adicionar Modelos</strong>
              Clique em &quot;Adicionar Nova Armação&quot;. Você pode preencher o nome, valor, marca, cor e escolher uma foto padrão do mostruário ou subir uma foto real da vitrine.
            </div>
            <div className="rounded-xl bg-light p-4">
              <strong className="block text-primary font-bold text-sm mb-1">2. Editar & Atualizar</strong>
              No card da armação desejada, clique em &quot;Editar Armação&quot;. Altere o preço, nome ou foto a qualquer momento e clique em Salvar. O site atualiza imediatamente.
            </div>
            <div className="rounded-xl bg-light p-4">
              <strong className="block text-primary font-bold text-sm mb-1">3. Backup & Segurança</strong>
              Use &quot;Exportar Backup&quot; para salvar uma cópia do seu catálogo em arquivo .JSON no seu computador. Assim você pode restaurar quando quiser com &quot;Importar Backup&quot;.
            </div>
          </div>
        </section>
      </main>

      {/* Modal Reutilizável de Adição e Edição */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onAddProduct={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
}
