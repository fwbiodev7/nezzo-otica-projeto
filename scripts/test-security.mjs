import assert from 'node:assert/strict';
import { randomBytes, scryptSync } from 'node:crypto';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:net';
import { request as httpRequest } from 'node:http';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import os from 'node:os';
import ts from 'typescript';
import { SignJWT } from 'jose';
import { chromium } from 'playwright';

// Fresh credentials and a dedicated server keep production credentials/quotas untouched.
const password = randomBytes(24).toString('base64url');
const salt = randomBytes(16);
const makeHash = value => `scrypt-v1:${salt.toString('hex')}:${scryptSync(value, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString('hex')}`;
const hash = makeHash(password);
const secret = randomBytes(32).toString('base64url');
process.env.ADMIN_PASSWORD_HASH = hash;
process.env.ADMIN_SESSION_SECRET = secret;
delete process.env.TRUSTED_PROXY_IP_HEADER;
delete process.env.APP_ORIGIN;

async function loadHelper(file, replacements = []) {
  let source = await readFile(file, 'utf8');
  source = source.replace("import 'server-only';", '');
  for (const [from, to] of replacements) source = source.replace(from, to);
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}
const bodySecurity = await loadHelper('src/lib/request-security.ts');
const limiter = await loadHelper('src/lib/rate-limit.ts');
const auth = await loadHelper('src/lib/admin-auth.ts', [
  ["import { cookies } from 'next/headers';", 'const cookies = async () => ({ get: () => globalThis.__testAdminCookie ? { value: globalThis.__testAdminCookie } : undefined });'],
  ["from 'jose'", `from '${import.meta.resolve('jose')}'`],
]);
assert.equal(auth.isAdminConfigured(), true);
assert.equal(await auth.verifyAdminPassword(password), true);
assert.equal(await auth.verifyAdminPassword('2000'), false);
assert.equal(await auth.verifyAdminPassword('x'.repeat(129)), false);
globalThis.__testAdminCookie = await auth.createAdminToken();
const validToken = globalThis.__testAdminCookie;
assert.equal(await auth.hasAdminSession(), true);
globalThis.__testAdminCookie = `${validToken.slice(0, -10)}AAAAAAAAAA`;
assert.equal(await auth.hasAdminSession(), false);
globalThis.__testAdminCookie = await new SignJWT({ version: '' }).setProtectedHeader({ alg: 'HS256' })
  .setSubject('administrator').setIssuer('nezzo-admin').setAudience('nezzo-dashboard')
  .setIssuedAt(Math.floor(Date.now() / 1000) - 36000).setExpirationTime(Math.floor(Date.now() / 1000) - 1)
  .sign(Buffer.from(secret, 'base64url'));
assert.equal(await auth.hasAdminSession(), false);
globalThis.__testAdminCookie = validToken;
process.env.ADMIN_PASSWORD_HASH = makeHash(`${password}-rotated`);
assert.equal(await auth.hasAdminSession(), false);
process.env.ADMIN_PASSWORD_HASH = hash;
process.env.ADMIN_SESSION_SECRET = 'invalid';
assert.equal(auth.isAdminConfigured(), false);
assert.equal(await auth.hasAdminSession(), false);
process.env.ADMIN_SESSION_SECRET = secret;
delete globalThis.__testAdminCookie;
console.log('PASS: senha antiga rejeitada; sessão válida, adulterada, expirada, configuração inválida e rotação de senha.');

const request = (body, headers = {}) => new Request('https://site.test/api', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body,
  ...(body instanceof ReadableStream ? { duplex: 'half' } : {}),
});
const rejectsWith = (promise, status) => assert.rejects(promise, error => error instanceof bodySecurity.RequestBodyError && error.status === status);
assert.deepEqual(await bodySecurity.readBoundedJson(request('{"image":"ok"}'), 64), { image: 'ok' });
await rejectsWith(bodySecurity.readBoundedJson(request('{'), 64), 400);
await rejectsWith(bodySecurity.readBoundedJson(request(new Uint8Array([0xff])), 64), 400);
await rejectsWith(bodySecurity.readBoundedJson(request('{}', { 'Content-Type': 'text/plain' }), 64), 415);
await rejectsWith(bodySecurity.readBoundedJson(request('{}', { 'Content-Length': '1000' }), 64), 413);
await rejectsWith(bodySecurity.readBoundedJson(request('{}', { 'Content-Length': '-1' }), 64), 413);
// Count actual chunks despite a false length and an extra escaped field.
const chunks = new ReadableStream({ start(controller) {
  controller.enqueue(new TextEncoder().encode('{"image":"ok","extra":"'));
  controller.enqueue(new TextEncoder().encode('\\u0041'.repeat(50) + '"}'));
  controller.close();
} });
await rejectsWith(bodySecurity.readBoundedJson(request(chunks, { 'Content-Length': '2' }), 64), 413);
const hangingCancel = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(100)); }, cancel() { return new Promise(() => {}); } });
await rejectsWith(bodySecurity.readBoundedJson(request(hangingCancel), 64), 413);
const stalled = new ReadableStream({ cancel() { return new Promise(() => {}); } });
await rejectsWith(bodySecurity.readBoundedJson(request(stalled), 64), 408);
console.log('PASS: JSON normal, inválido, UTF-8 inválido, tipo, tamanho declarado/real, escapes, cancelamento travado e prazo de envio.');

