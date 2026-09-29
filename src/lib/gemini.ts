import { GoogleGenAI } from '@google/genai';
import type { FaceAnalysisResult, FrameShape } from '@/types';
import { products } from './mock-data';

const faceShapes = ['Oval', 'Redondo', 'Quadrado', 'Coração', 'Alongado', 'Indefinido'] as const;
const catalog = products.map(({ id, name, category, frameShape, color, tags }) => ({ id, name, category, frameShape, color, tags }));

type FaceObservation = {
  hasFace: boolean;
  faceShape: string;
  faceAspectRatio: number;
  contourEvidence: string;
  confidence: number;
};

type StyleSelection = {
  styleAdvice: string;
  recommendations: Array<{ productId: string; reason: string }>;
};

export class VisagismoError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

const observationSchema = {
  type: 'object',
  properties: {
    hasFace: { type: 'boolean' },
    faceShape: { type: 'string', enum: faceShapes },
    faceAspectRatio: { type: 'number' },
    contourEvidence: { type: 'string' },
    confidence: { type: 'number' },
  },
  required: ['hasFace', 'faceShape', 'faceAspectRatio', 'contourEvidence', 'confidence'],
};

const selectionSchema = {
  type: 'object',
  properties: {
    styleAdvice: { type: 'string' },
    recommendations: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object',
        properties: {
          productId: { type: 'string', enum: products.map(product => product.id) },
          reason: { type: 'string' },
        },
        required: ['productId', 'reason'],
      },
    },
  },
  required: ['styleAdvice', 'recommendations'],
};

const observationPrompt = [
  'Analise somente o contorno anatômico do rosto na imagem, sem identificar a pessoa ou inferir atributos sensíveis ou saúde.',
  'Ignore cabelos, orelhas, pescoço e a proporção do enquadramento da foto.',
  'Compare a altura da linha de implantação do cabelo até o queixo com a largura máxima do rosto na altura das maçãs.',
  'Estime faceAspectRatio = altura do rosto / largura do rosto, com duas casas decimais. Essa é uma medida visual aproximada.',
  'Classifique Alongado SOMENTE se a altura for claramente pelo menos 1,55 vezes a largura e as laterais forem relativamente paralelas. Um rosto apenas um pouco mais alto que largo não é Alongado.',
  'Classifique Redondo se altura e largura forem próximas, bochechas cheias e mandíbula suave.',
  'Classifique Quadrado se a mandíbula for angulosa e tiver largura parecida com a testa.',
  'Classifique Coração se a testa for visivelmente mais larga que a mandíbula e o queixo for afilado.',
  'Classifique Oval se for moderadamente mais comprido que largo, com contorno suave e sem comprimento extremo.',
  'Se não houver um único rosto frontal nítido, ou não for possível ver o contorno da testa e do queixo para comparar as proporções, use hasFace=false e faceShape=Indefinido.',
  'Em contourEvidence, descreva apenas os traços visuais observados em uma frase breve, em português do Brasil.',
  'Em confidence, indique de 0 a 1 o quanto a foto permite essa classificação. Não force uma categoria quando houver dúvida.',
].join(' ');

function normalizeError(error: unknown, phase: 'contorno' | 'armações'): VisagismoError {
  const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : undefined;
  const kind = error instanceof Error ? error.name : typeof error;
  const message = error instanceof Error ? error.message : '';
  const secret = process.env.GEMINI_API_KEY;
  console.error('Falha na análise Gemini:', phase, status || kind, (secret ? message.replaceAll(secret, '[redacted]') : message).slice(0, 180));
  if (status === 429 || /too many requests|quota|rate limit/i.test(message)) return new VisagismoError('O limite temporário da IA foi atingido. Aguarde um pouco e tente novamente.', 503);
  if (kind === 'AbortError' || /timed out|timeout/i.test(message)) return new VisagismoError('A análise demorou mais que o esperado. Tente novamente em instantes.', 503);
  if (status === 503) return new VisagismoError('O serviço de IA está temporariamente ocupado. Tente novamente em instantes.', 503);
  if (status === 404) return new VisagismoError('O modelo de IA configurado não está disponível. Confira GEMINI_MODEL.', 503);
  return new VisagismoError('Não foi possível concluir a análise por IA. Tente novamente.', 502);
}

function cleanJsonText(raw: string): string {
  return raw.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
}

