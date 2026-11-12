import {missionResult} from './MissionResult';
import {openMissionPicker} from './navigation';
import {LESSON} from '../content/learning';
import {canPredict,gradePrediction,type LearningSession,type Prediction,type Answers} from '../learning/session';
import {describeCharge} from '../physics/charges';
import {mountGameDialog,focusDialog} from './gameDialogs';
import {trapDialogTab} from './dialogFocus';
import {decorateUI,speaker,icon} from './UISkin';
interface Actions {next:()=>void;predict:()=>void;observe:(panel:'left'|'right')=>void;save:(prediction:Prediction,revision:boolean)=>void;hint:()=>void;explain:(answers:Answers)=>void;reflect:(comparison:string,next:string)=>void;restart:()=>void;menu:()=>void;nextMission:()=>void;pause:()=>void;modal:(open:boolean)=>void;beforeModal:()=>void}
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const choiceLabel=(id:string)=>LESSON.prediction.choices.find(c=>c.id===id)?.label??id;
const answerLabel=(id:string,key:string)=>LESSON.questions.find(q=>q.id===id)?.options.find(o=>o.id===key)?.label??key;
export class LearningPanel {
  private root:HTMLElement;
  private signature='';
  private revisit=false;
  private revision=false;
  private dialog=document.createElement('dialog');
  private suspended=false;
  private session?:LearningSession;
  constructor(private actions:Actions,private terminal:HTMLElement){
    this.root=document.createElement('section');this.root.className='learning-panel';this.root.setAttribute('aria-label','Alur pembelajaran');
    this.dialog.className='learning-dialog inspection';this.dialog.setAttribute('aria-label','Dialog pembelajaran');mountGameDialog(this.dialog);
    this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.actions.pause()});
    this.dialog.addEventListener('keydown',e=>trapDialogTab(this.dialog,e));
    this.root.addEventListener('keydown',e=>{if(e.repeat&&['Enter',' '].includes(e.key)&&!(e.target instanceof HTMLTextAreaElement))e.preventDefault()});
  }
  render(s:LearningSession){
    this.session=s;
    // Pending transfers are logged in the model, but do not repeat lesson copy.
    const signature=JSON.stringify({...s,transfers:[]})+this.revisit+this.revision;if(signature===this.signature)return;const oldPhase=this.root.dataset.learningPhase;const active=document.activeElement;const fromForm=active instanceof HTMLElement&&this.root.contains(active)&&!!active.closest('form');const fromHint=active instanceof HTMLElement&&active.hasAttribute('data-hint');const fromObservation=active instanceof HTMLElement&&active.dataset.observe;this.signature=signature;
    this.root.dataset.learningPhase=s.phase;
    const back=document.querySelector<HTMLElement>('.back-button');if(back)back.hidden=s.phase==='RESULTS';
    let body='';
    const orientation=`<blockquote><strong>${LESSON.orientation.speaker}</strong><p>${LESSON.orientation.dialog}</p></blockquote><p>${LESSON.orientation.goal}</p>`;
    if(s.phase==='ORIENTATION')body=orientation+'<button data-next class="primary">Lanjut</button>';
    if(s.phase==='OBSERVATION')body=`<p>${LESSON.observation.instruction}</p><ul>${(['terminal','left','right'] as const).map((k,i)=>`<li>${s.observed[k]?'✓':'○'} ${['Terminal diperiksa','Panel kiri diperiksa','Panel kanan diperiksa'][i]}</li>`).join('')}</ul><div class="observation-buttons">${(['left','right'] as const).map(k=>`<button data-observe="${k}" aria-pressed="${s.observed[k]}" ${s.observed[k]?'disabled':''}>Periksa panel ${k==='left'?'kiri':'kanan'}</button>`).join('')}</div><p class="concept-note">${LESSON.observation.concept}</p><button data-predict class="primary" ${canPredict(s)?'':'disabled'}>Buat prediksi</button>`;
    if(s.phase==='PREDICTION'||s.phase==='EXPERIMENT'&&this.revision){
      const saved=this.revision?(s.predictionRevisions.at(-1)??s.initialPrediction):null;
      body=`<form data-prediction><fieldset><legend>${LESSON.prediction.question}</legend><p>${LESSON.prediction.multiple}</p>${LESSON.prediction.choices.map(c=>`<label class="answer-option"><input type="checkbox" name="prediction" value="${c.id}" ${saved?.choices.includes(c.id)?'checked':''}> ${c.id}. ${c.label}</label>`).join('')}</fieldset><fieldset><legend>${LESSON.prediction.reason}</legend>${LESSON.prediction.reasons.map(c=>`<label class="answer-option"><input type="radio" name="reason" value="${c.id}" ${saved?.reason===c.id?'checked':''} required> ${c.label}</label>`).join('')}</fieldset><p>${LESSON.prediction.distinction}</p><p class="form-error" role="alert"></p><button type="submit" class="primary">${this.revision?'Simpan revisi':'Simpan prediksi'}</button></form>`;
    }else if(s.phase==='EXPERIMENT')body=`<p role="status">${LESSON.prediction.saved}</p><p>${LESSON.experiment.instruction}</p><button data-revision>Tinjau / revisi prediksi</button><button data-hint ${s.hints.length>=LESSON.hints.length?'disabled':''}>Bantuan (${s.hints.length}/${LESSON.hints.length})</button>${s.hints.length?`<p class="concept-note">${LESSON.hints[s.hints.length-1]}</p>`:''}<p class="process-count">${s.attempts.length} percobaan dicatat · ${s.attempts.filter(a=>a.result==='CANCELLED').length} dibatalkan</p>`;
    if(s.phase==='EXPLANATION'){
      const latest=s.explanations.at(-1);
      body=`<p>${LESSON.explanation.intro}</p>${latest?`<p role="status">${LESSON.explanation.revise}</p>`:''}<form data-explanation>${LESSON.questions.map(q=>`<fieldset><legend>${q.id}. ${q.prompt}</legend>${q.options.map(o=>`<label class="answer-option"><input type="radio" name="${q.id}" value="${o.id}" ${latest?.answers[q.id]===o.id?'checked':''} required> ${o.label}</label>`).join('')}${latest?`<p class="concept-note">${latest.correct[q.id]?LESSON.explanation.matched:LESSON.explanation.review} ${q.feedback}</p>`:''}</fieldset>`).join('')}<p class="form-error" role="alert"></p><button type="submit" class="primary">Kirim penjelasan</button></form>`;
    }
    if(s.phase==='REFLECTION')body=`<p role="status">${LESSON.explanation.accepted}</p><p>${LESSON.reflection.notice}</p><form data-reflection>${LESSON.reflection.questions.map((q,i)=>`<label class="reflection-field">${q}<textarea name="${i===0?'comparison':'next'}" maxlength="2000" rows="3"></textarea></label>`).join('')}<button type="submit" class="primary">Lihat hasil</button></form>`;
    if(s.phase==='RESULTS'){
      const first=s.explanations[0],last=s.explanations.at(-1)!;
      body=`<p>${LESSON.results.intro}</p><h3>${LESSON.results.initial}</h3><p>${s.initialPrediction?.choices.map(choiceLabel).join(' ')} Alasan: ${LESSON.prediction.reasons.find(r=>r.id===s.initialPrediction?.reason)?.label}</p><p data-prediction-key></p><h3>${LESSON.results.success}</h3><p>Percobaan #${s.success!.attemptId} · Kiri ${describeCharge(s.success!.charges.left).text}, kanan ${describeCharge(s.success!.charges.right).text}, alat ${describeCharge(s.success!.charges.glove).text}.</p><h3>${LESSON.results.understanding}</h3><ul>${LESSON.questions.map(q=>`<li>${q.prompt} <strong>${last.correct[q.id]?LESSON.results.correct:LESSON.results.review}</strong></li>`).join('')}</ul><h3>${LESSON.results.changes}</h3>${LESSON.questions.map(q=>`<p>${q.id}. Awal: ${answerLabel(q.id,first.answers[q.id])}<br>Terakhir: ${answerLabel(q.id,last.answers[q.id])}</p>`).join('')}<p>${s.predictionRevisions.length} revisi prediksi · ${Math.max(0,s.explanations.length-1)} revisi penjelasan.</p><h3>${LESSON.results.process}</h3><p>${s.attempts.length} percobaan, ${s.attempts.filter(a=>a.result==='CANCELLED').length} dibatalkan. Tingkat bantuan: ${s.hints.length}/3. ${LESSON.results.processNotice}</p><h3>${LESSON.results.reflection}</h3><p class="student-reflection"></p><p>${LESSON.results.ungraded}</p><details><summary>Lihat riwayat</summary><div class="attempt-history"></div></details><details><summary>Baca kesimpulan konsep</summary><p>${LESSON.results.conclusion}</p></details>`;
    }
    if(s.phase==='RESULTS')body=missionResult({mission:1,title:'Gerbang Muatan terbuka',description:'Raka dan Ion memulihkan jalur laboratorium. Kedua panel ditahan oleh kait mekanis.',stats:[{value:s.success?'Terbuka':'Belum',label:'Gerbang'},{value:Object.values(s.explanations.at(-1)!.correct).filter(Boolean).length+'/3',label:'Jawaban konsep benar'},{value:Math.max(0,s.explanations.length-1),label:'Revisi penjelasan'}],summary:body});
    this.root.innerHTML=`<p class="eyebrow">ALUR BELAJAR · ${LESSON.phases[s.phase]}</p><h2 class="learning-heading" tabindex="-1">${s.phase==='ORIENTATION'?'Ion · '+LESSON.phases[s.phase]:LESSON.phases[s.phase]}</h2>${body}<div class="lesson-tools"><button data-reread>${this.revisit?'Tutup bacaan':'Baca kembali'}</button>${s.phase!=='ORIENTATION'?'<button data-restart>Ulang misi</button>':''}${s.phase==='RESULTS'?'<button data-menu>Kembali ke Beranda</button>':''}<button data-lesson-pause>Menu pause</button></div><div data-reread-copy ${this.revisit?'':'hidden'}>${orientation}</div>`;
    const action=(selector:string,callback:()=>void)=>this.root.querySelector(selector)?.addEventListener('click',callback);
    action('[data-next]',this.actions.next);action('[data-predict]',this.actions.predict);action('[data-observe="left"]',()=>this.actions.observe('left'));action('[data-observe="right"]',()=>this.actions.observe('right'));action('[data-hint]',this.actions.hint);action('[data-restart]',this.actions.restart);
    action('[data-menu]',this.actions.menu);
    if(s.phase==='RESULTS'){const tools=this.root.querySelector<HTMLElement>('.lesson-tools')!;const next=document.createElement('button');next.className='primary';next.textContent='Lanjut ke Misi 2';next.addEventListener('click',this.actions.nextMission);tools.prepend(next);const choose=document.createElement('button');choose.textContent='Pilih misi';choose.addEventListener('click',()=>openMissionPicker(this.actions.menu));tools.append(choose)}
    action('[data-lesson-pause]',this.actions.pause);
    if(s.phase==='RESULTS'){const close=document.createElement('button');close.textContent='Kembali ke arena';close.addEventListener('click',()=>{this.suspend();document.querySelector<HTMLElement>('.game-stage')!.focus({preventScroll:true})});this.root.querySelector('.lesson-tools')!.append(close)}
    action('[data-reread]',()=>{this.revisit=!this.revisit;this.root.querySelector<HTMLElement>('[data-reread-copy]')!.hidden=!this.revisit;this.root.querySelector('[data-reread]')!.textContent=this.revisit?'Tutup bacaan':'Baca kembali'});action('[data-revision]',()=>{this.revision=true;this.render(s)});
    this.bindForm('[data-prediction]',form=>{const data=new FormData(form),choices=data.getAll('prediction').map(String),reason=String(data.get('reason')??'');if(!choices.length||!reason)return LESSON.errors.prediction;const revision=this.revision;this.revision=false;this.actions.save({choices,reason},revision)});
    this.bindForm('[data-explanation]',form=>{const data=new FormData(form),answers={A:String(data.get('A')??''),B:String(data.get('B')??''),C:String(data.get('C')??'')};if(Object.values(answers).some(v=>!v))return LESSON.errors.explanation;this.actions.explain(answers)});
    this.bindForm('[data-reflection]',form=>{const data=new FormData(form);this.actions.reflect(String(data.get('comparison')??''),String(data.get('next')??''))});
    if(s.phase==='RESULTS'){const grade=gradePrediction(s.initialPrediction!);this.root.querySelector('[data-prediction-key]')!.textContent=`${LESSON.results.predictionKey} ${LESSON.results.predictionDirections}: ${grade.directions?LESSON.results.correct:LESSON.results.review}. ${LESSON.results.predictionReason}: ${grade.reason?LESSON.results.correct:LESSON.results.review}.`;this.root.querySelector('.student-reflection')!.textContent=LESSON.reflection.questions.map((q,i)=>`${q}\n${(i===0?s.reflection?.comparison:s.reflection?.next)||LESSON.results.empty}`).join('\n\n');this.renderHistory(s)}
    if(!['OBSERVATION','EXPERIMENT','RESULTS'].includes(s.phase)||this.revision)speaker(this.root,s.phase==='REFLECTION'?'Raka':'Ion');
    if(s.phase==='RESULTS')icon(this.root.querySelector('h2')!,'icon-success');
    if(s.phase==='RESULTS'){const tools=this.root.querySelector<HTMLElement>('.lesson-tools')!;tools.classList.add('result-actions');this.root.querySelector('.mission-result')!.append(tools)}
    decorateUI(this.root);
    this.present();
    if(oldPhase&&(oldPhase!==s.phase||fromForm))(this.root.querySelector<HTMLElement>('.mission-result h2')??this.root.querySelector<HTMLElement>('h2'))!.focus({preventScroll:true});
    else if(fromObservation){(this.root.querySelector<HTMLButtonElement>('[data-observe]:not(:disabled)')??this.root.querySelector<HTMLElement>('h2'))?.focus({preventScroll:true})}
    else if(fromHint){const hint=this.root.querySelector<HTMLButtonElement>('[data-hint]');(hint&&!hint.disabled?hint:this.root.querySelector<HTMLElement>('h2'))?.focus({preventScroll:true})}
  }
  private present(){
    const s=this.session;if(!s)return;
    const modal=!['OBSERVATION','EXPERIMENT'].includes(s.phase)||this.revision||s.phase==='OBSERVATION'&&s.observed.terminal;
    const objective=document.querySelector('#active-objective');if(objective)objective.textContent=({ORIENTATION:'Dengarkan pengarahan Ion.',OBSERVATION:'Periksa kedua panel di terminal.',PREDICTION:'Simpan prediksi dan alasanmu.',EXPERIMENT:'Atur muatan, lalu uji gerbang.',EXPLANATION:'Jelaskan hasil eksperimen.',REFLECTION:'Catat refleksi percobaanmu.',RESULTS:'Misi selesai. Ke pintu keluar di kanan dan tekan E untuk melanjutkan ke Misi 2.'} as Record<string,string>)[s.phase];
    this.dialog.dataset.phase=s.phase;
    if(modal){
      this.dialog.append(this.root);
      if(!this.suspended&&!this.dialog.open){this.actions.beforeModal();this.actions.modal(true);this.dialog.showModal();focusDialog(this.dialog)}
    }else{
      if(this.dialog.open){this.dialog.close();this.actions.modal(false)}
      this.terminal.append(this.root);
    }
  }
  suspend(){this.suspended=true;if(this.dialog.open){this.dialog.close();this.actions.modal(false)}}
  resume(){this.suspended=false;this.present()}
  private renderHistory(s:LearningSession){
    const root=this.root.querySelector('.attempt-history')!;
    const line=(parent:Element,text:string,tag='p')=>{const el=document.createElement(tag);el.textContent=text;parent.append(el);return el};
    const charges=(q:Record<'left'|'right'|'glove',number>)=>`Kiri ${describeCharge(q.left).text}, kanan ${describeCharge(q.right).text}, alat ${describeCharge(q.glove).text}`;
    for(const a of s.attempts){const article=document.createElement('article');line(article,`${LESSON.history.title} #${a.id} · ${LESSON.history.results[a.result]}`,'h4');line(article,`${LESSON.history.start}: ${charges(a.charges)}`);line(article,LESSON.history.transfers);const list=document.createElement('ol');for(const t of a.transfers)line(list,`${LESSON.history.objects[t.source]} → ${LESSON.history.objects[t.target]}. ${charges(t.before)} → ${charges(t.after)}`,'li');if(!a.transfers.length)line(article,LESSON.history.none);article.append(list);line(article,`${LESSON.history.hints}: ${a.hints.length?a.hints.map(n=>`${n}. ${LESSON.hints[n-1]}`).join(' '):LESSON.history.noHints}`);root.append(article)}
    s.predictionRevisions.forEach((p,i)=>line(root,`${LESSON.history.prediction} ${i+1}: ${p.choices.map(choiceLabel).join(' ')} ${LESSON.prediction.reasons.find(r=>r.id===p.reason)?.label}`));
    s.explanations.forEach((e,i)=>line(root,`${LESSON.history.answers} ${i+1}: ${LESSON.questions.map(q=>`${q.id}. ${answerLabel(q.id,e.answers[q.id])}`).join(' ')}`));
  }
  private bindForm(selector:string,submit:(form:HTMLFormElement)=>string|void){const form=this.root.querySelector<HTMLFormElement>(selector);if(!form)return;let sent=false;form.addEventListener('submit',e=>{e.preventDefault();if(sent)return;const error=submit(form);if(error){form.querySelector('.form-error')!.textContent=esc(error);return}sent=true;form.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled=true})}
  destroy(){if(this.dialog.open)this.dialog.close();this.root.remove();this.dialog.remove()}
}
