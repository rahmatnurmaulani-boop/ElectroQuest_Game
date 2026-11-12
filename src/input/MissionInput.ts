/** Single input source for DOM keyboard and all owned touch/pointer buttons. */
export class MissionInput {
  private keys=new Set<string>();
  private pointers=new Map<number,{direction:number;button:HTMLElement}>();
  private abort=new AbortController();
  private enabled=true;
  private requested=false;
  constructor(root:HTMLElement,private suspend:(hidden:boolean)=>void){
    const options={signal:this.abort.signal};
    window.addEventListener('keydown',this.keyDown,options);window.addEventListener('keyup',this.keyUp,options);
    window.addEventListener('blur',this.blur,options);
    document.addEventListener('visibilitychange',this.visibility,options);
    document.addEventListener('focusin',e=>{if(e.target instanceof HTMLElement&&e.target.closest('.learning-panel form'))this.clear()},options);
    window.addEventListener('resize',this.clear,options);
    document.addEventListener('pointerup',this.release,{...options,capture:true});document.addEventListener('pointercancel',this.release,{...options,capture:true});
    for(const button of root.querySelectorAll<HTMLElement>('[data-direction]')){
      button.addEventListener('pointerdown',e=>{if(!this.enabled||e.button!==0||this.pointers.has(e.pointerId))return;e.preventDefault();this.pointers.set(e.pointerId,{direction:Number(button.dataset.direction),button});button.setAttribute('aria-pressed','true');try{button.setPointerCapture(e.pointerId)}catch{/* document release fallback */}},options);
      button.addEventListener('lostpointercapture',this.release,options);
    }
    const interact=root.querySelector<HTMLButtonElement>('[data-interact]');
    interact?.addEventListener('pointerdown',e=>{if(!this.enabled||interact.disabled||e.button!==0||this.pointers.has(e.pointerId))return;e.preventDefault();this.pointers.set(e.pointerId,{direction:0,button:interact});try{interact.setPointerCapture(e.pointerId)}catch{/* document release fallback */}this.requested=true},options);
    interact?.addEventListener('lostpointercapture',this.release,options);
    // Pointerdown also works for a secondary touch; native click remains for AT/keyboard.
    interact?.addEventListener('click',e=>{if(this.enabled&&((e as MouseEvent).detail===0||!('PointerEvent'in window)))this.requested=true},options);
  }
  private keyDown=(e:KeyboardEvent)=>{
    if(!this.enabled||e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target instanceof HTMLElement&&e.target.matches('input,textarea,select,[contenteditable]'))return;
    if(['KeyA','KeyD','ArrowLeft','ArrowRight','KeyE'].includes(e.code)){e.preventDefault();this.keys.add(e.code);if(e.code==='KeyE')this.requested=true}
  };
  private keyUp=(e:KeyboardEvent)=>{this.keys.delete(e.code)};
  private release=(e:PointerEvent)=>{const entry=this.pointers.get(e.pointerId);if(!entry)return;this.pointers.delete(e.pointerId);entry.button.setAttribute('aria-pressed',String([...this.pointers.values()].some(p=>p.button===entry.button)));try{if(entry.button.hasPointerCapture(e.pointerId))entry.button.releasePointerCapture(e.pointerId)}catch{/* already released */}};
  private blur=()=>{this.clear();this.suspend(true)};
  private visibility=()=>{if(document.hidden||!document.hasFocus())this.blur()};
  clear=()=>{this.keys.clear();this.requested=false;const entries=[...this.pointers];this.pointers.clear();for(const[id,p]of entries){p.button.setAttribute('aria-pressed','false');try{if(p.button.hasPointerCapture(id))p.button.releasePointerCapture(id)}catch{/* detached control */}}};
  setEnabled(value:boolean){this.clear();this.enabled=value}
  get axis():number {if(!this.enabled)return 0;const dirs=[...this.pointers.values()].map(p=>p.direction);const left=this.keys.has('KeyA')||this.keys.has('ArrowLeft')||dirs.includes(-1),right=this.keys.has('KeyD')||this.keys.has('ArrowRight')||dirs.includes(1);return Number(right)-Number(left)}
  consumeInteraction():boolean {const value=this.requested;this.requested=false;return this.enabled&&value}
  destroy(){this.clear();this.enabled=false;this.abort.abort()}
}
