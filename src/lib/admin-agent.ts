import { getAnalyticsSummary } from './analytics';
import { loadCatalog, updateCatalogProduct } from './catalog-storage';
import { siteConfig } from './site-config';
import type { Product } from '@/types';

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionRequired?: {
    actionId: string;
    description: string;
    type: 'price_change' | 'stock_change' | 'create_promo';
    payload: Record<string, unknown>;
  };
}

export interface AgentAuditLog {
  id: string;
  action: string;
  executedBy: string;
  timestamp: string;
  details: string;
  confirmed: boolean;
}

const AUDIT_STORAGE_KEY = 'nezzo_agent_audit_v1';

export function getAuditLogs(): AgentAuditLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: '1',
        action: 'Consulta Analítica',
        executedBy: 'Agente IA Nezzo',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        details: 'Consulta dos formatos de rosto com maior conversão de WhatsApp',
        confirmed: true,
      },
    ];
  } catch {
    return [];
  }
}

export function logAgentAction(action: string, details: string, confirmed = true): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getAuditLogs();
    const newLog: AgentAuditLog = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      executedBy: 'Agente IA Nezzo (Controlado)',
      timestamp: new Date().toISOString(),
      details,
      confirmed,
    };
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([newLog, ...logs].slice(0, 50)));
  } catch (err) {
    console.warn('Falha ao registrar auditoria do agente:', err);
  }
}

/**
 * Ferramentas controladas do Agente IA para responder perguntas do Administrador
 */
export async function processAgentQuery(query: string): Promise<{
  reply: string;
  actionRequired?: AgentMessage['actionRequired'];
}> {
  const q = query.toLowerCase();
  const summary = getAnalyticsSummary();
  const catalog = loadCatalog();

  // 1. Pergunta sobre armações mais recomendadas
  if (q.includes('recomend') || q.includes('mais indicad') || q.includes('modelos a ia')) {
    const recs = summary.topRecommendedProducts.map(p => `• ${p.name}: ${p.count} recomendações`).join('\n');
    logAgentAction('Consulta de Recomendações', 'Verificação de modelos mais sugeridos pelo Visagista');
    return {
      reply: `Com base nas análises faciais registradas:\n\n${recs}\n\nO modelo **${summary.topRecommendedProducts[0]?.name}** foi o mais compatível, principalmente devido à alta procura por rostos de traços ovais e redondos.`,
    };
  }

  // 2. Pergunta sobre interesse / cliques / desempenho
  if (q.includes('desempenho') || q.includes('resultado') || q.includes('visita') || q.includes('semana') || q.includes('mês')) {
    logAgentAction('Consulta de Desempenho Geral', 'Geração de relatório sintético de KPIs');
    return {
      reply: `Resumo de desempenho da Ótica Nezzo:\n\n• **Acessos:** ${summary.pageViews} visualizações\n• **Usos do Visagista:** ${summary.visagismoStarts} iniciadas (${summary.visagismoCompletions} concluídas)\n• **Taxa de Conclusão do Laudo:** ${summary.completionRate}%\n• **Leads Gerados para WhatsApp:** ${summary.whatsappClicks} contatos diretos\n\nA conversão do Visagista para o WhatsApp está em excelente patamar comercial.`,
    };
  }

  // 3. Pergunta sobre formatos de rosto
  if (q.includes('formato') || q.includes('rosto') || q.includes('visagista')) {
    const shapes = summary.topFaceShapes.map(s => `• Formato ${s.shape}: ${s.count} análises`).join('\n');
    logAgentAction('Consulta de Formatos Faciais', 'Levantamento estatístico de formatos identificados');
    return {
      reply: `Distribuição dos formatos faciais identificados nos laudos dos clientes:\n\n${shapes}\n\nRecomendo manter estoque reforçado de armações quadradas e gatinho para atender a esse perfil preponderante.`,
    };
  }

  // 4. Solicitação de Ação Crítica (Exemplo: "Crie uma promoção para determinada categoria" ou alterar preço)
  if (q.includes('promoção') || q.includes('desconto') || q.includes('preço')) {
    return {
      reply: `Identifiquei a oportunidade para uma campanha promocional na categoria **Óculos de Sol**.\n\n⚠️ **Atenção:** Esta é uma ação importante no catálogo e requer sua confirmação prévia para entrar em vigor no site da Ótica Nezzo.`,
      actionRequired: {
        actionId: Math.random().toString(36).substring(2, 9),
        description: 'Aplicar 10% de desconto promocional em armações solares e atualizar destaque da vitrine',
        type: 'create_promo',
        payload: { category: 'Sol', discountPercent: 10 },
      },
    };
  }

  // Resposta padrão analítica inteligente
  logAgentAction('Consulta Geral', `Pergunta recebida: "${query}"`);
  return {
    reply: `Olá! Sou o assistente de inteligência de dados da Ótica Nezzo. Posso analisar em tempo real:
- "Quais armações tiveram mais interesse este mês?"
- "Quais modelos a IA mais recomendou?"
- "Como foi o desempenho do site esta semana?"
- "Crie uma promoção para determinada categoria."

Em que posso te ajudar hoje na gestão da Nezzo?`,
  };
}