for (let index = 0; index < 13; index++) {
  const req = request('{}', { 'X-Forwarded-For': `192.0.2.${index + 1}`, 'X-Real-IP': `198.51.100.${index + 1}` });
  assert.equal(limiter.getClientIp(req), 'shared-client');
  assert.equal(limiter.checkRateLimit(`test:${limiter.getClientIp(req)}`, { windowMs: 60000, maxRequests: 12 }).allowed, index < 12);
}
process.env.TRUSTED_PROXY_IP_HEADER = 'x-trusted-client';
assert.equal(limiter.getClientIp(request('{}', { 'x-trusted-client': '192.0.2.1' })), '192.0.2.1');
assert.equal(limiter.getClientIp(request('{}', { 'x-trusted-client': '192.0.2.1, 10.0.0.1' })), 'shared-client');
delete process.env.TRUSTED_PROXY_IP_HEADER;
assert.equal(limiter.checkRateLimit('test:expiry', { windowMs: 1, maxRequests: 1 }).allowed, true);
await delay(5);
assert.equal(limiter.checkRateLimit('test:expiry', { windowMs: 1, maxRequests: 1 }).allowed, true);
for (let index = 0; index < 2048; index++) limiter.checkRateLimit(`capacity:${index}`);
assert.equal(limiter.checkRateLimit('capacity:overflow').allowed, false);
assert.equal(bodySecurity.isSameOrigin(request('{}', { Origin: 'https://site.test' })), true);
assert.equal(bodySecurity.isSameOrigin(request('{}', { Origin: 'https://evil.test' })), false);
assert.equal(bodySecurity.isSameOrigin(request('{}', { Origin: 'https://site.test', 'Sec-Fetch-Site': 'cross-site' })), false);
process.env.APP_ORIGIN = 'https://public.test';
assert.equal(bodySecurity.isSameOrigin(request('{}', { Origin: 'https://public.test' })), true);
assert.equal(bodySecurity.isSameOrigin(request('{}', { Origin: 'https://evil.test', 'X-Forwarded-Host': 'evil.test' })), false);
delete process.env.APP_ORIGIN;
console.log('PASS: cabeçalhos falsificados não renovam cota; IP confiável validado; mapa limitado; origem fixa para proxy.');

