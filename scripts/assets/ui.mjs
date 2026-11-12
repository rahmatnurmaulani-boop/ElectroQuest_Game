/** Original pixel UI production source. No external service, fonts or stock art. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {PNG} from '../vendor/pngjs/lib/png.js';
const root=path.resolve(import.meta.dirname,'../..');process.chdir(root);
const P={navy:[17,30,53],dark:[37,57,82],gray:[82,103,128],light:[154,175,195],white:[237,245,250],cyan:[57,221,235],amber:[255,188,85]};
const records=[];const usage={
 'ui-hud-frame':'HUD nama misi dan tujuan', 'ui-dialog-info':'Dialog Ion, prediksi, penjelasan dan refleksi', 'ui-dialog-hint':'Catatan konsep, petunjuk dan peringatan', 'ui-dialog-success':'Hasil dan umpan balik keberhasilan', 'ui-terminal-frame':'Overlay terminal', 'ui-menu-frame':'Pause, pengaturan dan cara bermain', 'ui-choice-selected':'Pilihan panel dan jawaban aktif', 'ui-divider':'Pemisah bagian hasil', 'button-selected':'Tombol panel yang telah diperiksa', 'ui-next':'Tombol Lanjut dialog Ion', 'ui-answer-off':'Pilihan jawaban belum dipilih', 'ui-answer-on':'Pilihan jawaban dipilih'
};
function canvas(w,h){const p=new PNG({width:w,height:h});p.data.fill(0);return p}
function rect(p,x,y,w,h,color,alpha=255){const rgb=P[color]||color;for(let j=Math.max(0,y);j<Math.min(p.height,y+h);j++)for(let i=Math.max(0,x);i<Math.min(p.width,x+w);i++)p.data.set([...rgb,alpha],(j*p.width+i)*4)}
function line(p,x,y,x2,y2,c='white',t=2){const n=Math.max(Math.abs(x2-x),Math.abs(y2-y));for(let i=0;i<=n;i++)rect(p,Math.round(x+(x2-x)*i/(n||1)),Math.round(y+(y2-y)*i/(n||1)),t,t,c)}
function save(key,p,extra={}){const file=`assets/ui/${key}.png`;fs.writeFileSync(`public/${file}`,PNG.sync.write(p));let transparent=0,partial=0;for(let i=3;i<p.data.length;i+=4){if(p.data[i]===0)transparent++;else if(p.data[i]<255)partial++}assert(transparent>0,key+' needs real alpha');records.push({key,path:file,width:p.width,height:p.height,frameWidth:p.width,frameHeight:p.height,frames:1,fps:0,loop:false,anchor:{x:.5,y:.5},source:'scripts/assets/ui.mjs',status:'procedural',final:true,provenance:'Original deterministic pixel geometry, ElectroQuest palette; transparent RGBA PNG, no baked text.',usage:usage[key]||key,alpha:{transparentPixels:transparent,partialPixels:partial},...extra})}
function frame(key,accent='light',opacity=242,size=[32,32],slice=8){const p=canvas(...size),[w,h]=size;
 rect(p,4,0,w-8,h,'navy');rect(p,0,4,w,h-8,'navy');rect(p,2,4,w-4,h-8,'gray');rect(p,4,2,w-8,h-4,'gray');rect(p,4,4,w-8,h-8,'navy',opacity);
 rect(p,4,2,w-8,2,accent);rect(p,2,4,2,h-8,'light');rect(p,4,h-4,w-8,2,'dark');rect(p,w-4,4,2,h-8,'dark');rect(p,6,6,w-12,1,'dark');rect(p,6,h-7,w-12,1,'gray');
 if(key==='ui-dialog-success')rect(p,w-8,4,3,3,'amber');
 if(key==='ui-terminal-frame')rect(p,8,3,4,2,'cyan');
 if(key==='ui-menu-frame')rect(p,w-12,h-6,4,2,'amber');
 save(key,p,{nineSlice:{top:slice,right:slice,bottom:slice,left:slice},states:[key.split('-').at(-1)]});}
fs.mkdirSync('public/assets/ui',{recursive:true});
for(const [key,c,alpha]of [['ui-hud-frame','cyan',170],['ui-dialog-info','cyan',242],['ui-dialog-hint','amber',242],['ui-dialog-success','cyan',242],['ui-terminal-frame','light',245],['ui-menu-frame','light',245],['ui-choice-selected','cyan',242]])frame(key,c,alpha);
frame('button-selected','cyan',240,[48,24],6);
for(const [state,c,a]of [['normal','light',85],['focus','cyan',120],['pressed','cyan',170],['disabled','gray',55]]){usage[`ui-touch-${state}`]=`Kontrol sentuh, status ${state}`;frame(`ui-touch-${state}`,c,a)}
let p=canvas(32,4);rect(p,2,1,28,1,'gray');rect(p,14,0,4,3,'cyan');save('ui-divider',p,{repeat:'horizontal'});
for(const active of [false,true]){p=canvas(16,16);rect(p,2,2,12,12,'gray');rect(p,4,4,8,8,'navy');rect(p,4,2,8,2,active?'cyan':'light');if(active){line(p,4,8,7,11,'cyan');line(p,7,11,12,5,'cyan')}save(active?'ui-answer-on':'ui-answer-off',p)}
p=canvas(64,16);for(let f=0;f<4;f++){const o=f*16;line(p,o+4+f%2,3,o+10+f%2,8,'amber');line(p,o+10+f%2,8,o+4+f%2,13,'amber')}save('ui-next',p,{frameWidth:16,frames:4,fps:4,loop:true,animation:{spacing:0,margin:0,durationMs:1000}});
for(const name of ['pause','settings','help','back','info','warning','take','send','test','glove','panel-left','panel-right','success','retry']){
 p=canvas(24,24);
 if(name==='pause'){rect(p,5,4,5,16,'white');rect(p,14,4,5,16,'cyan')}
 if(name==='settings'){rect(p,7,3,10,18,'light');rect(p,3,7,18,10,'light');rect(p,5,5,14,14,'light');rect(p,8,8,8,8,'navy');rect(p,10,10,4,4,'cyan')}
 if(name==='help'){rect(p,7,4,10,10,'amber');rect(p,9,2,6,2,'white');rect(p,9,14,6,4,'light');rect(p,10,20,4,2,'cyan');for(const[x,y]of [[2,4],[19,4],[2,14],[19,14]])rect(p,x,y,3,2,'amber')}
 if(name==='back'){line(p,4,12,19,12);line(p,4,12,10,5,'cyan');line(p,4,12,10,19,'cyan')}
 if(name==='info'){line(p,11,2,21,11,'cyan');line(p,21,11,11,21,'cyan');line(p,11,21,2,11,'cyan');line(p,2,11,11,2,'cyan');rect(p,10,7,3,3,'white');rect(p,10,12,3,5,'white')}
 if(name==='warning'){line(p,11,2,22,21,'amber');line(p,22,21,1,21,'amber');line(p,1,21,11,2,'amber');rect(p,11,8,2,7,'white');rect(p,11,17,2,2,'white')}
 if(name==='take'||name==='send'){rect(p,2,4,5,16,'gray');rect(p,3,5,2,3,'cyan');const start=name==='take'?8:20,end=name==='take'?20:8;line(p,start,12,end,12,'cyan');line(p,end,12,end+(end>start?-4:4),8,'white');line(p,end,12,end+(end>start?-4:4),16,'white')}
 if(name==='test'){rect(p,3,3,18,2,'light');rect(p,3,3,2,18,'gray');rect(p,19,3,2,18,'gray');line(p,9,8,15,12,'amber');line(p,15,12,9,16,'amber');rect(p,9,8,2,10,'amber')}
 if(name==='glove'){rect(p,7,9,10,10,'cyan');rect(p,7,3,3,10,'light');rect(p,11,2,3,10,'cyan');rect(p,15,4,3,10,'light');rect(p,3,11,5,6,'cyan');rect(p,9,19,8,3,'dark');rect(p,10,13,4,3,'navy')}
 if(name==='panel-left'||name==='panel-right'){rect(p,4,2,16,20,'light');rect(p,6,4,12,16,'dark');rect(p,name==='panel-left'?15:7,5,2,14,'cyan');rect(p,8,7,5,2,'gray')}
 if(name==='success'){line(p,3,12,9,18,'cyan',3);line(p,9,18,20,5,'cyan',3);rect(p,18,2,3,2,'amber')}
 if(name==='retry'){line(p,5,6,18,6,'amber');line(p,18,6,18,18,'amber');line(p,18,18,5,18,'amber');line(p,5,18,5,11,'amber');line(p,5,6,9,2,'white');line(p,5,6,10,10,'white')}
 usage[`icon-${name}`]=`Game UI: ${name}`;save(`icon-${name}`,p);
}
const manifest=JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json','utf8'));
manifest.assets=manifest.assets.filter(a=>!records.some(n=>n.key===a.key)).concat(records);
fs.writeFileSync('docs/ASSET_MANIFEST.json',JSON.stringify(manifest,null,2));fs.copyFileSync('docs/ASSET_MANIFEST.json','public/asset-manifest.json');
fs.writeFileSync('assets-source/ui-production.json',JSON.stringify({source:'scripts/assets/ui.mjs',palette:P,assets:records},null,2));
console.log(`Created ${records.length} final UI PNG assets with measured alpha; manifest now ${manifest.assets.length} entries.`);