function ensureDistinctRecommendations(faceShape: string, rawRecs?: Array<{ productId?: string; reason?: string }>) {
  const seenIds = new Set<string>();
  const seenShapes = new Set<FrameShape>();
  const recommendations: Array<{ productId: string; reason: string }> = [];

  if (Array.isArray(rawRecs)) {
    for (const item of rawRecs) {
      if (!item || typeof item.productId !== 'string') continue;
      const product = products.find(p => p.id === item.productId);
      if (!product || seenIds.has(product.id) || seenShapes.has(product.frameShape)) continue;
      seenIds.add(product.id);
      seenShapes.add(product.frameShape);
      recommendations.push({
        productId: product.id,
        reason: (typeof item.reason === 'string' && item.reason.trim())
          ? item.reason.trim()
          : `Harmoniza com o contorno ${faceShape.toLowerCase()}.`,
      });
      if (recommendations.length === 3) break;
    }
  }

  // Auto-backfill if fewer than 3 distinct shapes were picked
  if (recommendations.length < 3) {
    for (const prod of products) {
      if (!seenIds.has(prod.id) && !seenShapes.has(prod.frameShape)) {
        seenIds.add(prod.id);
        seenShapes.add(prod.frameShape);
        recommendations.push({
          productId: prod.id,
          reason: `Design em harmonia com o contorno ${faceShape.toLowerCase()}.`,
        });
        if (recommendations.length === 3) break;
      }
    }
  }

  return recommendations;
}

export async function analyzeWithGemini(imageDataUrl: string): Promise<FaceAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new VisagismoError('GEMINI_API_KEY não configurada.', 503);
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(imageDataUrl);
  if (!match) throw new VisagismoError('Formato de imagem inválido.', 400);

  const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 60_000 } });
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  let observation: FaceObservation;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { inlineData: { mimeType: match[1], data: match[2] } },
        { text: observationPrompt },
      ],
      config: { responseMimeType: 'application/json', responseJsonSchema: observationSchema, temperature: 0 },
    });
    if (!response.text) throw new Error('Resposta vazia do Gemini contorno: ' + response.candidates?.[0]?.finishReason);
    observation = JSON.parse(response.text) as FaceObservation;
  } catch (error) {
    throw normalizeError(error, 'contorno');
  }

  if (!observation.hasFace || observation.faceShape === 'Indefinido') {
    throw new VisagismoError('Não foi possível avaliar o contorno do rosto. Envie uma foto frontal, nítida e com testa e queixo visíveis.', 422);
  }
  if (!faceShapes.includes(observation.faceShape as typeof faceShapes[number])
    || !Number.isFinite(observation.faceAspectRatio)
    || !Number.isFinite(observation.confidence)
    || typeof observation.contourEvidence !== 'string') {
    throw new VisagismoError('A IA não retornou uma análise válida. Tente outra foto.', 502);
  }
  if (observation.confidence < 0.50 || observation.faceAspectRatio < 0.75 || observation.faceAspectRatio > 2.2
    || (observation.faceShape === 'Alongado' && observation.faceAspectRatio < 1.30)) {
    throw new VisagismoError('As proporções do rosto não ficaram claras. Tente uma foto frontal, com o cabelo afastado do contorno facial.', 422);
  }

  let selection: StyleSelection;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        'Você é um consultor de armações. Uma análise visual anterior classificou o contorno aparente como ' + observation.faceShape + ',',
        'com proporção altura/largura estimada em ' + observation.faceAspectRatio.toFixed(2) + ' e estes traços: ' + observation.contourEvidence + '.',
        'Escolha exatamente 3 produtos de formatos diferentes do catálogo a seguir que complementem esses traços.',
        'Use somente os IDs existentes. Para cada produto, explique em uma frase curta por que combina com esse contorno.',
        'Escreva também styleAdvice em até duas frases curtas. Não reclassifique o rosto nem alegue precisão clínica.',
        'Responda em português do Brasil. Catálogo: ' + JSON.stringify(catalog),
      ].join(' '),
      config: { responseMimeType: 'application/json', responseJsonSchema: selectionSchema, temperature: 0.2 },
    });
    if (!response.text) throw new Error('Resposta vazia do Gemini armações: ' + response.candidates?.[0]?.finishReason);
    selection = JSON.parse(response.text) as StyleSelection;
  } catch (error) {
    throw normalizeError(error, 'armações');
  }

  const recommendations = ensureDistinctRecommendations(observation.faceShape, selection.recommendations);

  return {
    source: 'gemini',
    faceShape: observation.faceShape,
    description: observation.contourEvidence.trim(),
    styleAdvice: (selection.styleAdvice || 'Armações selecionadas para harmonizar com seus traços.').trim(),
    recommendedProducts: recommendations,
    recommendedFrameShapes: recommendations.map(item => products.find(p => p.id === item.productId)!.frameShape),
  };
}

