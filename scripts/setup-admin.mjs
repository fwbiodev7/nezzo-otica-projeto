import { randomBytes, scryptSync } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const envPath = path.join(root, '.env.local');
const credentialsPath = path.join(root, '.admin-credentials.local.txt');
const password = process.env.ADMIN_NEW_PASSWORD || randomBytes(24).toString('base64url');
if (password.length < 16 || password.length > 128 || /[\r\n]/.test(password)) {
  throw new Error('Use uma senha de 16 a 128 caracteres, sem quebras de linha.');
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
const config = {
  ADMIN_PASSWORD_HASH: `scrypt-v1:${salt.toString('hex')}:${hash.toString('hex')}`,
  ADMIN_SESSION_SECRET: randomBytes(32).toString('base64url'),
};
let env = '';
try { env = await readFile(envPath, 'utf8'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const [key, value] of Object.entries(config)) {
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  env = pattern.test(env) ? env.replace(pattern, `${key}=${value}`) : `${env.trimEnd()}\n${key}=${value}\n`;
}
await writeFile(envPath, env.trimStart(), { mode: 0o600 });
await writeFile(credentialsPath, [
  'Credenciais administrativas da Ótica Nezzo — arquivo privado, não publicar.',
  `Geradas em: ${new Date().toISOString()}`,
  'Acesso: /admin',
  `Senha: ${password}`,
  '',
  'Na Vercel, copie ADMIN_PASSWORD_HASH e ADMIN_SESSION_SECRET de .env.local para Environment Variables.',
  'Configure APP_ORIGIN com a origem pública exata e faça um novo deploy.',
  'Guarde a senha em um gerenciador e remova este arquivo quando não precisar dele.',
  'Rodar setup:admin novamente troca a senha e invalida as sessões após reiniciar/republicar.',
  '',
].join('\n'), { mode: 0o600 });
console.log('Senha forte gerada. Os valores privados não são exibidos no terminal.');
console.log(`Configuração local: ${envPath}`);
console.log(`Senha de acesso: ${credentialsPath}`);
console.log('Reinicie o servidor para usar a configuração. A Vercel exige configuração e novo deploy.');
