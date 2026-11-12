import {initialBridge,bridgeForce,type BridgeModel} from '../physics/coulomb';
export type BridgePhase='PROBLEM'|'OBSERVATION'|'PREDICTION'|'INVESTIGATION'|'SOLUTION'|'EXPLANATION'|'REFLECTION'|'RESULTS';
export interface Observation {id:number;source:number;platform:number;reservoir:number;r:number;force:number;direction:number}
export const BRIDGE_QUESTIONS=[
 {id:'charge',text:'Pada r tetap, salah satu besar muatan dua kali: besar gaya…',options:['Dua kali.','Setengah.','Tetap.'],correct:0,feedback:'F sebanding dengan |qSumber × qPlatform|; menggandakan satu muatan menggandakan gaya.'},
 {id:'distance',text:'Pada muatan tetap, jarak dua kali: besar gaya…',options:['Seperempat.','Dua kali.','Setengah.'],correct:0,feedback:'F sebanding dengan 1/r²: pada 2r, gaya menjadi 1/4.'},
 {id:'sign',text:'Muatan sejenis dan berbeda jenis masing-masing…',options:['Menolak dan menarik.','Menarik dan menolak.','Selalu menarik.'],correct:0,feedback:'Sejenis menolak, berbeda jenis menarik; gaya pasangan sama besar dan berlawanan.'},
 {id:'motion',text:'Saat platform menjauhi sumber, gaya mengecil karena…',options:['Jarak r bertambah.','Muatan otomatis habis.','Waktu menjadi gaya.'],correct:0,feedback:'r berubah selama bergerak; muatan tetap dan tidak habis. Waktu tempuh bukan ukuran langsung gaya.'}
] as const;
export interface Explanation {answers:number[];correct:boolean[]}
export interface BridgeSession {version:1;phase:BridgePhase;model:BridgeModel;prediction:number[]|null;observations:Observation[];comparisons:{a:number;b:number;kind:'distance'|'charge';ratio:number}[];explanations:Explanation[];reflection:string;hints:number;attempts:{initial:BridgeModel;final:BridgeModel}[];solution:BridgeModel|null;crossed:boolean;playerX:number}
export const newBridgeSession=():BridgeSession=>({version:1,phase:'PROBLEM',model:initialBridge(),prediction:null,observations:[],comparisons:[],explanations:[],reflection:'',hints:0,attempts:[],solution:null,crossed:false,playerX:80});
export function snapshot(m:BridgeModel,id:number):Observation {const f=bridgeForce(m);return {id,source:m.charges.source,platform:m.charges.platform,reservoir:m.charges.reservoir,r:f.r,force:f.magnitude,direction:Math.sign(f.platform)}}
export function compareObservations(a:Observation,b:Observation):{kind:'distance'|'charge'|null;ratio:number;message:string}{
 const ratio=a.force>0?b.force/a.force:0,sameQ=a.source===b.source&&a.platform===b.platform,sameR=a.r===b.r;
 if(a.force===0||b.force===0)return {kind:null,ratio,message:'Gunakan muatan bukan nol untuk menyelidiki perbandingan gaya. Polarisasi belum disimulasikan.'};
 if(sameQ&&Math.abs(b.r/a.r-2)<1e-6)return {kind:'distance',ratio,message:`Jarak dua kali, kedua muatan tetap: F kedua/F pertama = ${ratio.toFixed(3)} (seperempat).`};
 const doubled=(a.source===b.source&&b.platform===2*a.platform)||(a.platform===b.platform&&b.source===2*a.source);
 if(sameR&&doubled)return {kind:'charge',ratio,message:`Satu besar muatan dua kali, jarak tetap: F kedua/F pertama = ${ratio.toFixed(3)} (dua kali).`};
 return {kind:null,ratio,message:'Belum pasangan terkontrol yang diminta. Pilih urutan r lalu 2r dengan kedua muatan tetap, atau q lalu 2q pada r tetap. Jangan mengubah muatan dan jarak sekaligus.'};
}
export const investigated=(s:BridgeSession)=>['distance','charge'].every(k=>s.comparisons.some(c=>c.kind===k));
export function explainBridge(s:BridgeSession,answers:number[]):BridgeSession {if(s.phase!=='EXPLANATION'||answers.length!==4||answers.some(n=>!Number.isInteger(n)||n<0||n>2)||!investigated(s)||!s.crossed||!s.solution)return s;const correct=answers.map((n,i)=>n===BRIDGE_QUESTIONS[i].correct);return {...s,explanations:[...s.explanations,{answers:[...answers],correct}],phase:correct.every(Boolean)?'REFLECTION':'EXPLANATION'}}