export async function analyzeWithHuggingFace(imageDataUrl: string): Promise<FaceAnalysisResult> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new VisagismoError('HUGGINGFACE_API_KEY não configurada.', 503);
  const model = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.2-11B-Vision-Instruct';

  const prompt = [
    'Você é um consultor de visagismo ótico para a sua-marca.',
    'Analise o formato do rosto na foto e selecione 3 armações com formatos distintos do catálogo abaixo.',
    'Catálogo disponível: ' + JSON.stringify(catalog),
    'Responda EXCLUSIVAMENTE em formato JSON puro, sem blocos markdown, com o formato:',
    '{"faceShape":"Oval"|"Redondo"|"Quadrado"|"Coração"|"Alongado","description":"frase breve dos traços","styleAdvice":"conselho de estilo curto","recommendedProducts":[{"productId":"ID","reason":"motivo"}]}',
  ].join(' ');

  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageDataUrl } },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Hugging Face API erro ${response.status}: ${errorBody.slice(0, 160)}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) throw new Error('Hugging Face retornou resposta vazia.');

  const parsed = JSON.parse(cleanJsonText(rawContent));
  const faceShape = String(parsed.faceShape || 'Oval');
  const recommendations = ensureDistinctRecommendations(faceShape, parsed.recommendedProducts);

  return {
    source: 'huggingface',
    faceShape,
    description: String(parsed.description || 'Traços analisados via Hugging Face.').trim(),
    styleAdvice: String(parsed.styleAdvice || 'Armações selecionadas especialmente para você.').trim(),
    recommendedProducts: recommendations,
    recommendedFrameShapes: recommendations.map(item => products.find(p => p.id === item.productId)!.frameShape),
  };
}

export async function analyzeWithNvidia(imageDataUrl: string): Promise<FaceAnalysisResult> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new VisagismoError('NVIDIA_API_KEY não configurada.', 503);
  const model = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

  const prompt = [
    'Você é um consultor especialista em visagismo ótico para a sua-marca.',
    'Analise anatomicamente o contorno facial da pessoa nesta foto e selecione exatamente 3 armações com formatos diferentes do catálogo a seguir que valorizem esses traços.',
    'Catálogo disponível: ' + JSON.stringify(catalog),
    'Responda EXCLUSIVAMENTE em formato JSON puro, sem blocos markdown e sem textos adicionais, com a seguinte estrutura:',
    '{"faceShape":"Oval"|"Redondo"|"Quadrado"|"Coração"|"Alongado","description":"Frase descrevendo os traços do contorno facial observados na foto.","styleAdvice":"Conselho de estilo em até duas frases curtas.","recommendedProducts":[{"productId":"01","reason":"Por que esta armação combina com o formato do rosto."},{"productId":"02","reason":"Por que esta armação combina com o formato do rosto."},{"productId":"03","reason":"Por que esta armação combina com o formato do rosto."}]}',
  ].join(' ');

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageDataUrl } },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`NVIDIA API erro ${response.status}: ${errorBody.slice(0, 160)}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) throw new Error('NVIDIA API retornou resposta vazia.');

  const parsed = JSON.parse(cleanJsonText(rawContent));
  const faceShape = String(parsed.faceShape || 'Oval');
  const recommendations = ensureDistinctRecommendations(faceShape, parsed.recommendedProducts);

  return {
    source: 'nvidia',
    faceShape,
    description: String(parsed.description || 'Traços analisados com alta precisão visual via NVIDIA Vision.').trim(),
    styleAdvice: String(parsed.styleAdvice || 'Armações selecionadas especialmente para valorizar o seu formato de rosto.').trim(),
    recommendedProducts: recommendations,
    recommendedFrameShapes: recommendations.map(item => products.find(p => p.id === item.productId)!.frameShape),
  };
}

export async function analyzeFace(imageDataUrl: string): Promise<FaceAnalysisResult> {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(imageDataUrl);
  if (!match) throw new VisagismoError('Formato de imagem inválido.', 400);

  // Plano A: Gemini
  try {
    return await analyzeWithGemini(imageDataUrl);
  } catch (geminiError) {
    console.warn('Plano A (Gemini) indisponível ou esgotou cota. Acionando Plano B (Hugging Face)...', geminiError instanceof Error ? geminiError.message : geminiError);

    // Plano B: Hugging Face
    try {
      return await analyzeWithHuggingFace(imageDataUrl);
    } catch (hfError) {
      console.warn('Plano B (Hugging Face) indisponível. Acionando Plano C (NVIDIA)...', hfError instanceof Error ? hfError.message : hfError);

      // Plano C: NVIDIA NIM Vision
      try {
        return await analyzeWithNvidia(imageDataUrl);
      } catch (nvidiaError) {
        console.error('Todos os serviços em nuvem (Gemini, Hugging Face, NVIDIA) falharam:', nvidiaError instanceof Error ? nvidiaError.message : nvidiaError);
        throw new VisagismoError('Os provedores de IA em nuvem estão temporariamente ocupados. Ativando teste local...', 503);
      }
    }
  }
}
