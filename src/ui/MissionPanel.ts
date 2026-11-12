import {ARENA} from '../content/mission';
import {describeCharge,POLARIZATION_NOTE,totalCharge,type Panel,type Experiment,type ChargeObject} from '../physics/charges';
import {LESSON} from '../content/learning';
import {interactionFeedback,type LearningSession} from '../learning/session';
import {trapDialogTab} from './dialogFocus';
import {mountGameDialog} from './gameDialogs';
import {decorateUI,icon} from './UISkin';
interface Actions {transfer:(panel:Panel,action:'take'|'send')=>void;test:()=>void;reset:()=>void;observe:(panel:Panel)=>void;observation:(value:boolean)=>void}
export class MissionPanel {
  readonly controls:HTMLElement;
  private dialog:HTMLDialogElement;
  private abort=new AbortController();
  private nearby=false;
  private prompt:HTMLElement;
  private interact:HTMLButtonElement;
  private paused:HTMLElement;
  private route:HTMLElement;
  private interactionEnabled=false;
  private particles:{element:HTMLElement;from:ChargeObject;to:ChargeObject;age:number}[]=[];
  private lastRender='';
  private learningPhase:LearningSession['phase']='ORIENTATION';
  private reduced=false;
  setReduced(value:boolean){this.reduced=value;this.clearEffects()}
  constructor(private onModal:(open:boolean)=>void,actions:Actions,private electronPath:string){
    this.controls=document.createElement('div');this.controls.className='mission-controls';
    this.controls.innerHTML='<p id="interaction-prompt" role="status">Dekati terminal di sebelah kiri gerbang.</p><div class="touch-controls" role="group" aria-label="Kontrol Raka"><button data-direction="-1" aria-label="Berjalan ke kiri" aria-pressed="false">← <span>Kiri</span></button><button data-direction="1" aria-label="Berjalan ke kanan" aria-pressed="false">→ <span>Kanan</span></button><button data-interact disabled><span data-interact-label>Periksa terminal</span></button></div><p class="input-method"></p><p class="live-charges"></p><p class="experiment-status" role="status"></p><button class="reset-outside">Reset eksperimen</button><p class="pause-status" role="status" hidden>Permainan dijeda saat tab tidak aktif.</p>';
    document.querySelector('.game-stage')!.append(this.controls);
    this.prompt=this.controls.querySelector('#interaction-prompt')!;this.interact=this.controls.querySelector('[data-interact]')!;this.paused=this.controls.querySelector('.pause-status')!;
    this.dialog=document.createElement('dialog');this.dialog.className='inspection experiment';this.dialog.setAttribute('aria-labelledby','terminal-title');this.dialog.setAttribute('aria-describedby','terminal-purpose');
    this.dialog.innerHTML=`<p class="eyebrow">EKSPERIMEN GERBANG</p><h2 id="terminal-title">${ARENA.terminal.name}</h2><p id="terminal-purpose">Pindahkan elektron antara panel dan Charge Glove, lalu uji gerbang.</p><dl class="charge-readout">${(['left','right','glove'] as const).map((key,i)=>`<div><dt>${['Panel kiri','Panel kanan','Charge Glove'][i]}</dt><dd data-charge="${key}"></dd></div>`).join('')}</dl><div class="electron-route" aria-hidden="true"><span>Panel kiri</span><span>Panel kanan</span><span>Alat</span></div><p class="total-charge"></p><label class="panel-selector">Panel yang dituju<select aria-label="Panel yang dituju"><option value="left">Panel kiri</option><option value="right">Panel kanan</option></select></label><div class="transfer-actions"><button data-transfer="take">Ambil elektron</button><button data-transfer="send">Kirim elektron</button></div><p class="transfer-feedback" role="status"></p><p class="lock-status"></p><p class="neutral-note" hidden>${POLARIZATION_NOTE}</p><p class="charge-explainer">Nilai adalah satuan muatan bersih permainan, bukan jumlah elektron absolut dalam benda. Alat netral tetap mengandung elektron. Batas tiap objek: −8 sampai +8.</p><div class="experiment-actions"><button class="primary" data-test>Uji gerbang</button><button data-reset>Reset eksperimen</button><button data-close autofocus>Tutup</button></div><p class="dialog-hint">Escape juga menutup pemeriksaan.</p>`;
    this.route=this.dialog.querySelector('.electron-route')!;
    const observations=document.createElement('div');observations.className='initial-observation';observations.innerHTML=`<p>${LESSON.observation.locked}</p><p class="concept-note">${LESSON.observation.concept}</p><div class="observation-buttons"><button data-observe="left">Periksa panel kiri</button><button data-observe="right">Periksa panel kanan</button></div>`;this.dialog.querySelector('.total-charge')!.after(observations);
    const lock=document.createElement('p');lock.className='learning-lock';lock.textContent=LESSON.observation.gate;this.dialog.querySelector('.panel-selector')!.before(lock);
    const mode=document.createElement('label');mode.className='observation-mode';mode.innerHTML=`<input type="checkbox" data-observation checked> ${LESSON.experiment.observe}`;this.controls.append(mode);const legend=document.createElement('p');legend.className='observation-legend';legend.textContent=LESSON.experiment.units;this.controls.append(legend);
    this.dialog.append(mode,legend);
    mountGameDialog(this.dialog);const options={signal:this.abort.signal};
    this.dialog.querySelector('[data-close]')!.addEventListener('click',()=>this.close(),options);
    this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.close()},options);
    this.dialog.addEventListener('keydown',e=>{trapDialogTab(this.dialog,e);if(e.repeat&&['Enter',' '].includes(e.key))e.preventDefault()},options);
    for(const button of this.dialog.querySelectorAll<HTMLButtonElement>('[data-transfer]'))button.addEventListener('click',()=>actions.transfer(this.selected,button.dataset.transfer as 'take'|'send'),options);
    this.dialog.querySelector('[data-test]')!.addEventListener('click',actions.test,options);
    this.dialog.querySelector('[data-reset]')!.addEventListener('click',actions.reset,options);
    this.controls.querySelector('.reset-outside')!.addEventListener('click',actions.reset,options);
    for(const button of observations.querySelectorAll<HTMLButtonElement>('[data-observe]'))button.addEventListener('click',()=>actions.observe(button.dataset.observe as Panel),options);
    mode.querySelector('input')!.addEventListener('change',e=>{const value=(e.target as HTMLInputElement).checked;this.route.hidden=!value;legend.hidden=!value;actions.observation(value)},options);
    decorateUI(this.controls);decorateUI(this.dialog);
  }
  private get selected(){return this.dialog.querySelector<HTMLSelectElement>('select')!.value as Panel}
  render(state:Experiment){
    const signature=JSON.stringify([state.charges,state.phase,state.message,this.nearby,this.learningPhase]);if(signature===this.lastRender)return;this.lastRender=signature;
    for(const key of ['left','right','glove'] as const){const q=describeCharge(state.charges[key]),dd=this.dialog.querySelector<HTMLElement>(`[data-charge="${key}"]`)!;dd.textContent=`${q.text} ${q.polarity}`;dd.style.color=q.color}
    this.dialog.querySelector('.total-charge')!.textContent=`Total muatan sistem: ${totalCharge(state)}`;
    this.controls.querySelector('.live-charges')!.textContent=`Kiri ${describeCharge(state.charges.left).text} · Kanan ${describeCharge(state.charges.right).text} · Alat ${describeCharge(state.charges.glove).text} · Total ${totalCharge(state)}`;
    this.controls.querySelector('.experiment-status')!.textContent=state.phase==='CONFIGURING'?state.message:`${interactionFeedback(state)} ${state.phase==='UNSUCCESSFUL'?state.message:state.phase==='OPENED'&&this.learningPhase==='EXPLANATION'?LESSON.explanation.intro:''}`;
    this.controls.dataset.phase=state.phase;
    this.dialog.querySelector('.lock-status')!.textContent=state.phase==='CONFIGURING'?'Gerbang masih ditahan mekanisme pengunci; perubahan muatan belum menggerakkan panel.':state.message;
    this.dialog.querySelector<HTMLElement>('.neutral-note')!.hidden=state.charges.left!==0&&state.charges.right!==0;
    for(const el of this.dialog.querySelectorAll<HTMLButtonElement|HTMLSelectElement>('[data-transfer],[data-test],select'))el.disabled=state.phase!=='CONFIGURING'||this.learningPhase!=='EXPERIMENT';
    this.interact.disabled=!this.interactionEnabled||state.phase==='SIMULATING';
  }
  setLearning(s:LearningSession){this.learningPhase=s.phase;this.dialog.querySelector<HTMLElement>('.initial-observation')!.hidden=s.phase!=='OBSERVATION';this.dialog.querySelector<HTMLElement>('.learning-lock')!.hidden=!!s.initialPrediction;for(const button of this.dialog.querySelectorAll<HTMLButtonElement>('[data-observe]')){const observed=s.observed[button.dataset.observe as Panel];button.setAttribute('aria-pressed',String(observed));button.textContent=`${observed?'✓ ':''}Periksa panel ${button.dataset.observe==='left'?'kiri':'kanan'}`}decorateUI(this.dialog)}
  feedback(message:string){const el=this.dialog.querySelector('.transfer-feedback')!;el.textContent=message;if(message)icon(el,message.includes('ditolak')?'icon-warning':'icon-info')}
  setNearby(value:boolean,mode:'terminal'|'exit-locked'|'exit-open'|'none'='terminal'){
    this.nearby=mode==='terminal'&&value;
    this.interactionEnabled=value&&mode!=='exit-locked'&&mode!=='none';
    const label=this.controls.querySelector<HTMLElement>('[data-interact-label]')!;
    label.textContent=mode==='exit-open'?'Lanjut ke Misi 2':mode==='exit-locked'?'Misi 1 belum selesai':'Periksa terminal';
    this.interact.disabled=!this.interactionEnabled;
    this.prompt.textContent=!value?'':mode==='terminal'?'E — Periksa terminal':mode==='exit-open'?'E — Lanjut ke Misi 2':'Selesaikan pembelajaran untuk membuka pintu keluar.';
    this.prompt.dataset.nearby=String(value&&mode!=='exit-locked');
  }
  setPaused(value:boolean){this.paused.hidden=!value}
  open(){if(!this.nearby||this.dialog.open)return;this.onModal(true);this.dialog.showModal();this.dialog.querySelector<HTMLButtonElement>('[data-close]')!.focus({preventScroll:true})}
  close(){if(!this.dialog.open)return;this.dialog.close();this.onModal(false);if(!document.querySelector('.game-stage dialog[open]'))this.interact.focus({preventScroll:true})}
  get lessonHost(){return this.dialog}
  get observationInput(){return this.dialog.querySelector<HTMLInputElement>('[data-observation]')!}
  showElectron(from:ChargeObject,to:ChargeObject){if(this.particles.length>=(this.reduced?2:8))this.particles.shift()!.element.remove();const element=document.createElement('img');element.setAttribute('src',this.electronPath);element.className='transfer-electron';element.alt='';this.route.append(element);this.particles.push({element,from,to,age:0})}
  updateEffects(dt:number){const x={left:1/6,right:1/2,glove:5/6};this.particles=this.particles.filter(p=>{p.age+=dt;const t=Math.min(1,p.age/(this.reduced?.25:.6));p.element.style.left=`${(x[p.from]+(x[p.to]-x[p.from])*t)*100}%`;p.element.style.top=`${22-(this.reduced?0:Math.sin(t*Math.PI)*14)}px`;if(t>=1){p.element.remove();return false}return true})}
  clearEffects(){for(const p of this.particles)p.element.remove();this.particles=[];this.feedback('')}
  get isOpen(){return this.dialog.open}
  destroy(){this.abort.abort();this.clearEffects();if(this.dialog.open)this.dialog.close();this.dialog.remove();this.controls.remove()}
}
