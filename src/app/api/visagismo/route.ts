import { NextResponse } from 'next/server';
import { analyzeFace, VisagismoError } from '@/lib/gemini';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    cloudAnalysis: Boolean(process.env.GEMINI_API_KEY || process.env.HUGGINGFACE_API_KEY || process.env.NVIDIA_API_KEY),
    cloudTryOn: Boolean(process.env.GEMINI_API_KEY),
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  try {
    // 1. Proteção de Taxa de Requisições (Rate Limiting anti-DoS e anti-abuso de tokens)
    const clientIp = getClientIp(request);
    const limit = checkRateLimit(clientIp, { windowMs: 60_000, maxRequests: 12 });
    
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

    // 2. Proteção Anti-Hotlink / Cross-Origin Hijacking
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      let sameOrigin = false;
      try { const parsed = new URL(origin); sameOrigin = ['http:', 'https:'].includes(parsed.protocol) && parsed.host === host; } catch { /* Origem inválida. */ }
      if (!sameOrigin) {
        return NextResponse.json(
          { error: 'Acesso não autorizado para origens externas.' },
          { status: 403 }
        );
      }
    }

    // 3. Validação rigorosa do corpo da requisição
    const body = (await request.json().catch(() => null)) as { image?: unknown } | null;
    if (!body || typeof body.image !== 'string') {
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
  }
}
