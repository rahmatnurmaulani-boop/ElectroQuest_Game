import {expect} from '@playwright/test';
export async function unlockExperiment(page,{choices=['A','B'],reason='repel'}={}){
  await page.getByRole('button',{name:'Lanjut',exact:true}).click();
  await page.keyboard.down('KeyD');await expect.poll(async()=>page.locator('#game').evaluate(el=>JSON.parse(el.dataset.mission).x)).toBeGreaterThan(165);await page.keyboard.up('KeyD');
  await page.keyboard.press('KeyE');await expect(page.locator('.learning-dialog[open]')).toBeVisible();await expect(page.locator('.experiment[open]')).toHaveCount(0);
  await page.getByRole('button',{name:'Periksa panel kiri',exact:true}).click();await page.getByRole('button',{name:'Periksa panel kanan',exact:true}).click();
  await page.getByRole('button',{name:'Buat prediksi',exact:true}).click();await expect(page.locator('.learning-dialog[open][data-phase=PREDICTION]')).toBeVisible();await expect(page.locator('.experiment[open]')).toHaveCount(0);
  for(const choice of choices)await page.locator(`input[name=prediction][value=${choice}]`).check();await page.locator(`input[name=reason][value=${reason}]`).check();await page.getByRole('button',{name:'Simpan prediksi',exact:true}).click();
  await expect(page.locator('.learning-panel')).toHaveAttribute('data-learning-phase','EXPERIMENT');await expect(page.locator('.learning-dialog[open]')).toHaveCount(0);await expect(page.locator('.experiment[open]')).toBeVisible();
}
export async function returnHome(page){
  if(await page.locator('.experiment[open]').count())await page.keyboard.press('Escape');
  if(!(await page.locator('.pause-dialog[open]').count()))await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Kembali ke Beranda',exact:true}).click();
}
export async function finishLearning(page,{shot,closeResults=true}={}){
  for(const[key,value]of Object.entries({A:'like',B:'positive',C:'conserved'}))await page.locator(`input[name=${key}][value=${value}]`).check();
  await page.getByRole('button',{name:'Kirim penjelasan',exact:true}).click();await page.getByRole('button',{name:'Lihat hasil',exact:true}).click();if(shot){await page.screenshot({path:shot});const size=page.viewportSize();await page.setViewportSize({width:390,height:844});await page.screenshot({path:shot.replace('.png','-mobile.png')});expect(await page.locator('.learning-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);await page.setViewportSize(size)}if(closeResults)await page.getByRole('button',{name:'Kembali ke arena',exact:true}).click();
}
export async function resetFromPause(page){
  if(await page.locator('.experiment[open]').count())await page.keyboard.press('Escape');
  if(!(await page.locator('.pause-dialog[open]').count()))await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Reset eksperimen',exact:true}).click();
  await page.getByRole('button',{name:'Ya, lanjutkan',exact:true}).click();
}
