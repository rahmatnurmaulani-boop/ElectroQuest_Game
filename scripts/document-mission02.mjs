import fs from 'node:fs';
const p='docs/MISSION_02.md';const {assets}=JSON.parse(fs.readFileSync('assets-source/mission-02/production.json'));
const heading='| Aset | Lokasi file | Penggunaan di scene | Status pemeriksaan |';
const document=fs.readFileSync(p,'utf8');const index=document.lastIndexOf(heading);const base=index<0?document:document.slice(0,index);
fs.writeFileSync(p,base+heading+'\n|---|---|---|---|\n'+assets.map(a=>`| ${a.key} (${a.frameWidth}×${a.frameHeight}${a.frames>1?`, ${a.frames} frame @ ${a.fps} FPS`:''}) | public/${a.path} | ${a.usage} | Final, terpasang; lulus |`).join('\n')+'\n');
