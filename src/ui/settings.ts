export interface Settings {largeText:boolean;highContrast:boolean;touchControls:boolean;reducedEffects:boolean;master:number;effects:number;music:number;mute:boolean}
const key='electroquest.settings.v2';
let memory:Settings|undefined;
const volume=(v:unknown,fallback:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1?v:fallback;
export function defaults():Settings{return {largeText:false,highContrast:false,touchControls:true,reducedEffects:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches,master:.6,effects:.65,music:.45,mute:false}}
export function readSettings():Settings {
  if(memory)return {...memory};const base=defaults();
  try{const raw=localStorage.getItem(key),stored=raw?JSON.parse(raw):null;const v=stored?.version===2?stored.settings:JSON.parse(localStorage.getItem('electroquest.settings.v1')||'{}');if(!v||typeof v!=='object')return base;return {...base,largeText:v.largeText===true,highContrast:v.highContrast===true,touchControls:typeof v.touchControls==='boolean'?v.touchControls:base.touchControls,reducedEffects:typeof v.reducedEffects==='boolean'?v.reducedEffects:base.reducedEffects,master:volume(v.master,base.master),effects:volume(v.effects,base.effects),music:volume(v.music,base.music),mute:v.mute===true}}catch{return base}
}
export function applySettings(s:Settings){document.documentElement.classList.toggle('large-text',s.largeText);document.documentElement.classList.toggle('high-contrast',s.highContrast);document.documentElement.classList.toggle('hide-touch',!s.touchControls);document.documentElement.classList.toggle('reduced-effects',s.reducedEffects)}
export function saveSettings(s:Settings):boolean {memory={...s};applySettings(s);window.dispatchEvent(new Event('electroquest-settings'));try{localStorage.setItem(key,JSON.stringify({version:2,settings:s}));return true}catch{return false}}
