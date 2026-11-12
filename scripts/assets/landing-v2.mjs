/** Entirely new landing-only geometric UI/effects. Never rewrites gameplay artwork. */
import fs from 'node:fs';import path from 'node:path';import {PNG} from '../vendor/pngjs/lib/png.js';
process.chdir(path.resolve(import.meta.dirname,'../..'));
const dir='public/assets/landing';fs.mkdirSync(dir,{recursive:true});
const C={navy:[12,24,45],blue:[32,51,78],edge:[83,119,146],light:[169,199,216],cyan:[63,233,242],amber:[255,190,94],white:[236,246,252]};
const records=JSON.parse(fs.readFileSync('assets-source/landing-v2/imported-manifest.json','utf8'));
function canvas(w,h){const p=new PNG({width:w,height:h});p.data.fill(0);return p}
function rect(p,x,y,w,h,c,a=255){const rgb=C[c]||c;for(let j=Math.max(0,y);j<Math.min(p.height,y+h);j++)for(let i=Math.max(0,x);i<Math.min(p.width,x+w);i++)p.data.set([...rgb,a],(j*p.width+i)*4)}
function line(p,x,y,x2,y2,c='white',t=2){const n=Math.max(Math.abs(x2-x),Math.abs(y2-y));for(let i=0;i<=n;i++)rect(p,Math.round(x+(x2-x)*i/(n||1)),Math.round(y+(y2-y)*i/(n||1)),t,t,c)}
function save(key,p,usage,extra={}){const file=`assets/landing/${key}.png`;fs.writeFileSync('public/'+file,PNG.sync.write(p));let clear=0,partial=0;for(let i=3;i<p.data.length;i+=4){if(!p.data[i])clear++;else if(p.data[i]<255)partial++}records.push({key,path:file,width:p.width,height:p.height,frameWidth:p.width,frameHeight:p.height,frames:1,fps:0,loop:false,anchor:{x:.5,y:.5},source:'scripts/assets/landing-v2.mjs',status:'procedural',final:true,usage,alpha:{transparentPixels:clear,partialPixels:partial},provenance:'New original deterministic pixel geometry created in this task. No prior images, labels, title text or charge values baked into artwork.',...extra})}
function panel(key,accent,fill,usage){const p=canvas(48,32);rect(p,4,0,40,30,'navy');rect(p,0,4,48,22,'navy');rect(p,3,3,42,25,'edge');rect(p,5,5,38,21,fill,245);rect(p,6,3,36,2,accent);rect(p,3,6,2,16,'light');rect(p,6,26,36,2,'blue');rect(p,43,6,2,18,'blue');rect(p,1,5,2,5,accent);rect(p,45,20,2,5,accent);rect(p,7,29,34,2,'navy',170);save(key,p,usage,{nineSlice:{left:8,right:8,top:8,bottom:8}})}
panel('lp-title-frame','cyan','navy','HTML title frame');panel('lp-panel-frame','amber','navy','Help, mission and settings overlays');
for(const[state,accent,fill]of [['normal','edge','blue'],['focus','cyan','blue'],['pressed','amber','navy'],['disabled','blue','navy']])panel(`lp-button-${state}`,accent,fill,`Landing button ${state}`);
for(const name of ['play','continue','help','settings','sound','back','close','info']){const p=canvas(24,24);
 if(name==='play'||name==='continue'){for(let x=0;x<8;x++)rect(p,7+x,4+x,2,16-x*2,'cyan');if(name==='continue')rect(p,18,5,2,14,'amber')}
 if(name==='help'){rect(p,6,6,12,10,'amber');rect(p,8,3,8,3,'light');rect(p,9,16,6,3,'blue');rect(p,10,21,4,2,'cyan');line(p,2,4,4,6,'cyan');line(p,19,4,21,2,'cyan')}
 if(name==='settings'){rect(p,6,5,12,14,'edge');rect(p,3,9,18,6,'edge');rect(p,9,2,6,20,'edge');rect(p,8,8,8,8,'navy');rect(p,10,10,4,4,'cyan')}
 if(name==='sound'){rect(p,3,9,5,7,'light');for(let i=0;i<5;i++)rect(p,7+i,8-i,1,9+i*2,'light');line(p,16,7,20,11,'cyan');line(p,20,11,16,17,'cyan')}
 if(name==='back'){line(p,4,12,20,12,'light');line(p,4,12,11,5,'cyan');line(p,4,12,11,19,'cyan')}
 if(name==='close'){line(p,5,5,18,18,'amber');line(p,5,18,18,5,'light')}
 if(name==='info'){rect(p,4,4,16,16,'edge');rect(p,6,6,12,12,'navy');rect(p,11,7,2,3,'cyan');rect(p,11,12,2,5,'light')}
 save('lp-icon-'+name,p,`Landing ${name} button`)}
let p=canvas(48,48);line(p,24,2,44,14,'edge',3);line(p,44,14,44,34,'cyan',3);line(p,44,34,24,45,'edge',3);line(p,24,45,3,34,'edge',3);line(p,3,34,3,14,'light',3);line(p,3,14,24,2,'cyan',3);rect(p,22,10,8,12,'cyan');rect(p,15,22,14,5,'cyan');rect(p,18,27,6,11,'cyan');rect(p,33,7,4,4,'amber');save('lp-emblem',p,'Landing identity ornament');
for(const[key,color]of [['lp-lamp-glow','amber'],['lp-glove-glow','cyan']]){p=canvas(64,64);for(let y=0;y<64;y+=2)for(let x=0;x<64;x+=2){const d=Math.hypot(x-31,y-31)/31;rect(p,x,y,2,2,color,d>=1?0:Math.round((1-d)**2*96/8)*8)}save(key,p,key==='lp-lamp-glow'?'Lamp local illumination':'Charge Glove local illumination')}
p=canvas(8,8);rect(p,3,0,2,8,'amber',90);rect(p,0,3,8,2,'cyan',90);rect(p,3,3,2,2,'white',200);save('lp-particle',p,'Three finite-lifetime ambient particles');
p=canvas(64,16);for(let x=0;x<64;x++)for(let y=0;y<16;y++){const d=((x-32)/31)**2+((y-8)/7)**2;if(d<1)rect(p,x,y,1,1,[3,8,18],Math.round((1-d)*100))}save('lp-raka-shadow',p,'Raka floor contact shadow');
p=canvas(64,16);for(let f=0;f<4;f++)for(let k=0;k<4;k++)rect(p,f*16+[6,11,6,1][k],[1,6,11,6][k],4,4,k===f?'cyan':'edge');save('lp-loader',p,'Actual asset loader activity indicator',{frameWidth:16,frames:4,fps:6,loop:true});
const manifest=JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json','utf8'));manifest.assets=manifest.assets.filter(a=>!records.some(r=>r.key===a.key)).concat(records);fs.writeFileSync('docs/ASSET_MANIFEST.json',JSON.stringify(manifest,null,2));fs.copyFileSync('docs/ASSET_MANIFEST.json','public/asset-manifest.json');fs.writeFileSync('assets-source/landing-v2/production.json',JSON.stringify({source:'scripts/assets/landing-v2.mjs',assets:records},null,2));console.log(`Landing v2: ${records.length} new assets, ${manifest.assets.length} total. All original assets retained.`);
