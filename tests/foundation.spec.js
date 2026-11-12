import {returnHome,resetFromPause,finishLearning} from './learning-helper.js';
import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json','utf8'));
const entry=page=>page.locator('#hero [data-entry]');
const mission=async page=>{await expect(page.locator('#game')).toHaveAttribute('data-mission',/.+/);if(await page.locator('.learning-dialog[open][data-phase=ORIENTATION]').count())await page.getByRole('button',{name:'Lanjut',exact:true}).click()};
test('title panels, art, settings and repeated home/game entry preserve checkpoint',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url())});
 await page.goto('/');await expect(page.locator('.diorama img[data-key="lp-lab"]')).toBeVisible();await expect(page.locator('.landing-raka')).toBeVisible();await expect(page.locator('canvas')).toHaveCount(0);
 for(const [name,title]of [['Cara Bermain','Cara Bermain'],['Tentang Misi','Tentang Misi ElectroQuest']]){await page.getByRole('button',{name,exact:true}).click();await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();await page.getByRole('button',{name:'Tutup',exact:true}).click()}
 await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await page.getByLabel('Teks lebih besar').check();await page.getByLabel('Kontras tinggi').check();await page.getByLabel('Kurangi efek',{exact:true}).check();await page.getByLabel('Mute',{exact:true}).check();await page.getByRole('button',{name:'Tutup',exact:true}).click();await page.reload();await expect(page.locator('html')).toHaveClass(/high-contrast/);
 await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await expect(page.getByLabel('Mute',{exact:true})).toBeChecked();await page.getByLabel('Teks lebih besar').uncheck();await page.getByLabel('Kontras tinggi').uncheck();await page.getByRole('button',{name:'Tutup',exact:true}).click();
 for(let i=0;i<3;i++){await entry(page).click();await mission(page);await expect(page.locator('canvas')).toHaveCount(1);await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Kembali ke Beranda',exact:true}).click();await expect(entry(page)).toHaveText('Lanjutkan');await expect(page.locator('canvas')).toHaveCount(0);expect(await page.evaluate(()=>localStorage.getItem('electroquest.progress.v1'))).not.toBe(null)}
 expect(errors).toEqual([]);
});
test('landing responsive art, reduced motion and game ratio',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('.landing-raka,.ion-float')).toHaveCount(2);
 for(const [width,height]of [[1440,900],[1024,768],[768,1024],[390,844],[320,740],[3840,2160]]){
 await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('.ion-float').evaluate(img=>getComputedStyle(img).animationName)).toBe('none');
 await page.screenshot({path:`docs/landing-evidence/${width}.png`,fullPage:true});
 await entry(page).click();await mission(page);await expect.poll(()=>page.locator('canvas').evaluate(c=>{const r=c.getBoundingClientRect();return Math.abs(r.width/r.height-640/360)})).toBeLessThan(.02);expect(await page.locator('canvas').evaluate(c=>[c.width,c.height,getComputedStyle(c).imageRendering])).toEqual([640,360,'pixelated']);await returnHome(page);
 }
});
test('new game confirms, failed loading preserves progress, retry replaces it only on success',async({page})=>{
 await page.goto('/');await entry(page).click();await mission(page);await page.keyboard.down('KeyD');await expect.poll(()=>page.locator('#game').evaluate(el=>JSON.parse(el.dataset.mission).x)).toBeGreaterThan(140);await page.keyboard.up('KeyD');await returnHome(page);const saved=await page.evaluate(()=>localStorage.getItem('electroquest.progress.v1'));
 await page.getByRole('button',{name:'Mulai Baru',exact:true}).click();await page.getByRole('button',{name:'Batal',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('electroquest.progress.v1'))).toBe(saved);
 await page.route('**/assets/environment/sky.png',r=>r.fulfill({status:404,body:'offline'}));await page.getByRole('button',{name:'Mulai Baru',exact:true}).click();await page.getByRole('button',{name:'Ya, lanjutkan',exact:true}).click();await expect(page.locator('body')).toHaveAttribute('data-screen','error');await expect(page.getByRole('alert')).toContainText('sky');expect(await page.evaluate(()=>localStorage.getItem('electroquest.progress.v1'))).toBe(saved);
 await page.unroute('**/assets/environment/sky.png');await page.getByRole('button',{name:'Coba lagi',exact:true}).click();await mission(page);expect(await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.mission).x)).toBe(80);
});
test('optional asset error is reported and mission opens',async({page})=>{
 await page.route('**/assets/characters/raka-portrait.png',r=>r.fulfill({status:404,body:'offline'}));await page.goto('/');await entry(page).click();await mission(page);await page.keyboard.press('Escape');await expect(page.getByRole('alert')).toContainText('raka-portrait');
});
test('manifest HTTP failure and illustration retry recover',async({page})=>{
 await page.route('**/asset-manifest.json',r=>r.fulfill({status:503,body:'offline'}));await page.goto('/');await expect(page.getByRole('button',{name:'Coba lagi ilustrasi'})).toBeVisible();await entry(page).click();await expect(page.locator('#fatal-message')).toContainText('503');await page.unroute('**/asset-manifest.json');await page.getByRole('button',{name:'Coba lagi',exact:true}).click();await mission(page);
});
test('invalid, omitted and wrong-sized mandatory assets block mission',async({page})=>{
 for(const mode of ['duplicate','omitted','size']){const invalid=structuredClone(manifest);if(mode==='duplicate')invalid.assets.push(invalid.assets[0]);if(mode==='omitted')invalid.assets=invalid.assets.filter(a=>a.key!=='sky');if(mode==='size'){invalid.assets[0].width=320;invalid.assets[0].frameWidth=320}await page.route('**/asset-manifest.json',r=>r.fulfill({json:invalid}));await page.goto('/');await entry(page).click();await expect(page.locator('body')).toHaveAttribute('data-screen','error');await expect(page.locator('#game')).not.toHaveAttribute('data-mission',/.+/);await page.unroute('**/asset-manifest.json')}
});
test('Canvas fallback works and unavailable canvas gives readable error',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return ['webgl','webgl2','experimental-webgl'].includes(type)?null:original.call(this,type,...args)}});await page.goto('/');await entry(page).click();await mission(page);await page.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null});await page.reload();await entry(page).click();await expect(page.locator('#fatal-message')).toContainText('Canvas 2D');
});
test('existing gallery remains available',async({page})=>{await page.goto('/gallery.html');await page.waitForFunction(()=>window.previewState?.ready);await expect(page.locator('.card img')).toHaveCount(manifest.assets.length)});
test('keyboard navigation, animation pause and shared mission CTA resume the same checkpoint',async({page})=>{
 const requests=[];page.on('request',r=>requests.push(r.url()));await page.goto('/');await expect(page.locator('.landing-raka')).toBeVisible();expect(requests.some(url=>/\/game-[^/]+\.js/.test(url))).toBe(false);
 await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main-content')).toBeFocused();
 await page.getByRole('button',{name:'Jeda animasi',exact:true}).click();expect(await page.locator('.ion-float').evaluate(img=>getComputedStyle(img).animationPlayState)).toBe('paused');
 await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await expect(page.locator('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();
 await entry(page).click();await mission(page);await page.keyboard.down('KeyD');await expect.poll(()=>page.locator('#game').evaluate(el=>JSON.parse(el.dataset.mission).x)).toBeGreaterThan(145);await page.keyboard.up('KeyD');await returnHome(page);const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('electroquest.progress.v1')).player.x);await entry(page).click();await mission(page);expect(await page.locator('#game').evaluate(el=>JSON.parse(el.dataset.mission).x)).toBe(saved);
});
