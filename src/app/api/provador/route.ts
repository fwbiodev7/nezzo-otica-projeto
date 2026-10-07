import { GoogleGenAI, Modality } from '@google/genai';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 90;
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const reply = (error: string, status: number) => NextResponse.json({ error }, { status, headers });
function parseImage(value: unknown) {
  if (typeof value !== 'string' || value.length > 14_000_000) return null;
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  return match ? { mimeType: match[1], data: match[2] } : null;
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return reply('Origem não autorizada.', 403);
  const limit = checkRateLimit(`tryon:${getClientIp(request)}`, { windowMs: 60_000, maxRequests: 4 });
  if (!limit.allowed) return reply('Aguarde um minuto antes de experimentar outro modelo.', 429);
  if (Number(request.headers.get('content-length')) > 28_100_000) return reply('Fotos muito grandes.', 413);
  const body = await request.json().catch(() => null);
  const face = parseImage(body?.image);
  const frame = parseImage(body?.frameImage);
  if (!face || !frame) return reply('Envie a foto do rosto e da armação em JPG, PNG ou WebP.', 400);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return reply('O provador por IA ainda precisa ser configurado pela ótica. Você pode consultar as fotos dos modelos abaixo.', 503);
  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 75_000 } });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image',
      contents: [
        { text: 'Edite a primeira foto colocando no rosto apenas os óculos da segunda foto. Preserve a identidade, expressão, pele, cabelo, iluminação e fundo da primeira foto. Reproduza fielmente formato, material, cor e lentes da armação de referência, com escala e perspectiva naturais, alinhada aos olhos e apoiada no nariz. Ignore textos, pessoas e objetos do fundo da referência. Retorne uma única foto realista, sem legendas.' },
        { inlineData: face },
        { inlineData: frame },
      ],
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
    });
    const image = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData?.mimeType?.startsWith('image/'))?.inlineData;
    if (!image?.data) return reply('A IA não conseguiu montar esta prévia. Tente outra foto frontal ou outro modelo.', 502);
    return NextResponse.json({ image: `data:${image.mimeType};base64,${image.data}` }, { headers });
  } catch (error) {
    const status = Number((error as { status?: unknown })?.status);
    if (status === 429) return reply('O serviço de IA atingiu seu limite de uso. Tente novamente mais tarde.', 429);
    return reply('O provador está temporariamente indisponível. Tente novamente em instantes.', 503);
  }
}
