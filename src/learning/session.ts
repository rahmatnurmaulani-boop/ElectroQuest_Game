import {LESSON} from '../content/learning';
import type {Experiment,Panel,ChargeObject} from '../physics/charges';
export type LearningPhase=keyof typeof LESSON.phases;
export interface Prediction {choices:string[];reason:string}
export type Answers=Record<'A'|'B'|'C',string>;
export interface TransferRecord {panel:Panel;action:'take'|'send';source:ChargeObject;target:ChargeObject;before:Experiment['charges'];after:Experiment['charges']}
export interface Attempt {id:number;charges:Experiment['charges'];transfers:TransferRecord[];hints:number[];result:'RUNNING'|'OPENED'|'UNSUCCESSFUL'|'CANCELLED';final:Experiment|null}
export interface LearningSession {schemaVersion:1;phase:LearningPhase;observed:{terminal:boolean;left:boolean;right:boolean};observation:Experiment|null;initialPrediction:Prediction|null;predictionRevisions:Prediction[];transfers:TransferRecord[];attempts:Attempt[];activeAttempt:number|null;hints:number[];success:{attemptId:number;charges:Experiment['charges']}|null;explanations:{kind:'INITIAL'|'REVISION';answers:Answers;correct:Record<'A'|'B'|'C',boolean>}[];reflection:{comparison:string;next:string}|null}
const clone=<T>(value:T):T=>structuredClone(value);
export function createLearning():LearningSession{return {schemaVersion:1,phase:'ORIENTATION',observed:{terminal:false,left:false,right:false},observation:null,initialPrediction:null,predictionRevisions:[],transfers:[],attempts:[],activeAttempt:null,hints:[],success:null,explanations:[],reflection:null}}
export function orient(s:LearningSession):LearningSession{return s.phase==='ORIENTATION'?{...s,phase:'OBSERVATION'}:s}
export function observe(s:LearningSession,object:'terminal'|Panel,model:Experiment):LearningSession {if(s.phase!=='OBSERVATION')return s;return {...s,observed:{...s.observed,[object]:true},observation:clone(model)}}
export function canPredict(s:LearningSession){return Object.values(s.observed).every(Boolean)}
export function gradePrediction(p:Prediction){const choices=new Set(p.choices);return {directions:choices.size===LESSON.prediction.correct.length&&LESSON.prediction.correct.every(c=>choices.has(c)),reason:p.reason===LESSON.prediction.correctReason}}
export function predict(s:LearningSession):LearningSession{return s.phase==='OBSERVATION'&&canPredict(s)?{...s,phase:'PREDICTION'}:s}
export function savePrediction(s:LearningSession,p:Prediction):LearningSession {
  if(!['PREDICTION','EXPERIMENT'].includes(s.phase)||!p.choices.length||p.choices.some(c=>!LESSON.prediction.choices.some(x=>x.id===c))||!LESSON.prediction.reasons.some(x=>x.id===p.reason))return s;
  const saved={choices:[...new Set(p.choices)].sort(),reason:p.reason};
  if(s.phase==='PREDICTION'&&!s.initialPrediction)return {...s,phase:'EXPERIMENT',initialPrediction:saved};
  return s.phase==='EXPERIMENT'?{...s,predictionRevisions:[...s.predictionRevisions,saved]}:s;
}
export function addTransfer(s:LearningSession,record:TransferRecord):LearningSession{return s.phase==='EXPERIMENT'&&s.initialPrediction&&s.activeAttempt===null?{...s,transfers:[...s.transfers,clone(record)]}:s}
export function startAttempt(s:LearningSession,model:Experiment):LearningSession {
  if(s.phase!=='EXPERIMENT'||!s.initialPrediction||s.activeAttempt!==null||model.phase!=='CONFIGURING')return s;
  const id=s.attempts.length+1;return {...s,activeAttempt:id,attempts:[...s.attempts,{id,charges:clone(model.charges),transfers:clone(s.transfers),hints:[...s.hints],result:'RUNNING',final:null}]};
}
export function finishAttempt(s:LearningSession,model:Experiment):LearningSession {
  if(s.activeAttempt===null||!['OPENED','UNSUCCESSFUL'].includes(model.phase))return s;
  const success=model.phase==='OPENED';return {...s,activeAttempt:null,phase:success?'EXPLANATION':'EXPERIMENT',success:success?{attemptId:s.activeAttempt,charges:clone(model.charges)}:s.success,attempts:s.attempts.map(a=>a.id===s.activeAttempt?{...a,result:success?'OPENED':'UNSUCCESSFUL',final:clone(model),hints:[...s.hints]}:a)};
}
export function resetLearningExperiment(s:LearningSession):LearningSession{return {...s,phase:s.initialPrediction?'EXPERIMENT':s.phase,activeAttempt:null,transfers:[],attempts:s.attempts.map(a=>a.id===s.activeAttempt?{...a,result:'CANCELLED',hints:[...s.hints]}:a)}}
export function requestHint(s:LearningSession):LearningSession{return s.phase==='EXPERIMENT'&&s.hints.length<LESSON.hints.length?{...s,hints:[...s.hints,s.hints.length+1]}:s}
export function explain(s:LearningSession,answers:Answers):LearningSession {
  if(s.phase!=='EXPLANATION'||!s.success||LESSON.questions.some(q=>!q.options.some(o=>o.id===answers[q.id])))return s;
  const correct=Object.fromEntries(LESSON.questions.map(q=>[q.id,answers[q.id]===q.correct])) as Record<'A'|'B'|'C',boolean>;
  return {...s,phase:Object.values(correct).every(Boolean)?'REFLECTION':'EXPLANATION',explanations:[...s.explanations,{kind:s.explanations.length?'REVISION':'INITIAL',answers:clone(answers),correct}]};
}
export function reflect(s:LearningSession,comparison:string,next:string):LearningSession{return s.phase==='REFLECTION'?{...s,phase:'RESULTS',reflection:{comparison:comparison.slice(0,2000),next:next.slice(0,2000)}}:s}
export function interactionFeedback(model:Experiment){if(model.phase==='OPENED')return LESSON.feedback.opened;if(!model.charges.left||!model.charges.right)return LESSON.feedback.neutral;return model.charges.left*model.charges.right<0?LESSON.feedback.attract:LESSON.feedback.repel}
