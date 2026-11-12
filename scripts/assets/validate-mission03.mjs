import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PNG } from '../vendor/pngjs/lib/png.js';

const production = JSON.parse(fs.readFileSync('assets-source/mission-03/production.json'));
const manifest = JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json'));
assert.deepEqual(manifest, JSON.parse(fs.readFileSync('public/asset-manifest.json')));
assert.equal(production.assets.length, 48);

for (const a of production.assets) {
  assert(a.final && a.usage && fs.existsSync(a.source), a.key);
  assert.deepEqual(a, manifest.assets.find(b => a.key === b.key));
  const p = PNG.sync.read(fs.readFileSync('public/' + a.path));
  assert.equal(p.width, a.width);
  assert.equal(p.height, a.height);
  assert.equal(p.width, a.frameWidth * a.frames);
  assert.equal(p.height, a.frameHeight);
  let clear = 0;
  for (let i = 3; i < p.data.length; i += 4) if (!p.data[i]) clear++;
  assert.equal(clear, a.alpha.transparentPixels);
  if (!/^m3-(bg-wall$|shelves$|floor-|terminal$|rail-|zoom-frame$|dipole-|metal-)/.test(a.key)) {
    assert(clear > 0, a.key + ' needs real alpha');
  }
  if (a.nineSlice) {
    assert(a.nineSlice.left + a.nineSlice.right < a.frameWidth);
    assert(a.nineSlice.top + a.nineSlice.bottom < a.frameHeight);
  }
}

const pulse = production.assets.find(a => a.key === 'm3-attract-pulse');
const storage=PNG.sync.read(fs.readFileSync('public/assets/mission-03/environment/m3-storage-layer.png'));
let centerAlpha=0,centerClear=0;for(let y=0;y<360;y++)for(let x=240;x<400;x++){const a=storage.data[(y*640+x)*4+3];centerAlpha+=a;if(a===0)centerClear++;assert(a<16,'quiet center contains visible opaque artwork')};assert(centerClear>50000);assert(centerAlpha/(160*360)<1,'quiet center alpha must remain negligible');
const wand=production.assets.find(a=>a.key==='m3-source-wand-long');assert.equal(wand.height,82);assert.equal(wand.anchor.y,0);
assert.equal(pulse.frames, 3);
assert.equal(pulse.fps, 10);
const success = production.assets.find(a => a.key === 'm3-success-flash');
assert.equal(success.frames, 3);
assert.equal(success.fps, 10);
const completion = production.assets.find(a => a.key === 'm3-completion-art');
assert.equal(completion.width, 640);
assert.equal(completion.height, 240);

for(const key of ['m3-storage-layer','m3-insulator-stage','m3-conductor-stage','m3-icon-clearance','m3-tray-ready'])assert(production.assets.some(a=>a.key===key));
console.log('48 Mission 3 assets validated: actual PNG dimensions, alpha, sources, frames, nine-slice and synchronized manifests.');
