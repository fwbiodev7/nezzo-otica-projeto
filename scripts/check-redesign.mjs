import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.DEMO_BASE_URL || 'http://localhost:3000';
await fs.mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
async function countArticles(expected) {
 await page.waitForFunction(count => document.querySelectorAll('article').length === count, expected).catch(async error => {
  console.log(JSON.stringify({expected,query:await page.getByRole('textbox',{name:'Buscar óculos'}).inputValue(),articles:await page.locator('article h3').allTextContents(),errors}));
  throw error;
 });
 assert.equal(await page.locator('article').count(), expected);
}
try {
 await page.goto(base,{waitUntil:'networkidle'});
 assert.match(await page.title(),/Ótica Nezzo/);
 for(const section of await page.locator('.reveal-ready').all()) { await section.scrollIntoViewIfNeeded(); await page.waitForTimeout(950); }
 await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(300);
 await page.screenshot({path:'artifacts/hero-clean-desktop.png'});
 await page.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
 await page.locator('a[href="/catalogo?categoria=Sol"]').click();
 await page.waitForURL('**/catalogo?categoria=Sol');
 await page.waitForLoadState('networkidle');
 assert.equal(await page.getByRole('button',{name:'Óculos de sol',exact:true}).getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Limpar filtros'}).click();
 await page.getByRole('textbox',{name:'Buscar óculos'}).fill('retangular ambar');
 await countArticles(1);
 assert.match(await page.locator('article').textContent(),/Solar Retangular Âmbar/);
 await page.getByRole('textbox',{name:'Buscar óculos'}).fill('inexistente123');
 await countArticles(0);
 await page.getByRole('button',{name:'Ver todos os óculos'}).click();
 await page.getByRole('combobox',{name:'Ordenar produtos'}).selectOption('name');
 assert.match(await page.locator('article').first().textContent(),/88Pro/);
 await page.getByRole('button',{name:/Ver mais modelos/}).click();
 await countArticles(9);
 console.log('Busca sem acento, filtros, ordenação e paginação: OK');
 const sample={id:'custom-test',name:'Marca Teste',brand:'Marca Independente',price:123.45,image:'/images/frame-rectangular.png',category:'Grau',frameShape:'Retangular',tags:['Leve'],color:'Preto'};
 await page.evaluate(p=>{localStorage.setItem('oticafabio_catalog_v1',JSON.stringify([p]));window.dispatchEvent(new Event('oticafabio_catalog_changed'));},sample);
 await page.getByRole('combobox',{name:'Filtrar por marca'}).selectOption('Marca Independente');
 await countArticles(1); assert.match(await page.locator('article').textContent(),/123,45/);
 await page.goto(base,{waitUntil:'networkidle'}); await page.locator('#colecao').scrollIntoViewIfNeeded();
 assert.match(await page.locator('#colecao article').textContent(),/Marca Teste/);
 await page.evaluate(()=>{localStorage.setItem('oticafabio_catalog_v1','[]');window.dispatchEvent(new Event('oticafabio_catalog_changed'));});
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.locator('#colecao article').count(),0);
 await page.goto(base+'/catalogo',{waitUntil:'networkidle'});
 await countArticles(0);
 await page.evaluate(()=>localStorage.setItem('oticafabio_catalog_v1','[{"id":"bad"}]'));
 await page.reload({waitUntil:'networkidle'}); await countArticles(8);
 console.log('Marcas dinâmicas, preço com centavos, vitrine sincronizada, catálogo vazio e dados corrompidos: OK');
 await page.evaluate(()=>localStorage.removeItem('oticafabio_catalog_v1'));
 await page.goto(base+'/admsecreto');
 await page.getByPlaceholder('Ex: 2000').fill('2000');
 await page.getByRole('button',{name:'Entrar no Dashboard'}).click();
 await page.getByRole('button',{name:/Catálogo/}).first().click();
 await page.getByRole('button',{name:'Novo Produto'}).click();
 await page.getByRole('dialog').waitFor();
 await page.getByPlaceholder('Ex: Milano Havana, Óculos Capri...').fill('Teste de centavos');
 await page.locator('dialog input[type="number"]').fill('199.90');
 await page.getByRole('button',{name:'Cadastrar no Catálogo'}).click();
 assert.equal(await page.locator('dialog').count(),0);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('oticafabio_catalog_v1')));
 assert.equal(stored[0].price,199.9);
 await page.getByRole('button',{name:'Novo Produto'}).click();
 await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog').count(),0);
 console.log('Cadastro, preço decimal e fechamento acessível do modal: OK');
 await page.evaluate(()=>{localStorage.removeItem('oticafabio_catalog_v1');sessionStorage.clear();});
 await page.setViewportSize({width:390,height:844});
 for(const route of ['/','/catalogo','/sobre','/contato','/visagismo']) {
  await page.goto(base+route,{waitUntil:'domcontentloaded'}); await page.locator('main h1').waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Sem overflow em '+route);
 }
 await page.goto(base,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Abrir menu'}).click();
 await page.getByRole('navigation',{name:'Navegação móvel'}).getByRole('link',{name:'Catálogo',exact:true}).click();
 await page.waitForURL('**/catalogo'); assert.equal(await page.getByRole('navigation',{name:'Navegação móvel'}).count(),0);
 await page.goto(base,{waitUntil:'networkidle'});
 for(const section of await page.locator('.reveal-ready').all()) { await section.scrollIntoViewIfNeeded(); await page.waitForTimeout(950); }
 await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(300);
 await page.screenshot({path:'artifacts/hero-clean-mobile.png'});
 await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.ticker > div').evaluate(el=>getComputedStyle(el).animationName),'none');
 console.log('Cinco páginas em celular, menu e movimento reduzido: OK');
 const invalid=await page.request.post(base+'/api/visagismo',{data:{image:'bad'}});assert.equal(invalid.status(),400);
 const external=await page.request.post(base+'/api/visagismo',{headers:{Origin:'https://untrusted.vercel.app'},data:{image:'bad'}});assert.equal(external.status(),403);
 console.log('Validação de entrada e bloqueio de origem externa: OK');
 await page.route('**/api/visagismo', route => route.request().method() === 'GET'
  ? route.fulfill({contentType:'application/json',body:JSON.stringify({cloudAnalysis:false})})
  : route.abort());
 await page.goto(base+'/visagismo');
 await page.locator('input[type=file]').setInputFiles('public/images/frame-champagne.png');
 await page.getByRole('checkbox',{name:'Autorizar análise da foto'}).check();
 await page.getByRole('button',{name:'Analisar com IA'}).click();
 await page.locator('#experimente span[role="alert"]').waitFor({timeout:60000});
 assert.match(await page.locator('#experimente span[role="alert"]').textContent(),/rosto/);
 console.log('Foto sem rosto: erro compreensível sem travar a página');
 await page.getByRole('button',{name:'Trocar foto'}).click();
 await page.locator('input[type=file]').setInputFiles('scripts/fixtures/face-round.png');
 await page.getByRole('button',{name:'Analisar com IA'}).click();
 await page.getByRole('heading',{name:'Redondo',exact:true}).waitFor({timeout:60000});
 await page.waitForFunction(() => document.querySelectorAll('#recomendados h4').length === 3);
 assert.equal(await page.locator('#recomendados h4').count(),3);
 console.log('Visagismo local: análise e três sugestões verificadas');
 assert.deepEqual(errors,[]);
 console.log('PASSOU: nenhum erro de execução no navegador');
} finally { await browser.close(); }
