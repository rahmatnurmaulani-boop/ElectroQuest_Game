import {confirmGame} from './ConfirmDialog';
import {assetURL,fetchManifest,type AssetManifest} from '../content/manifest';
import {readProgress} from '../storage/progress';
import {bridgeUnlocked,readBridge,removeBridge,UNLOCK_KEY} from '../storage/bridgeProgress';
import {polarizationUnlocked,readPolarization,removePolarization} from '../storage/polarizationProgress';
import {readSettings,applySettings} from './settings';
import {mountSettings} from './SettingsPanel';
import {installLandingSkin,decorateLanding,landingIcon} from './LandingSkin';
import {trapDialogTab} from './dialogFocus';
import {audio} from '../audio/AudioBus';

/** Title screen: DOM/CSS layers only. Phaser is imported after the shared entry action. */
export class LandingPage {
  private listeners=new AbortController();
  private dialog:HTMLDialogElement;
  private manifest?:AssetManifest;
  private busy=false;
  private trigger:HTMLElement|null=null;
  constructor(private root:HTMLElement,private enter:(fresh?:boolean,mission?:number)=>void){
    document.body.dataset.screen='landing';audio.setMusic('landing');applySettings(readSettings());
    root.innerHTML=`<main id="main-content" tabindex="-1" class="landing"><section id="hero" class="title-screen"><div class="title-sky" aria-hidden="true"></div><div class="title-content"><div class="title-identity"><div data-art="lp-emblem" class="title-emblem" aria-hidden="true"></div><p class="landing-label">PETUALANGAN FISIKA INTERAKTIF</p></div><h1>ELECTROQUEST</h1><p class="title-subtitle">Penjaga Kota Muatan</p><p class="title-intro">Bantu Raka dan Ion memulihkan kota melalui eksperimen listrik statis.</p><nav class="title-menu" aria-label="Menu utama"><button data-entry class="title-primary">Mulai Petualangan</button><button data-new hidden>Mulai Baru</button><button data-help>Cara Bermain</button><button data-mission>Tentang Misi</button><button data-settings>Pengaturan</button></nav><p class="landing-save" role="status"></p><p class="title-credit">Media pembelajaran listrik statis SMA</p></div><div class="title-world"><div class="diorama" role="img" aria-label="Laboratorium kota menjelang malam, Raka dengan Charge Glove cyan dan Ion"><p class="art-placeholder">Menyiapkan pemandangan kota…</p></div></div><div class="title-corner"><span>RAKA + ION / MISI 01–03</span><button data-animation aria-pressed="false">Jeda animasi</button></div></section><dialog class="title-panel" aria-labelledby="title-panel-heading"><h2 id="title-panel-heading" tabindex="-1"></h2><div data-panel-body></div><form method="dialog"><button data-close>Tutup</button></form></dialog></main>`;
    this.dialog=root.querySelector('dialog')!;const options={signal:this.listeners.signal};
    root.querySelector('[data-entry]')!.addEventListener('click',()=>this.navigate(false),options);
    root.querySelector('[data-new]')!.addEventListener('click',async()=>{if(!this.busy&&await confirmGame('Mulai petualangan baru? Checkpoint, prediksi, riwayat, jawaban dan refleksi tersimpan akan diganti setelah misi baru berhasil dimuat. Pengaturan tetap disimpan.'))this.navigate(true)},options);
    root.querySelector('[data-help]')!.addEventListener('click',()=>this.showPanel('Cara Bermain',`<ol class="title-steps"><li>Amati keadaan muatan.</li><li>Buat prediksi.</li><li>Lakukan eksperimen dan uji hasilnya.</li><li>Jelaskan temuanmu berbasis bukti.</li></ol><p><kbd>A</kbd> / <kbd>D</kbd> atau ← / → untuk berjalan. <kbd>E</kbd> memeriksa terminal dalam jangkauan. <kbd>Escape</kbd> menutup terminal atau membuka pause.</p><p>Pada layar sentuh, tahan tombol arah dan ketuk Periksa terminal. Dialog panjang dapat digulir di dalam panel.</p>`),options);
    root.querySelector('[data-mission]')!.addEventListener('click',()=>this.showPanel('Tentang Misi ElectroQuest','<h3>Misi 1 — Gerbang Muatan</h3><p>Motor gerbang rusak. Pindahkan elektron antar panel agar kedua panel bermuatan sejenis dan saling tolak-menolak membuka jalan.</p><h3>Misi 2 — Jembatan Coulomb</h3><p>Platform penyeberangan rusak. Selidiki hubungan kuantitatif gaya Coulomb terhadap besar muatan dan jarak pusat bola konduktor.</p><h3>Misi 3 — Gudang Polarisasi</h3><p>Jalur gudang tertutup serpihan kertas isolator netral. Gunakan alat bermuatan untuk menginduksi polarisasi dan mengumpulkan kertas ke baki tanpa kontak.</p>'),options);
    root.querySelector('[data-settings]')!.addEventListener('click',()=>{this.showPanel('Pengaturan','<div data-settings-host></div>');mountSettings(this.dialog.querySelector('[data-settings-host]')!);decorateLanding(this.dialog)},options);
    this.dialog.addEventListener('click',async e=>{
      const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-first],[data-second],[data-third],[data-replay-second],[data-replay-third]');if(!b||b.disabled||this.busy)return;
      if(b.hasAttribute('data-first')){this.navigate(false,1);return}
      const mission=b.hasAttribute('data-second')||b.hasAttribute('data-replay-second')?2:3;
      if(mission===2?!bridgeUnlocked():!polarizationUnlocked())return;
      if(b.hasAttribute('data-replay-second')||b.hasAttribute('data-replay-third')){if(!await confirmGame('Ulang Misi '+mission+'? Hanya sesi misi ini yang diganti; progres lain dan pengaturan tetap.'))return;if(mission===2)removeBridge();else removePolarization()}
      this.busy=true;this.enter(false,mission);
    },options);
    this.dialog.addEventListener('keydown',event=>trapDialogTab(this.dialog,event),options);
    this.dialog.addEventListener('close',()=>this.trigger?.isConnected&&this.trigger.focus({preventScroll:true}),options);
    root.querySelector('[data-animation]')!.addEventListener('click',event=>{const button=event.currentTarget as HTMLButtonElement;const paused=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Putar animasi':'Jeda animasi';root.classList.toggle('animation-paused',paused)},options);
    window.addEventListener('electroquest-progress-cleared',()=>this.refreshProgress(),options);
    document.addEventListener('visibilitychange',()=>root.classList.toggle('page-hidden',document.hidden),options);
    if(readProgress().checkpoint?.learning.phase==='RESULTS')try{localStorage.setItem(UNLOCK_KEY,'true')}catch{/* session unlock still reads Mission 1 */}
    const missions=document.createElement('button');missions.textContent='Pilih misi';missions.dataset.missions='';root.querySelector('.title-menu')!.append(missions);
    missions.addEventListener('click',()=>{
      const m2Unlocked=bridgeUnlocked(),m2Saved=readBridge();
      const m3Unlocked=polarizationUnlocked(),m3Saved=readPolarization();
      this.showPanel('Pilih misi',`
        <p><strong>Misi 1: Gerbang Muatan</strong></p>
        <button data-first>Mainkan Misi 1</button>
        <hr>
        <p><strong>Misi 2: Jembatan Coulomb</strong> ${m2Unlocked?'':'— selesaikan Misi 1 terlebih dahulu.'}</p>
        <button data-second ${m2Unlocked?'':'disabled'}>${m2Saved?'Lanjutkan Misi 2':'Mulai Misi 2'}</button>
        ${m2Saved?'<button data-replay-second>Ulang Misi 2</button>':''}
        <hr>
        <p><strong>Misi 3: Gudang Polarisasi</strong> ${m3Unlocked?'':'— selesaikan Misi 2 terlebih dahulu.'}</p>
        <button data-third ${m3Unlocked?'':'disabled'}>${m3Saved?'Lanjutkan Misi 3':'Mulai Misi 3'}</button>
        ${m3Saved?'<button data-replay-third>Ulang Misi 3</button>':''}
      `);
    },options);
    this.refreshProgress();void this.loadArt();
  }
  private navigate(fresh:boolean,mission=1){if(this.busy)return;this.busy=true;this.root.querySelectorAll<HTMLButtonElement>('[data-entry],[data-new]').forEach(b=>b.disabled=true);this.enter(fresh,mission)}
  private showPanel(title:string,copy:string){this.trigger=document.activeElement instanceof HTMLElement?document.activeElement:null;this.dialog.querySelector('h2')!.textContent=title;this.dialog.querySelector('[data-panel-body]')!.innerHTML=copy;decorateLanding(this.dialog);this.dialog.showModal();this.dialog.scrollTop=0;this.dialog.querySelector<HTMLElement>('h2')!.focus({preventScroll:true})}
  private refreshProgress(){const progress=readProgress(),button=this.root.querySelector<HTMLButtonElement>('[data-entry]')!;button.textContent=progress.checkpoint?'Lanjutkan':'Mulai Petualangan';landingIcon(button,progress.checkpoint?'lp-icon-continue':'lp-icon-play');this.root.querySelector<HTMLButtonElement>('[data-new]')!.hidden=!progress.checkpoint;this.root.querySelector('.landing-save')!.textContent=progress.checkpoint?'Checkpoint tersedia di browser ini.':progress.status==='invalid'?'Progres lokal tidak valid. Kamu dapat memulai petualangan baru.':progress.status==='unavailable'?'Penyimpanan browser tidak tersedia. Kamu tetap dapat bermain pada sesi ini.':''}
  private image(key:string,style=''){const a=this.manifest?.assets.find(asset=>asset.key===key);if(!a?.path)return '';return `<img alt="" data-key="${key}" src="${assetURL(a.path)}" style="${style}" width="${a.width}" height="${a.height}">`}
  private async loadArt(){try{
    this.manifest=await fetchManifest();if(this.listeners.signal.aborted)return;installLandingSkin(this.manifest);this.refreshProgress();decorateLanding(this.root);
    this.root.querySelectorAll<HTMLElement>('[data-art]').forEach(host=>host.innerHTML=this.image(host.dataset.art!));
    this.root.querySelector('.title-sky')!.innerHTML=this.image('lp-sky');
    this.root.querySelector('.diorama')!.innerHTML=this.image('lp-city','inset:0;width:100%;height:100%')+this.image('lp-lab','inset:0;width:100%;height:100%')+this.image('lp-floor','inset:0;width:100%;height:100%')+this.image('lp-raka-shadow','left:54%;top:85%;width:16%;height:auto')+`<div class="landing-raka" style="left:52%;top:36%;width:20%">${this.image('lp-raka')}</div><div class="ion-float">${this.image('lp-ion')}</div>`+this.image('lp-lamp-glow','left:29%;top:44%;width:20%;height:auto')+this.image('lp-glove-glow','left:60%;top:53%;width:12%;height:auto')+`<span class="ambient a1">${this.image('lp-particle')}</span><span class="ambient a2">${this.image('lp-particle')}</span><span class="ambient a3">${this.image('lp-particle')}</span>`;
    for(const img of this.root.querySelectorAll<HTMLImageElement>('img')){const failed=()=>this.artError();img.addEventListener('error',failed,{once:true,signal:this.listeners.signal});if(img.complete&&!img.naturalWidth)failed()}
  }catch{if(!this.listeners.signal.aborted)this.artError()}}
  private artError(){const status=this.root.querySelector('.landing-save')!;status.textContent='Sebagian ilustrasi belum dapat dimuat. Menu tetap dapat digunakan.';if(!this.root.querySelector('.art-retry')){const retry=document.createElement('button');retry.className='art-retry';retry.textContent='Coba lagi ilustrasi';retry.addEventListener('click',()=>{retry.remove();void this.loadArt()},{once:true,signal:this.listeners.signal});status.after(retry)}}
  destroy(){this.listeners.abort();audio.stop();if(this.dialog.open)this.dialog.close()}
}
