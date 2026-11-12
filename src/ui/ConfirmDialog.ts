import {mountGameDialog} from './gameDialogs';import {trapDialogTab} from './dialogFocus';
let pending:Promise<boolean>|undefined;
let cancel:(()=>void)|undefined;
const deferred=new Map<object,()=>void>();
export function deferWhileConfirming(owner:object,callback:()=>void){if(!pending)return false;deferred.set(owner,callback);return true}
export function cancelGameConfirmation(){cancel?.()}
/** Parent dialog remains open/inert underneath, so its pause reason survives confirmation. */
export function confirmGame(message:string,title='Konfirmasi tindakan'):Promise<boolean>{
 if(pending)return pending;pending=new Promise(resolve=>{
 const trigger=document.activeElement instanceof HTMLElement?document.activeElement:null;const d=document.createElement('dialog');d.className='eq-confirm';d.setAttribute('aria-labelledby','eq-confirm-heading');d.innerHTML='<h2 id="eq-confirm-heading" tabindex="-1"></h2><p></p><div class="confirm-actions"><button type="button" data-confirm-cancel>Batal</button><button type="button" data-confirm-accept>Ya, lanjutkan</button></div>';d.querySelector('h2')!.textContent=title;d.querySelector('p')!.textContent=message;
 const done=(value:boolean)=>{d.close();d.remove();pending=undefined;cancel=undefined;window.dispatchEvent(new CustomEvent('electroquest-confirmation',{detail:false}));if(trigger?.isConnected)trigger.focus({preventScroll:true});const callbacks=[...deferred.values()];deferred.clear();for(const callback of callbacks)callback();resolve(value)};cancel=()=>done(false);
 d.querySelector('[data-confirm-cancel]')!.addEventListener('click',()=>done(false),{once:true});d.querySelector('[data-confirm-accept]')!.addEventListener('click',()=>done(true),{once:true});d.addEventListener('cancel',e=>{e.preventDefault();done(false)});d.addEventListener('keydown',e=>{e.stopPropagation();trapDialogTab(d,e)});
 if(document.querySelector('.game-stage'))mountGameDialog(d);else document.querySelector('#app')!.append(d);window.dispatchEvent(new CustomEvent('electroquest-confirmation',{detail:true}));d.showModal();d.querySelector<HTMLButtonElement>('[data-confirm-cancel]')!.focus({preventScroll:true});
 });return pending;
}
