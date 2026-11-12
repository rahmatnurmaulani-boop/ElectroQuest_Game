import {test,expect} from '@playwright/test';
test('world feedback uses game time, bounded pixels, reduced effects and clean reentry',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.locator('[data-entry]').click();await page.getByRole('button',{name:'Lanjut',exact:true}).click();
 const state=async()=>{await expect(page.locator('#game')).toHaveAttribute('data-mission',/.+/);return page.locator('#game').evaluate(e=>JSON.parse(e.dataset.mission))};
 await expect.poll(async()=>(await state()).vfx.time).toBeGreaterThan(.1);
 await page.keyboard.down('KeyD');await expect.poll(async()=>(await state()).x).toBeGreaterThan(120);await page.keyboard.up('KeyD');
 expect((await state()).vfx.particles).toBeLessThanOrEqual(40);
 await page.screenshot({path:'docs/vfx-evidence/mission1.png'});
 await page.getByRole('button',{name:'Pause',exact:true}).click();const frozen=(await state()).vfx.time;await page.waitForTimeout(180);expect((await state()).vfx.time).toBe(frozen);
 await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await page.getByLabel('Kurangi efek').check();await page.getByRole('button',{name:'Kembali ke pause',exact:true}).click();await page.getByRole('button',{name:'Lanjutkan',exact:true}).click();
 await expect.poll(async()=>(await state()).vfx.reduced).toBe(true);expect((await state()).vfx.particles).toBe(0);
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Kembali ke Beranda',exact:true}).click();await page.getByRole('button',{name:'Lanjutkan',exact:true}).click();await expect.poll(async()=>(await state()).vfx.reduced).toBe(true);expect(errors).toEqual([]);
});
