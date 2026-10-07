export type FrameShape = 'Redondo' | 'Gatinho' | 'Aviador' | 'Retangular' | 'Oval' | 'Quadrado';
export type ProductCategory = 'Grau' | 'Sol' | 'Multifocal';
export type FrameSize = 'P' | 'M' | 'G';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  imageCrop?: { x: number; y: number; width: number; height: number; sourceWidth: number; sourceHeight: number };
  sourceUrl?: string;
  category: ProductCategory;
  frameShape: FrameShape;
  size?: FrameSize;
  tags: string[];
  color: string;
  companyId?: string;
  featured?: boolean;
  inStock?: boolean;
  description?: string;
}

export interface FaceMetrics {
  aspectRatio: number; // Altura / Largura
  jawToCheekRatio: number; // Largura Mandíbula / Largura Maçãs
  foreheadToJawRatio: number; // Largura Testa / Mandíbula
  symmetryRatio: number; // 0 a 1 (1 = 100% simétrico)
  suggestedSize?: FrameSize;
  isFrontal: boolean; // Confirmação de pose frontal adequada
  measurementDisclaimer: string; // Aviso formal LGPD / Não clínico
}

export interface FaceAnalysisResult {
  source: 'gemini' | 'huggingface' | 'nvidia' | 'local';
  faceShape: string;
  description: string;
  recommendedFrameShapes: FrameShape[];
  styleAdvice: string;
  metrics?: FaceMetrics;
  recommendedProducts: Array<{ productId: string; reason: string }>;
  suggestedSize?: FrameSize;
  placement?: FacePlacement;
}

export interface FacePlacement {
  centerX: number;
  centerY: number;
  width: number;
  rotation: number;
  imageAspectRatio: number;
}

export interface ContactLead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: 'site' | 'visagismo' | 'whatsapp';
  recommendedProducts?: string[];
  faceShape?: string;
  createdAt?: string;
  status?: 'novo' | 'em_atendimento' | 'convertido' | 'arquivado';
  companyId?: string;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'visagismo_started'
  | 'visagismo_completed'
  | 'product_viewed'
  | 'interest_clicked'
  | 'whatsapp_click';

export interface AnalyticsRecord {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  companyId?: string;
  metadata?: {
    faceShape?: string;
    productId?: string;
    productName?: string;
    frameShape?: string;
    source?: string;
    mode?: string;
  };
}

export interface AnalyticsSummary {
  pageViews: number;
  visagismoStarts: number;
  visagismoCompletions: number;
  completionRate: number;
  whatsappClicks: number;
  interestClicks: number;
  leadsCount: number;
  topFaceShapes: Array<{ shape: string; count: number }>;
  topRecommendedProducts: Array<{ id: string; name: string; count: number }>;
  topViewedProducts: Array<{ id: string; name: string; count: number }>;
}

export interface TenantConfig {
  id: string;
  name: string;
  tagline: string;
  city: string;
  state: string;
  phone: string;
  phoneFormatted: string;
  whatsapp: string;
  instagram: string;
  instagramHandle: string;
  address: string;
  primaryColor: string;
  accentColor: string;
  bgLightColor: string;
}