const listener = createServer();
await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
const port = listener.address().port;
await new Promise(resolve => listener.close(resolve));
const base = `http://localhost:${port}`;
const serverEnv = { ...process.env, ADMIN_PASSWORD_HASH: hash, ADMIN_SESSION_SECRET: secret, APP_ORIGIN: base,
  GEMINI_API_KEY: '', HUGGINGFACE_API_KEY: '', NVIDIA_API_KEY: '', TRUSTED_PROXY_IP_HEADER: '' };
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], { env: serverEnv, stdio: ['ignore', 'pipe', 'pipe'] });
let serverOutput = '';
server.stdout.on('data', data => { serverOutput += data; });
server.stderr.on('data', data => { serverOutput += data; });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error('Servidor de teste encerrou antes de ficar pronto.');
    try { if ((await fetch(base + '/api/admin/session')).ok) { ready = true; break; } } catch { /* Starting. */ }
    await delay(250);
  }
  assert(ready, 'Servidor de teste disponível');
  const api = (route, method, body, headers = {}) => fetch(base + route, {
    method, headers: { Origin: base, 'Content-Type': 'application/json', ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  assert.equal((await api('/api/admin/session', 'POST', { password }, { Origin: 'https://evil.test' })).status, 403);
  assert.equal((await fetch(base + '/api/admin/session', { method: 'POST', body: '{}' })).status, 403);
  assert.equal((await api('/api/admin/session', 'POST', { password: '2000' })).status, 401);
  const login = await api('/api/admin/session', 'POST', { password });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie');
  assert.match(cookie, /__Host-nezzo-admin=/);
  assert.match(cookie, /HttpOnly/i); assert.match(cookie, /Secure/i); assert.match(cookie, /SameSite=Strict/i);
  assert.match(cookie, /Max-Age=28800/i); assert.match(cookie, /Path=\//i);
  assert.equal((await fetch(base + '/api/admin/session', { headers: { Cookie: cookie.split(';')[0] } }).then(r => r.json())).authenticated, true);
  assert.equal((await fetch(base + '/api/admin/session', { headers: { Cookie: '__Host-nezzo-admin=forged' } }).then(r => r.json())).authenticated, false);
  const logout = await api('/api/admin/session', 'DELETE');
  assert.equal(logout.status, 200); assert.match(logout.headers.get('set-cookie'), /Max-Age=0/i);
  assert.equal((await api('/api/admin/session', 'DELETE', undefined, { Origin: 'https://evil.test' })).status, 403);

  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/admsecreto');
  await page.waitForURL('**/admin');
  assert.equal(await page.getByLabel('Senha de acesso').count(), 1);
  assert(!/Ex:\s*2000/.test(await page.locator('body').textContent()));
  await page.evaluate(() => { sessionStorage.setItem('nezzo_admin_session', 'true'); sessionStorage.setItem('oticafabio_adm_auth', 'true'); });
  await page.reload();
  assert.equal(await page.getByLabel('Senha de acesso').count(), 1);
  await page.getByLabel('Senha de acesso').fill(password);
  await page.getByRole('button', { name: 'Entrar no Dashboard' }).click();
  await page.getByRole('button', { name: /Catálogo/ }).first().click();
  await page.getByRole('button', { name: 'Novo Produto' }).waitFor();
  assert.equal(await page.evaluate(() => document.cookie.includes('nezzo-admin')), false);
  const output = process.env.SECURITY_ARTIFACT_DIR || path.join(os.tmpdir(), 'nezzo-security-tests');
  await mkdir(output, { recursive: true });
  await page.screenshot({ path: path.join(output, 'admin-authenticated.png'), fullPage: true });
  await page.getByRole('button', { name: /Sair/ }).click();
  await page.getByLabel('Senha de acesso').waitFor();
  await page.reload();
  assert.equal(await page.getByLabel('Senha de acesso').count(), 1);
  await page.screenshot({ path: path.join(output, 'admin-login.png'), fullPage: true });
  assert.deepEqual(errors, []);
  console.log('PASS: servidor real, cookie protegido, rota antiga, flag antiga, login e logout no navegador.');

  assert.equal((await api('/api/visagismo', 'POST', { image: 'bad' })).status, 400);
  assert.equal((await api('/api/visagismo', 'POST', { image: 'bad' }, { Origin: 'https://untrusted.vercel.app' })).status, 403);
  assert.equal((await api('/api/visagismo', 'POST', { image: 'bad', extra: 'data' })).status, 400);
  assert.equal((await fetch(base + '/api/visagismo', { method: 'POST', headers: { Origin: base, 'Content-Type': 'text/plain' }, body: '{}' })).status, 415);
  const chunkedStatus = await new Promise((resolve, reject) => {
    const req = httpRequest(base + '/api/visagismo', { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json', 'Transfer-Encoding': 'chunked' } }, res => { res.resume(); res.on('end', () => resolve(res.statusCode)); });
    req.on('error', reject);
    req.write('{"image":"bad","extra":"');
    for (let index = 0; index < 15; index++) req.write('x'.repeat(1024 * 1024));
    req.end('"}');
  });
  assert.equal(chunkedStatus, 413);
  for (let index = 4; index < 13; index++) {
    const result = await api('/api/visagismo', 'POST', { image: 'bad' }, { 'X-Forwarded-For': `192.0.2.${index}`, 'X-Real-IP': `198.51.100.${index}` });
    assert.equal(result.status, index < 12 ? 400 : 429);
    if (index === 12) assert(result.headers.get('retry-after'));
  }
  for (let index = 3; index < 6; index++) {
    const result = await api('/api/admin/session', 'POST', { password: 'wrong' }, { 'X-Forwarded-For': `192.0.2.${index}` });
    assert.equal(result.status, index < 5 ? 401 : 429);
  }
  console.log('PASS: API real rejeita corpo chunked de 15 MiB, tipo/origem/campos extras, spoofing de IP e excesso de login.');
  console.log('PASSOU: todos os testes de segurança; nenhuma chamada a provedores pagos.');
} catch (error) {
  // Server output may contain infrastructure details; do not print credentials or full requests.
  console.error('Falha na validação de segurança:', error.message);
  if (/Servidor/.test(error.message)) console.error(serverOutput.replaceAll(password, '[redacted]').replaceAll(secret, '[redacted]').replaceAll(hash, '[redacted]').slice(-2000));
  throw error;
} finally {
  if (browser) await browser.close();
  server.kill();
}
