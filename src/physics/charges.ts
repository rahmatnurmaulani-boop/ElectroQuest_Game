import {PUZZLE} from '../content/mission';
export type Panel='left'|'right';
export type ChargeObject=Panel|'glove';
export type Phase='CONFIGURING'|'SIMULATING'|'OPENED'|'UNSUCCESSFUL';
export interface Experiment {charges:Record<ChargeObject,number>;phase:Phase;left:number;right:number;vLeft:number;vRight:number;elapsed:number;repelled:boolean;locked:boolean;message:string}
export const POLARIZATION_NOTE='Model misi ini belum menyimulasikan polarisasi. Dalam keadaan nyata, benda netral dapat tertarik oleh benda bermuatan.';
export function createExperiment():Experiment{return {charges:{...PUZZLE.initial},phase:'CONFIGURING',...PUZZLE.closed,vLeft:0,vRight:0,elapsed:0,repelled:false,locked:true,message:'Gerbang ditahan pengunci. Atur muatan, lalu uji gerbang.'}}
export function totalCharge(state:Experiment){return state.charges.left+state.charges.right+state.charges.glove}
export function describeCharge(q:number){return {text:q>0?`+${q}`:q<0?`−${Math.abs(q)}`:'0',polarity:q>0?'positif':q<0?'negatif':'netral',color:q>0?'#ffbc55':q<0?'#39ddeb':'#edf5fa'}}
export function transferElectron(state:Experiment,panel:Panel,action:'take'|'send'){
  const source:ChargeObject=action==='take'?panel:'glove',target:ChargeObject=action==='take'?'glove':panel;
  if(state.phase!=='CONFIGURING')return {state,accepted:false,message:'Transfer hanya tersedia saat konfigurasi.',source,target};
  const from=state.charges[source]+1,to=state.charges[target]-1;
  if(Math.abs(from)>PUZZLE.limit||Math.abs(to)>PUZZLE.limit)return {state,accepted:false,message:'Transfer ditolak: muatan panel atau alat akan melewati batas −8 sampai +8.',source,target};
  const next:Experiment={...state,charges:{...state.charges,[source]:from,[target]:to}};
  return {state:next,accepted:true,message:action==='take'?'Satu elektron berpindah dari panel ke alat.':'Satu elektron berpindah dari alat ke panel.',source,target};
}
export function panelForce(qLeft:number,qRight:number,distance:number){
  const product=qLeft*qRight,r=Math.max(PUZZLE.minDistance,Math.abs(distance));
  const right=PUZZLE.forceScale*product/(r*r);
  return {left:right===0?0:-right,right};
}
export function beginSimulation(state:Experiment):Experiment{return state.phase==='CONFIGURING'?{...state,phase:'SIMULATING',locked:false,elapsed:0,message:'Pengunci dilepas. Menguji gerakan panel…'}:state}
export function stepExperiment(state:Experiment,dt=PUZZLE.fixedStep):Experiment {
  if(state.phase!=='SIMULATING')return state;
  const force=panelForce(state.charges.left,state.charges.right,state.right-state.left);
  const velocity=(v:number,f:number)=>Math.max(-PUZZLE.maxSpeed,Math.min(PUZZLE.maxSpeed,(v+f/PUZZLE.mass*dt)*Math.exp(-PUZZLE.damping*dt)));
  let vLeft=velocity(state.vLeft,force.left),vRight=velocity(state.vRight,force.right);
  let left=Math.max(PUZZLE.open.left,Math.min(PUZZLE.closed.left,state.left+vLeft*dt));
  let right=Math.min(PUZZLE.open.right,Math.max(PUZZLE.closed.right,state.right+vRight*dt));
  if(right-left<PUZZLE.panelWidth){const mid=(left+right)/2;left=mid-PUZZLE.panelWidth/2;right=mid+PUZZLE.panelWidth/2;vLeft=vRight=0}
  if(left===PUZZLE.open.left||left===PUZZLE.closed.left)vLeft=0;
  if(right===PUZZLE.open.right||right===PUZZLE.closed.right)vRight=0;
  const elapsed=state.elapsed+dt,repelled=state.repelled||(force.left<0&&left<state.left&&right>state.right);
  if(repelled&&left===PUZZLE.open.left&&right===PUZZLE.open.right)return {...state,left,right,vLeft:0,vRight:0,elapsed,repelled,phase:'OPENED',locked:true,message:'Gerbang terbuka! Kait menahan kedua panel. Jalur kini dapat dilewati.'};
  const neutral=state.charges.left===0||state.charges.right===0;
  const attraction=state.charges.left*state.charges.right<0;
  if(elapsed>=PUZZLE.maxDuration||elapsed>=1.2&&(neutral||attraction))return {...state,left,right,vLeft:0,vRight:0,elapsed,repelled,phase:'UNSUCCESSFUL',locked:true,message:neutral?`Belum terbuka: gaya model bernilai nol karena salah satu panel netral. ${POLARIZATION_NOTE}`:attraction?'Belum terbuka: muatan berbeda jenis saling menarik. Panel tertahan pada batas tertutup.':'Panel belum mencapai kedua batas terbuka. Reset dan coba muatan lain.'};
  return {...state,left,right,vLeft,vRight,elapsed,repelled};
}
