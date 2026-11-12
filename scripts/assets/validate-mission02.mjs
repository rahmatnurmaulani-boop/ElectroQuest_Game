import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PNG} from '../vendor/pngjs/lib/png.js';
const production=JSON.parse(fs.readFileSync('assets-source/mission-02/production.json'));
const manifest=JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json'));
assert.deepEqual(manifest,JSON.parse(fs.readFileSync('public/asset-manifest.json')));
assert.equal(production.assets.length,46);
for(const a of production.assets){
 assert(a.final&&a.usage&&fs.existsSync(a.source),a.key);
 assert.deepEqual(a,manifest.assets.find(b=>a.key===b.key));
 const p=PNG.sync.read(fs.readFileSync('public/'+a.path));
 assert.equal(p.width,a.width);assert.equal(p.height,a.height);
 assert.equal(p.width,a.frameWidth*a.frames);assert.equal(p.height,a.frameHeight);
 let clear=0;for(let i=3;i<p.data.length;i+=4)if(!p.data[i])clear++;
 assert.equal(clear,a.alpha.transparentPixels);if(!/^m2-(sky|floor-|platform$|carriage$|terminal$|rail-)/.test(a.key))assert(clear>0,a.key+' needs real alpha');
 if(a.nineSlice){assert(a.nineSlice.left+a.nineSlice.right<a.frameWidth);assert(a.nineSlice.top+a.nineSlice.bottom<a.frameHeight)}
}
const flash=production.assets.find(a=>a.key==='m2-latch-flash');assert.equal(flash.frames,3);assert.equal(flash.fps,10);
console.log('46 Mission 2 assets validated: actual PNG dimensions, alpha, sources, frames, nine-slice and synchronized manifests.');
