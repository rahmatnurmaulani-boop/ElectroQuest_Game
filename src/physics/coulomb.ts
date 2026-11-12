/** Units: world pixels, game seconds, game charge/mass/force; no SI mapping. */
export const COULOMB={K:100000,mass:1,damping:.6,maxSpeed:26,h:1/120,minDistance:48,start:320,end:408,ballOffset:28,source:208,sourceMin:68,sourceMax:208,dockMin:380,dockMax:408,dock:392,timeout:24} as const;
export type Charges={source:number;platform:number;reservoir:number};
export interface Transfer {target:'source'|'platform';action:'take'|'send';before:Charges;after:Charges}
export interface BridgeModel {charges:Charges;transfers:Transfer[];x:number;sourceX:number;v:number;elapsed:number;phase:'LOCKED'|'RUNNING'|'DOCKED'|'STOPPED';autoLock:boolean;message:string}
export const initialBridge=():BridgeModel=>({charges:{source:2,platform:2,reservoir:-4},transfers:[],x:320,sourceX:208,v:0,elapsed:0,phase:'LOCKED',autoLock:true,message:'Platform ditahan. Bandingkan gaya sebelum dilepas.'});
export function pairForce(qSource:number,qPlatform:number,sourceX:number,platformCenter:number){const r=Math.max(COULOMB.minDistance,Math.abs(platformCenter-sourceX));const platform=COULOMB.K*qSource*qPlatform/(r*r)*Math.sign(platformCenter-sourceX||1);return {r,platform,source:-platform,magnitude:Math.abs(platform)}}
export function bridgeForce(m:BridgeModel){return pairForce(m.charges.source,m.charges.platform,m.sourceX,m.x+COULOMB.ballOffset)}
export function electron(m:BridgeModel,target:Transfer['target'],action:Transfer['action']):BridgeModel{
 if(m.phase!=='LOCKED')return m;const d=action==='take'?1:-1,after={...m.charges,[target]:m.charges[target]+d,reservoir:m.charges.reservoir-d};
 if(Math.abs(after[target])>4||Math.abs(after.reservoir)>8)return m;
 return {...m,charges:after,transfers:[...m.transfers,{target,action,before:{...m.charges},after:{...after}}],message:`Elektron ${action==='take'?'diambil dari':'dikirim ke'} bola ${target==='source'?'sumber':'platform'}. Total muatan tetap 0.`};
}
export function configure(m:BridgeModel,source:number,platform:number,r:number){if(m.phase!=='LOCKED'||![140,280].includes(r))return m;let out=m;for(const [key,value]of [['source',source],['platform',platform]] as const){if(!Number.isInteger(value)||Math.abs(value)>4)return m;while(out.charges[key]!==value){const next=electron(out,key,out.charges[key]<value?'take':'send');if(next===out)return m;out=next}}return {...out,sourceX:348-r}}
export const canDock=(m:BridgeModel)=>m.phase==='RUNNING'&&m.x>=COULOMB.dockMin&&m.x<=COULOMB.dockMax;
export function dockBridge(m:BridgeModel):BridgeModel{return canDock(m)?{...m,x:COULOMB.dock,v:0,phase:'DOCKED',message:'Rem mekanis mengunci platform. Pijakan tersambung; ini bukan keseimbangan listrik.'}:m}
export function startBridge(m:BridgeModel):BridgeModel{return m.phase==='LOCKED'?{...m,phase:'RUNNING',elapsed:0,v:0,message:'Platform dilepas; gaya dihitung ulang pada setiap langkah.'}:m}
export function stepBridge(m:BridgeModel):BridgeModel{
 if(m.phase!=='RUNNING')return m;const c=COULOMB,h=c.h,f=bridgeForce(m);let v=Math.max(-c.maxSpeed,Math.min(c.maxSpeed,(m.v+f.platform/c.mass*h)*Math.exp(-c.damping*h)));let x=m.x+v*h;const low=Math.max(c.start,m.sourceX+c.minDistance-c.ballOffset);if(x<low){x=low;v=0}if(x>c.end){x=c.end;v=0}let n:BridgeModel={...m,x,v,elapsed:m.elapsed+h,message:f.platform>0?'Platform menjauhi sumber; r bertambah dan gaya listrik mengecil.':f.platform<0?'Tarikan menuju sumber tertahan batas rel kiri.':'Gaya model nol. Polarisasi belum disimulasikan; benda netral di dunia nyata dapat tertarik.'};
 if(n.autoLock&&canDock(n))return dockBridge(n);if((f.platform<=0&&n.elapsed>1.2)||n.elapsed>=c.timeout)return {...n,v:0,phase:'STOPPED',message:f.platform<=0?n.message:'Waktu uji berakhir. Reset dan atur percobaan baru; timing bukan ukuran pemahaman.'};if(canDock(n))n.message='Platform dalam zona docking. Aktifkan Kunci platform; rem mekanis menahannya.';return n;
}
