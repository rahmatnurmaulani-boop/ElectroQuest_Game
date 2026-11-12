import {test,expect} from '@playwright/test';
test('animated game dialogs stay inside arena after resize and do not block movement after Continue',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await page.locator('[data-entry]').click();await expect(page.locator('.game-stage dialog[open]')).toHaveCount(1);await expect(page.getByRole('button',{name:'Lanjut',exact:true})).toBeVisible();
 const bounds=()=>page.locator('.game-stage dialog[open]').evaluateAll(ds=>ds.map(d=>{const r=d.getBoundingClientRect(),a=document.querySelector('.game-stage').getBoundingClientRect();return {inside:r.left>=a.left-1&&r.right<=a.right+1&&r.top>=a.top-1&&r.bottom<=a.bottom+1,width:r.width,height:r.height}}));
 for(const [width,height]of [[1920,1080],[1366,768],[844,390],[390,844]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(200);expect((await bounds()).every(r=>r.inside&&r.width>0&&r.height>0)).toBe(true);await page.screenshot({path:`docs/vfx-evidence/dialog-${width}.png`});
 }
 await page.setViewportSize({width:1440,height:900});await page.getByRole('button',{name:'Lanjut',exact:true}).click();
 const state=()=>page.locator('#game').evaluate(e=>JSON.parse(e.dataset.mission));const x=(await state()).x;await page.keyboard.down('KeyD');await expect.poll(async()=>(await state()).x).toBeGreaterThan(x+20);await page.keyboard.up('KeyD');
 for(let i=0;i<3;i++){await page.getByRole('button',{name:'Pause',exact:true}).click();expect((await bounds()).every(r=>r.inside)).toBe(true);await page.getByRole('button',{name:'Lanjutkan',exact:true}).click();await expect.poll(async()=>(await state()).paused).toBe(false)}
 expect(errors).toEqual([]);
});
