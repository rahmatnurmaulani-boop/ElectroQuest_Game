import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {PNG} from '../vendor/pngjs/lib/png.js';
const source=JSON.parse(fs.readFileSync('assets-source/ui-production.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json','utf8'));
assert.deepEqual(manifest,JSON.parse(fs.readFileSync('public/asset-manifest.json','utf8')));
for(const a of source.assets){
 assert(a.final&&a.status==='procedural'&&a.source==='scripts/assets/ui.mjs');assert(a.usage);assert(fs.existsSync(a.source));
 assert.deepEqual(a,manifest.assets.find(x=>x.key===a.key));
 const p=PNG.sync.read(fs.readFileSync('public/'+a.path));assert.equal(p.width,a.width);assert.equal(p.height,a.height);assert.equal(p.width,a.frameWidth*a.frames);assert.equal(p.height,a.frameHeight);
 let transparent=0,partial=0;for(let i=3;i<p.data.length;i+=4){if(p.data[i]===0)transparent++;else if(p.data[i]<255)partial++}assert(transparent>0,a.key+' alpha');assert.equal(transparent,a.alpha.transparentPixels);assert.equal(partial,a.alpha.partialPixels);
 if(a.key.includes('touch-'))assert(partial>0,a.key+' translucency');
 if(a.nineSlice){const n=a.nineSlice;assert(n.left+n.right<a.frameWidth);assert(n.top+n.bottom<a.frameHeight);assert(Object.values(n).every(v=>v>0&&Number.isInteger(v)))}
}
assert.equal(source.assets.find(a=>a.key==='ui-next').frames,4);
const baseline=JSON.parse(fs.readFileSync('docs/stage-4-asset-baseline.json','utf8'));
for(const a of baseline)assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public/'+a.path)).digest('hex'),a.sha256,a.key+' original asset changed');
console.log(`UI validated: ${source.assets.length} final production records, actual alpha, nine-slice bounds and synchronized manifests.`);
console.log(`${baseline.length} original PNG hashes unchanged.`);
