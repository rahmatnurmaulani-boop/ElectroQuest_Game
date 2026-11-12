import {assetURL,type AssetManifest} from '../content/manifest';
let observer:MutationObserver|undefined;let ready=false;
export function installConsoleAssets(manifest:AssetManifest){for(const a of manifest.assets)if(a.key.startsWith('eq-')&&a.path)document.documentElement.style.setProperty('--'+a.key,`url("${new URL(assetURL(a.path),document.baseURI).href}")`);document.documentElement.dataset.consoleUi='true';ready=true;decorateConsole(document.querySelector('#app')!)}
function iconFor(el:HTMLElement){const d=el.dataset,a=d.action??'',label=el.textContent?.trim().toLowerCase()??'';
 if(el.matches('[data-direction]'))return null;
 if(el.matches('[data-pause],[data-lesson-pause]'))return 'pause';if(el.matches('[data-fullscreen]'))return 'fullscreen';
 if(el.matches('[data-entry]'))return label.includes('lanjut')?'continue':'play';
 if(el.matches('[data-confirm-accept]'))return 'continue';
 if(a==='back')return 'home';if(el.matches('[data-back]'))return 'close';
 if(el.matches('[data-settings]')||label==='pengaturan')return 'settings';
 if(el.matches('[data-missions],[data-first],[data-second],[data-third]')||a==='missions')return 'missions';
 if(el.matches('[data-help]')||a==='hint'||el.matches('[data-hint]'))return 'help';
 if(el.matches('[data-mission]'))return 'info';
 if(el.matches('[data-reread]')||a==='reread')return 'reread';
 if(el.matches('[data-resume]')||a==='next'||a==='observe')return 'continue';
 if(el.matches('[data-menu]')||a==='home'||label==='kembali ke beranda')return 'home';
 if(el.matches('[data-delete-progress],[data-reset]')||a==='reset'||label.startsWith('reset'))return 'reset';
 if(el.matches('[data-restart],[data-new],[data-replay-second],[data-replay-third]')||a==='replay')return 'replay';
 if(el.matches('[data-close]')||a==='close'||label==='tutup'||label==='batal')return 'close';
 if(a==='observations'||a==='compare'||label.includes('catatan')||label.includes('pengamatan'))return 'notes';
 if(label.includes('ringkasan')||a==='results')return 'results';
 if(el.matches('[data-audio-test]'))return 'sound-on';
 if(label.startsWith('lanjut')||label.startsWith('mulai'))return 'play';return null;
}
export function consoleIcon(host:HTMLElement,key:string){const old=host.querySelector<HTMLImageElement>(':scope > .ui-icon');if(old?.dataset.consoleIcon===key)return;if(old)old.remove();const img=document.createElement('img');img.className='ui-icon eq-icon';img.alt='';img.setAttribute('aria-hidden','true');img.width=24;img.height=24;img.dataset.consoleIcon=key;img.src=assetURL('assets/ui/shared/eq-icon-'+key+'.png');host.prepend(img)}
export function decorateConsole(root:Element){if(!root||!ready)return;
 for(const el of [root,...root.querySelectorAll('dialog,.game-hud,.bridge-data,.bridge-live,.experiment-status,.form-error:not(:empty),.error-panel,.concept-note,.neutral-note,.settings-feedback,.pause-checkpoint,.title-content,.title-panel,#panel,.dialog-speaker,.result-stat,.mission-result-summary,fieldset,blockquote')]){
  if(!(el instanceof HTMLElement))continue;if(el.matches('dialog')){el.classList.add('eq-window');el.setAttribute('aria-modal','true')}
  if(el.matches('dialog,.game-hud,.bridge-data,.bridge-live,.experiment-status,.form-error:not(:empty),.error-panel,.concept-note,.neutral-note,.settings-feedback,.pause-checkpoint,.title-content,.title-panel,.result-stat,.mission-result-summary,fieldset,blockquote')||el.id==='panel'&&document.body.dataset.screen!=='mission'){
   el.classList.add('eq-panel');el.dataset.eqPanel=el.matches('.title-content')?'main':el.matches('.concept-note,.neutral-note')?'hint':el.matches('.error-panel')?'warning':el.matches('.pause-checkpoint,.settings-feedback')?'footer':el.matches('.bridge-data,.result-stat,fieldset')?'stat':'modal';
  }
 }
 for(const button of root.querySelectorAll<HTMLElement>('button,summary')){
  button.classList.add('eq-button');const key=iconFor(button);if(key)consoleIcon(button,key);
  button.dataset.eqVariant=button.dataset.demoVariant??(button.matches('[data-delete-progress],[data-new],[data-reset],.reset-outside')||['reset','replay'].includes(button.dataset.action??'')?'warning':button.matches('.primary,.title-primary,[data-entry],[data-resume]')?'primary':button.matches('[data-pause],[data-fullscreen],[data-direction]')?'icon':'secondary');
  for(const n of button.childNodes)if(n.nodeType===Node.TEXT_NODE&&n.textContent){const text=n.textContent.replace(/^[\s]*[\u{1F300}-\u{1FAFF}\u2600-\u26FF]\uFE0F?\s*/u,'');if(text!==n.textContent)n.textContent=text}
 }
 for(const label of root.querySelectorAll<HTMLElement>('label:has([data-setting=mute])')){const input=label.querySelector<HTMLInputElement>('input')!;consoleIcon(label,input.checked?'sound-off':'sound-on')}
 for(const h of root.querySelectorAll<HTMLElement>('.eq-window > h2,.learning-heading,.pause-dialog > h2,.title-content h1'))h.classList.add('eq-heading');
 for(const h of root.querySelectorAll<HTMLElement>('.pause-dialog > h2'))consoleIcon(h,'pause');
 for(const h of root.querySelectorAll<HTMLElement>('.eq-confirm > h2'))consoleIcon(h,'warning');
 for(const img of root.querySelectorAll<HTMLImageElement>('.dialog-speaker img'))img.classList.add('eq-portrait');
 for(const img of root.querySelectorAll<HTMLImageElement>('.eq-icon'))if(!img.dataset.eqErrorBound){img.dataset.eqErrorBound='true';img.addEventListener('error',()=>{img.hidden=true},{once:true})}
 for(const img of root.querySelectorAll<HTMLImageElement>('.result-art img'))if(!img.dataset.eqObserved){img.dataset.eqObserved='true';const failed=()=>{img.hidden=true;const host=img.parentElement;if(host&&!host.querySelector('[role=status]')){const p=document.createElement('p');p.setAttribute('role','status');p.textContent='Ilustrasi gagal dimuat. Data eksperimen dan tombol tetap tersedia.';host.append(p)}};img.addEventListener('error',failed,{once:true});if(img.complete&&!img.naturalWidth)failed()}
}
/** One observer covers dynamically rendered windows; never observes game-state attributes. */
export function startConsoleUI(root:HTMLElement){
 const keys=['emblem','badge','pointer','indicator','divider','success','loader',...['main','modal','result','stat','title','footer','hint','warning','input','portrait'].map(k=>'panel-'+k),...['primary','secondary','warning','icon'].flatMap(v=>['normal','hover','focus','pressed','disabled','selected'].map(s=>'button-'+v+'-'+s))];
 for(const k of keys)document.documentElement.style.setProperty('--eq-'+k,`url("${new URL(assetURL('assets/ui/'+(k==='emblem'?'landing':'shared')+'/eq-'+k+'.png'),document.baseURI).href}")`);ready=true;document.documentElement.dataset.consoleUi='true';
 observer?.disconnect();let queued=false;const update=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;if(root.isConnected)decorateConsole(root)})};observer=new MutationObserver(update);observer.observe(root,{childList:true,subtree:true});root.addEventListener('input',update);update();return()=>{observer?.disconnect();root.removeEventListener('input',update)}}
