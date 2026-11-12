import {readProgress} from './progress';
import {initialBridge,type BridgeModel} from '../physics/coulomb';
import {snapshot,compareObservations,investigated,BRIDGE_QUESTIONS,type BridgeSession} from '../learning/bridge';
export const BRIDGE_KEY='electroquest.mission2.v1',UNLOCK_KEY='electroquest.mission1.completed.v1';
let memory:BridgeSession|null=null;
export function bridgeUnlocked(){try{return readProgress().checkpoint?.learning.phase==='RESULTS'||localStorage.getItem(UNLOCK_KEY)==='true'}catch{return false}}
const equal=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
function validModel(m:BridgeModel){if(!m||!['LOCKED','DOCKED','STOPPED'].includes(m.phase)||!Number.isFinite(m.x)||m.x<320||m.x>408||m.sourceX<68||m.sourceX>208||!Number.isFinite(m.sourceX)||m.v!==0||!Number.isFinite(m.elapsed)||m.elapsed<0||m.elapsed>25||typeof m.autoLock!=='boolean'||typeof m.message!=='string'||m.message.length>2000||!Array.isArray(m.transfers)||m.transfers.length>2000)return false;let q=initialBridge().charges;for(const t of m.transfers){if(!t||!['source','platform'].includes(t.target)||!['take','send'].includes(t.action)||!equal(t.before,q))return false;const d=t.action==='take'?1:-1;const next={...q,[t.target]:q[t.target]+d,reservoir:q.reservoir-d};if(Math.abs(next[t.target])>4||Math.abs(next.reservoir)>8||!equal(next,t.after))return false;q=next}return equal(q,m.charges)&&(m.phase!=='DOCKED'||m.x===392)&&(m.phase!=='LOCKED'||m.x===320)}
export function validateBridge(value:unknown):BridgeSession|null {try{const s=value as BridgeSession;
 if(!s||s.version!==1||!['PROBLEM','OBSERVATION','PREDICTION','INVESTIGATION','SOLUTION','EXPLANATION','REFLECTION','RESULTS'].includes(s.phase)||!validModel(s.model)||!Array.isArray(s.observations)||s.observations.length>100||!Array.isArray(s.comparisons)||s.comparisons.length>100||!Array.isArray(s.explanations)||s.explanations.length>100||!Array.isArray(s.attempts)||s.attempts.length>100||typeof s.reflection!=='string'||s.reflection.length>2000||!Number.isInteger(s.hints)||s.hints<0||s.hints>3||typeof s.crossed!=='boolean'||!Number.isFinite(s.playerX)||s.playerX<32||s.playerX>608)return null;
 if(s.prediction!==null&&(!Array.isArray(s.prediction)||s.prediction.length!==2||s.prediction.some(n=>!Number.isInteger(n)||n<0||n>2)))return null;
 if(['INVESTIGATION','SOLUTION','EXPLANATION','REFLECTION','RESULTS'].includes(s.phase)&&!s.prediction)return null;
 for(const [i,o]of s.observations.entries()){if(!o||o.id!==i+1||![o.source,o.platform,o.reservoir,o.r].every(Number.isFinite)||![o.source,o.platform,o.reservoir].every(Number.isInteger)||Math.abs(o.source)>4||Math.abs(o.platform)>4||Math.abs(o.reservoir)>8||o.source+o.platform+o.reservoir!==0||o.r<140||o.r>280)return null;const m={...initialBridge(),charges:{source:o.source,platform:o.platform,reservoir:o.reservoir},sourceX:348-o.r};if(!equal(o,snapshot(m,i+1)))return null}
 for(const c of s.comparisons){const a=s.observations[c.a-1],b=s.observations[c.b-1];if(!a||!b)return null;const r=compareObservations(a,b);if(!r.kind||r.kind!==c.kind||r.ratio!==c.ratio)return null}
 for(const a of s.attempts)if(!validModel(a.initial)||a.initial.phase!=='LOCKED'||!validModel(a.final)||!equal(a.initial.charges,a.final.charges))return null;
 if(s.solution!==null&&(!validModel(s.solution)||s.solution.phase!=='DOCKED'||!s.attempts.some(a=>equal(a.final,s.solution))))return null;
 if(['SOLUTION','EXPLANATION','REFLECTION','RESULTS'].includes(s.phase)&&!investigated(s))return null;
 if((s.crossed||['EXPLANATION','REFLECTION','RESULTS'].includes(s.phase))&&(!s.solution||s.model.phase!=='DOCKED'))return null;
 for(const e of s.explanations)if(!e||!Array.isArray(e.answers)||e.answers.length!==4||e.answers.some(n=>!Number.isInteger(n)||n<0||n>2)||!equal(e.correct,e.answers.map((n,i)=>n===BRIDGE_QUESTIONS[i].correct)))return null;
 if(['REFLECTION','RESULTS'].includes(s.phase)&&!s.explanations.at(-1)?.correct.every(Boolean))return null;
 if(['PROBLEM','OBSERVATION','PREDICTION'].includes(s.phase)&&(s.prediction!==null||s.observations.length||s.comparisons.length||s.attempts.length||s.explanations.length||s.solution||s.crossed))return null;
 return structuredClone(s);
 }catch{return null}}
export function readBridge():BridgeSession|null {try{const raw=localStorage.getItem(BRIDGE_KEY);return raw&&raw.length<2000000?validateBridge(JSON.parse(raw)):null}catch{return memory?structuredClone(memory):null}}
export function saveBridge(s:BridgeSession){const valid=validateBridge(s);if(!valid)return false;memory=valid;try{localStorage.setItem(BRIDGE_KEY,JSON.stringify(valid));if(s.phase==='RESULTS'){localStorage.setItem('electroquest.mission2.completed.v1','true')}return true}catch{return false}}
export function removeBridge(){memory=null;try{localStorage.removeItem(BRIDGE_KEY)}catch{}}
