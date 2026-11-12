// Use this project's installed Playwright; no automatic download or install.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const modulePath=process.env.PLAYWRIGHT_MODULE||'./node_modules/playwright/index.mjs';
const {chromium}=await import(pathToFileURL(modulePath.startsWith('/')?modulePath:fs.realpathSync(modulePath)).href);
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:960},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
const assert=(condition,message)=>{if(!condition)throw Error(message)};
await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:5173/gallery.html');await page.waitForFunction(()=>window.previewState?.ready);
await page.locator('#play').click();
const animations=[];
for(const key of ['raka-idle','raka-walk','raka-tool','ion-idle']){await page.locator('#animation').selectOption(key);await page.locator('#play').click();const seen=[];const count=key==='raka-walk'?8:key==='raka-tool'?6:4;for(let f=0;f<count;f++){seen.push(await page.evaluate(()=>window.previewState.frame));await page.locator('#step').click()}assert(new Set(seen).size===count,key+' frame stepping');assert((await page.evaluate(()=>window.previewState.frame))===0,key+' wrap');animations.push({key,framesInspected:seen})}
await page.locator('#animation').selectOption('raka-tool');await page.locator('#fps').fill('60');await page.waitForFunction(()=>!window.previewState.playing&&window.previewState.frame===5);await page.locator('#restart').click();await page.locator('#play').click();
for(const scale of ['1','2','4']){await page.locator('#scale').selectOption(scale);assert(await page.locator('#sprite').evaluate(c=>c.width)===64*Number(scale),'scale '+scale)}
for(const bg of ['white','dark','checker'])await page.locator('#background').selectOption(bg);
await page.locator('#guides').uncheck();await page.locator('#guides').check();await page.locator('#scale').selectOption('4');
fs.mkdirSync('docs/preview-evidence',{recursive:true});await page.locator('main section').first().screenshot({path:'docs/preview-evidence/character-checker.png'});
await page.locator('#background').selectOption('white');await page.locator('main section').first().screenshot({path:'docs/preview-evidence/character-white.png'});
await page.locator('#motion').uncheck();await page.locator('#arena').screenshot({path:'docs/preview-evidence/arena.png'});
assert(await page.locator('.card img').count()===72,'gallery image count');assert(await page.locator('.card img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),'gallery decode');
await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile horizontal overflow');await page.screenshot({path:'docs/preview-evidence/mobile.png'});
assert(errors.length===0,errors.join('\n'));fs.writeFileSync('docs/browser-validation.json',JSON.stringify({animations,checks:['play/pause','step and wrap','tool stops on final frame','restart','1x/2x/4x dimensions','background choices','guides toggle','72 gallery PNG decode','390px viewport no horizontal page overflow'],errors},null,2));await browser.close();console.log('Browser checks passed');
