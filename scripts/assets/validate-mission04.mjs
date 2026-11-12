import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PNG } from '../vendor/pngjs/lib/png.js';

const production = JSON.parse(fs.readFileSync('assets-source/mission-04/production.json'));
const manifest = JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json'));
assert.deepEqual(manifest, JSON.parse(fs.readFileSync('public/asset-manifest.json')));
assert(production.assets.length >= 30, `Expected at least 30 Mission 4 assets, found ${production.assets.length}`);

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
  if (!/^m4-(bg-lab$|rear-props$|floor-|bench$|terminal$|dist-frame$|sphere-|door-|icon-)/.test(a.key)) {
    assert(clear > 0, a.key + ' needs real alpha');
  }
}

const ef = production.assets.find(a => a.key === 'm4-electron-flow');
assert.equal(ef.frames, 3);
assert.equal(ef.fps, 8);
const sp = production.assets.find(a => a.key === 'm4-sensor-pass');
assert.equal(sp.frames, 3);
assert.equal(sp.fps, 8);

console.log(`${production.assets.length} Mission 4 assets validated: actual PNG dimensions, alpha, sources, frames and synchronized manifests.`);
