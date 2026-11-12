/** Keep game dialogs with their scene; CSS fits them to the arena or the portrait viewport. */
export function mountGameDialog(dialog:HTMLDialogElement){
  document.querySelector('.game-stage')!.append(dialog);
  dialog.setAttribute('aria-modal','true');
  dialog.classList.add('eq-window');dialog.dataset.modalLayer='game';
}
export function focusDialog(dialog:HTMLDialogElement){
  [...dialog.querySelectorAll<HTMLElement>('h2,[autofocus],button,input,textarea,select')].find(el=>{const r=el.getBoundingClientRect();return r.width>1&&r.height>1&&!el.matches(':disabled')})?.focus({preventScroll:true});
}
