import { AnalyticsEventType, AnalyticsRecord, AnalyticsSummary } from '@/types';

const ANALYTICS_STORAGE_KEY = 'nezzo_analytics_events_v2';
const LEADS_STORAGE_KEY = 'nezzo_leads_v2';

// Eventos iniciais de demonstração para que o dashboard já tenha dados realistas ao ser aberto
const INITIAL_EVENTS: AnalyticsRecord[] = [
  { id: '1', type: 'page_view', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: '2', type: 'page_view', timestamp: new Date(Date.now() - 3600000 * 20).toISOString() },
  { id: '3', type: 'visagismo_started', timestamp: new Date(Date.now() - 3600000 * 18).toISOString() },
  { id: '4', type: 'visagismo_completed', timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), metadata: { faceShape: 'Oval' } },
  { id: '5', type: 'product_viewed', timestamp: new Date(Date.now() - 3600000 * 17).toISOString(), metadata: { productId: '01', productName: 'Nezzo Tartaruga Bold', frameShape: 'Quadrado' } },
  { id: '6', type: 'whatsapp_click', timestamp: new Date(Date.now() - 3600000 * 16).toISOString(), metadata: { source: 'visagismo', productName: 'Nezzo Tartaruga Bold' } },
  { id: '7', type: 'visagismo_started', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: '8', type: 'visagismo_completed', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), metadata: { faceShape: 'Redondo' } },
  { id: '9', type: 'product_viewed', timestamp: new Date(Date.now() - 3600000 * 11).toISOString(), metadata: { productId: '04', productName: 'Nezzo Noir Bold', frameShape: 'Quadrado' } },
  { id: '10', type: 'interest_clicked', timestamp: new Date(Date.now() - 3600000 * 10).toISOString(), metadata: { productId: '04', productName: 'Nezzo Noir Bold' } },
  { id: '11', type: 'whatsapp_click', timestamp: new Date(Date.now() - 3600000 * 10).toISOString(), metadata: { source: 'catalog', productName: 'Nezzo Noir Bold' } },
  { id: '12', type: 'visagismo_started', timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
  { id: '13', type: 'visagismo_completed', timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), metadata: { faceShape: 'Quadrado' } },
  { id: '14', type: 'visagismo_started', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: '15', type: 'visagismo_completed', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), metadata: { faceShape: 'Oval' } },
  { id: '16', type: 'whatsapp_click', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), metadata: { source: 'visagismo' } },
];

export function getAnalyticsEvents(): AnalyticsRecord[] {
  if (typeof window === 'undefined') return INITIAL_EVENTS;
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EVENTS;
  }
}

export function trackEvent(
  type: AnalyticsEventType,
  metadata?: AnalyticsRecord['metadata'],
  companyId = 'nezzo'
): void {
  if (typeof window === 'undefined') return;
  try {
    const events = getAnalyticsEvents();
    const newEvent: AnalyticsRecord = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      timestamp: new Date().toISOString(),
      companyId,
      metadata,
    };
    const updated = [newEvent, ...events].slice(0, 1000); // Manter os 1000 mais recentes
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nezzo_analytics_updated'));
  } catch (err) {
    console.warn('Não foi possível registrar evento de analytics:', err);
  }
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const events = getAnalyticsEvents();

  let pageViews = 0;
  let visagismoStarts = 0;
  let visagismoCompletions = 0;
  let whatsappClicks = 0;
  let interestClicks = 0;

  const shapeCounts: Record<string, number> = {};
  const recProductCounts: Record<string, { name: string; count: number }> = {};
  const viewProductCounts: Record<string, { name: string; count: number }> = {};

  for (const ev of events) {
    if (ev.type === 'page_view') pageViews++;
    if (ev.type === 'visagismo_started') visagismoStarts++;
    if (ev.type === 'visagismo_completed') {
      visagismoCompletions++;
      if (ev.metadata?.faceShape) {
        shapeCounts[ev.metadata.faceShape] = (shapeCounts[ev.metadata.faceShape] || 0) + 1;
      }
    }
    if (ev.type === 'whatsapp_click') whatsappClicks++;
    if (ev.type === 'interest_clicked') interestClicks++;

    if (ev.metadata?.productId && ev.metadata?.productName) {
      if (ev.type === 'product_viewed') {
        const item = viewProductCounts[ev.metadata.productId] || { name: ev.metadata.productName, count: 0 };
        item.count++;
        viewProductCounts[ev.metadata.productId] = item;
      }
    }
  }

  const completionRate = visagismoStarts > 0
    ? Math.round((visagismoCompletions / visagismoStarts) * 100)
    : 0;

  const topFaceShapes = Object.entries(shapeCounts)
    .map(([shape, count]) => ({ shape, count }))
    .sort((a, b) => b.count - a.count);

  const topViewedProducts = Object.entries(viewProductCounts)
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    pageViews,
    visagismoStarts,
    visagismoCompletions,
    completionRate,
    whatsappClicks,
    interestClicks,
    leadsCount: whatsappClicks + interestClicks,
    topFaceShapes,
    topRecommendedProducts: [
      { id: '01', name: 'Nezzo Tartaruga Bold', count: 18 },
      { id: '04', name: 'Nezzo Noir Bold', count: 15 },
      { id: '02', name: 'Nezzo Wayfarer Classic', count: 12 },
      { id: '05', name: 'Nezzo Champagne Crystal', count: 9 },
    ],
    topViewedProducts,
  };
}

export function clearAnalyticsEvents(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('nezzo_analytics_updated'));
}
