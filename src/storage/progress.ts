import {PUZZLE} from '../content/mission';
import {LESSON} from '../content/learning';
import type {Experiment} from '../physics/charges';
import type {LearningSession} from '../learning/session';
export interface Checkpoint {version:1;learning:LearningSession;experiment:Experiment;player:{x:number;y:number};observationMode:boolean}
export const PROGRESS_KEY='electroquest.progress.v1';
let epoch=0;
export const progressEpoch=()=>epoch;
const object=(v:unknown):v is Record<string,any>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const finite=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const text=(v:unknown,max=2000)=>typeof v==='string'&&v.length<=max;
const array=(v:unknown,max=500):v is any[]=>Array.isArray(v)&&v.length<=max;
function charges(v:unknown):boolean {return object(v)&&['left','right','glove'].every(k=>Number.isInteger(v[k])&&Math.abs(v[k])<=8)&&v.left+v.right+v.glove===0}
const equal=(a:Record<string,number>,b:Record<string,number>)=>['left','right','glove'].every(k=>a[k]===b[k]);
function experiment(v:unknown):v is Experiment {
  if(!object(v)||!charges(v.charges)||!['CONFIGURING','OPENED','UNSUCCESSFUL'].includes(v.phase)||!finite(v.left,224,288)||!finite(v.right,352,416)||v.right-v.left<64||v.vLeft!==0||v.vRight!==0||!finite(v.elapsed,0,9)||typeof v.repelled!=='boolean'||v.locked!==true||!text(v.message))return false;
  if(v.phase==='CONFIGURING'&&(v.left!==288||v.right!==352||v.elapsed!==0||v.repelled))return false;
  if(v.phase==='OPENED'&&(v.left!==224||v.right!==416||!v.repelled||v.charges.left*v.charges.right<=0))return false;
  return true;
}
function prediction(v:unknown){return object(v)&&array(v.choices,3)&&v.choices.length>0&&new Set(v.choices).size===v.choices.length&&v.choices.every(c=>['A','B','C'].includes(c))&&['repel','attract'].includes(v.reason)}
function hints(v:unknown,max=3){return array(v,3)&&v.every((n,i)=>n===i+1)&&v.length<=max}
function transfers(v:unknown,target:Record<string,number>){
  if(!array(v,2000))return false;let current:Record<string,number>={...PUZZLE.initial};
  for(const t of v){if(!object(t)||!['left','right'].includes(t.panel)||!['take','send'].includes(t.action)||!charges(t.before)||!charges(t.after)||!equal(t.before,current))return false;const source=t.action==='take'?t.panel:'glove',recipient=t.action==='take'?'glove':t.panel;if(t.source!==source||t.target!==recipient)return false;const next={...current,[source]:current[source]+1,[recipient]:current[recipient]-1};if(!equal(next,t.after))return false;current=t.after}
  return equal(current,target);
}
export function validateCheckpoint(value:unknown):Checkpoint|null {
  try{
    if(!object(value)||value.version!==1||!experiment(value.experiment)||!object(value.player)||!finite(value.player.x,32,608)||value.player.y!==328||typeof value.observationMode!=='boolean')return null;
    const e=value.experiment,s=value.learning;
    if(e.phase!=='OPENED'&&value.player.x>244)return null;
    if(!object(s)||s.schemaVersion!==1||typeof s.phase!=='string'||!Object.hasOwn(LESSON.phases,s.phase)||!object(s.observed)||!['terminal','left','right'].every(k=>typeof s.observed[k]==='boolean')||s.activeAttempt!==null||!hints(s.hints))return null;
    if((s.observed.left||s.observed.right)&&!s.observed.terminal)return null;
    if(s.observation!==null&&(!experiment(s.observation)||s.observation.phase!=='CONFIGURING'||!equal(s.observation.charges,PUZZLE.initial)))return null;
    if(s.phase==='ORIENTATION'&&(s.observation!==null||Object.values(s.observed).some(Boolean)))return null;
    if(Object.values(s.observed).some(Boolean)&&s.observation===null)return null;
    const advanced=['EXPERIMENT','EXPLANATION','REFLECTION','RESULTS'].includes(s.phase);
    if(advanced?!prediction(s.initialPrediction):s.initialPrediction!==null)return null;
    if((s.phase==='PREDICTION'||advanced)&&!Object.values(s.observed).every(Boolean))return null;
    if(!array(s.predictionRevisions,100)||!s.predictionRevisions.every(prediction)||!transfers(s.transfers,e.charges)||!array(s.attempts))return null;
    for(let i=0;i<s.attempts.length;i++){
      const a=s.attempts[i];if(!object(a)||a.id!==i+1||!charges(a.charges)||!transfers(a.transfers,a.charges)||!hints(a.hints,s.hints.length)||!['OPENED','UNSUCCESSFUL','CANCELLED'].includes(a.result))return null;
      if(a.result==='CANCELLED'){if(a.final!==null)return null}else if(!experiment(a.final)||a.final.phase!==a.result||!equal(a.final.charges,a.charges))return null;
    }
    if(s.success!==null){if(!object(s.success)||!charges(s.success.charges)||!s.attempts.some(a=>a.id===s.success.attemptId&&a.result==='OPENED'&&equal(a.charges,s.success.charges)))return null}
    if(e.phase==='OPENED'&&(!s.success||!equal(s.success.charges,e.charges)))return null;
    if(['EXPLANATION','REFLECTION','RESULTS'].includes(s.phase)&&(e.phase!=='OPENED'||s.success===null))return null;
    if(!array(s.explanations,100))return null;
    if((s.explanations.length||s.reflection!==null)&&s.success===null)return null;
    for(let i=0;i<s.explanations.length;i++){const a=s.explanations[i];if(!object(a)||a.kind!==(i===0?'INITIAL':'REVISION')||!object(a.answers)||!object(a.correct)||LESSON.questions.some(q=>!q.options.some(o=>o.id===a.answers[q.id])||a.correct[q.id] !== (a.answers[q.id]===q.correct)))return null}
    if(['REFLECTION','RESULTS'].includes(s.phase)&&(!s.explanations.length||!Object.values(s.explanations.at(-1).correct).every(v=>v===true)))return null;
    if(s.reflection!==null&&(!object(s.reflection)||!text(s.reflection.comparison)||!text(s.reflection.next)))return null;
    if(s.phase==='RESULTS'&&s.reflection===null)return null;
    if(!advanced&&(e.phase!=='CONFIGURING'||!equal(e.charges,PUZZLE.initial)||s.attempts.length||s.transfers.length||s.hints.length||s.explanations.length||s.success!==null||s.reflection!==null||s.predictionRevisions.length))return null;
    return structuredClone(value) as Checkpoint;
  }catch{return null}
}
export function makeCheckpoint(learning:LearningSession,model:Experiment,x:number,observationMode:boolean):Checkpoint|null {return validateCheckpoint({version:1,learning,experiment:model,player:{x,y:328},observationMode})}
export function readProgress():{checkpoint:Checkpoint|null;status:'ok'|'empty'|'invalid'|'unavailable'} {try{const raw=localStorage.getItem(PROGRESS_KEY);if(!raw)return {checkpoint:null,status:'empty'};if(raw.length>2000000)return {checkpoint:null,status:'invalid'};let value:unknown;try{value=JSON.parse(raw)}catch{return {checkpoint:null,status:'invalid'}}const checkpoint=validateCheckpoint(value);return {checkpoint,status:checkpoint?'ok':'invalid'}}catch{return {checkpoint:null,status:'unavailable'}}}
export function writeProgress(checkpoint:Checkpoint){try{const raw=JSON.stringify(checkpoint);if(raw.length>2000000)return false;localStorage.setItem(PROGRESS_KEY,raw);if(checkpoint.learning.phase==='RESULTS')localStorage.setItem('electroquest.mission1.completed.v1','true');return true}catch{return false}}
export function clearProgress(notify=true){try{localStorage.removeItem(PROGRESS_KEY);localStorage.removeItem('electroquest.mission2.v1');localStorage.removeItem('electroquest.mission1.completed.v1');epoch++;if(notify)window.dispatchEvent(new Event('electroquest-progress-cleared'));return true}catch{return false}}
