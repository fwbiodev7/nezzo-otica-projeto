import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const base = process.env.DEMO_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
let analysisRequests = 0;
let generationRequests = 0;
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (request.url().endsWith('/api/provador')) generationRequests++; });
await page.route('**/api/visagismo', route => {
  if (route.request().method() === 'GET') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ cloudAnalysis: false }) });
  analysisRequests++;
  return route.abort();
});
async function analyze() {
  await page.goto(base + '/visagismo');
  await page.getByRole('checkbox').check();
  await page.locator('input[type=file]').setInputFiles('scripts/fixtures/face-round.png');
  await page.getByRole('button', { name: 'Analisar com IA', exact: true }).click();
  await page.locator('#melhor-armacao').waitFor({ timeout: 60000 });
}
try {
  await analyze();
  assert.equal(await page.locator('#recomendados img').count(), 3);
  assert.match(await page.locator('#melhor-armacao').textContent(), /NZ Vision Azul/);
  assert.equal(await page.getByRole('heading', { name: 'Veja os óculos no seu rosto' }).count(), 0);
  assert.equal(await page.locator('#tryon-model').count(), 0);
  assert.equal(await page.getByRole('button', { name: /Gerar prévia|Experimentar no meu rosto/ }).count(), 0);
  assert(!/Tamanho [PMG]|Aros entre|Aros a partir/.test(await page.locator('#experimente').textContent()));
  await page.getByRole('button', { name: 'Óculos de sol', exact: true }).click();
  await page.getByRole('button', { name: 'Discreto', exact: true }).click();
  assert.match(await page.locator('#melhor-armacao').textContent(), /Solar Retangular Âmbar/);
  assert(!/Hickmann|Auryn|NZ Vision/.test(await page.locator('#recomendados').textContent()));
  await page.getByRole('button', { name: 'Óculos de grau', exact: true }).click();
  await page.getByRole('button', { name: 'Versátil', exact: true }).click();
  await mkdir('artifacts', { recursive: true });
  await page.locator('#recomendados').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'artifacts/resultado-sem-provador.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.getByRole('button', { name: 'Fazer nova análise' }).click();
  assert.equal(await page.locator('#melhor-armacao').count(), 0);
  const custom = { id: 'modelo-cadastrado', name: 'Armação cadastrada na ótica', brand: 'Marca cadastrada', price: 0, category: 'Grau', frameShape: 'Retangular', color: 'Preto', image: '/images/nezzo-catalogo-122818.png', tags: [] };
  await page.evaluate(items => localStorage.setItem('oticafabio_catalog_v1', JSON.stringify(items)), [custom, { ...custom, id: 'sem-estoque', name: 'Modelo sem estoque', inStock: false }]);
  await analyze();
  assert.equal(await page.locator('#recomendados img').count(), 1);
  assert.match(await page.locator('#melhor-armacao').textContent(), /Armação cadastrada na ótica/);
  assert(!/Modelo sem estoque/.test(await page.locator('#recomendados').textContent()));
  assert.equal((await page.request.post(base + '/api/provador', { data: {} })).status(), 404);
  assert.equal(analysisRequests, 0);
  assert.equal(generationRequests, 0);
  assert.deepEqual(errors, []);
  console.log('OK: recomendações e preferências, catálogo real, estoque, celular e remoção completa do provador. Nenhuma foto enviada à nuvem.');
} finally { await browser.close(); }
