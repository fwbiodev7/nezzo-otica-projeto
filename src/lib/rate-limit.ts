import { isIP } from 'node:net';

/**
 * Rate Limiter simples em memória para proteção contra ataques de negação de serviço (DoS)
 * e abuso de cota de inteligência artificial na Vercel / Node.js.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();
const MAX_RECORDS = 2048;

// Limpeza periódica automática para não acumular memória
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipMap.entries()) {
    if (record.resetTime <= now) {
      ipMap.delete(ip);
    }
  }
}, 60_000);
cleanupTimer.unref();

export interface RateLimitOptions {
  windowMs: number; // Janela de tempo em milissegundos
  maxRequests: number; // Máximo de requisições por janela
}

export function checkRateLimit(
  clientIp: string,
  options: RateLimitOptions = { windowMs: 60_000, maxRequests: 10 }
): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = ipMap.get(clientIp);

  if (!record || record.resetTime <= now) {
    if (!record && ipMap.size >= MAX_RECORDS) {
      for (const [key, entry] of ipMap) if (entry.resetTime <= now) ipMap.delete(key);
      if (ipMap.size >= MAX_RECORDS) return { allowed: false, remaining: 0, resetInSec: 60 };
    }
    ipMap.set(clientIp, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetInSec: Math.ceil(options.windowMs / 1000),
    };
  }

  if (record.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: options.maxRequests - record.count,
    resetInSec: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Only an explicitly configured ingress may provide client identity.
 * The ingress MUST overwrite the selected header and block direct access.
 * Without that guarantee, requests share a conservative bucket.
 */
export function getClientIp(request: Request): string {
  const trustedHeader = process.env.TRUSTED_PROXY_IP_HEADER;
  if (trustedHeader && /^[a-z0-9-]{1,64}$/.test(trustedHeader)) {
    const value = request.headers.get(trustedHeader)?.trim();
    if (value && value.length <= 45 && isIP(value)) return value;
  }
  return 'shared-client';
}
