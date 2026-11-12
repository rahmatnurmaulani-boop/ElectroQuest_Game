import fs from 'node:fs';
import path from 'node:path';
import {PNG} from '../vendor/pngjs/lib/png.js';
process.chdir(path.resolve(import.meta.dirname,'../..'));
const entries=[];fs.mkdirSync('public/assets/landing',{recursive:true});
function canvas(w,h){const p=new PNG({width:w,height:h});p.data.fill(0);return p}
function rect(p,x,y,w,h,c){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)p.data.set(c,(j*p.width+i)*4)}
function save(key,p,usage){const file=`assets/landing/${key}.png`;fs.writeFileSync(`public/${file}`,PNG.sync.write(p));let transparent=0;for(let i=3;i<p.data.length;i+=4)if(!p.data[i])transparent++;entries.push({key,path:file,width:p.width,height:p.height,frameWidth:p.width,frameHeight:p.height,frames:1,fps:0,loop:false,anchor:{x:.5,y:.5},source:'scripts/assets/landing.mjs',status:'procedural',final:true,usage,alpha:{transparentPixels:transparent},provenance:'Original geometric pixel emblem/lighting. No baked text, no stock or external service.'})}
let p=canvas(48,48);const navy=[17,30,53,255],gray=[82,103,128,255],cyan=[57,221,235,255],amber=[255,188,85,255];
rect(p,10,2,28,44,navy);rect(p,2,10,44,28,navy);rect(p,10,4,28,2,gray);rect(p,4,10,2,28,gray);rect(p,8,12,32,24,gray);rect(p,12,8,24,32,gray);rect(p,12,12,24,24,navy);rect(p,22,12,8,10,cyan);rect(p,16,22,12,6,cyan);rect(p,18,28,6,10,cyan);rect(p,34,8,6,6,amber);save('eq-emblem',p,'Identitas layar judul ElectroQuest');
for(const [key,color]of [['landing-lamp-light',[255,188,85]],['landing-glove-light',[57,221,235]]]){p=canvas(64,64);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const d=Math.hypot(Math.floor(x/2)*2-31,Math.floor(y/2)*2-31)/31;const alpha=d<1?Math.round((1-d)**2*110/12)*12:0;p.data.set([...color,alpha],(y*64+x)*4)}save(key,p,key.includes('lamp')?'Cahaya lokal lampu laboratorium':'Sorotan cyan Charge Glove Raka')}
p=canvas(24,24);rect(p,4,4,3,16,cyan);for(let i=0;i<7;i++){rect(p,9+i,5+i,2,2,amber);rect(p,9+i,17-i,2,2,amber)}save('icon-continue',p,'Tombol Lanjutkan pada layar judul');
const manifest=JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json','utf8'));manifest.assets=manifest.assets.filter(a=>!entries.some(e=>e.key===a.key)).concat(entries);fs.writeFileSync('docs/ASSET_MANIFEST.json',JSON.stringify(manifest,null,2));fs.copyFileSync('docs/ASSET_MANIFEST.json','public/asset-manifest.json');fs.writeFileSync('assets-source/landing-production.json',JSON.stringify({source:'scripts/assets/landing.mjs',assets:entries},null,2));console.log(`Landing: ${entries.length} final PNGs, actual alpha recorded; ${manifest.assets.length} manifest entries.`);
