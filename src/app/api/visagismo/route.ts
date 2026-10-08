import { NextResponse } from 'next/server';
import { analyzeFace, VisagismoError } from '@/lib/gemini';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { isSameOrigin, readBoundedJson, RequestBodyError } from '@/lib/request-security';

export const runtime = 'nodejs';
let activeRequests = 0;

export function GET() {
  return NextResponse.json({
    cloudAnalysis: Boolean(process.env.GEMINI_API_KEY || process.env.HUGGINGFACE_API_KEY || process.env.NVIDIA_API_KEY),
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (request.headers.get('origin') && !isSameOrigin(request)) {
    return NextResponse.json({ error: 'Acesso não autorizado para origens externas.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  }
  const globalLimit = checkRateLimit('analysis-global', { windowMs: 60_000, maxRequests: 60 });
  if (!globalLimit.allowed || activeRequests >= 2) {
    return NextResponse.json({ error: 'Muitas análises simultâneas. Aguarde e tente novamente.' }, { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } });
  }
  activeRequests++;
  try {
    // 1. Proteção de Taxa de Requisições (Rate Limiting anti-DoS e anti-abuso de tokens)
    const clientIp = getClientIp(request);
    const limit = checkRateLimit(`analysis:${clientIp}`, { windowMs: 60_000, maxRequests: 12 });
    
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Limite de análises atingido temporariamente. Por favor, aguarde ${limit.resetInSec} segundos antes de tentar novamente.` },
        {
          status: 429,
          headers: {
            'Retry-After': String(limit.resetInSec),
            'X-RateLimit-Limit': '12',
            'X-RateLimit-Remaining': '0',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Bound total bytes before JSON parsing, including extra fields/escapes.
    const body = await readBoundedJson(request, 14_001_024);
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length !== 1 || !('image' in body) || typeof body.image !== 'string') {
      return NextResponse.json({ error: 'Nenhuma foto enviada para análise.' }, { status: 400 });
    }

    // Validar formato MIME aceito
    if (!/^data:image\/(jpeg|png|webp);base64,/.test(body.image)) {
      return NextResponse.json(
        { error: 'Formato inválido. Envie apenas imagens JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    // Limite máximo de tamanho do payload (10 MB em base64)
    if (body.image.length > 14_000_000) {
      return NextResponse.json(
        { error: 'A foto enviada é muito grande. O limite máximo é de 10 MB.' },
        { status: 413 }
      );
    }

    // 4. Execução da análise com resiliência quádrupla
    const result = await analyzeFace(body.image);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-RateLimit-Limit': '12',
        'X-RateLimit-Remaining': String(limit.remaining),
      },
    });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: { 'Cache-Control': 'no-store' } });
    }
    if (error instanceof VisagismoError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Evita expor detalhes de infraestrutura ou chaves para o cliente
    console.error('Erro na rota de visagismo:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Não foi possível concluir a análise no momento. Tente novamente ou use o teste local.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  } finally { activeRequests--; }
}
