import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
try {
  await page.goto('http://localhost:3000/visagismo');
  await page.getByRole('checkbox').check();
  await page.locator('input[type="file"]').setInputFiles('scripts/fixtures/face-round.png');
  await page.getByRole('button', { name: 'Analisar com IA', exact: true }).click();
  await page.locator('#melhor-armacao').waitFor({ timeout: 45_000 });
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/provador'), { timeout: 90_000 });
  await page.getByRole('button', { name: 'Experimentar no meu rosto' }).click();
  const response = await responsePromise;
  console.log(`GEMINI_LIVE_PREVIEW_HTTP_${response.status()}`);
  if (!response.ok()) { process.exitCode = 1; }
  else {
    await page.getByAltText(/Prévia com/).waitFor({ timeout: 10_000 });
    await page.getByRole('region', { name: 'Veja os óculos no seu rosto' }).screenshot({ path: 'artifacts/provador-gemini-real.png' });
    console.log('GEMINI_LIVE_PREVIEW_OK');
  }
} finally { await browser.close(); }
