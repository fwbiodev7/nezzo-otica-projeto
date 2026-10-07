import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.DEMO_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (message.type() === 'error' && /TensorFlow|XNNPACK/.test(message.text())) errors.push(message.text());
});
const image = 'data:image/png;base64,' + (await readFile('scripts/fixtures/face-round.png')).toString('base64');
let cloudTryOn = true;
let analysisRequests = 0;
let tryonRequests = 0;
let tryOnStatus = 200;
await page.route('**/api/visagismo', route => {
  if (route.request().method() === 'GET') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ cloudAnalysis: false, cloudTryOn }) });
  analysisRequests++;
  return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Teste sem nuvem' }) });
});
await page.route('**/api/provador', async route => {
  tryonRequests++;
  const body = route.request().postDataJSON();
  assert.match(body.image, /^data:image\/jpeg;base64,/);
  assert.match(body.frameImage, /^data:image\/(png|jpeg|webp);base64,/);
  await route.fulfill({ status: tryOnStatus, contentType: 'application/json', body: JSON.stringify(tryOnStatus === 200 ? { image } : { error: 'Prévia em nuvem indisponível neste teste.' }) });
});

async function upload(file = 'scripts/fixtures/face-round.png') {
  await page.goto(base + '/visagismo');
  await page.getByRole('checkbox').check();
  await page.locator('input[type="file"]').setInputFiles(file);
  await page.getByRole('button', { name: 'Analisar com IA', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Analisar com IA', exact: true }).count(), 1);
  assert.equal(await page.getByRole('button', { name: /MediaPipe|Gemini IA/ }).count(), 0);
  await page.getByRole('button', { name: 'Analisar com IA', exact: true }).click();
}

try {
  await upload();
  await page.getByRole('heading', { name: 'Redondo', exact: true }).waitFor({ timeout: 60_000 });
  assert.equal(analysisRequests, 0, 'Análise no aparelho não envia a foto à nuvem');
  assert.equal(await page.getByRole('img', { name: /Simulação ilustrativa/ }).count(), 0, 'Não desenha uma armação sobre o rosto');
  await page.getByAltText('Sua foto original', { exact: true }).waitFor();
  assert.equal(tryonRequests, 0, 'Geração é solicitada somente ao clicar');
  assert(!/Tamanho [PMG]|Aros entre|Aros a partir/.test(await page.locator('#experimente').textContent()));
  assert.equal(await page.locator('#recomendados img').count(), 3);
  assert.match(await page.locator('#melhor-armacao').textContent(), /NZ Vision Azul/);
  assert(!/Nezzo Tartaruga Bold|Nezzo Noir Bold/.test(await page.locator('#recomendados').textContent()));
  const originalFrame = await page.locator('#melhor-armacao img').getAttribute('src');
  assert.match(originalFrame, /nezzo-catalogo-122818/);
  await mkdir('artifacts', { recursive: true });
  await page.getByRole('region', { name: 'Veja os óculos no seu rosto' }).screenshot({ path: 'artifacts/provador-ia.png' });
  const model = page.locator('#tryon-model');
  const ids = await model.locator('option').evaluateAll(options => options.map(option => option.value));
  await page.getByRole('button', { name: 'Gerar prévia com IA' }).click();
  await page.getByAltText(/Prévia com/).waitFor();
  assert.equal(tryonRequests, 1);
  await page.getByRole('button', { name: 'Comparar com minha foto original' }).click();
  await page.getByAltText('Sua foto original', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Ver foto com os óculos' }).click();
  await page.getByAltText(/Prévia com/).waitFor();
  await page.getByRole('button', { name: 'Gerar prévia com IA' }).click();
  assert.equal(tryonRequests, 1, 'Prévia em cache não repete a chamada de IA');
  await model.selectOption(ids[1]);
  assert.equal(await page.getByAltText(/Prévia com/).count(), 0);
  await page.getByRole('button', { name: 'Gerar prévia com IA' }).click();
  await page.getByAltText(/Prévia com/).waitFor();
  assert.equal(tryonRequests, 2);
  tryOnStatus = 503;
  await model.selectOption(ids[2]);
  await page.getByRole('button', { name: 'Gerar prévia com IA' }).click();
  await page.getByRole('region', { name: 'Veja os óculos no seu rosto' }).getByRole('alert').waitFor();
  assert.equal(await page.getByRole('img', { name: /Simulação ilustrativa/ }).count(), 0, 'Falha da nuvem não retorna o desenho removido');
  await page.getByAltText('Sua foto original', { exact: true }).waitFor();
  tryOnStatus = 200;
  await page.getByRole('button', { name: 'Óculos de sol', exact: true }).click();
  assert.equal(await page.locator('#recomendados img').count(), 3);
  assert(!/Hickmann|Auryn|NZ Vision/.test(await page.locator('#recomendados').textContent()));
  await page.getByRole('button', { name: 'Discreto', exact: true }).click();
  assert.match(await page.locator('#melhor-armacao').textContent(), /Solar Retangular Âmbar/);
  await page.getByRole('button', { name: 'Óculos de grau', exact: true }).click();
  await page.getByRole('button', { name: 'Versátil', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Provador cabe no celular');
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/provador-mobile.png', fullPage: true });
  await page.locator('#melhor-armacao').screenshot({ path: 'artifacts/recomendacao-real.png' });
  await page.getByRole('button', { name: 'Fazer nova análise' }).click();
  assert.equal(await model.count(), 0, 'Reiniciar remove a foto e as prévias');

  await upload('public/images/frame-champagne.png');
  await page.locator('#experimente [role="alert"]').waitFor({ timeout: 60_000 });
  assert.match(await page.locator('#experimente [role="alert"]').textContent(), /rosto/i);
  const invalid = await page.request.post(base + '/api/provador', { data: { image: 'invalid', frameImage: 'invalid' } });
  assert.equal(invalid.status(), 400);
  const crossOrigin = await page.request.post(base + '/api/provador', { headers: { origin: 'https://example.com' }, data: {} });
  assert.equal(crossOrigin.status(), 403);

  const custom = { id: 'modelo-cadastrado', name: 'Armação cadastrada na ótica', brand: 'Marca cadastrada', price: 0, category: 'Grau', frameShape: 'Retangular', color: 'Preto', image: '/images/nezzo-catalogo-122818.png', tags: [] };
  await page.evaluate(items => localStorage.setItem('oticafabio_catalog_v1', JSON.stringify(items)), [custom, { ...custom, id: 'sem-estoque', name: 'Modelo sem estoque', inStock: false }]);
  cloudTryOn = false;
  await upload();
  await page.locator('#melhor-armacao').waitFor();
  assert.match(await page.locator('#melhor-armacao').textContent(), /Armação cadastrada na ótica/);
  assert.equal(await page.locator('#recomendados img').count(), 1);
  const requestsBeforeLocalPreview = tryonRequests;
  assert.equal(await page.getByRole('button', { name: 'Gerar prévia com IA' }).isDisabled(), true);
  assert.equal(await page.getByRole('img', { name: /Simulação ilustrativa/ }).count(), 0);
  assert.equal(tryonRequests, requestsBeforeLocalPreview, 'Sem chave, geração fica indisponível sem chamada à nuvem');
  assert(!/Modelo sem estoque|Produto antigo/.test(await page.locator('#recomendados').textContent()));

  await page.evaluate(() => localStorage.setItem('oticafabio_catalog_v1', JSON.stringify([{ id: '01', name: 'Nezzo Tartaruga Bold', brand: 'Nezzo Atelier', price: 389, image: '/images/frame-rectangular.png', category: 'Grau', frameShape: 'Quadrado', tags: [], color: 'Tartaruga' }])));
  await page.goto(base + '/catalogo');
  await page.getByText('88Pro Esportivo Espelhado', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Ver mais modelos (1)' }).click();
  assert.equal(await page.locator('.product-card').count(), 9, 'Catálogo antigo migra para os modelos reais');
  assert.equal(await page.getByText('Nezzo Tartaruga Bold', { exact: true }).count(), 0);
  assert.equal(await page.getByText('Preço sob consulta', { exact: true }).count(), 9);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator('.product-card img').first().waitFor();
  await page.screenshot({ path: 'artifacts/catalogo-real.png', fullPage: true });
  assert.deepEqual(errors, []);
  assert.equal(analysisRequests, 0);
  console.log('OK: análise local, catálogo real, geração por clique, comparação, cache, erro sem desenho e geração desativada sem chave. Nenhuma chamada paga.');
} finally { await browser.close(); }
