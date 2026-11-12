import fs from 'node:fs';import path from 'node:path';import {PNG} from '../vendor/pngjs/lib/png.js';
process.chdir(path.resolve(import.meta.dirname,'../..'));const source='assets-source/console-ui';fs.mkdirSync(source,{recursive:true});const assets=[];
const C={navy:[14,25,44],dark:[30,46,67],steel:[71,94,117],light:[156,181,199],white:[237,247,251],cyan:[57,221,235],amber:[255,188,85],muted:[74,91,108]};
const canvas=(w,h)=>{const p=new PNG({width:w,height:h});p.data.fill(0);return p};
function rect(p,x,y,w,h,c,a=255){for(let yy=Math.max(0,y|0);yy<Math.min(p.height,y+h);yy++)for(let xx=Math.max(0,x|0);xx<Math.min(p.width,x+w);xx++)p.data.set([...(C[c]??c),a],(yy*p.width+xx)*4)}
function line(p,x,y,x2,y2,c,t=2){const n=Math.max(Math.abs(x-x2),Math.abs(y-y2));for(let i=0;i<=n;i++)rect(p,Math.round(x+(x2-x)*i/(n||1)),Math.round(y+(y2-y)*i/(n||1)),t,t,c)}
function save(key,p,usage,extra={}){const file=`assets/ui/${key.startsWith('eq-result-art')?'results':key==='eq-emblem'?'landing':'shared'}/${key}.png`;fs.mkdirSync(path.dirname('public/'+file),{recursive:true});fs.writeFileSync('public/'+file,PNG.sync.write(p));let transparent=0,partial=0;for(let i=3;i<p.data.length;i+=4){if(!p.data[i])transparent++;else if(p.data[i]<255)partial++}assets.push({key,path:file,width:p.width,height:p.height,frameWidth:p.width,frameHeight:p.height,frames:1,fps:0,loop:false,anchor:{x:.5,y:.5},source:'scripts/assets/console-ui.mjs',status:'procedural',final:true,usage,provenance:'Original deterministic pixel geometry, no baked text, values, mission numbers or answers.',alpha:{transparentPixels:transparent,partialPixels:partial},...extra})}
function frame(w,h,accent='cyan',state='normal',kind='panel'){
 const p=canvas(w,h),pressed=state==='pressed',disabled=state==='disabled',a=disabled?'muted':accent;
 rect(p,4,0,w-8,h,'navy');rect(p,0,4,w,h-8,'navy');rect(p,4,2,w-8,h-4,'steel');rect(p,2,4,w-4,h-8,'steel');rect(p,6,4,w-12,h-8,'dark');rect(p,4,6,w-8,h-12,'dark');rect(p,12,12,w-24,h-24,kind==='primary'?[19,64,82]:'navy',kind==='panel'?250:255);
 rect(p,6,4,w-12,2,pressed?'navy':'light');rect(p,4,6,2,h-12,'light');rect(p,6,h-8,w-12,4,'navy');rect(p,w-8,8,4,h-14,'navy');
 for(const[x,y]of [[7,7],[w-10,7],[7,h-10],[w-10,h-10]]){rect(p,x,y,3,3,'navy');rect(p,x,y,2,1,'light')}
 for(const[x,y]of [[4,4],[w-12,4],[4,h-12],[w-12,h-12]]){rect(p,x,y,8,8,'steel');rect(p,x,y,8,2,'light');rect(p,x+2,y+3,4,4,'navy');rect(p,x+3,y+3,2,2,'light')}
 rect(p,12,5,w-24,3,'steel');rect(p,12,8,w-24,2,pressed?'navy':'light');rect(p,12,h-11,w-24,3,'steel');rect(p,12,h-8,w-24,3,'navy');
 for(const x of [12,w-20]){rect(p,x,2,8,2,a);rect(p,x,h-4,8,2,a)}
 if(state==='hover'||state==='selected'){rect(p,12,6,w-24,2,a);rect(p,8,12,2,h-24,a);rect(p,w-10,12,2,h-24,a)}
 if(state==='focus'){for(const[x,y,s,t]of [[0,0,1,1],[w-2,0,-1,1],[0,h-2,1,-1],[w-2,h-2,-1,-1]]){line(p,x,y,x+8*s,y,'white');line(p,x,y,x,y+8*t,'white')}rect(p,12,6,w-24,2,a)}
 if(pressed){rect(p,10,10,w-20,3,'navy');rect(p,12,h-8,w-24,2,a)}
 if(disabled)for(const x of [8,w-18])line(p,x,h-13,x+6,h-7,'muted',1);
 if(state==='selected'){rect(p,5,15,4,10,a);rect(p,6,18,2,4,'white')}
 return p;
}
for(const[type,accent]of [['main','cyan'],['modal','cyan'],['result','amber'],['stat','cyan'],['title','amber'],['footer','cyan'],['hint','amber'],['warning','amber'],['input','cyan'],['portrait','cyan']])save('eq-panel-'+type,frame(48,48,accent),`Shared ${type} nine-slice frame`,{nineSlice:{top:12,right:12,bottom:12,left:12},minimum:{width:type==='portrait'?48:128,height:type==='portrait'?48:64},padding:16});
for(const variant of ['primary','secondary','warning','icon'])for(const state of ['normal','hover','focus','pressed','disabled','selected'])save(`eq-button-${variant}-${state}`,frame(variant==='icon'?48:72,40,variant==='warning'?'amber':'cyan',state,variant),`${variant} button ${state}`,{nineSlice:{top:12,right:12,bottom:12,left:12},minimum:{width:48,height:48},padding:12,state,variant});
for(const key of ['play','continue','help','info','settings','missions','home','reset','replay','notes','results','reread','close','sound-on','sound-off','pause','fullscreen','warning']){
 const p=canvas(24,24),l=(x,y,x2,y2,c='white')=>line(p,x,y,x2,y2,c);
 if(key==='play'||key==='continue'){l(7,4,18,12,'cyan');l(18,12,7,20,'cyan');l(7,4,7,20);if(key==='continue')l(20,5,20,19,'amber')}
 if(key==='help'){l(7,5,16,5);l(16,5,18,9);l(18,9,12,13,'cyan');l(12,13,12,15,'cyan');rect(p,12,19,2,2,'amber')}
 if(key==='info'){rect(p,11,3,3,3,'amber');rect(p,11,9,3,11,'white');l(7,20,17,20,'cyan')}
 if(key==='settings'){for(const[x,y]of [[12,3],[12,20],[3,12],[20,12],[5,5],[18,18],[5,18],[18,5]])rect(p,x-1,y-1,3,3,'light');for(let y=5;y<19;y++)for(let x=5;x<19;x++){const r=Math.hypot(x-12,y-12);if(r<7&&r>3)rect(p,x,y,1,1,'cyan')}}
 if(key==='missions'){for(const[x,y]of [[3,3],[14,3],[3,14],[14,14]]){rect(p,x,y,7,7,'steel');rect(p,x+2,y+2,3,3,'cyan')}}
 if(key==='home'){l(3,11,12,3);l(12,3,21,11);l(5,10,5,21,'cyan');l(19,10,19,21,'cyan');l(5,21,19,21,'cyan');rect(p,10,14,4,8,'white')}
 if(key==='reset'||key==='replay'){l(6,5,18,5,'cyan');l(18,5,20,15,'cyan');l(20,15,12,21,'cyan');l(12,21,4,16,'cyan');l(6,2,6,8,'amber');l(6,8,12,8,'amber');if(key==='replay'){l(9,10,14,13);l(14,13,9,16)}}
 if(key==='notes'||key==='reread'){l(3,4,11,6);l(11,6,21,4);l(3,4,3,20,'cyan');l(21,4,21,20,'cyan');l(3,20,11,22);l(11,22,21,20);l(11,6,11,22);l(6,10,8,10,'amber');l(14,10,18,9,'amber')}
 if(key==='results'){for(const[x,h]of [[4,8],[10,14],[16,19]])rect(p,x,22-h,4,h,'cyan');l(2,22,22,22,'white')}
 if(key==='close'){l(5,5,19,19);l(19,5,5,19,'cyan')}
 if(key.startsWith('sound')){rect(p,3,9,5,7,'white');l(7,9,12,4);l(12,4,12,20);l(7,15,12,20);if(key==='sound-on'){l(16,7,20,11,'cyan');l(20,11,16,17,'cyan')}else{l(16,8,22,16,'amber');l(22,8,16,16,'amber')}}
 if(key==='pause'){rect(p,6,4,4,16,'white');rect(p,15,4,4,16,'cyan')}
 if(key==='fullscreen')for(const[x,y,s,t]of [[3,3,1,1],[19,3,-1,1],[3,19,1,-1],[19,19,-1,-1]]){l(x,y,x+5*s,y);l(x,y,x,y+5*t,'cyan')}
 if(key==='warning'){l(12,2,2,21,'amber');l(2,21,22,21,'amber');l(22,21,12,2,'amber');rect(p,11,8,3,7,'white');rect(p,11,17,3,2,'white')}
 save('eq-icon-'+key,p,'Shared accessible control icon: '+key);
}
let p=canvas(64,64);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const r=Math.hypot(x-31.5,y-31.5);if(r<29&&r>22)rect(p,x,y,1,1,r>26?'steel':'cyan')}line(p,18,34,29,14,'amber',4);line(p,29,14,25,33,'amber',4);line(p,25,33,42,28,'amber',4);line(p,42,28,32,50,'amber',4);save('eq-emblem',p,'Landing ElectroQuest charge/adventure emblem');
p=canvas(48,48);for(let y=3;y<40;y++){const half=y<28?18:Math.max(0,18-(y-28)*1.5);rect(p,Math.round(24-half),y,Math.round(half*2),1,'steel');rect(p,Math.round(26-half),y,Math.max(0,Math.round(half*2-4)),1,'navy')}rect(p,8,5,32,3,'amber');line(p,14,24,21,31,'cyan',3);line(p,21,31,34,16,'cyan',3);save('eq-badge',p,'Mission completed badge; mission number remains HTML');
p=canvas(16,16);line(p,3,2,12,8,'cyan');line(p,12,8,3,14,'cyan');save('eq-pointer',p,'Menu hover/focus selection pointer');
p=canvas(24,8);rect(p,0,1,24,6,'navy');rect(p,2,2,20,3,'cyan',180);rect(p,4,2,16,1,'white');save('eq-indicator',p,'Console checkpoint/status lamp');
p=canvas(64,8);rect(p,0,3,64,2,'steel');for(const x of [0,60])rect(p,x,1,4,6,'cyan');save('eq-divider',p,'Resizable section separator');
p=canvas(96,24);for(let f=0;f<4;f++){for(const[x,y]of [[4,12],[12,4],[20,12],[12,20]]){rect(p,f*24+x-1,y-1,3,3,f%2?'cyan':'amber');if(f<2)rect(p,f*24+10,10,4,4,'white')}}save('eq-success',p,'Short decorative result success flash',{frameWidth:24,frames:4,fps:8,loop:false});
p=canvas(96,24);for(let f=0;f<4;f++)for(let i=0;i<4;i++)rect(p,f*24+3+i*5,7,3,10,i===f?'cyan':'steel');save('eq-loader',p,'Loading indicator using four fixed frames',{frameWidth:24,frames:4,fps:6,loop:true});
for(const n of [1,2,3]){const master=`${source}/mission-${n}-master.png`;if(!fs.existsSync(master))throw Error('Missing original result illustration '+master);const raw=PNG.sync.read(fs.readFileSync(master));p=canvas(640,280);const scale=Math.min(640/raw.width,280/raw.height),w=Math.round(raw.width*scale),h=Math.round(raw.height*scale),ox=Math.floor((640-w)/2),oy=Math.floor((280-h)/2);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(Math.min(raw.height-1,Math.floor((y+.5)*raw.height/h))*raw.width+Math.min(raw.width-1,Math.floor((x+.5)*raw.width/w)))*4;p.data.set(raw.data.subarray(i,i+4),((y+oy)*640+x+ox)*4)}save(`eq-result-art-${n}`,p,`Shared MissionResult illustration for mission ${n}`,{source:master,status:'generated',contentRect:{x:ox,y:oy,width:w,height:h},provenance:'Built-in image_gen, original retained, aspect preserved with transparent letterbox, nearest-neighbor normalization, no baked data.'})}
const file='docs/ASSET_MANIFEST.json',manifest=JSON.parse(fs.readFileSync(file));manifest.assets=manifest.assets.filter(a=>!a.key.startsWith('eq-')).concat(assets);fs.writeFileSync(file,JSON.stringify(manifest,null,2));fs.copyFileSync(file,'public/asset-manifest.json');fs.writeFileSync(`${source}/production.json`,JSON.stringify({palette:C,assets},null,2));console.log(`Console UI: ${assets.length} final assets; ${manifest.assets.length} total.`);
