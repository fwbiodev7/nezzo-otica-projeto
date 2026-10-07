import assert from 'node:assert/strict';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.DEMO_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.route('**/api/visagismo', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ cloudAnalysis: false, cloudTryOn: false }) }));
const cases = [
  ['face-round.png', 'redondo'],
  ['face-square.png', 'quadrado'],
  ['face-long.png', 'alongado'],
  ['face-oval.png', 'oval'],
  ['face-heart.png', 'coração'],
];

async function upload(file) {
  await page.goto(base + '/visagismo');
  await page.getByRole('checkbox').check();
  await page.locator('input[type="file"]').setInputFiles(file);
}

try {
  const selections = new Set();
  for (const [file, expected] of cases) {
    await upload(path.join(process.cwd(), 'scripts', 'fixtures', file));
    await page.getByRole('button', { name: 'Analisar com IA', exact: true }).click();
    await page.locator('#melhor-armacao').waitFor({ timeout: 30_000 });
    const actual = (await page.locator('#experimente h2').first().textContent()).toLocaleLowerCase('pt-BR');
    assert.equal(actual, expected, `${file}: ${(await page.locator('#experimente').innerText()).slice(0, 700)}`);
    const names = await page.locator('#recomendados h4').allTextContents();
    assert.equal(names.length, 3, `Três armações para ${expected}`);
    selections.add(names.join('|'));
    console.log(`${file}: ${expected} -> ${names.join(', ')}`);
  }
  assert(selections.size >= 3, 'As escolhas devem variar conforme o contorno');

  await upload(path.join(process.cwd(), 'public', 'images', 'frame-champagne.png'));
  await page.getByRole('button', { name: 'Analisar com IA', exact: true }).click();
  await page.locator('#experimente [role="alert"]').waitFor({ timeout: 30_000 });
  assert.match(await page.locator('#experimente [role="alert"]').textContent(), /rosto/);

  let apiRequests = 0;
  await page.route('**/api/visagismo', async route => {
    if (route.request().method() === 'GET') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ cloudAnalysis: false, cloudTryOn: false }) });
    apiRequests++;
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Cota esgotada' }) });
  });
  await upload(path.join(process.cwd(), 'scripts', 'fixtures', 'face-round.png'));
  await page.getByRole('button', { name: 'Analisar com IA' }).click();
  await page.getByRole('heading', { name: 'Redondo', exact: true }).waitFor({ timeout: 30_000 });
  assert.equal(apiRequests, 0, 'Análise local funciona sem enviar a foto para a API');
  console.log('Foto sem rosto e análise sem chamadas à API: OK');
} finally {
  await browser.close();
}
