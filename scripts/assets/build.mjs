import fs from 'node:fs';
import path from 'node:path';
import {PNG} from '../vendor/pngjs/lib/png.js';
const root=path.resolve(import.meta.dirname,'../..');
process.chdir(root);
export const palette={navy:'#111e35',dark:'#253952',gray:'#526780',light:'#9aafc3',white:'#edf5fa',cyan:'#39ddeb',amber:'#ffbc55',green:'#6bba9a'};
const P=palette, manifest=[];
function rgba(c){return c==='clear'?[0,0,0,0]:[...c.slice(1).match(/../g).map(x=>parseInt(x,16)),255]}
export function canvas(w,h){const a=new PNG({width:w,height:h});a.data.fill(0);return a}
export function rect(a,x,y,w,h,c){const col=rgba(c);for(let j=Math.max(0,y|0);j<Math.min(a.height,y+h);j++)for(let i=Math.max(0,x|0);i<Math.min(a.width,x+w);i++)a.data.set(col,(j*a.width+i)*4)}
function line(a,x,y,x2,y2,c,t=2){const n=Math.max(Math.abs(x2-x),Math.abs(y2-y));for(let i=0;i<=n;i++)rect(a,Math.round(x+(x2-x)*i/(n||1)),Math.round(y+(y2-y)*i/(n||1)),t,t,c)}
function box(a,x,y,w,h,c=P.gray){rect(a,x,y,w,h,P.navy);rect(a,x+2,y+2,w-4,h-4,c);rect(a,x+2,y+2,w-4,2,P.light)}
export function save(key,group,a,extra={}){const file=`public/assets/${group}/${key}.png`;fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,PNG.sync.write(a));manifest.push({key,path:file.replace('public/',''),width:a.width,height:a.height,frameWidth:a.width,frameHeight:a.height,frames:1,fps:0,loop:false,anchor:{x:0.5,y:1},source:'scripts/assets/build.mjs',status:'procedural',provenance:'Original deterministic geometric artwork created for this task; no stock input.',...extra});}
// Separate parallax layers: no puzzle parts are baked into the architecture.
let a=canvas(640,360);rect(a,0,0,640,360,P.navy);rect(a,0,160,640,200,P.dark);for(let i=0;i<42;i++)rect(a,(i*97)%640,(i*43)%160,2,2,P.light);save('sky','environment',a);
a=canvas(640,360);for(let i=0;i<17;i++){let h=35+(i*29)%105;rect(a,i*40,300-h,34,h,P.dark);rect(a,i*40+4,296-h,26,4,P.gray);for(let y=310-h;y<280;y+=16)rect(a,i*40+8,y,4,6,P.gray)}save('city','environment',a);
a=canvas(640,360);box(a,32,96,576,232,P.dark);rect(a,32,92,576,10,P.light);for(const x of [48,128,464,544]){box(a,x,132,48,82,P.gray);rect(a,x+4,136,40,72,P.navy);rect(a,x+6,138,36,3,P.cyan);rect(a,x+23,140,2,68,P.gray)}rect(a,256,112,128,216,'clear');for(let x=40;x<600;x+=32)rect(a,x,304,24,6,P.gray);save('lab-facade','environment',a,{gateOpening:{x:256,y:112,width:128,height:216}});
for(const kind of ['floor','wall'])for(const edge of ['left','middle','right']){a=canvas(32,32);rect(a,0,0,32,32,P.dark);rect(a,2,2,28,28,P.gray);rect(a,0,0,32,4,P.light);rect(a,0,28,32,4,P.navy);if(kind==='wall'){rect(a,0,15,32,2,P.dark);rect(a,15,0,2,15,P.dark);rect(a,7,17,2,14,P.dark)}else{rect(a,5,9,22,2,P.dark);rect(a,5,21,22,2,P.dark)}if(edge!=='middle')rect(a,edge==='left'?0:28,0,4,32,P.light);save(`${kind}-${edge}`,'environment',a)}
for(const prop of ['lamp','crate','plant','sign']){a=canvas(48,64);if(prop==='lamp'){rect(a,22,12,4,48,P.gray);box(a,8,4,32,14);rect(a,12,8,24,6,P.amber);rect(a,14,60,20,4,P.light)}if(prop==='crate'){box(a,4,24,40,40);line(a,8,28,37,55,P.light,3);line(a,8,55,37,28,P.light,3)}if(prop==='plant'){box(a,12,43,24,21);rect(a,22,14,4,30,P.green);for(let i=0;i<3;i++){rect(a,8+i*4,17+i*8,16,6,P.green);rect(a,25,10+i*10,14-i*2,6,P.green)}}if(prop==='sign'){rect(a,21,28,6,36,P.gray);box(a,2,6,44,30);rect(a,6,10,36,22,P.navy)}save(prop,'environment',a)}
for(const side of ['left','right']){a=canvas(64,128);box(a,2,0,60,128);rect(a,8,8,48,112,P.dark);rect(a,side==='left'?52:8,12,4,104,P.cyan);for(let y=16;y<120;y+=24)rect(a,16,y,28,4,P.gray);save(`panel-${side}`,'puzzle',a)}
a=canvas(160,240);box(a,0,0,160,240);rect(a,12,12,136,228,'clear');save('gate-frame','puzzle',a);
a=canvas(160,16);box(a,0,0,160,16);rect(a,6,6,148,4,P.navy);save('rail','puzzle',a);
for(const open of [false,true]){a=canvas(24,32);box(a,4,16,16,16,P.amber);rect(a,5,2,4,16,P.light);rect(a,5,2,14,4,P.light);if(!open)rect(a,15,2,4,14,P.light);save(`latch-${open?'open':'closed'}`,'puzzle',a)}
a=canvas(40,64);box(a,0,0,40,64);rect(a,6,7,28,23,P.navy);rect(a,9,10,22,3,P.cyan);rect(a,8,40,8,8,P.cyan);rect(a,24,40,8,8,P.amber);save('terminal','puzzle',a);
a=canvas(80,128);box(a,0,0,80,128);box(a,6,6,68,122,P.navy);rect(a,12,12,56,4,P.cyan);rect(a,61,64,5,10,P.amber);save('destination-door','puzzle',a);
a=canvas(24,24);box(a,0,0,24,24,P.dark);rect(a,5,5,14,14,P.dark);save('panel-nine','ui',a,{nineSlice:{top:6,right:6,bottom:6,left:6}});
for(const state of ['normal','focus','pressed','disabled']){a=canvas(48,24);box(a,0,0,48,24,state==='disabled'?P.dark:state==='pressed'?P.navy:P.gray);if(state==='focus'){rect(a,2,2,44,2,P.cyan);rect(a,2,20,44,2,P.cyan);rect(a,2,2,2,20,P.cyan);rect(a,44,2,2,20,P.cyan)}save(`button-${state}`,'ui',a,{nineSlice:{top:6,right:6,bottom:6,left:6}})}
for(const icon of ['left','right','interaction','scanner','electron-transfer','observation','reset','sound','fullscreen']){a=canvas(24,24);const c=P.white;if(icon==='left'||icon==='right'){const s=icon==='left'?1:-1;line(a,12-5*s,12,12+3*s,4,c);line(a,12-5*s,12,12+3*s,20,c)}if(icon==='interaction'){box(a,4,5,16,14);rect(a,10,2,4,20,P.cyan)}if(icon==='scanner'){for(const [x,y]of [[2,2],[16,2],[2,16],[16,16]]){rect(a,x,y,6,2,c);rect(a,x,y,2,6,c)}rect(a,5,11,14,2,P.cyan)}if(icon==='electron-transfer'){line(a,2,8,19,8,c);line(a,19,8,15,4,c);line(a,20,16,3,16,P.cyan);line(a,3,16,7,20,P.cyan)}if(icon==='observation'){line(a,2,12,10,5,c);line(a,10,5,21,12,c);line(a,2,12,10,19,c);line(a,10,19,21,12,c);rect(a,10,9,4,6,P.cyan)}if(icon==='reset'){line(a,5,5,18,5,c);line(a,18,5,18,19,c);line(a,18,19,5,19,c);line(a,5,19,5,9,c);line(a,5,9,2,13,c)}if(icon==='sound'){rect(a,3,9,5,7,c);line(a,7,9,12,4,c);line(a,12,4,12,20,c);line(a,7,15,12,20,c);line(a,16,7,20,11,P.cyan);line(a,20,11,16,17,P.cyan)}if(icon==='fullscreen'){for(const[x,y,s,t]of [[2,2,1,1],[21,2,-1,1],[2,21,1,-1],[21,21,-1,-1]]){line(a,x,y,x+5*s,y,c);line(a,x,y,x,y+5*t,c)}}save(`icon-${icon}`,'ui',a,{anchor:{x:.5,y:.5}})}
a=canvas(12,12);rect(a,2,2,8,8,P.navy);rect(a,3,3,6,6,P.cyan);rect(a,4,5,4,2,P.white);save('electron','vfx',a,{anchor:{x:.5,y:.5}});
const sparkFrames=[];for(let f=0;f<5;f++){a=canvas(24,24);const d=2+f*2;for(const [x,y]of [[12-d,12],[12+d,12],[12,12-d],[12,12+d]])rect(a,x,y,2,2,f<3?P.amber:P.light);if(f<3)rect(a,10,10,4,4,P.white);sparkFrames.push(a);save(`spark-${f}`,'vfx',a,{anchor:{x:.5,y:.5}})}
export function sheet(frames){const a=canvas(frames[0].width*frames.length,frames[0].height);frames.forEach((f,i)=>PNG.bitblt(f,a,0,0,f.width,f.height,i*f.width,0));return a}
save('spark','vfx',sheet(sparkFrames),{frameWidth:24,frameHeight:24,frames:5,fps:16,loop:false,anchor:{x:.5,y:.5}});
// Generated sources are normalized separately; never invent a generated asset.
const imported='assets-source/generated/imported-manifest.json';if(fs.existsSync(imported))manifest.push(...JSON.parse(fs.readFileSync(imported)));
for(const [key,w,h,n,fps,loop]of [['raka-idle',64,96,4,6,true],['raka-walk',64,96,8,12,true],['raka-tool',64,96,6,10,false],['ion-idle',48,48,4,6,true],['raka-portrait',128,128,1,0,false],['ion-portrait',128,128,1,0,false]])if(!manifest.some(a=>a.key===key))manifest.push({key,path:null,width:w*n,height:h,frameWidth:w,frameHeight:h,frames:n,fps,loop,anchor:{x:.5,y:key.startsWith('raka-')&&!key.includes('portrait')?90/96:.5},source:null,status:'missing',provenance:'Awaiting built-in image generation and inspected normalization.'});
fs.writeFileSync('docs/ASSET_MANIFEST.json',JSON.stringify({schemaVersion:1,baseCoordinates:{width:640,height:360,tile:32},palette:P,assets:manifest},null,2));fs.copyFileSync('docs/ASSET_MANIFEST.json','public/asset-manifest.json');
console.log(`${manifest.length} manifest entries; ${manifest.filter(a=>a.status==='missing').length} missing`);
await import('./ui.mjs');
await import('./landing.mjs');
if(fs.existsSync('assets-source/landing-v2/imported-manifest.json')){await import('./import-landing.mjs');await import('./landing-v2.mjs')}
if(fs.existsSync('assets-source/mission-02/production.json'))await import('./mission-02.mjs');
if(fs.existsSync('assets-source/mission-03/production.json'))await import('./mission-03.mjs');
if(fs.existsSync('assets-source/mission-04/production.json'))await import('./mission-04.mjs');

if(fs.existsSync('assets-source/console-ui/production.json'))await import('./console-ui.mjs');
