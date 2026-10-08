import 'server-only';
import { createHash, scrypt, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-nezzo-admin' : 'nezzo_admin';
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

function getConfig() {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? '';
  const match = /^scrypt-v1:([a-f0-9]{32}):([a-f0-9]{128})$/.exec(hash);
  const secret = process.env.ADMIN_SESSION_SECRET ?? '';
  if (!match || !/^[A-Za-z0-9_-]{43}$/.test(secret)) return null;
  const key = Buffer.from(secret, 'base64url');
  if (key.length !== 32 || key.toString('base64url') !== secret) return null;
  return { salt: Buffer.from(match[1], 'hex'), passwordHash: Buffer.from(match[2], 'hex'), key, version: createHash('sha256').update(hash).digest('hex') };
}

export function isAdminConfigured() { return getConfig() !== null; }

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const config = getConfig();
  if (!config || password.length < 1 || password.length > 128) return false;
  const derived = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, config.salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error); else resolve(key);
    });
  });
  return timingSafeEqual(derived, config.passwordHash);
}

export async function createAdminToken(): Promise<string> {
  const config = getConfig();
  if (!config) throw new Error('Admin authentication is not configured.');
  return new SignJWT({ version: config.version }).setProtectedHeader({ alg: 'HS256' }).setSubject('administrator')
    .setIssuer('nezzo-admin').setAudience('nezzo-dashboard').setIssuedAt().setExpirationTime(`${ADMIN_SESSION_SECONDS}s`).sign(config.key);
}

export async function hasAdminSession(): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token || token.length > 2048) return false;
  try {
    const { payload } = await jwtVerify(token, config.key, {
      algorithms: ['HS256'], issuer: 'nezzo-admin', audience: 'nezzo-dashboard',
      requiredClaims: ['sub', 'iat', 'exp', 'version'], maxTokenAge: `${ADMIN_SESSION_SECONDS}s`,
    });
    return payload.sub === 'administrator' && payload.version === config.version;
  } catch { return false; }
}

export function adminCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/', maxAge: ADMIN_SESSION_SECONDS };
}
