import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const output = path.join(root, 'artifacts');
await mkdir(output, { recursive: true });
const base = process.env.DEMO_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, recordVideo: { dir: output, size: { width: 1440, height: 900 } } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));

async function visit(route, heading) {
  const response = await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.equal(response?.status(), 200, `HTTP ${route}`);
  await page.getByRole('heading', { name: heading, exact: false }).first().waitFor();
  await page.waitForTimeout(900);
}

try {
  await visit('/', 'Seu olhar.');
  await page.screenshot({ path: path.join(output, 'home-desktop.png'), fullPage: true });
  await page.mouse.wheel(0, 670);
  await page.waitForTimeout(750);
  await visit('/catalogo', 'Óculos com');
  await page.getByRole('button', { name: 'Óculos de sol' }).click();
  assert.equal(await page.locator('article').count(), 8);
  await page.screenshot({ path: path.join(output, 'catalogo-desktop.png'), fullPage: true });
  await page.waitForTimeout(800);
  await visit('/visagismo', 'O óculos ideal começa');
  await page.locator('input[type="file"]').setInputFiles(path.join(root, 'scripts', 'fixtures', 'face-round.png'));
  await page.getByRole('button', { name: 'Analisar neste aparelho' }).click();
  await page.getByRole('heading', { name: 'Formato provável: redondo' }).waitFor({ timeout: 30_000 });
  assert.equal(await page.locator('#experimente a[href="#recomendados"] strong').count(), 3, 'Three locally selected products');
  await page.evaluate(() => { const target = document.querySelector('#experimente'); if (target) window.scrollTo(0, window.scrollY + target.getBoundingClientRect().top - 120); });
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(output, 'visagismo-card.png') });
  await page.screenshot({ path: path.join(output, 'visagismo-resultado.png'), fullPage: true });
  await page.waitForTimeout(1200);
  await visit('/sobre', 'Um novo jeito');
  await visit('/contato', 'Toda boa escolha começa');
  const waLinks = await page.locator('a[href*="wa.me"]').all();
  assert(waLinks.length > 0, 'WhatsApp links present');
  for (const link of waLinks) assert.match(await link.getAttribute('href'), /^https:\/\/wa\.me\/\d+\?text=/);
  await page.waitForTimeout(850);

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(base + '/', { waitUntil: 'networkidle' });
  await mobilePage.getByRole('button', { name: 'Abrir menu' }).click();
  await mobilePage.getByRole('navigation', { name: 'Navegação móvel' }).waitFor();
  await mobilePage.screenshot({ path: path.join(output, 'home-mobile.png'), fullPage: true });
  await mobilePage.getByRole('navigation', { name: 'Navegação móvel' }).getByRole('link', { name: 'Nossos óculos' }).click();
  await mobilePage.getByRole('heading', { name: 'Óculos com', exact: false }).waitFor();
  const mobileLayout = await mobilePage.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, offenders: [...document.querySelectorAll('*')].filter(el => el.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 8).map(el => ({ tag: el.tagName, className: el.className?.toString().slice(0, 100), right: Math.round(el.getBoundingClientRect().right) })) }));
  assert.equal(mobileLayout.scrollWidth <= mobileLayout.width, true, 'No mobile horizontal overflow');
  await mobilePage.goto(base + '/visagismo', { waitUntil: 'networkidle' });
  await mobilePage.locator('input[type="file"]').setInputFiles(path.join(root, 'scripts', 'fixtures', 'face-round.png'));
  await mobilePage.getByRole('button', { name: 'Analisar neste aparelho' }).click();
  await mobilePage.getByRole('heading', { name: 'Formato provável: redondo' }).waitFor();
  await mobilePage.screenshot({ path: path.join(output, 'visagismo-mobile.png'), fullPage: true });
  assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'No mobile result overflow');
  await mobile.close();
  assert.deepEqual(errors, [], 'No page errors');
  console.log('Routes, filters, local face analysis, WhatsApp links and mobile menu: OK');
} finally {
  const video = page.video();
  await context.close();
  if (video) { await video.saveAs(path.join(output, 'sua-marca-demo.webm')); console.log('Video: artifacts/sua-marca-demo.webm'); }
  await browser.close();
}
