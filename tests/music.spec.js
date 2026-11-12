import {test,expect} from '@playwright/test';
test('music starts after gesture, has one loop, obeys volume/mute and pause in all missions',async({page})=>{
 test.setTimeout(60000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  localStorage.setItem('electroquest.mission1.completed.v1','true');localStorage.setItem('electroquest.mission2.completed.v1','true');
  window.audioProbe={created:0,active:0,starts:0};const original=AudioContext.prototype.createBufferSource;
  AudioContext.prototype.createBufferSource=function(...args){window.audioProbe.created++;const source=original.apply(this,args),start=source.start.bind(source),stop=source.stop.bind(source);let running=false;source.start=(...a)=>{start(...a);running=true;window.audioProbe.active++;window.audioProbe.starts++};source.stop=(...a)=>{stop(...a);if(running){running=false;window.audioProbe.active--}};return source};
 });
 const active=()=>page.evaluate(()=>window.audioProbe.active);
 await page.goto('/');expect(await active()).toBe(0);
 await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await expect.poll(active).toBe(1);
 await page.getByLabel('Volume musik',{exact:true}).fill('0');await expect.poll(active).toBe(0);
 await page.getByLabel('Volume musik',{exact:true}).fill('0.3');await expect.poll(active).toBe(1);
 await page.getByLabel('Mute',{exact:true}).check();await expect.poll(active).toBe(0);await page.getByLabel('Mute',{exact:true}).uncheck();await expect.poll(active).toBe(1);
 await page.getByRole('button',{name:'Tutup',exact:true}).click();
 for(const mission of ['first','second','third']){
  await page.getByRole('button',{name:'Pilih misi',exact:true}).click();await page.locator(`[data-${mission}]`).click();
  if(mission==='third'){await expect(page.locator('.warehouse-lesson')).toBeVisible();await expect.poll(active).toBe(0);await page.getByRole('button',{name:'Lanjut ke Observasi',exact:true}).click();await expect.poll(active).toBe(1)}
  else{await expect(page.getByRole('button',{name:'Lanjut',exact:true})).toBeVisible();await expect.poll(active).toBe(0);await page.getByRole('button',{name:'Lanjut',exact:true}).click();await expect.poll(active).toBe(1)}
  await page.getByRole('button',{name:'Pause',exact:true}).click();await expect.poll(active).toBe(0);await page.getByRole('button',{name:'Lanjutkan',exact:true}).click();await expect.poll(active).toBe(1);
  await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Kembali ke Beranda',exact:true}).click();await expect.poll(active).toBe(1);
 }
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('electroquest.settings.v2')).settings.music)).toBe(.3);expect(errors).toEqual([]);
});
