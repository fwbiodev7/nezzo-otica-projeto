import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminCookieOptions, createAdminToken, hasAdminSession, isAdminConfigured, verifyAdminPassword } from '@/lib/admin-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { isSameOrigin, readBoundedJson, RequestBodyError } from '@/lib/request-security';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'private, no-store' };
export async function GET() { return NextResponse.json({ authenticated: await hasAdminSession() }, { headers }); }

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origem não autorizada.' }, { status: 403, headers });
  if (!isAdminConfigured()) return NextResponse.json({ error: 'Acesso administrativo indisponível.' }, { status: 503, headers });
  const globalLimit = checkRateLimit('admin-global', { windowMs: 600_000, maxRequests: 60 });
  const clientLimit = checkRateLimit(`admin:${getClientIp(request)}`, { windowMs: 600_000, maxRequests: 5 });
  if (!globalLimit.allowed || !clientLimit.allowed) {
    const retry = Math.max(globalLimit.resetInSec, clientLimit.resetInSec);
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }, { status: 429, headers: { ...headers, 'Retry-After': String(retry) } });
  }
  try {
    const body = await readBoundedJson(request, 2048);
    if (!body || typeof body !== 'object' || Array.isArray(body) || !('password' in body) || typeof body.password !== 'string') {
      return NextResponse.json({ error: 'Senha inválida.' }, { status: 400, headers });
    }
    if (!(await verifyAdminPassword(body.password))) return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401, headers });
    const response = NextResponse.json({ authenticated: true }, { headers });
    response.cookies.set(ADMIN_COOKIE, await createAdminToken(), adminCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof RequestBodyError) return NextResponse.json({ error: error.message }, { status: error.status, headers });
    return NextResponse.json({ error: 'Não foi possível entrar. Tente novamente.' }, { status: 500, headers });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origem não autorizada.' }, { status: 403, headers });
  const response = NextResponse.json({ authenticated: false }, { headers });
  response.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions(), maxAge: 0 });
  return response;
}
