import {confirmGame} from './ConfirmDialog';
import {mountSettings} from './SettingsPanel';
import {trapDialogTab} from './dialogFocus';
import {mountGameDialog,focusDialog} from './gameDialogs';
import {LESSON} from '../content/learning';
import {decorateUI,icon,speaker} from './UISkin';
import type {LoadReport} from './AppUI';
export class PausePanel {
  private dialog=document.createElement('dialog');
  private abort=new AbortController();
  private trigger:HTMLElement|null=null;
  private toolbar=document.createElement('div');
  readonly pauseButton:HTMLButtonElement;
  constructor(private actions:{resume:()=>void;menu:()=>void;status:()=>string;reset:()=>void;report:()=>LoadReport;retry:()=>void;resetLabel?:string;preview?:{help:string;dialog:string;goal:string}}){
    this.dialog.className='pause-dialog inspection';this.dialog.setAttribute('aria-label','Menu pause');mountGameDialog(this.dialog);
    const toolbar=this.toolbar;toolbar.className='mission-toolbar';toolbar.innerHTML='<button data-pause>Pause</button><button data-fullscreen>Fullscreen</button><span role="status" class="fullscreen-status"></span>';
    document.querySelector('.game-stage')!.append(toolbar);this.pauseButton=toolbar.querySelector('[data-pause]')!;
    decorateUI(toolbar);toolbar.querySelector('[data-fullscreen]')!.setAttribute('aria-label','Fullscreen');this.pauseButton.setAttribute('aria-label','Pause');
    toolbar.querySelector('[data-fullscreen]')!.addEventListener('click',async()=>{const status=toolbar.querySelector<HTMLElement>('.fullscreen-status')!;try{if(document.fullscreenElement){await document.exitFullscreen();status.textContent='Fullscreen ditutup.'}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();status.textContent='Fullscreen aktif.'}else status.textContent='Fullscreen tidak didukung. Permainan tetap tersedia.'}catch{status.textContent='Fullscreen ditolak browser. Lanjutkan dalam jendela biasa.'}status.hidden=false},{signal:this.abort.signal});
    document.addEventListener('fullscreenchange',()=>{const button=toolbar.querySelector('[data-fullscreen]')!;button.textContent=document.fullscreenElement?'Keluar fullscreen':'Fullscreen';button.setAttribute('aria-label',button.textContent);decorateUI(toolbar)},{signal:this.abort.signal});
    this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.menuView()},{signal:this.abort.signal});
    this.dialog.addEventListener('keydown',e=>trapDialogTab(this.dialog,e),{signal:this.abort.signal});
  }
  show(){if(!this.dialog.open){this.trigger=document.activeElement instanceof HTMLElement?document.activeElement:null;this.menuView();this.dialog.showModal();this.dialog.querySelector<HTMLButtonElement>('[data-resume]')!.focus({preventScroll:true})}}
  private menuView(){
    this.dialog.innerHTML='<h2 tabindex="-1">Permainan dijeda</h2><p>Gerak, simulasi dan efek berhenti.</p><div class="pause-actions"><button class="primary" data-resume>Lanjutkan</button><button data-settings>Pengaturan</button><button data-help>Cara bermain</button><button data-reread>Baca kembali tujuan/dialog</button><button data-menu>Kembali ke Beranda</button></div><p class="pause-checkpoint" role="status"></p>';
    this.dialog.querySelector('.pause-checkpoint')!.textContent=this.actions.status();
    const reset=document.createElement('button');reset.dataset.reset='';reset.textContent=this.actions.resetLabel??(this.actions.preview?'Reset demonstrasi':'Reset eksperimen');reset.addEventListener('click',async()=>{if(await confirmGame('Reset eksperimen ke pengaturan awal? Prediksi dan catatan belajar mengikuti aturan misi.')){this.actions.reset();this.dialog.close();this.actions.resume()}});this.dialog.querySelector('.pause-actions')!.append(reset);
    const report=this.actions.report();if(report.failed.length){const warning=document.createElement('p');warning.setAttribute('role','alert');warning.textContent=`Ilustrasi opsional gagal dimuat: ${report.failed.join(', ')}.`;icon(warning,'icon-warning');const retry=document.createElement('button');retry.textContent='Coba muat ulang';retry.dataset.uiRetry='';retry.addEventListener('click',this.actions.retry);this.dialog.append(warning,retry)}
    this.dialog.querySelector('[data-resume]')!.addEventListener('click',()=>{this.dialog.close();this.actions.resume();if(!document.querySelector('.game-stage dialog[open]'))(this.trigger?.isConnected?this.trigger:this.pauseButton).focus({preventScroll:true})});
    this.dialog.querySelector('[data-menu]')!.addEventListener('click',this.actions.menu);
    this.dialog.querySelector('[data-settings]')!.addEventListener('click',()=>{this.subview('Pengaturan saat pause','<div data-settings-host></div>');mountSettings(this.dialog.querySelector('[data-settings-host]')!,{allowProgressDelete:!this.actions.preview});decorateUI(this.dialog);focusDialog(this.dialog)});
    this.dialog.querySelector('[data-help]')!.addEventListener('click',()=>this.subview('Cara bermain',this.actions.preview?.help??'<p>A / D atau ← / → untuk berjalan. E memeriksa terminal ketika penandanya terlihat. Escape menutup terminal atau membuka pause.</p><p>Pada layar sentuh, tahan tombol arah di kiri bawah dan ketuk Periksa terminal di kanan bawah. Kontrol gerak disembunyikan saat dialog terbuka.</p><ol><li>Amati kedua panel di terminal.</li><li>Simpan prediksi dan alasan.</li><li>Pindahkan elektron, lalu uji gerbang.</li><li>Jelaskan hasil dan isi refleksi bila ingin.</li></ol>'));
    this.dialog.querySelector('[data-reread]')!.addEventListener('click',()=>{this.subview('Tujuan penyelidikan',`<blockquote><strong>${LESSON.orientation.speaker}</strong><p>${this.actions.preview?.dialog??LESSON.orientation.dialog}</p></blockquote><p>${this.actions.preview?.goal??LESSON.orientation.goal}</p>`);speaker(this.dialog,'Ion')});
    decorateUI(this.dialog);
    if(this.dialog.open)focusDialog(this.dialog);
  }
  private subview(title:string,copy:string){this.dialog.innerHTML=`<h2 tabindex="-1">${title}</h2>${copy}<button data-back>Kembali ke pause</button>`;this.dialog.querySelector('[data-back]')!.addEventListener('click',()=>this.menuView());decorateUI(this.dialog);this.dialog.scrollTop=0;focusDialog(this.dialog)}
  get isOpen(){return this.dialog.open}
  destroy(){this.abort.abort();if(this.dialog.open)this.dialog.close();this.dialog.remove();this.toolbar.remove()}
}
