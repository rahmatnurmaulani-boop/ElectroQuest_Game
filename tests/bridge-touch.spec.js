import {test,expect} from '@playwright/test';
test.use({hasTouch:true});
const state=page=>page.locator('#game').evaluate(el=>JSON.parse(el.dataset.bridge));
test('bridge real multitouch, cancellation, modal focus and small-screen panel',async({page,context})=>{
 await page.setViewportSize({width:844,height:390});await page.goto('/?preview=mission-02');await expect(page.locator('#game')).toHaveAttribute('data-bridge',/.+/);
 const client=await context.newCDPSession(page);await client.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:3});
 const point=async(selector,id)=>{const b=await page.locator(selector).boundingBox();return {x:b.x+b.width/2,y:b.y+b.height/2,id}};
 const right=await point('[data-direction="1"]',1),left=await point('[data-direction="-1"]',2),interact=await point('[data-interact]',3);
 await expect(page.locator('[data-direction="1"] img')).toBeVisible();
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right,left]});await page.waitForTimeout(120);expect((await state(page)).player.x).toBeCloseTo(80,0);await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right]});await expect.poll(async()=>(await state(page)).player.x).toBeGreaterThan(102);
 await client.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await page.waitForTimeout(80);const stopped=(await state(page)).player.x;await page.waitForTimeout(120);expect((await state(page)).player.x).toBeCloseTo(stopped,0);
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right]});await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right,interact]});await expect(page.locator('.bridge-terminal')).toBeVisible();await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 for(const[width,height]of [[844,390],[390,844],[320,740]]){await page.setViewportSize({width,height});const r=await page.locator('.bridge-terminal').boundingBox();expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);expect(r.y+r.height).toBeLessThanOrEqual(height);await page.locator('[data-close]').scrollIntoViewIfNeeded();await expect(page.locator('[data-close]')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);await page.screenshot({path:`docs/mission-02-evidence/panel-${width}.png`})}
 await page.keyboard.press('Escape');await expect(page.locator('.bridge-terminal')).not.toBeVisible();await page.waitForTimeout(100);const after=(await state(page)).player.x;await page.waitForTimeout(120);expect((await state(page)).player.x).toBeCloseTo(after,0);
 await page.getByRole('button',{name:'Fullscreen',exact:true}).click();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(true);await page.getByRole('button',{name:'Keluar fullscreen',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('electroquest.progress.v1'))).toBe(null);
});
